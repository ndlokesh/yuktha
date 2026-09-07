const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireRole } = require('../middleware/auth');
const { upload, localFileUrl } = require('../middleware/upload');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/student/profile
router.get('/profile', authenticate, requireRole('STUDENT'), async (req, res) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        skills: { include: { skill: true } },
        user: { select: { name: true, email: true } },
      },
    });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/student/profile
router.put('/profile', authenticate, requireRole('STUDENT'), async (req, res) => {
  try {
    const {
      institution, degree, graduationYear, city, state,
      linkedinUrl, achievements, bio, name,
    } = req.body;

    // Update user name if provided
    if (name) {
      await prisma.user.update({ where: { id: req.user.id }, data: { name } });
    }

    const profile = await prisma.studentProfile.update({
      where: { userId: req.user.id },
      data: {
        ...(institution !== undefined && { institution }),
        ...(degree !== undefined && { degree }),
        ...(graduationYear !== undefined && { graduationYear: parseInt(graduationYear) }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(achievements !== undefined && { achievements }),
        ...(bio !== undefined && { bio }),
      },
      include: {
        skills: { include: { skill: true } },
        user: { select: { name: true, email: true } },
      },
    });

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/student/skills — set student skills (replaces existing)
router.post('/skills', authenticate, requireRole('STUDENT'), async (req, res) => {
  try {
    const { skillIds } = req.body;
    if (!Array.isArray(skillIds)) return res.status(400).json({ error: 'skillIds must be an array' });

    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user.id } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    // Delete existing and re-insert
    await prisma.studentSkill.deleteMany({ where: { studentId: profile.id } });

    if (skillIds.length > 0) {
      await prisma.studentSkill.createMany({
        data: skillIds.map((skillId) => ({ studentId: profile.id, skillId })),
        skipDuplicates: true,
      });
    }

    const updated = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: { skills: { include: { skill: true } } },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update skills' });
  }
});

// POST /api/student/resume — upload resume PDF
router.post('/resume', authenticate, requireRole('STUDENT'), upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const resumeUrl = localFileUrl(req, req.file.filename);

    const profile = await prisma.studentProfile.update({
      where: { userId: req.user.id },
      data: { resumeUrl },
    });

    res.json({ resumeUrl, profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Resume upload failed' });
  }
});

// POST /api/student/photo — upload profile photo
router.post('/photo', authenticate, requireRole('STUDENT'), upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const photoUrl = localFileUrl(req, req.file.filename);

    const profile = await prisma.studentProfile.update({
      where: { userId: req.user.id },
      data: { photoUrl },
    });

    res.json({ photoUrl, profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Photo upload failed' });
  }
});

// GET /api/student/applications
router.get('/applications', authenticate, requireRole('STUDENT'), async (req, res) => {
  try {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user.id } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const applications = await prisma.application.findMany({
      where: { studentId: profile.id },
      include: {
        job: {
          include: {
            company: true,
            skills: { include: { skill: true } },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

module.exports = router;
