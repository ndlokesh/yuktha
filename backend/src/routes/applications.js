const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireRole } = require('../middleware/auth');
const { sendEmail, emailTemplates } = require('../utils/email');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/apply/:jobId — student applies to a job
router.post('/:jobId', authenticate, requireRole('STUDENT'), async (req, res) => {
  try {
    const { jobId } = req.params;

    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user.id } });
    if (!profile) return res.status(404).json({ error: 'Student profile not found' });

    const job = await prisma.jobListing.findUnique({
      where: { id: jobId },
      include: { company: true },
    });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (!job.isActive) return res.status(400).json({ error: 'This listing is no longer active' });

    const existing = await prisma.application.findUnique({
      where: { studentId_jobId: { studentId: profile.id, jobId } },
    });
    if (existing) return res.status(409).json({ error: 'Already applied to this job' });

    const application = await prisma.application.create({
      data: { studentId: profile.id, jobId, status: 'APPLIED' },
      include: { job: { include: { company: true } } },
    });

    // Email trigger: application received
    const tmpl = emailTemplates.applicationReceived(req.user.name, job.title, job.company.name);
    await sendEmail({ to: req.user.email, ...tmpl });

    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// PATCH /api/applications/:id — company updates status
router.patch('/:id', authenticate, requireRole('COMPANY'), async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['APPLIED', 'SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'ACCEPTED', 'REJECTED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: {
        student: { include: { user: true } },
        job: { include: { company: true } },
      },
    });

    if (!application) return res.status(404).json({ error: 'Application not found' });

    // Verify the company owns this job
    if (application.job.company.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.application.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(note !== undefined && { note }),
      },
    });

    // Email trigger: status updated
    const tmpl = emailTemplates.statusUpdated(
      application.student.user.name,
      application.job.title,
      status
    );
    await sendEmail({ to: application.student.user.email, ...tmpl });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// GET /api/applications/:id/milestones — Get internship milestones
router.get('/:id/milestones', authenticate, async (req, res) => {
  try {
    const milestones = await prisma.internshipMilestone.findMany({
      where: { applicationId: req.params.id },
      orderBy: { weekNumber: 'asc' },
    });
    res.json(milestones);
  } catch (err) {
    console.error('Fetch milestones error:', err);
    res.status(500).json({ error: 'Failed to fetch milestones' });
  }
});

// POST /api/applications/:id/milestones — Student logs weekly progress milestone
router.post('/:id/milestones', authenticate, async (req, res) => {
  try {
    const { weekNumber, title, description, deliverablesUrl } = req.body;
    if (!weekNumber || !title || !description) {
      return res.status(400).json({ error: 'Week number, title, and description are required' });
    }

    const milestone = await prisma.internshipMilestone.create({
      data: {
        applicationId: req.params.id,
        weekNumber: parseInt(weekNumber),
        title,
        description,
        deliverablesUrl: deliverablesUrl || null,
        status: 'SUBMITTED',
      },
    });

    res.status(201).json(milestone);
  } catch (err) {
    console.error('Create milestone error:', err);
    res.status(500).json({ error: 'Failed to log internship milestone' });
  }
});

// PATCH /api/applications/milestones/:milestoneId — Mentor feedback and rating
router.patch('/milestones/:milestoneId', authenticate, requireRole('COMPANY', 'COLLEGE', 'ADMIN'), async (req, res) => {
  try {
    const { mentorRating, mentorFeedback, status } = req.body;

    const updated = await prisma.internshipMilestone.update({
      where: { id: req.params.milestoneId },
      data: {
        mentorRating: mentorRating !== undefined ? parseInt(mentorRating) : undefined,
        mentorFeedback: mentorFeedback !== undefined ? mentorFeedback : undefined,
        status: status || 'APPROVED',
        reviewedAt: new Date(),
      },
    });

    res.json({ message: 'Milestone evaluated', milestone: updated });
  } catch (err) {
    console.error('Evaluate milestone error:', err);
    res.status(500).json({ error: 'Failed to evaluate milestone' });
  }
});

module.exports = router;
