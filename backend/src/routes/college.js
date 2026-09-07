const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireRole } = require('../middleware/auth');
const { sendEmail, emailTemplates } = require('../utils/email');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/college/students — institution's students + analytics
router.get('/students', authenticate, requireRole('COLLEGE', 'ADMIN'), async (req, res) => {
  try {
    const { graduationYear } = req.query;
    let institutionName;

    if (req.user.role === 'COLLEGE') {
      institutionName = req.user.college?.name;
    }

    const where = {
      user: { isActive: true },
      ...(institutionName && { institution: { contains: institutionName } }),
      ...(graduationYear && { graduationYear: parseInt(graduationYear) }),
    };

    const students = await prisma.studentProfile.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, isActive: true, createdAt: true } },
        skills: { include: { skill: true } },
        applications: {
          include: {
            job: { include: { company: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Compute per-student stats
    const enriched = students.map((s) => {
      const apps = s.applications;
      const accepted = apps.filter((a) => a.status === 'ACCEPTED').length;
      const placed = accepted > 0;
      return { ...s, totalApplications: apps.length, placed };
    });

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// GET /api/college/pending — students pending verification
router.get('/pending', authenticate, requireRole('COLLEGE', 'ADMIN'), async (req, res) => {
  try {
    let institutionFilter = {};
    if (req.user.role === 'COLLEGE') {
      institutionFilter = { institution: { contains: req.user.college?.name } };
    }

    const pending = await prisma.studentProfile.findMany({
      where: { user: { isActive: false }, ...institutionFilter },
      include: { user: { select: { id: true, name: true, email: true, createdAt: true } } },
    });

    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending students' });
  }
});

// PATCH /api/college/verify/:userId — verify or reject a student
router.patch('/verify/:userId', authenticate, requireRole('COLLEGE', 'ADMIN'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body; // 'approve' | 'reject'

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { student: true },
    });

    if (!user || user.role !== 'STUDENT') {
      return res.status(404).json({ error: 'Student not found' });
    }

    const isActive = action === 'approve';

    await prisma.user.update({ where: { id: userId }, data: { isActive } });

    if (isActive) {
      const tmpl = emailTemplates.verificationApproved(user.name);
      await sendEmail({ to: user.email, ...tmpl });
    }

    res.json({ message: `Student ${action === 'approve' ? 'approved' : 'rejected'}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update verification' });
  }
});

// GET /api/college/analytics — batch-wise placement analytics
router.get('/analytics', authenticate, requireRole('COLLEGE', 'ADMIN'), async (req, res) => {
  try {
    const { graduationYear } = req.query;
    let institutionName;
    if (req.user.role === 'COLLEGE') {
      institutionName = req.user.college?.name;
    }

    const where = {
      user: { isActive: true },
      ...(institutionName && { institution: { contains: institutionName } }),
      ...(graduationYear && { graduationYear: parseInt(graduationYear) }),
    };

    const students = await prisma.studentProfile.findMany({
      where,
      include: {
        applications: { include: { job: { include: { company: true } } } },
        skills: { include: { skill: true } },
      },
    });

    const totalStudents = students.length;
    const placed = students.filter((s) => s.applications.some((a) => a.status === 'ACCEPTED')).length;

    // Skills distribution
    const skillCounts = {};
    students.forEach((s) => {
      s.skills.forEach((sk) => {
        skillCounts[sk.skill.name] = (skillCounts[sk.skill.name] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Top hiring companies
    const companyCounts = {};
    students.forEach((s) => {
      s.applications.filter((a) => a.status === 'ACCEPTED').forEach((a) => {
        const cname = a.job.company.name;
        companyCounts[cname] = (companyCounts[cname] || 0) + 1;
      });
    });

    const topCompanies = Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Batch-wise breakdown
    const batchMap = {};
    students.forEach((s) => {
      const yr = s.graduationYear;
      if (!batchMap[yr]) batchMap[yr] = { year: yr, total: 0, placed: 0, applied: 0 };
      batchMap[yr].total++;
      if (s.applications.length > 0) batchMap[yr].applied++;
      if (s.applications.some((a) => a.status === 'ACCEPTED')) batchMap[yr].placed++;
    });

    const batches = Object.values(batchMap).sort((a, b) => b.year - a.year);

    res.json({ totalStudents, placed, placementRate: totalStudents ? Math.round((placed / totalStudents) * 100) : 0, topSkills, topCompanies, batches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
