const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/assessments — List all available assessments
router.get('/', authenticate, async (req, res) => {
  try {
    const assessments = await prisma.skillAssessment.findMany({
      include: {
        _count: {
          select: { questions: true, attempts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let studentAttempts = [];
    if (req.user.student) {
      studentAttempts = await prisma.assessmentAttempt.findMany({
        where: { studentId: req.user.student.id },
        select: {
          assessmentId: true,
          score: true,
          totalQuestions: true,
          percentage: true,
          completedAt: true,
        },
        orderBy: { completedAt: 'desc' },
      });
    }

    const result = assessments.map((a) => {
      const userAttempt = studentAttempts.find((att) => att.assessmentId === a.id);
      return {
        id: a.id,
        title: a.title,
        category: a.category,
        domain: a.domain,
        description: a.description,
        durationMinutes: a.durationMinutes,
        totalQuestions: a._count.questions,
        passingScore: a.passingScore,
        attemptsCount: a._count.attempts,
        lastAttempt: userAttempt || null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Fetch assessments error:', err);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// GET /api/assessments/:id — Get assessment questions for taking the test
router.get('/:id', authenticate, async (req, res) => {
  try {
    const assessment = await prisma.skillAssessment.findUnique({
      where: { id: req.params.id },
      include: {
        questions: true,
      },
    });

    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

    // Sanitize questions so correct answers are not exposed to the client
    const sanitizedQuestions = assessment.questions.map((q) => {
      let parsedOptions = [];
      try {
        parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
      } catch {
        parsedOptions = [];
      }
      return {
        id: q.id,
        questionText: q.questionText,
        options: parsedOptions,
        skillName: q.skillName,
        difficulty: q.difficulty,
      };
    });

    res.json({
      id: assessment.id,
      title: assessment.title,
      category: assessment.category,
      domain: assessment.domain,
      description: assessment.description,
      durationMinutes: assessment.durationMinutes,
      totalQuestions: sanitizedQuestions.length,
      passingScore: assessment.passingScore,
      questions: sanitizedQuestions,
    });
  } catch (err) {
    console.error('Fetch assessment detail error:', err);
    res.status(500).json({ error: 'Failed to fetch assessment details' });
  }
});

// POST /api/assessments/:id/submit — Submit student responses and evaluate
router.post('/:id/submit', authenticate, requireRole('STUDENT'), async (req, res) => {
  try {
    const student = req.user.student;
    if (!student) return res.status(403).json({ error: 'Student profile not found' });

    const assessment = await prisma.skillAssessment.findUnique({
      where: { id: req.params.id },
      include: { questions: true },
    });

    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

    const { answers } = req.body; // Map: { [questionId]: selectedOptionIndex }
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Answers payload is required' });
    }

    let correctCount = 0;
    const skillStats = {};
    const reviewData = [];

    for (const q of assessment.questions) {
      const selectedIndex = answers[q.id];
      const isCorrect = selectedIndex !== undefined && parseInt(selectedIndex) === q.correctAnswer;
      if (isCorrect) correctCount++;

      // Track by skill name
      if (!skillStats[q.skillName]) {
        skillStats[q.skillName] = { total: 0, correct: 0 };
      }
      skillStats[q.skillName].total += 1;
      if (isCorrect) skillStats[q.skillName].correct += 1;

      let parsedOptions = [];
      try {
        parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
      } catch {
        parsedOptions = [];
      }

      reviewData.push({
        id: q.id,
        questionText: q.questionText,
        options: parsedOptions,
        selectedAnswer: selectedIndex !== undefined ? parseInt(selectedIndex) : null,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        skillName: q.skillName,
      });
    }

    const totalQuestions = assessment.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 1000) / 10 : 0;

    // Build category / skill breakdown
    const categoryBreakdown = Object.keys(skillStats).map((skill) => {
      const { total, correct } = skillStats[skill];
      const pct = Math.round((correct / total) * 100);
      return {
        category: skill,
        score: pct,
        benchmark: 75, // Industry benchmark standard
      };
    });

    // Identify Strengths and Skill Gaps
    const strengths = [];
    const skillGaps = [];

    Object.keys(skillStats).forEach((skill) => {
      const { total, correct } = skillStats[skill];
      const pct = Math.round((correct / total) * 100);
      if (pct >= 75) {
        strengths.push(`High proficiency in ${skill} (${pct}%)`);
      } else {
        skillGaps.push(`${skill}: Needs improvement (${pct}% vs 75% industry standard)`);
      }
    });

    if (strengths.length === 0) {
      strengths.push('Foundational knowledge demonstrated; review core modules to build mastery.');
    }

    // Curate Recommendations
    const recommendations = [
      {
        role: percentage >= 75 ? 'Senior Clinical Specialist / Research Associate' : 'Junior Clinical Associate / Trainee',
        matchPercent: Math.min(Math.round(percentage * 1.05), 98),
        salaryRange: percentage >= 75 ? '₹5.5L - ₹8.5L p.a.' : '₹3.5L - ₹5.0L p.a.',
        suggestedProgram: 'Advanced Certificate in Clinical Data Management & GCP',
      },
      {
        role: 'Healthcare Data & Quality Compliance Analyst',
        matchPercent: Math.min(Math.round(percentage * 0.95), 95),
        salaryRange: '₹4.8L - ₹7.2L p.a.',
        suggestedProgram: 'AI in Herbal Pharmacognosy & Bio-informatics',
      },
    ];

    // Save Attempt
    const attempt = await prisma.assessmentAttempt.create({
      data: {
        studentId: student.id,
        assessmentId: assessment.id,
        score: correctCount,
        totalQuestions,
        percentage,
        categoryBreakdown: JSON.stringify(categoryBreakdown),
        strengths: JSON.stringify(strengths),
        skillGaps: JSON.stringify(skillGaps),
        recommendations: JSON.stringify(recommendations),
      },
    });

    res.status(201).json({
      attemptId: attempt.id,
      score: correctCount,
      totalQuestions,
      percentage,
      passed: percentage >= assessment.passingScore,
      categoryBreakdown,
      strengths,
      skillGaps,
      recommendations,
      review: reviewData,
    });
  } catch (err) {
    console.error('Submit assessment error:', err);
    res.status(500).json({ error: 'Failed to evaluate assessment submission' });
  }
});

// GET /api/assessments/student/history — Get student's assessment attempts
router.get('/student/history', authenticate, requireRole('STUDENT'), async (req, res) => {
  try {
    const student = req.user.student;
    if (!student) return res.status(403).json({ error: 'Student profile not found' });

    const attempts = await prisma.assessmentAttempt.findMany({
      where: { studentId: student.id },
      include: {
        assessment: {
          select: { title: true, category: true, domain: true, passingScore: true },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    const parsed = attempts.map((att) => {
      let categoryBreakdown = [];
      let strengths = [];
      let skillGaps = [];
      let recommendations = [];
      try {
        categoryBreakdown = JSON.parse(att.categoryBreakdown);
        strengths = JSON.parse(att.strengths);
        skillGaps = JSON.parse(att.skillGaps);
        recommendations = JSON.parse(att.recommendations);
      } catch (e) {
        console.error('JSON parse error in attempts:', e);
      }
      return {
        id: att.id,
        assessmentTitle: att.assessment.title,
        category: att.assessment.category,
        domain: att.assessment.domain,
        score: att.score,
        totalQuestions: att.totalQuestions,
        percentage: att.percentage,
        passed: att.percentage >= att.assessment.passingScore,
        categoryBreakdown,
        strengths,
        skillGaps,
        recommendations,
        completedAt: att.completedAt,
      };
    });

    res.json(parsed);
  } catch (err) {
    console.error('Fetch student history error:', err);
    res.status(500).json({ error: 'Failed to fetch assessment history' });
  }
});

module.exports = router;
