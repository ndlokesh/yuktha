const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, institution, companyName, sector, collegeName, city, state } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password and role are required' });
    }

    const validRoles = ['STUDENT', 'COMPANY', 'COLLEGE'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be STUDENT, COMPANY or COLLEGE' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);

    // Students need verification by college, companies/colleges are active by default
    const isActive = role !== 'STUDENT';

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
      include: { student: true, company: true, college: true },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: role === 'STUDENT'
        ? 'Registration successful. Your account is pending verification by your institution.'
        : 'Registration successful.',
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { student: true, company: true, college: true },
    });

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.isActive) {
      return res.status(403).json({
        error: 'Account pending verification. Please wait for your institution to approve your registration.',
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').authenticate, async (req, res) => {
  const { password: _, ...user } = req.user;
  res.json(user);
});

module.exports = router;
