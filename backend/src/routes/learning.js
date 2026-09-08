const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/learning — List all industry learning programs
router.get('/', authenticate, async (req, res) => {
  try {
    const { category, targetAudience, mode, search } = req.query;

    const where = {
      status: 'ACTIVE',
    };

    if (category) where.category = category;
    if (mode) where.mode = mode;
    if (targetAudience && targetAudience !== 'ALL') {
      where.OR = [{ targetAudience }, { targetAudience: 'ALL' }];
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { skillsCovered: { contains: search } },
      ];
    }

    const programs = await prisma.learningProgram.findMany({
      where,
      include: {
        company: {
          select: { name: true, city: true, logoUrl: true },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Determine if current user is already enrolled
    let myEnrollments = [];
    if (req.user.student) {
      myEnrollments = await prisma.learningEnrollment.findMany({
        where: { studentId: req.user.student.id },
      });
    } else if (req.user.faculty) {
      myEnrollments = await prisma.learningEnrollment.findMany({
        where: { facultyId: req.user.faculty.id },
      });
    }

    const result = programs.map((p) => {
      const enrollment = myEnrollments.find((e) => e.programId === p.id);
      return {
        id: p.id,
        title: p.title,
        category: p.category,
        targetAudience: p.targetAudience,
        description: p.description,
        duration: p.duration,
        mode: p.mode,
        skillsCovered: p.skillsCovered,
        instructorName: p.instructorName,
        syllabus: p.syllabus,
        companyName: p.company?.name || 'Industry Partner',
        companyLogo: p.company?.logoUrl,
        enrollmentCap: p.enrollmentCap,
        enrolledCount: p._count.enrollments,
        isEnrolled: !!enrollment,
        userProgress: enrollment ? enrollment.progress : 0,
        enrollmentStatus: enrollment ? enrollment.status : null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Fetch learning programs error:', err);
    res.status(500).json({ error: 'Failed to fetch learning programs' });
  }
});

// GET /api/learning/:id — Program details
router.get('/:id', authenticate, async (req, res) => {
  try {
    const program = await prisma.learningProgram.findUnique({
      where: { id: req.params.id },
      include: {
        company: {
          select: { name: true, city: true, sector: true, website: true, logoUrl: true },
        },
      },
    });

    if (!program) return res.status(404).json({ error: 'Program not found' });

    res.json(program);
  } catch (err) {
    console.error('Fetch program detail error:', err);
    res.status(500).json({ error: 'Failed to fetch program details' });
  }
});

// POST /api/learning — Create learning program (Company or Admin)
router.post('/', authenticate, requireRole('COMPANY', 'ADMIN'), async (req, res) => {
  try {
    const company = req.user.company;
    const {
      title,
      category,
      targetAudience,
      description,
      duration,
      mode,
      skillsCovered,
      syllabus,
      instructorName,
      enrollmentCap,
    } = req.body;

    if (!title || !category || !description || !duration) {
      return res.status(400).json({ error: 'Title, category, description, and duration are required' });
    }

    const program = await prisma.learningProgram.create({
      data: {
        companyId: company ? company.id : null,
        title,
        category: category.toUpperCase(),
        targetAudience: targetAudience || 'ALL',
        description,
        duration,
        mode: mode || 'ONLINE',
        skillsCovered: skillsCovered || '',
        syllabus: syllabus || '',
        instructorName: instructorName || req.user.name,
        enrollmentCap: parseInt(enrollmentCap) || 100,
        status: 'ACTIVE',
      },
    });

    res.status(201).json(program);
  } catch (err) {
    console.error('Create learning program error:', err);
    res.status(500).json({ error: 'Failed to publish learning program' });
  }
});

// POST /api/learning/:id/enroll — Enroll in program
router.post('/:id/enroll', authenticate, async (req, res) => {
  try {
    const program = await prisma.learningProgram.findUnique({
      where: { id: req.params.id },
    });
    if (!program) return res.status(404).json({ error: 'Program not found' });

    let studentId = null;
    let facultyId = null;
    let role = req.user.role;

    if (role === 'STUDENT') {
      if (!req.user.student) return res.status(400).json({ error: 'Student profile missing' });
      studentId = req.user.student.id;
    } else if (role === 'FACULTY') {
      if (!req.user.faculty) return res.status(400).json({ error: 'Faculty profile missing' });
      facultyId = req.user.faculty.id;
    } else {
      return res.status(403).json({ error: 'Only students and faculty can enroll in learning programs' });
    }

    // Check existing enrollment
    const existing = await prisma.learningEnrollment.findFirst({
      where: {
        programId: program.id,
        OR: [
          { studentId: studentId || undefined },
          { facultyId: facultyId || undefined },
        ],
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in this program' });
    }

    const enrollment = await prisma.learningEnrollment.create({
      data: {
        programId: program.id,
        studentId,
        facultyId,
        userRole: role,
        status: 'ENROLLED',
        progress: 0,
      },
    });

    // Update program enrolled count
    await prisma.learningProgram.update({
      where: { id: program.id },
      data: { enrolledCount: { increment: 1 } },
    });

    res.status(201).json({ message: 'Enrollment successful!', enrollment });
  } catch (err) {
    console.error('Enroll error:', err);
    res.status(500).json({ error: 'Failed to enroll in program' });
  }
});

// GET /api/learning/user/my-programs — Enrolled programs for current user
router.get('/user/my-programs', authenticate, async (req, res) => {
  try {
    const where = {};
    if (req.user.student) {
      where.studentId = req.user.student.id;
    } else if (req.user.faculty) {
      where.facultyId = req.user.faculty.id;
    } else {
      return res.json([]);
    }

    const enrollments = await prisma.learningEnrollment.findMany({
      where,
      include: {
        program: {
          include: {
            company: { select: { name: true, logoUrl: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    const result = enrollments.map((e) => ({
      enrollmentId: e.id,
      programId: e.program.id,
      title: e.program.title,
      category: e.program.category,
      duration: e.program.duration,
      mode: e.program.mode,
      skillsCovered: e.program.skillsCovered,
      companyName: e.program.company?.name || 'Industry Partner',
      status: e.status,
      progress: e.progress,
      certificateIssued: e.certificateIssued,
      certificateUrl: e.certificateUrl,
      enrolledAt: e.enrolledAt,
      completedAt: e.completedAt,
    }));

    res.json(result);
  } catch (err) {
    console.error('Fetch my programs error:', err);
    res.status(500).json({ error: 'Failed to fetch enrolled programs' });
  }
});

// PATCH /api/learning/enrollment/:id/progress — Update progress and issue certificate
router.patch('/enrollment/:id/progress', authenticate, async (req, res) => {
  try {
    const { progress } = req.body;
    const progressVal = Math.min(Math.max(parseInt(progress) || 0, 0), 100);

    const isCompleted = progressVal === 100;
    const updateData = {
      progress: progressVal,
      status: isCompleted ? 'COMPLETED' : progressVal > 0 ? 'IN_PROGRESS' : 'ENROLLED',
    };

    if (isCompleted) {
      updateData.certificateIssued = true;
      updateData.completedAt = new Date();
      updateData.certificateUrl = `https://certificates.yuktha.gov.in/verify/CERT-${Date.now().toString().slice(-8)}`;
    }

    const updated = await prisma.learningEnrollment.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({ message: 'Progress updated', enrollment: updated });
  } catch (err) {
    console.error('Update progress error:', err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

module.exports = router;
