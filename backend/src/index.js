require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skills');
const studentRoutes = require('./routes/student');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const companyRoutes = require('./routes/company');
const collegeRoutes = require('./routes/college');
const analyticsRoutes = require('./routes/analytics');
const assessmentRoutes = require('./routes/assessments');
const learningRoutes = require('./routes/learning');
const collaborationRoutes = require('./routes/collaboration');
const facultyRoutes = require('./routes/faculty');
const portfolioRoutes = require('./routes/portfolio');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxies (Render, AWS, Heroku, Cloudflare, Nginx)
app.set('trust proxy', 1);

// ─── Force HTTPS & Security Headers Middleware ───────────────────────────────
app.use((req, res, next) => {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';

  // In production, force HTTPS redirect
  if (!isHttps && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }

  // Security headers (HSTS, clickjacking prevention, MIME sniffing prevention)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  next();
});

// ─── Rate Limiting (Spam & Bot Protection) ────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 600, // Limit each IP to 600 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP address. Please try again after 15 minutes.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 authentication attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please wait 15 minutes before trying again.' },
});

// Apply rate limiter to general API
app.use('/api/', apiLimiter);

// ─── CORS & Body Parsing ──────────────────────────────────────────────────────
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((u) => u.trim())
  : ['http://localhost:5173', 'http://localhost:5000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files (local disk fallback)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ─── SEO Endpoints: Robots.txt & Sitemap.xml ──────────────────────────────────
const frontendPublic = path.join(__dirname, '..', '..', 'frontend', 'public');

app.get('/robots.txt', (req, res) => {
  const robotsPath = path.join(frontendPublic, 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.type('text/plain').sendFile(robotsPath);
  } else {
    res.type('text/plain').send("User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://yuktha.gov.in/sitemap.xml\n");
  }
});

app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.join(frontendPublic, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    res.type('application/xml').sendFile(sitemapPath);
  } else {
    res.status(404).send('Sitemap not found');
  }
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/apply', applicationRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/portfolio', portfolioRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ─── Serve Frontend Static in Production with Cache-Control ───────────────────
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist, {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, filePath) => {
      // Never cache index.html so updates are immediately visible to clients
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  }));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// ─── Auto-seed check on startup ───────────────────────────────────────────────
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function autoSeedIfEmpty() {
  try {
    const count = await prisma.user.count();
    if (count === 0) {
      console.log('🌱 No users found in database. Auto-seeding default demo accounts...');
      const { execSync } = require('child_process');
      execSync('node prisma/seed.js', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
      console.log('✅ Auto-seed completed successfully.');
    }
  } catch (err) {
    console.warn('⚠️ Auto-seed notice:', err.message);
  }
}
autoSeedIfEmpty();

app.listen(PORT, () => {
  console.log(`🚀 Yuktha Portal API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Security: HTTPS redirect & Rate limiting enabled`);
});

module.exports = app;
