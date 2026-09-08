const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/collaboration/opportunities — List all academic-industry collaboration opportunities
router.get('/opportunities', authenticate, async (req, res) => {
  try {
    const { type, domain, search } = req.query;

    const where = { status: 'OPEN' };
    if (type) where.type = type;
    if (domain) where.domain = { contains: domain };
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { requirements: { contains: search } },
      ];
    }

    const opportunities = await prisma.collaborationOpportunity.findMany({
      where,
      include: {
        company: { select: { name: true, city: true, logoUrl: true, sector: true } },
        college: { select: { name: true, city: true, state: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Check if logged in faculty has already applied
    let facultyApplications = [];
    if (req.user.faculty) {
      facultyApplications = await prisma.collaborationApplication.findMany({
        where: { facultyId: req.user.faculty.id },
      });
    }

    const result = opportunities.map((opp) => {
      const existingApp = facultyApplications.find((a) => a.opportunityId === opp.id);
      return {
        id: opp.id,
        title: opp.title,
        type: opp.type,
        domain: opp.domain,
        description: opp.description,
        requirements: opp.requirements,
        budgetOrStipend: opp.budgetOrStipend,
        duration: opp.duration,
        location: opp.location,
        deadline: opp.deadline,
        postedBy: opp.company?.name || opp.college?.name || 'Academic-Industry Alliance',
        postedByType: opp.company ? 'COMPANY' : 'COLLEGE',
        logoUrl: opp.company?.logoUrl,
        applicationsCount: opp._count.applications,
        hasApplied: !!existingApp,
        applicationStatus: existingApp ? existingApp.status : null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Fetch collaboration opportunities error:', err);
    res.status(500).json({ error: 'Failed to fetch collaboration opportunities' });
  }
});

// GET /api/collaboration/opportunities/:id — Single opportunity details
router.get('/opportunities/:id', authenticate, async (req, res) => {
  try {
    const opportunity = await prisma.collaborationOpportunity.findUnique({
      where: { id: req.params.id },
      include: {
        company: true,
        college: true,
        applications: {
          include: {
            faculty: {
              include: { user: { select: { name: true, email: true } } },
            },
          },
        },
      },
    });

    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

    res.json(opportunity);
  } catch (err) {
    console.error('Fetch opportunity detail error:', err);
    res.status(500).json({ error: 'Failed to fetch opportunity details' });
  }
});

// POST /api/collaboration/opportunities — Post new collaboration RFP (Company or College)
router.post('/opportunities', authenticate, requireRole('COMPANY', 'COLLEGE', 'ADMIN'), async (req, res) => {
  try {
    const {
      title,
      type,
      domain,
      description,
      requirements,
      budgetOrStipend,
      duration,
      location,
      deadline,
    } = req.body;

    if (!title || !type || !domain || !description || !requirements) {
      return res.status(400).json({ error: 'Title, type, domain, description, and requirements are required' });
    }

    const opportunity = await prisma.collaborationOpportunity.create({
      data: {
        companyId: req.user.company ? req.user.company.id : null,
        collegeId: req.user.college ? req.user.college.id : null,
        title,
        type: type.toUpperCase(),
        domain,
        description,
        requirements,
        budgetOrStipend: budgetOrStipend || null,
        duration: duration || 'Flexible',
        location: location || 'Hybrid',
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: 'OPEN',
      },
    });

    res.status(201).json(opportunity);
  } catch (err) {
    console.error('Post opportunity error:', err);
    res.status(500).json({ error: 'Failed to post collaboration opportunity' });
  }
});

// POST /api/collaboration/opportunities/:id/apply — Faculty applies/submits proposal
router.post('/opportunities/:id/apply', authenticate, requireRole('FACULTY'), async (req, res) => {
  try {
    const faculty = req.user.faculty;
    if (!faculty) return res.status(403).json({ error: 'Faculty profile not found' });

    const opportunity = await prisma.collaborationOpportunity.findUnique({
      where: { id: req.params.id },
    });
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

    const existing = await prisma.collaborationApplication.findFirst({
      where: { opportunityId: opportunity.id, facultyId: faculty.id },
    });
    if (existing) {
      return res.status(400).json({ error: 'Proposal already submitted for this opportunity' });
    }

    const { proposal, documentUrl } = req.body;
    if (!proposal) return res.status(400).json({ error: 'Proposal content is required' });

    const application = await prisma.collaborationApplication.create({
      data: {
        opportunityId: opportunity.id,
        facultyId: faculty.id,
        proposal,
        documentUrl: documentUrl || null,
        status: 'APPLIED',
      },
    });

    res.status(201).json({ message: 'Collaboration proposal submitted successfully!', application });
  } catch (err) {
    console.error('Submit proposal error:', err);
    res.status(500).json({ error: 'Failed to submit proposal' });
  }
});

// GET /api/collaboration/faculty/my-proposals — Faculty's submitted proposals
router.get('/faculty/my-proposals', authenticate, requireRole('FACULTY'), async (req, res) => {
  try {
    const faculty = req.user.faculty;
    if (!faculty) return res.status(403).json({ error: 'Faculty profile not found' });

    const applications = await prisma.collaborationApplication.findMany({
      where: { facultyId: faculty.id },
      include: {
        opportunity: {
          include: {
            company: { select: { name: true, logoUrl: true, city: true } },
            college: { select: { name: true, city: true } },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    const result = applications.map((app) => ({
      id: app.id,
      opportunityId: app.opportunity.id,
      title: app.opportunity.title,
      type: app.opportunity.type,
      domain: app.opportunity.domain,
      budgetOrStipend: app.opportunity.budgetOrStipend,
      organization: app.opportunity.company?.name || app.opportunity.college?.name,
      proposal: app.proposal,
      documentUrl: app.documentUrl,
      status: app.status,
      reviewNote: app.reviewNote,
      appliedAt: app.appliedAt,
    }));

    res.json(result);
  } catch (err) {
    console.error('Fetch faculty proposals error:', err);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// GET /api/collaboration/company/proposals/:opportunityId — Company reviews submitted proposals
router.get('/company/proposals/:opportunityId', authenticate, requireRole('COMPANY', 'COLLEGE', 'ADMIN'), async (req, res) => {
  try {
    const applications = await prisma.collaborationApplication.findMany({
      where: { opportunityId: req.params.opportunityId },
      include: {
        faculty: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    const result = applications.map((app) => ({
      id: app.id,
      facultyId: app.faculty.id,
      facultyName: app.faculty.user.name,
      facultyEmail: app.faculty.user.email,
      institution: app.faculty.institution,
      department: app.faculty.department,
      designation: app.faculty.designation,
      qualifications: app.faculty.qualifications,
      experienceYears: app.faculty.experienceYears,
      specializations: app.faculty.specializations,
      publicationsCount: app.faculty.publicationsCount,
      proposal: app.proposal,
      documentUrl: app.documentUrl,
      status: app.status,
      reviewNote: app.reviewNote,
      appliedAt: app.appliedAt,
    }));

    res.json(result);
  } catch (err) {
    console.error('Fetch company proposals error:', err);
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

// PATCH /api/collaboration/proposals/:id/status — Accept / Reject / Update proposal
router.patch('/proposals/:id/status', authenticate, requireRole('COMPANY', 'COLLEGE', 'ADMIN'), async (req, res) => {
  try {
    const { status, reviewNote } = req.body;
    const validStatuses = ['APPLIED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = await prisma.collaborationApplication.update({
      where: { id: req.params.id },
      data: {
        status,
        reviewNote: reviewNote || undefined,
      },
    });

    res.json({ message: 'Proposal status updated successfully', application: updated });
  } catch (err) {
    console.error('Update proposal status error:', err);
    res.status(500).json({ error: 'Failed to update proposal status' });
  }
});

module.exports = router;
