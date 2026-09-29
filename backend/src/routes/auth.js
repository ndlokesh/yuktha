const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    // Spam/bot honeypot check
    if (req.body.website_hp) {
      return res.status(400).json({ error: 'Automated submission detected.' });
    }

    const { name, email, password, role, institution, companyName, sector, collegeName, city, state } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password and role are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const validRoles = ['STUDENT', 'FACULTY', 'COMPANY', 'COLLEGE'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be STUDENT, FACULTY, COMPANY or COLLEGE' });
    }

    const existing = await prisma.user.findFirst({
      where: { email: { equals: cleanEmail } },
    });
    if (existing) return res.status(409).json({ error: 'Email already registered. Please sign in instead.' });

    const hashed = await bcrypt.hash(password, 10);

    // All roles are active immediately — no institution verification required
    const isActive = true;

    let userData = {
      name,
      email,
      password: hashed,
      role,
      isActive,
    };

    // Create role-specific sub-profile
    if (role === 'STUDENT') {
      userData.student = {
        create: {
          institution: institution || '',
          degree: req.body.degree || '',
          graduationYear: parseInt(req.body.graduationYear) || new Date().getFullYear() + 1,
          city: city || '',
          state: state || '',
          targetRole: req.body.targetRole || '',
        },
      };
    } else if (role === 'FACULTY') {
      userData.faculty = {
        create: {
          institution: institution || '',
          department: req.body.department || 'Academic Department',
          designation: req.body.designation || 'Assistant Professor',
          qualifications: req.body.qualifications || 'Ph.D / Post-Graduate',
          experienceYears: parseInt(req.body.experienceYears) || 3,
          specializations: req.body.specializations || 'Research & Teaching',
          researchInterests: req.body.researchInterests || '',
        },
      };
    } else if (role === 'COMPANY') {
      userData.company = {
        create: {
          name: companyName || name,
          sector: sector || 'General',
          city: city || '',
        },
      };
    } else if (role === 'COLLEGE') {
      userData.college = {
        create: {
          name: collegeName || name,
          city: city || '',
          state: state || '',
          verificationStatus: 'PENDING',
        },
      };
    }

    const user = await prisma.user.create({
      data: userData,
      include: { student: true, faculty: true, company: true, college: true },
    });

    const secret = process.env.JWT_SECRET || 'ayush_sih_2026_super_secret_key_yuktha';
    const token = jwt.sign(
      { id: user.id, role: user.role },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'Registration successful.',
      user: userWithoutPassword,
      token,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    if (req.body.website_hp) {
      return res.status(400).json({ error: 'Automated submission detected.' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Try direct match first, then fallback to case-insensitive findFirst
    let user = await prisma.user.findFirst({
      where: { email: cleanEmail },
      include: { student: true, faculty: true, company: true, college: true },
    });

    if (!user) {
      const allUsers = await prisma.user.findMany({
        include: { student: true, faculty: true, company: true, college: true },
      });
      user = allUsers.find((u) => u.email.trim().toLowerCase() === cleanEmail);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password. Please verify your credentials.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password. Please verify your credentials.' });
    }

    if (!user.isActive) {
      return res.status(403).json({
        error: 'Your account has been deactivated. Please contact support.',
      });
    }

    const secret = process.env.JWT_SECRET || 'ayush_sih_2026_super_secret_key_yuktha';
    const token = jwt.sign(
      { id: user.id, role: user.role },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login service encountered an issue. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').authenticate, async (req, res) => {
  const { password: _, ...user } = req.user;
  res.json(user);
});

module.exports = router;
