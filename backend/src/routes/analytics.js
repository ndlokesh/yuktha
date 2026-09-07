const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/analytics/overview — national Ministry analytics
router.get('/overview', authenticate, requireRole('ADMIN', 'COLLEGE'), async (req, res) => {
  try {
    const [totalStudents, totalCompanies, totalColleges, totalJobs, totalApplications, allStudents, allSkills] =
      await Promise.all([
        prisma.user.count({ where: { role: 'STUDENT' } }),
        prisma.user.count({ where: { role: 'COMPANY' } }),
        prisma.user.count({ where: { role: 'COLLEGE' } }),
        prisma.jobListing.count(),
        prisma.application.count(),
        prisma.studentProfile.findMany({
          include: {
            user: { select: { createdAt: true } },
            applications: true,
            skills: { include: { skill: true } },
          },
        }),
        prisma.jobSkill.findMany({ include: { skill: true } }),
      ]);

    // Placement rate
    const placedStudents = allStudents.filter((s) =>
      s.applications.some((a) => a.status === 'ACCEPTED')
    ).length;

    // Students by state
    const stateMap = {};
    allStudents.forEach((s) => {
      const st = s.state || 'Unknown';
      stateMap[st] = (stateMap[st] || 0) + 1;
    });
    const studentsByState = Object.entries(stateMap)
      .sort(([, a], [, b]) => b - a)
      .map(([state, count]) => ({ state, count }));

    // Top 10 demanded skills (from job listings)
    const demandMap = {};
    allSkills.forEach((js) => {
      demandMap[js.skill.name] = (demandMap[js.skill.name] || 0) + 1;
    });
    const topSkillsDemand = Object.entries(demandMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Monthly registrations + applications trend (last 12 months)
    const now = new Date();
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
        start: new Date(d.getFullYear(), d.getMonth(), 1),
        end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
      });
    }

    const monthlyTrend = await Promise.all(
      months.map(async ({ month, start, end }) => {
        const [registrations, applications] = await Promise.all([
          prisma.user.count({ where: { createdAt: { gte: start, lte: end } } }),
          prisma.application.count({ where: { appliedAt: { gte: start, lte: end } } }),
        ]);
        return { month, registrations, applications };
      })
    );

    // College performance leaderboard
    const allColleges = await prisma.college.findMany({
      include: { user: { select: { name: true } } },
    });

    const collegeStats = await Promise.all(
      allColleges.map(async (college) => {
        const students = await prisma.studentProfile.findMany({
          where: { institution: { contains: college.name, mode: 'insensitive' } },
          include: { applications: true },
        });
        const total = students.length;
        const placed = students.filter((s) =>
          s.applications.some((a) => a.status === 'ACCEPTED')
        ).length;
        return {
          college: college.name,
          city: college.city,
          state: college.state,
          totalStudents: total,
          placed,
          placementRate: total ? Math.round((placed / total) * 100) : 0,
        };
      })
    );

    collegeStats.sort((a, b) => b.placementRate - a.placementRate);

    res.json({
      overview: {
        totalStudents,
        totalCompanies,
        totalColleges,
        totalJobs,
        totalApplications,
        placedStudents,
        placementRate: totalStudents ? Math.round((placedStudents / totalStudents) * 100) : 0,
      },
      studentsByState,
      topSkillsDemand,
      monthlyTrend,
      collegeLeaderboard: collegeStats.slice(0, 10),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
