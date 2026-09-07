const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/jobs — list jobs with filters
router.get('/', async (req, res) => {
  try {
    const { skill, location, type, search } = req.query;

    const where = { isActive: true };

    if (type && (type === 'INTERNSHIP' || type === 'JOB')) {
      where.type = type;
    }

    if (location) {
      where.location = { contains: location };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    let jobs = await prisma.jobListing.findMany({
      where,
      include: {
        company: true,
        skills: { include: { skill: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter by skill after fetch (many-to-many)
    if (skill) {
      jobs = jobs.filter((j) =>
        j.skills.some((s) => s.skill.name.toLowerCase().includes(skill.toLowerCase()))
      );
    }

    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await prisma.jobListing.findUnique({
      where: { id: req.params.id },
      include: {
        company: true,
        skills: { include: { skill: true } },
        _count: { select: { applications: true } },
      },
    });

    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// POST /api/jobs — create job (Company only)
router.post('/', authenticate, requireRole('COMPANY'), async (req, res) => {
  try {
    const { title, description, type, location, stipend, deadline, skillIds } = req.body;

    if (!title || !description || !type || !location || !deadline) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const company = req.user.company;
    if (!company) return res.status(400).json({ error: 'Company profile not found' });

    const job = await prisma.jobListing.create({
      data: {
        companyId: company.id,
        title,
        description,
        type,
        location,
        stipend,
        deadline: new Date(deadline),
        skills: {
          create: (skillIds || []).map((skillId) => ({ skillId })),
        },
      },
      include: {
        company: true,
        skills: { include: { skill: true } },
      },
    });

    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// PUT /api/jobs/:id — update job (Company only)
router.put('/:id', authenticate, requireRole('COMPANY'), async (req, res) => {
  try {
    const { title, description, type, location, stipend, deadline, skillIds, isActive } = req.body;

    const company = req.user.company;
    const job = await prisma.jobListing.findFirst({
      where: { id: req.params.id, companyId: company.id },
    });

    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Update skills if provided
    if (Array.isArray(skillIds)) {
      await prisma.jobSkill.deleteMany({ where: { jobId: job.id } });
      await prisma.jobSkill.createMany({
        data: skillIds.map((skillId) => ({ jobId: job.id, skillId })),
        skipDuplicates: true,
      });
    }

    const updated = await prisma.jobListing.update({
      where: { id: job.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(location !== undefined && { location }),
        ...(stipend !== undefined && { stipend }),
        ...(deadline !== undefined && { deadline: new Date(deadline) }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        company: true,
        skills: { include: { skill: true } },
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// GET /api/jobs/company/mine — company's own jobs
router.get('/company/mine', authenticate, requireRole('COMPANY'), async (req, res) => {
  try {
    const company = req.user.company;
    const jobs = await prisma.jobListing.findMany({
      where: { companyId: company.id },
      include: {
        skills: { include: { skill: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

module.exports = router;
