const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/portfolio/:studentId — Public / Shareable Verified Digital Portfolio
router.get('/:studentId', async (req, res) => {
  try {
    const student = await prisma.studentProfile.findFirst({
      where: {
        OR: [
          { id: req.params.studentId },
          { userId: req.params.studentId },
        ],
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        skills: { include: { skill: true } },
        projects: { orderBy: { createdAt: 'desc' } },
        certifications: { orderBy: { issueDate: 'desc' } },
        assessmentAttempts: {
          include: {
            assessment: { select: { title: true, category: true, domain: true } },
          },
          orderBy: { completedAt: 'desc' },
        },
        applications: {
          where: { status: { in: ['ACCEPTED', 'COMPLETED'] } },
          include: {
            job: {
              include: { company: { select: { name: true, city: true, logoUrl: true } } },
            },
            milestones: { where: { status: 'APPROVED' } },
          },
        },
      },
    });

    if (!student) return res.status(404).json({ error: 'Student digital portfolio not found' });

    // Fetch documents
    const documents = await prisma.studentDocument.findMany({
      where: { userId: student.userId },
      orderBy: { uploadedAt: 'desc' },
    });

    // Parse assessment breakdown
    const parsedAssessments = student.assessmentAttempts.map((att) => {
      let categoryBreakdown = [];
      let strengths = [];
      try {
        categoryBreakdown = JSON.parse(att.categoryBreakdown);
        strengths = JSON.parse(att.strengths);
      } catch (e) {
        console.error('Error parsing assessment in portfolio:', e);
      }
      return {
        id: att.id,
        assessmentTitle: att.assessment.title,
        category: att.assessment.category,
        percentage: att.percentage,
        strengths,
        categoryBreakdown,
        completedAt: att.completedAt,
      };
    });

    const portfolio = {
      id: student.id,
      name: student.user.name,
      email: student.user.email,
      institution: student.institution,
      department: student.department,
      degree: student.degree,
      graduationYear: student.graduationYear,
      cgpa: student.cgpa,
      city: student.city,
      state: student.state,
      targetRole: student.targetRole,
      bio: student.bio,
      achievements: student.achievements,
      linkedinUrl: student.linkedinUrl,
      githubUrl: student.githubUrl,
      portfolioUrl: student.portfolioUrl,
      isVerified: student.isVerified,
      skills: student.skills.map((s) => ({
        id: s.skill.id,
        name: s.skill.name,
        system: s.skill.system,
      })),
      projects: student.projects,
      certifications: student.certifications,
      assessments: parsedAssessments,
      internships: student.applications.map((app) => ({
        id: app.id,
        title: app.job.title,
        companyName: app.job.company.name,
        companyCity: app.job.company.city,
        companyLogo: app.job.company.logoUrl,
        type: app.job.type,
        status: app.status,
        note: app.note,
        approvedMilestonesCount: app.milestones.length,
        milestones: app.milestones,
      })),
      documents,
    };

    res.json(portfolio);
  } catch (err) {
    console.error('Fetch portfolio error:', err);
    res.status(500).json({ error: 'Failed to fetch digital portfolio' });
  }
});

// POST /api/portfolio/projects — Add student project
router.post('/projects', authenticate, requireRole('STUDENT'), async (req, res) => {
  try {
    const student = req.user.student;
    if (!student) return res.status(403).json({ error: 'Student profile missing' });

    const { title, description, techStack, repoUrl, liveUrl, role, isFeatured } = req.body;
    if (!title || !description || !techStack) {
      return res.status(400).json({ error: 'Title, description, and techStack are required' });
    }

    const project = await prisma.studentProject.create({
      data: {
        studentId: student.id,
        title,
        description,
        techStack,
        repoUrl: repoUrl || null,
        liveUrl: liveUrl || null,
        role: role || 'Lead Contributor',
        isFeatured: isFeatured || false,
      },
    });

    res.status(201).json(project);
  } catch (err) {
    console.error('Add project error:', err);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// DELETE /api/portfolio/projects/:id — Delete student project
router.delete('/projects/:id', authenticate, requireRole('STUDENT'), async (req, res) => {
  try {
    const student = req.user.student;
    const project = await prisma.studentProject.findFirst({
      where: { id: req.params.id, studentId: student.id },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    await prisma.studentProject.delete({ where: { id: req.params.id } });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// POST /api/portfolio/certifications — Add student certification
router.post('/certifications', authenticate, requireRole('STUDENT'), async (req, res) => {
  try {
    const student = req.user.student;
    if (!student) return res.status(403).json({ error: 'Student profile missing' });

    const { title, issuer, issueDate, credentialUrl } = req.body;
    if (!title || !issuer || !issueDate) {
      return res.status(400).json({ error: 'Title, issuer, and issueDate are required' });
    }

    const certification = await prisma.studentCertification.create({
      data: {
        studentId: student.id,
        title,
        issuer,
        issueDate: new Date(issueDate),
        credentialUrl: credentialUrl || null,
        verificationStatus: 'VERIFIED',
      },
    });

    res.status(201).json(certification);
  } catch (err) {
    console.error('Add certification error:', err);
    res.status(500).json({ error: 'Failed to add certification' });
  }
});

// POST /api/portfolio/documents — Add document metadata
router.post('/documents', authenticate, async (req, res) => {
  try {
    const { title, type, fileUrl, fileSize } = req.body;
    if (!title || !type || !fileUrl) {
      return res.status(400).json({ error: 'Title, type, and fileUrl are required' });
    }

    const document = await prisma.studentDocument.create({
      data: {
        userId: req.user.id,
        title,
        type,
        fileUrl,
        fileSize: fileSize || '1.0 MB',
      },
    });

    res.status(201).json(document);
  } catch (err) {
    console.error('Add document error:', err);
    res.status(500).json({ error: 'Failed to add document' });
  }
});

// DELETE /api/portfolio/documents/:id — Delete document
router.delete('/documents/:id', authenticate, async (req, res) => {
  try {
    const doc = await prisma.studentDocument.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    await prisma.studentDocument.delete({ where: { id: req.params.id } });
    res.json({ message: 'Document removed successfully' });
  } catch (err) {
    console.error('Delete document error:', err);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

module.exports = router;
