const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/skills — all skills grouped by system
router.get('/', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { system: 'asc' } });

    // Group by system
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.system]) acc[skill.system] = [];
      acc[skill.system].push(skill);
      return acc;
    }, {});

    res.json({ skills, grouped });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

module.exports = router;
