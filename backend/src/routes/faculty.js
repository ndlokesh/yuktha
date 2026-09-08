const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/faculty/profile — Get faculty profile
router.get('/profile', authenticate, requireRole('FACULTY'), async (req, res) => {
  try {
    const faculty = await prisma.facultyProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: { select: { name: true, email: true, role: true } },
      },
    });

    if (!faculty) return res.status(404).json({ error: 'Faculty profile not found' });
    res.json(faculty);
  } catch (err) {
    console.error('Get faculty profile error:', err);
    res.status(500).json({ error: 'Failed to fetch faculty profile' });
  }
});

// PUT /api/faculty/profile — Update faculty profile
router.put('/profile', authenticate, requireRole('FACULTY'), async (req, res) => {
  try {
    const {
      institution,
      department,
      designation,
      qualifications,
      experienceYears,
      specializations,
      researchInterests,
      consultingDomains,
      publicationsCount,
      bio,
      linkedinUrl,
      cvUrl,
    } = req.body;

    const updated = await prisma.facultyProfile.update({
      where: { userId: req.user.id },
      data: {
        institution: institution !== undefined ? institution : undefined,
        department: department !== undefined ? department : undefined,
        designation: designation !== undefined ? designation : undefined,
        qualifications: qualifications !== undefined ? qualifications : undefined,
        experienceYears: experienceYears !== undefined ? parseInt(experienceYears) : undefined,
        specializations: specializations !== undefined ? specializations : undefined,
        researchInterests: researchInterests !== undefined ? researchInterests : undefined,
        consultingDomains: consultingDomains !== undefined ? consultingDomains : undefined,
        publicationsCount: publicationsCount !== undefined ? parseInt(publicationsCount) : undefined,
        bio: bio !== undefined ? bio : undefined,
        linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : undefined,
        cvUrl: cvUrl !== undefined ? cvUrl : undefined,
      },
      include: {
        user: { select: { name: true, email: true, role: true } },
      },
    });

    res.json({ message: 'Faculty profile updated successfully', faculty: updated });
  } catch (err) {
    console.error('Update faculty profile error:', err);
    res.status(500).json({ error: 'Failed to update faculty profile' });
  }
});

// GET /api/faculty/dashboard — Summary metrics and active collaboration state
router.get('/dashboard', authenticate, requireRole('FACULTY'), async (req, res) => {
  try {
    const faculty = req.user.faculty;
    if (!faculty) return res.status(404).json({ error: 'Faculty profile not found' });

    // Count submitted proposals
    const proposals = await prisma.collaborationApplication.findMany({
      where: { facultyId: faculty.id },
      include: {
        opportunity: {
          select: { title: true, type: true, domain: true, budgetOrStipend: true },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    // Enrolled learning programs / FDPs
    const enrolledPrograms = await prisma.learningEnrollment.findMany({
      where: { facultyId: faculty.id },
      include: {
        program: {
          select: { title: true, category: true, duration: true, mode: true },
        },
      },
    });

    // Open opportunities count
    const openOpportunitiesCount = await prisma.collaborationOpportunity.count({
      where: { status: 'OPEN' },
    });

    // Recent opportunities
    const recentOpportunities = await prisma.collaborationOpportunity.findMany({
      where: { status: 'OPEN' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        company: { select: { name: true, city: true } },
        college: { select: { name: true } },
      },
    });

    res.json({
      faculty,
      stats: {
        totalProposals: proposals.length,
        acceptedProposals: proposals.filter((p) => p.status === 'ACCEPTED').length,
        enrolledFDPs: enrolledPrograms.length,
        openOpportunities: openOpportunitiesCount,
      },
      proposals: proposals.slice(0, 5),
      enrolledPrograms,
      recentOpportunities,
    });
  } catch (err) {
    console.error('Faculty dashboard error:', err);
    res.status(500).json({ error: 'Failed to fetch faculty dashboard' });
  }
});

module.exports = router;
