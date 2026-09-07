const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/company/profile
router.get('/profile', authenticate, requireRole('COMPANY'), async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { userId: req.user.id },
      include: {
        user: { select: { name: true, email: true } },
        jobs: { include: { _count: { select: { applications: true } } } },
      },
    });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch company profile' });
  }
});

// PUT /api/company/profile
router.put('/profile', authenticate, requireRole('COMPANY'), async (req, res) => {
  try {
    const { name, sector, website, city, description } = req.body;

    const company = await prisma.company.update({
      where: { userId: req.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(sector !== undefined && { sector }),
        ...(website !== undefined && { website }),
        ...(city !== undefined && { city }),
        ...(description !== undefined && { description }),
      },
    });

    res.json(company);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update company profile' });
  }
});

// GET /api/company/applicants/:jobId — with skill-match scoring
router.get('/applicants/:jobId', authenticate, requireRole('COMPANY'), async (req, res) => {
  try {
    const { jobId } = req.params;
    const { skill, institution, city, graduationYear } = req.query;

    // Verify company owns this job
    const job = await prisma.jobListing.findFirst({
      where: { id: jobId, company: { userId: req.user.id } },
      include: { skills: { include: { skill: true } } },
    });

    if (!job) return res.status(404).json({ error: 'Job not found' });

    const requiredSkillIds = new Set(job.skills.map((js) => js.skillId));

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        student: {
          include: {
            user: { select: { name: true, email: true } },
            skills: { include: { skill: true } },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    // Compute skill-match %
    let results = applications.map((app) => {
      const studentSkillIds = new Set(app.student.skills.map((ss) => ss.skillId));
      const matchCount = [...requiredSkillIds].filter((id) => studentSkillIds.has(id)).length;
      const matchPercent = requiredSkillIds.size > 0
        ? Math.round((matchCount / requiredSkillIds.size) * 100)
        : 0;

      return { ...app, matchPercent };
    });

    // Apply filters
    if (skill) {
      results = results.filter((r) =>
        r.student.skills.some((s) => s.skill.name.toLowerCase().includes(skill.toLowerCase()))
      );
    }
    if (institution) {
      results = results.filter((r) =>
        r.student.institution.toLowerCase().includes(institution.toLowerCase())
      );
    }
    if (city) {
      results = results.filter((r) =>
        r.student.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    if (graduationYear) {
      results = results.filter((r) => r.student.graduationYear === parseInt(graduationYear));
    }

    // Sort by match % descending
    results.sort((a, b) => b.matchPercent - a.matchPercent);

    res.json({ job, applications: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
});

// GET /api/company/students/search — search students by skill/institution/city/year
router.get('/students/search', authenticate, requireRole('COMPANY'), async (req, res) => {
  try {
    const { skill, institution, city, graduationYear } = req.query;

    const where = {};
    if (institution) where.institution = { contains: institution, mode: 'insensitive' };
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (graduationYear) where.graduationYear = parseInt(graduationYear);

    let students = await prisma.studentProfile.findMany({
      where: { ...where, user: { isActive: true } },
      include: {
        user: { select: { name: true, email: true, createdAt: true } },
        skills: { include: { skill: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (skill) {
      students = students.filter((s) =>
        s.skills.some((sk) => sk.skill.name.toLowerCase().includes(skill.toLowerCase()))
      );
    }

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search students' });
  }
});

module.exports = router;
