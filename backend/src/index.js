require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

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

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files (local disk fallback)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
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

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Global error handler ─────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Ayush Portal API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
