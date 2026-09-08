/**
 * Comprehensive Prisma Seed Script for Yuktha
 * Unified Academia-Industry Collaboration Portal
 * Run: node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ─── Skill Taxonomy ─────────────────────────────────────────────────────────────

const SKILLS = [
  // Healthcare & Ayush
  { name: 'Panchkarma Procedures', system: 'Ayurveda' },
  { name: 'Nadi Pariksha (Pulse Diagnosis)', system: 'Ayurveda' },
  { name: 'Herbal Formulation & Standardization', system: 'Ayurveda' },
  { name: 'Pharmacognosy & Phytochemistry', system: 'Ayurveda' },
  { name: 'Ayurvedic Dietetics & Nutrition', system: 'Ayurveda' },
  { name: 'Shirodhara & Regimental Protocols', system: 'Ayurveda' },
  { name: 'Asana & Therapeutic Yoga', system: 'Healthcare' },
  { name: 'Pranayama Therapy', system: 'Healthcare' },
  { name: 'Case Taking & Constitutional Analysis', system: 'Healthcare' },

  // Regulatory & Clinical Research
  { name: 'Clinical Trials & GCP Compliance', system: 'Regulatory & Research' },
  { name: 'Pharmacovigilance & Drug Safety', system: 'Regulatory & Research' },
  { name: 'CTRI Documentation & Protocol Design', system: 'Regulatory & Research' },
  { name: 'Biostatistics & Health Data Analysis', system: 'Regulatory & Research' },
  { name: 'Scientific Manuscript Writing', system: 'Regulatory & Research' },
  { name: 'Regulatory Affairs & FDA/AYUSH Guidelines', system: 'Regulatory & Research' },

  // Tech, Data & AI
  { name: 'Health Data Analytics & Python', system: 'Tech & Data' },
  { name: 'Full-Stack Web Development (React & Node)', system: 'Tech & Data' },
  { name: 'Database Architecture & SQL', system: 'Tech & Data' },
  { name: 'Machine Learning for Bio-Data', system: 'Tech & Data' },
  { name: 'RESTful API Engineering', system: 'Tech & Data' },
  { name: 'Cloud Infrastructure & DevOps', system: 'Tech & Data' },

  // Management & Soft Skills
  { name: 'Technical Communication & Presentation', system: 'Management & Soft Skills' },
  { name: 'Problem Solving & Critical Reasoning', system: 'Management & Soft Skills' },
  { name: 'Agile Project Management', system: 'Management & Soft Skills' },
  { name: 'Cross-Functional Team Collaboration', system: 'Management & Soft Skills' },
  { name: 'Leadership & Conflict Resolution', system: 'Management & Soft Skills' },
];

async function main() {
  console.log('🌱 Starting comprehensive database seed for Yuktha...');

  // 1. Seed Skills
  for (const skill of SKILLS) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: { system: skill.system },
      create: skill,
    });
  }
  console.log(`✅ Seeded ${SKILLS.length} cross-disciplinary skills`);

  const hash = (pw) => bcrypt.hashSync(pw, 10);
  const defaultPw = hash('Demo@1234');

  // 2. Demo College Admin
  const collegeUser = await prisma.user.upsert({
    where: { email: 'college@ayushportal.demo' },
    update: {},
    create: {
      name: 'Gujarat Ayurved University',
      email: 'college@ayushportal.demo',
      password: defaultPw,
      role: 'COLLEGE',
      isActive: true,
      college: {
        create: {
          name: 'Gujarat Ayurved University',
          city: 'Jamnagar',
          state: 'Gujarat',
          affiliation: 'Autonomous – Institute of National Importance',
          verificationStatus: 'VERIFIED',
        },
      },
    },
    include: { college: true },
  });
  console.log('✅ College Account: college@ayushportal.demo');

  // 3. Demo Admin (National Ministry & Policy)
  await prisma.user.upsert({
    where: { email: 'admin@ayushportal.demo' },
    update: {},
    create: {
      name: 'Dr. Vivek Saxena (National Directorate)',
      email: 'admin@ayushportal.demo',
      password: defaultPw,
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Admin Account: admin@ayushportal.demo');

  // 4. Demo Company
  const companyUser = await prisma.user.upsert({
    where: { email: 'company@ayushportal.demo' },
    update: {},
    create: {
      name: 'Himalaya Wellness & Healthcare',
      email: 'company@ayushportal.demo',
      password: defaultPw,
      role: 'COMPANY',
      isActive: true,
      company: {
        create: {
          name: 'Himalaya Wellness Company',
          sector: 'Healthcare & Pharma',
          website: 'https://himalayawellness.in',
          city: 'Bengaluru',
          description:
            'A pioneer in scientifically validated herbal solutions, pharmaceuticals, and health-tech research with global operations across 100+ countries.',
          logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=128&auto=format&fit=crop&q=80',
        },
      },
    },
    include: { company: true },
  });
  console.log('✅ Company Account: company@ayushportal.demo');
  const company = companyUser.company;

  // 5. Demo Academician / Faculty User
  const facultyUser = await prisma.user.upsert({
    where: { email: 'faculty@ayushportal.demo' },
    update: {},
    create: {
      name: 'Dr. Rajeshwari Joshi',
      email: 'faculty@ayushportal.demo',
      password: defaultPw,
      role: 'FACULTY',
      isActive: true,
      faculty: {
        create: {
          institution: 'Gujarat Ayurved University',
          department: 'Department of Clinical Pharmacology & Research',
          designation: 'Professor & Head of Research',
          qualifications: 'Ph.D in Phytopharmacology, MD (Ayurveda)',
          experienceYears: 14,
          specializations: 'Pharmacokinetics, Standardized Herbal Extracts, GCP Clinical Trials',
          researchInterests: 'Translational drug delivery, Phytochemical analysis, Reverse pharmacology',
          publicationsCount: 28,
          consultingDomains: 'Clinical trial design, Ayurvedic Pharmacopoeia compliance, Quality assurance',
          bio: 'Senior researcher and educator with 14+ years experience bridging traditional medicine with modern GCP-compliant clinical trial methodologies. Principal Investigator on 6 sponsored clinical trials.',
          linkedinUrl: 'https://linkedin.com/in/dr-rajeshwari-joshi',
          verificationStatus: 'VERIFIED',
        },
      },
    },
    include: { faculty: true },
  });
  console.log('✅ Faculty Account: faculty@ayushportal.demo');

  // 6. Demo Student User
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@ayushportal.demo' },
    update: {},
    create: {
      name: 'Priya Sharma',
      email: 'student@ayushportal.demo',
      password: defaultPw,
      role: 'STUDENT',
      isActive: true,
      student: {
        create: {
          institution: 'Gujarat Ayurved University',
          department: 'Panchkarma & Clinical Sciences',
          degree: 'BAMS (Bachelor of Ayurvedic Medicine & Surgery)',
          graduationYear: 2025,
          cgpa: 9.1,
          city: 'Jamnagar',
          state: 'Gujarat',
          targetRole: 'Clinical Research Associate & Panchkarma Consultant',
          bio: 'Final-year BAMS candidate passionate about clinical trials, phytomedicine research, and modernizing Panchkarma protocols using digitized patient tracking. Published 2 conference papers on GCP adherence.',
          achievements: 'First Prize – National Ayush Research Conclave 2024; Gold Medalist in Pharmacognosy 2023; Certified in GCP (NIH).',
          linkedinUrl: 'https://linkedin.com/in/priyasharma-ayush',
          githubUrl: 'https://github.com/priyasharma-research',
          portfolioUrl: 'https://priyasharma.portfolio.dev',
          isVerified: true,
        },
      },
    },
    include: { student: true },
  });
  console.log('✅ Student Account: student@ayushportal.demo');
  const student = studentUser.student;

  // 7. Map Skills to Student
  const allSkills = await prisma.skill.findMany();
  const getSkill = (name) => allSkills.find((s) => s.name === name);

  const studentSelectedSkillNames = [
    'Panchkarma Procedures',
    'Nadi Pariksha (Pulse Diagnosis)',
    'Herbal Formulation & Standardization',
    'Clinical Trials & GCP Compliance',
    'Ayurvedic Dietetics & Nutrition',
    'Technical Communication & Presentation',
    'Problem Solving & Critical Reasoning',
  ];

  for (const name of studentSelectedSkillNames) {
    const s = getSkill(name);
    if (s) {
      await prisma.studentSkill.upsert({
        where: { studentId_skillId: { studentId: student.id, skillId: s.id } },
        update: {},
        create: { studentId: student.id, skillId: s.id },
      });
    }
  }

  // 8. Seed Student Verified Projects
  await prisma.studentProject.deleteMany({ where: { studentId: student.id } });
  await prisma.studentProject.createMany({
    data: [
      {
        studentId: student.id,
        title: 'Digital Panchkarma Outcome Monitoring Protocol',
        description: 'Developed a structured clinical questionnaire and computerized tracking sheet to quantify patient recovery milestones during 21-day Virechana treatments.',
        techStack: 'Clinical Research, GCP, Excel/SPSS, Digital Health',
        repoUrl: 'https://github.com/priyasharma-research/panchkarma-outcome-tracker',
        liveUrl: 'https://panchkarma-outcomes.demo.app',
        role: 'Principal Student Investigator',
        isFeatured: true,
      },
      {
        studentId: student.id,
        title: 'Comparative Stability Analysis of Triphala Formulations',
        description: 'Laboratory assessment of aqueous and hydro-alcoholic extracts evaluating shelf-life and polyphenol degradation under accelerated temperature conditions.',
        techStack: 'Phytochemistry, HPLC, Data Analysis, Standardisation',
        role: 'Research Co-author',
        isFeatured: true,
      },
    ],
  });

  // 9. Seed Student Certifications
  await prisma.studentCertification.deleteMany({ where: { studentId: student.id } });
  await prisma.studentCertification.createMany({
    data: [
      {
        studentId: student.id,
        title: 'Good Clinical Practice (GCP) for Clinical Investigations',
        issuer: 'NIDA Clinical Trials Network / NIH',
        issueDate: new Date('2024-03-15'),
        credentialUrl: 'https://citi.programs.org/verify/GCP-9482918',
        verificationStatus: 'VERIFIED',
      },
      {
        studentId: student.id,
        title: 'Advanced Ayush Pharmacovigilance & Adverse Reporting',
        issuer: 'National Pharmacovigilance Coordination Centre (NPvCC)',
        issueDate: new Date('2024-08-10'),
        credentialUrl: 'https://ayushsuraksha.gov.in/cert/NPV-2024-091',
        verificationStatus: 'VERIFIED',
      },
    ],
  });

  // 10. Seed Student Documents
  await prisma.studentDocument.deleteMany({ where: { userId: studentUser.id } });
  await prisma.studentDocument.createMany({
    data: [
      {
        userId: studentUser.id,
        title: 'Priya_Sharma_Resume_2025.pdf',
        type: 'RESUME',
        fileUrl: '/uploads/resumes/priya_sharma_cv.pdf',
        fileSize: '420 KB',
      },
      {
        userId: studentUser.id,
        title: 'NIH_GCP_Certificate.pdf',
        type: 'CERTIFICATE',
        fileUrl: '/uploads/certificates/gcp_cert.pdf',
        fileSize: '1.2 MB',
      },
      {
        userId: studentUser.id,
        title: 'Hospital_Internship_Completion_Report.pdf',
        type: 'INTERNSHIP_REPORT',
        fileUrl: '/uploads/reports/sdm_internship_report.pdf',
        fileSize: '2.8 MB',
      },
    ],
  });

  // 11. Seed Skill Assessments & Questions
  await prisma.assessmentQuestion.deleteMany({});
  await prisma.assessmentAttempt.deleteMany({});
  await prisma.skillAssessment.deleteMany({});

  const assessment1 = await prisma.skillAssessment.create({
    data: {
      id: 'assessment-tech-01',
      title: 'Clinical Research & Ayush Industry Technical Competency',
      category: 'TECHNICAL',
      domain: 'Clinical Protocols, GCP & Pharmacology',
      description: 'Standardized industry questionnaire evaluating competence in GCP guidelines, patient protocol adherence, CTRI submission, and phytopharmaceutical quality standards.',
      durationMinutes: 20,
      totalQuestions: 6,
      passingScore: 65,
    },
  });

  const assessment2 = await prisma.skillAssessment.create({
    data: {
      id: 'assessment-soft-01',
      title: 'Workplace Soft Skills & Cross-Functional Collaboration',
      category: 'SOFT_SKILL',
      domain: 'Communication, Conflict Resolution, Ethics',
      description: 'Evaluates empathy in clinical interactions, inter-departmental technical communication, situational judgement, and industry ethical standards.',
      durationMinutes: 15,
      totalQuestions: 5,
      passingScore: 70,
    },
  });

  const assessment3 = await prisma.skillAssessment.create({
    data: {
      id: 'assessment-apt-01',
      title: 'Quantitative Reasoning & Scientific Aptitude',
      category: 'APTITUDE',
      domain: 'Biostatistics, Data Interpretation, Logical Analysis',
      description: 'Tests analytical aptitude, interpretation of scientific tables/graphs, dosage calculation ratios, and hypothesis test logic.',
      durationMinutes: 20,
      totalQuestions: 5,
      passingScore: 60,
    },
  });

  // Questions for Assessment 1
  await prisma.assessmentQuestion.createMany({
    data: [
      {
        assessmentId: assessment1.id,
        questionText: 'Under ICH-GCP guidelines, which document must be formally approved by the Institutional Ethics Committee (IEC) prior to recruiting the first clinical subject?',
        type: 'MCQ',
        options: JSON.stringify([
          'Investigator Brochure, Clinical Study Protocol & Informed Consent Form',
          'Company Annual Financial Balance Sheet',
          'Post-market Sales Marketing Brochure',
          'Only the curriculum vitae of the study coordinator',
        ]),
        correctAnswer: 0,
        skillName: 'Clinical Trials & GCP Compliance',
        difficulty: 'MEDIUM',
        explanation: 'ICH-GCP section 3 requires the IEC to review and approve the Protocol, ICF, and Investigator Brochure before subject enrolment.',
      },
      {
        assessmentId: assessment1.id,
        questionText: 'Which chromatographic technique is most commonly specified by pharmacopoeial guidelines for quantitative marker identification in herbal standardization?',
        type: 'MCQ',
        options: JSON.stringify([
          'High-Performance Thin-Layer Chromatography (HPTLC / HPLC)',
          'Simple Paper Filtration',
          'Gravimetric Crucible Ashing only',
          'Qualitative Fehling Test',
        ]),
        correctAnswer: 0,
        skillName: 'Herbal Formulation & Standardization',
        difficulty: 'HARD',
        explanation: 'HPTLC and HPLC are regulatory gold standards for fingerprinting active phyto-markers in Ayush drugs.',
      },
      {
        assessmentId: assessment1.id,
        questionText: 'When reporting a Serious Adverse Event (SAE) occurring during an active clinical trial in India, what is the mandatory reporting window to the DCGI (CDSCO)?',
        type: 'MCQ',
        options: JSON.stringify([
          'Within 24 hours of occurrence/knowledge',
          'Within 30 business days',
          'Only at study completion',
          'Within 6 months during annual review',
        ]),
        correctAnswer: 0,
        skillName: 'Pharmacovigilance & Drug Safety',
        difficulty: 'HARD',
        explanation: 'Under Indian New Drugs and Clinical Trials Rules 2019, any SAE must be reported within 24 hours to the Ethics Committee and Central Licensing Authority.',
      },
      {
        assessmentId: assessment1.id,
        questionText: 'In classical Panchkarma, what is the physiological objective of Poorva Karma (Deepana, Pachana, Snehana, and Swedana)?',
        type: 'MCQ',
        options: JSON.stringify([
          'Mobilize toxins (Doshas/Ama) from periphery (Sakha) into the gastrointestinal tract (Koshta)',
          'Induce immediate surgical excision of localized lesions',
          'Permanently suppress all metabolic fire (Agni)',
          'Provide dietary deprivation without internal preparation',
        ]),
        correctAnswer: 0,
        skillName: 'Panchkarma Procedures',
        difficulty: 'MEDIUM',
        explanation: 'Poorva Karma softens and dislodges morbid doshas from deep tissues and brings them to Koshta for systematic expulsion.',
      },
      {
        assessmentId: assessment1.id,
        questionText: 'Which regulatory registration portal in India is legally mandatory for prospectively registering all human biomedical clinical trials before enrolling participants?',
        type: 'MCQ',
        options: JSON.stringify([
          'Clinical Trials Registry - India (CTRI)',
          'Ministry of Corporate Affairs Portal',
          'Indian Patents Office Gazette',
          'University Grant Commission (UGC) Portal',
        ]),
        correctAnswer: 0,
        skillName: 'CTRI Documentation & Protocol Design',
        difficulty: 'EASY',
        explanation: 'CTRI managed by ICMR is the mandatory prospective clinical trial registry in India.',
      },
      {
        assessmentId: assessment1.id,
        questionText: 'In statistical analysis of clinical data, what does a p-value of < 0.01 between treatment and control cohorts typically signify?',
        type: 'MCQ',
        options: JSON.stringify([
          'Less than 1% probability that the observed effect is due to random chance (statistically significant)',
          'The drug is 99% toxic to human cells',
          'The sample size was inadequate by 10x',
          'The null hypothesis is strictly proven true',
        ]),
        correctAnswer: 0,
        skillName: 'Biostatistics & Health Data Analysis',
        difficulty: 'MEDIUM',
        explanation: 'p < 0.01 provides strong empirical evidence against the null hypothesis.',
      },
    ],
  });

  // Questions for Assessment 2 (Soft Skills)
  await prisma.assessmentQuestion.createMany({
    data: [
      {
        assessmentId: assessment2.id,
        questionText: 'An anxious patient refuses a recommended therapy due to conflicting misinformation found on social media. What is your initial response?',
        type: 'MCQ',
        options: JSON.stringify([
          'Listen actively to understand specific fears, validate concerns empathetically, and explain the evidence in simple terms',
          'Dismiss their concerns as unscientific and threaten to discontinue consultation',
          'Immediately prescribe without answering any questions',
          'Transfer the patient without giving explanations',
        ]),
        correctAnswer: 0,
        skillName: 'Technical Communication & Presentation',
        difficulty: 'EASY',
        explanation: 'Patient-centric communication requires empathetic listening and evidence translation.',
      },
      {
        assessmentId: assessment2.id,
        questionText: 'During a cross-functional project meeting, the quality assurance lead and production manager have contradictory views on batch release. As project lead, how do you resolve it?',
        type: 'MCQ',
        options: JSON.stringify([
          'Re-examine standardized objective release criteria and data together to find an evidence-backed consensus',
          'Take sides with the louder participant to save time',
          'Cancel the product release indefinitely without investigation',
          'Ignore the quality parameters to meet delivery targets',
        ]),
        correctAnswer: 0,
        skillName: 'Leadership & Conflict Resolution',
        difficulty: 'MEDIUM',
        explanation: 'Objective data-driven consensus upholds compliance and team alignment.',
      },
      {
        assessmentId: assessment2.id,
        questionText: 'When presenting technical research findings to non-technical corporate business stakeholders, what is the best strategy?',
        type: 'MCQ',
        options: JSON.stringify([
          'Highlight practical business impact, key clinical milestones, and clear visual summaries rather than dense equations',
          'Read raw mathematical matrices verbatim without visual charts',
          'Refuse to answer questions claiming stakeholders cannot understand science',
          'Use obscure acronyms without defining their significance',
        ]),
        correctAnswer: 0,
        skillName: 'Technical Communication & Presentation',
        difficulty: 'EASY',
        explanation: 'Translating technical insights into strategic value is a key industry competency.',
      },
      {
        assessmentId: assessment2.id,
        questionText: 'An unexpected deviation occurs in an active research assay. What is the ethically and professionally correct action?',
        type: 'MCQ',
        options: JSON.stringify([
          'Document the deviation immediately in the logbook, initiate a Root Cause Analysis (RCA), and notify the supervisor',
          'Quietly alter the recorded numbers so the assay appears normal',
          'Discard the sample and pretend the experiment never happened',
          'Blame an intern who was not present in the laboratory',
        ]),
        correctAnswer: 0,
        skillName: 'Problem Solving & Critical Reasoning',
        difficulty: 'MEDIUM',
        explanation: 'Data integrity and transparent CAPA (Corrective Action) procedures are mandatory.',
      },
      {
        assessmentId: assessment2.id,
        questionText: 'In an Agile workflow, what is the primary purpose of daily 15-minute standup meetings?',
        type: 'MCQ',
        options: JSON.stringify([
          'Identify immediate blockers, sync priorities, and ensure cross-functional visibility',
          'Conduct comprehensive performance appraisals and salary reviews',
          'Assign full-year strategic corporate budgets',
          'Micromanage individual typing speeds',
        ]),
        correctAnswer: 0,
        skillName: 'Agile Project Management',
        difficulty: 'EASY',
        explanation: 'Daily standups facilitate swift identification of blockers and team synchronicity.',
      },
    ],
  });

  // Questions for Assessment 3 (Aptitude)
  await prisma.assessmentQuestion.createMany({
    data: [
      {
        assessmentId: assessment3.id,
        questionText: 'If a dry herbal extract yield is 12% from raw botanical feedstock, how many kilograms of raw crude herb are required to manufacture 60 kg of standardized finished extract?',
        type: 'MCQ',
        options: JSON.stringify(['500 kg', '720 kg', '360 kg', '480 kg']),
        correctAnswer: 0,
        skillName: 'Problem Solving & Critical Reasoning',
        difficulty: 'MEDIUM',
        explanation: '60 kg / 0.12 = 500 kg of crude material.',
      },
      {
        assessmentId: assessment3.id,
        questionText: 'In a prospective study of 200 treated subjects and 200 controls, 180 treated vs 100 controls recovered fully. What is the Relative Risk (RR) ratio of recovery in the treated group?',
        type: 'MCQ',
        options: JSON.stringify(['1.8', '0.55', '2.5', '1.0']),
        correctAnswer: 0,
        skillName: 'Biostatistics & Health Data Analysis',
        difficulty: 'MEDIUM',
        explanation: '(180/200) / (100/200) = 0.90 / 0.50 = 1.8.',
      },
      {
        assessmentId: assessment3.id,
        questionText: 'Complete the sequence: 4, 12, 36, 108, ?',
        type: 'MCQ',
        options: JSON.stringify(['324', '216', '432', '312']),
        correctAnswer: 0,
        skillName: 'Problem Solving & Critical Reasoning',
        difficulty: 'EASY',
        explanation: 'Each term is multiplied by 3. 108 * 3 = 324.',
      },
      {
        assessmentId: assessment3.id,
        questionText: 'A trial monitoring dashboard indicates: Cohort A completion rate is 85%, Cohort B is 90%. If Cohort A has 100 subjects and Cohort B has 200 subjects, what is the combined overall completion rate?',
        type: 'MCQ',
        options: JSON.stringify(['88.33%', '87.50%', '90.00%', '86.66%']),
        correctAnswer: 0,
        skillName: 'Biostatistics & Health Data Analysis',
        difficulty: 'MEDIUM',
        explanation: '(85 + 180) / 300 = 265 / 300 = 88.33%.',
      },
      {
        assessmentId: assessment3.id,
        questionText: 'Which measure of central tendency is least sensitive to extreme outliers in clinical laboratory test distributions?',
        type: 'MCQ',
        options: JSON.stringify(['Median', 'Arithmetic Mean', 'Standard Deviation', 'Variance']),
        correctAnswer: 0,
        skillName: 'Biostatistics & Health Data Analysis',
        difficulty: 'EASY',
        explanation: 'The median represents the 50th percentile and is robust against skewed outlier values.',
      },
    ],
  });
  console.log('✅ Seeded 3 Skill Assessments with 16 standardized MCQ questions');

  // 12. Seed Student Assessment Attempt for Priya Sharma
  await prisma.assessmentAttempt.create({
    data: {
      studentId: student.id,
      assessmentId: assessment1.id,
      score: 5,
      totalQuestions: 6,
      percentage: 83.3,
      categoryBreakdown: JSON.stringify([
        { category: 'Clinical Protocols', score: 90, benchmark: 75 },
        { category: 'GCP & Regulatory', score: 85, benchmark: 80 },
        { category: 'Phytochemistry', score: 80, benchmark: 70 },
        { category: 'Pharmacovigilance', score: 55, benchmark: 80 },
        { category: 'Biostatistics', score: 60, benchmark: 75 },
      ]),
      strengths: JSON.stringify([
        'Deep understanding of ICH-GCP ethics and protocol structure',
        'Strong classical Panchkarma clinical diagnosis & treatment design',
        'Standardization workflows in Ayurvedic phytopharmacy',
      ]),
      skillGaps: JSON.stringify([
        'Post-marketing Pharmacovigilance & Periodic Safety Update Reports (PSUR)',
        'Inferential Biostatistics (Multi-variable regression & survival curves)',
        'Digital CTRI portal query management and amendment tracking',
      ]),
      recommendations: JSON.stringify([
        {
          role: 'Associate Clinical Research Scientist',
          matchPercent: 88,
          salaryRange: '₹6.5L - ₹9.2L p.a.',
          suggestedProgram: 'Advanced Certificate in Clinical Data Management & GCP',
        },
        {
          role: 'Panchkarma Quality & Regulatory Specialist',
          matchPercent: 92,
          salaryRange: '₹7.0L - ₹10.5L p.a.',
          suggestedProgram: 'Executive Leadership & Industry Communication Masterclass',
        },
      ]),
    },
  });
  console.log('✅ Seeded Student Assessment Attempt & Skill Gap Profile');

  // 13. Seed Industry Learning Programs
  await prisma.learningEnrollment.deleteMany({});
  await prisma.learningProgram.deleteMany({});

  const prog1 = await prisma.learningProgram.create({
    data: {
      companyId: company.id,
      title: 'Advanced Certificate in Clinical Data Management & GCP',
      category: 'CERTIFICATION',
      targetAudience: 'ALL',
      description: 'Comprehensive industry-aligned program delivered by Himalaya Clinical Affairs team covering eCRF design, adverse event causality evaluation, CTRI documentation, and regulatory inspection readiness.',
      duration: '6 Weeks (40 Hours)',
      mode: 'HYBRID',
      skillsCovered: 'Clinical Trials & GCP Compliance, Pharmacovigilance & Drug Safety, CTRI Documentation',
      syllabus: 'Module 1: Good Clinical Practice Foundations\nModule 2: eCRF Design & Data Validation\nModule 3: Serious Adverse Event Processing & Safety Reporting\nModule 4: Regulatory Audits & Capa Formulation',
      instructorName: 'Dr. Anita Nambiar, Head of Medical Affairs',
      enrollmentCap: 150,
      enrolledCount: 38,
      status: 'ACTIVE',
    },
  });

  const prog2 = await prisma.learningProgram.create({
    data: {
      companyId: company.id,
      title: 'AI in Herbal Pharmacognosy & Bio-informatics',
      category: 'COURSE',
      targetAudience: 'STUDENT',
      description: 'Hands-on practical training exploring machine learning models applied to spectral data, active constituent prediction, and automated reverse pharmacology pipelines.',
      duration: '4 Weeks (25 Hours)',
      mode: 'ONLINE',
      skillsCovered: 'Machine Learning for Bio-Data, Health Data Analytics & Python, Herbal Formulation & Standardization',
      syllabus: 'Module 1: Phyto-chemical databases & SMILES structures\nModule 2: Python for spectral curve processing\nModule 3: In-silico docking & target prediction',
      instructorName: 'Vikram Sundaram, Lead Bio-informatics Engineer',
      enrollmentCap: 200,
      enrolledCount: 74,
      status: 'ACTIVE',
    },
  });

  const prog3 = await prisma.learningProgram.create({
    data: {
      companyId: company.id,
      title: 'Faculty Development Program (FDP): Next-Gen Translational Research & Industry Standards',
      category: 'FDP',
      targetAudience: 'FACULTY',
      description: 'An exclusive 2-week intensive Faculty Development Program for academic educators and department heads to align university syllabi with modern industrial quality benchmarks, GMP standard operating procedures, and industry patent drafting.',
      duration: '2 Weeks (30 Hours)',
      mode: 'HYBRID',
      skillsCovered: 'Regulatory Affairs & FDA/AYUSH Guidelines, Scientific Manuscript Writing, Herbal Formulation & Standardization',
      syllabus: 'Day 1-4: High-Throughput Screening in Industrial Labs\nDay 5-8: Navigating Intellectual Property & Commercialization\nDay 9-12: Joint Research Grant Proposals & Industry Mentorship Frameworks',
      instructorName: 'Dr. K. S. Ramanathan, VP - Global R&D',
      enrollmentCap: 50,
      enrolledCount: 19,
      status: 'ACTIVE',
    },
  });

  const prog4 = await prisma.learningProgram.create({
    data: {
      companyId: company.id,
      title: 'Executive Leadership & Industry Communication Masterclass',
      category: 'WORKSHOP',
      targetAudience: 'ALL',
      description: 'Interactive corporate workshop focusing on presentation skills, cross-functional project management, stakeholder alignment, and technical business storytelling.',
      duration: '3 Days (12 Hours)',
      mode: 'ONLINE',
      skillsCovered: 'Technical Communication & Presentation, Leadership & Conflict Resolution, Agile Project Management',
      instructorName: 'Sanjay Deshmukh, Corporate HR & Talent Director',
      enrollmentCap: 100,
      enrolledCount: 52,
      status: 'ACTIVE',
    },
  });

  // Enroll student in prog1
  await prisma.learningEnrollment.create({
    data: {
      programId: prog1.id,
      studentId: student.id,
      userRole: 'STUDENT',
      status: 'IN_PROGRESS',
      progress: 65,
    },
  });

  // Enroll faculty in prog3 (FDP)
  await prisma.learningEnrollment.create({
    data: {
      programId: prog3.id,
      facultyId: facultyUser.faculty.id,
      userRole: 'FACULTY',
      status: 'ENROLLED',
      progress: 20,
    },
  });
  console.log('✅ Seeded 4 Industry Learning Programs with active enrollments');

  // 14. Seed Academician & Industry Collaboration Opportunities
  await prisma.collaborationApplication.deleteMany({});
  await prisma.collaborationOpportunity.deleteMany({});

  const collab1 = await prisma.collaborationOpportunity.create({
    data: {
      companyId: company.id,
      title: 'Faculty Industrial Immersion: High-Throughput Phytochemical Screening',
      type: 'FACULTY_INTERNSHIP',
      domain: 'Phytochemistry & Analytical R&D',
      description: 'Himalaya R&D invites senior university faculty members for a fully-sponsored 6-week on-site industrial immersion. Faculty will work alongside our senior discovery scientists on LC-MS/MS quantification of novel herbal actives, experiencing real-world industrial QA/QC workflows.',
      requirements: 'Ph.D or MD in Phytochemistry, Pharmacognosy, or Dravyaguna with minimum 3 years academic teaching experience.',
      budgetOrStipend: '₹45,000 / month stipend + on-campus executive accommodation',
      duration: '6 Weeks',
      location: 'Bengaluru R&D Center (Onsite)',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'OPEN',
    },
  });

  const collab2 = await prisma.collaborationOpportunity.create({
    data: {
      companyId: company.id,
      title: 'Industry-Academia Joint Research Grant: Bio-availability Enhancement of Curcuminoid Formulations',
      type: 'RESEARCH_PROJECT',
      domain: 'Translational Drug Delivery',
      description: 'Himalaya is accepting research proposals from academic institutions for co-funded collaborative research. The project focuses on novel nano-emulsion and liposomal carriers for poorly soluble herbal extracts.',
      requirements: 'Joint proposal submitted by accredited university department with lab access to cell culture or animal study facilities.',
      budgetOrStipend: '₹12,00,000 research grant + consumable support',
      duration: '12 Months',
      location: 'Hybrid (University Lab + Company Co-testing)',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'OPEN',
    },
  });

  const collab3 = await prisma.collaborationOpportunity.create({
    data: {
      companyId: company.id,
      title: 'Consultancy RFP: Expert Clinical Advisory on Pediatric Herbal Tonic Safety',
      type: 'CONSULTANCY',
      domain: 'Clinical Safety & Pharmacovigilance',
      description: 'Seeking academic experts to serve on our Independent Data Safety Monitoring Board (DSMB) for an ongoing phase-IV post-marketing surveillance registry across 12 hospitals.',
      requirements: 'Recognized academician with experience in clinical trials and ethical safety evaluations.',
      budgetOrStipend: '₹1,50,000 consultancy honorarium',
      duration: '3 Months (Part-time / Ad-hoc)',
      location: 'Remote / Virtual Board',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'OPEN',
    },
  });

  const collab4 = await prisma.collaborationOpportunity.create({
    data: {
      collegeId: collegeUser.college.id,
      title: 'National Ayush Hackathon 2026: AI-Enabled Panchkarma Decision Support Systems',
      type: 'INNOVATION_CHALLENGE',
      domain: 'Digital Health & Medical AI',
      description: 'Collaborative nationwide innovation challenge inviting interdisciplinary teams (Faculty mentors + Student developers) to build open-source tools for standardized clinical decision support and patient outcome metrics.',
      requirements: 'Teams consisting of 1 faculty advisor and 2-4 students from verified institutions.',
      budgetOrStipend: '₹5,00,000 Total Cash Prizes + Industry Incubation',
      duration: '3 Months Challenge',
      location: 'Hybrid / Grand Finale at Jamnagar',
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      status: 'OPEN',
    },
  });

  // Seed Faculty Application to collab2
  await prisma.collaborationApplication.create({
    data: {
      opportunityId: collab2.id,
      facultyId: facultyUser.faculty.id,
      status: 'UNDER_REVIEW',
      proposal: 'Project Proposal: Optimization of Self-Nanoemulsifying Drug Delivery Systems (SNEDDS) for Curcuminoid Extract Using Food-Grade Surfactants. Our university laboratory has existing HPLC and Franz diffusion cell apparatus ready for immediate phase 1 in-vitro permeability studies.',
      documentUrl: '/uploads/proposals/curcumin_snedds_proposal_dr_joshi.pdf',
      reviewNote: 'Strong academic credentials; proposal forwarded to Chief Scientific Officer for technical feasibility clearance.',
    },
  });
  console.log('✅ Seeded 4 Collaboration Opportunities and active Faculty Proposal');

  // 15. Seed Job Listings & Student Applications with Milestones
  await prisma.internshipMilestone.deleteMany({});
  await prisma.jobSkill.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.jobListing.deleteMany({});

  const sPanchkarma = getSkill('Panchkarma Procedures');
  const sGCP = getSkill('Clinical Trials & GCP Compliance');
  const sFormulation = getSkill('Herbal Formulation & Standardization');
  const sSafety = getSkill('Pharmacovigilance & Drug Safety');
  const sAnalytics = getSkill('Health Data Analytics & Python');

  const job1 = await prisma.jobListing.create({
    data: {
      id: 'job-001',
      companyId: company.id,
      title: 'Panchkarma Clinical Specialist – Healthcare Internship',
      description: 'We are seeking motivated BAMS graduates/interns to join our specialized integrative therapy clinics in Bengaluru. You will assist senior Ayurvedic physicians in administering classical Panchkarma protocols, monitor clinical vital markers, maintain digital patient progress records, and coordinate patient dietary regimens.',
      type: 'INTERNSHIP',
      workMode: 'ONSITE',
      experienceLevel: 'ENTRY',
      vacancies: 4,
      location: 'Bengaluru, Karnataka',
      stipend: '₹22,000 / month + accommodation',
      deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      isActive: true,
      skills: {
        create: [
          { skillId: sPanchkarma.id },
          { skillId: sFormulation.id },
        ],
      },
    },
  });

  const job2 = await prisma.jobListing.create({
    data: {
      id: 'job-002',
      companyId: company.id,
      title: 'Clinical Research Associate (CRA) – Ayush Trials',
      description: 'Himalaya R&D is hiring entry-level Clinical Research Associates to monitor multicentric observational and interventional clinical studies. Responsibilities include site initiation visits, eCRF source verification, CTRI compliance tracking, and pharmacovigilance event reporting under ICH-GCP rules.',
      type: 'JOB',
      workMode: 'HYBRID',
      experienceLevel: 'ENTRY',
      vacancies: 2,
      location: 'Bengaluru, Karnataka',
      stipend: '₹42,000 / month (CTC ₹5.5 LPA)',
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      isActive: true,
      skills: {
        create: [
          { skillId: sGCP.id },
          { skillId: sSafety.id },
        ],
      },
    },
  });

  const job3 = await prisma.jobListing.create({
    data: {
      id: 'job-003',
      companyId: company.id,
      title: 'Bio-Informatics & Health Data Apprentice',
      description: 'Work alongside computational biologists and clinical pharmacologists to clean, tag, and analyze large-scale electronic health records and trial datasets using Python and SQL.',
      type: 'APPRENTICESHIP',
      workMode: 'REMOTE',
      experienceLevel: 'ENTRY',
      vacancies: 3,
      location: 'Remote (India)',
      stipend: '₹20,000 / month stipend',
      deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      isActive: true,
      skills: {
        create: [
          { skillId: sAnalytics.id },
          { skillId: sGCP.id },
        ],
      },
    },
  });

  // Student Application to Job 1 (Internship - Accepted with active milestones)
  const app1 = await prisma.application.create({
    data: {
      studentId: student.id,
      jobId: job1.id,
      status: 'ACCEPTED',
      note: 'Exceptional skill match (92%). Demonstrated practical expertise in Poorva and Pradhana Karma protocols.',
    },
  });

  // Create Milestones for Priya's accepted internship
  await prisma.internshipMilestone.createMany({
    data: [
      {
        applicationId: app1.id,
        weekNumber: 1,
        title: 'Clinical Orientation & Protocol Familiarization',
        description: 'Completed hospital safety orientation, patient consent reviews, and shadowed senior consultants in OPD.',
        deliverablesUrl: 'https://intern-portal.himalaya.demo/reports/w1_priya.pdf',
        mentorRating: 5,
        mentorFeedback: 'Priya demonstrated prompt adherence to clinical SOPs and remarkable patient rapport.',
        status: 'APPROVED',
      },
      {
        applicationId: app1.id,
        weekNumber: 2,
        title: 'Supervised Virechana Protocol Administration',
        description: 'Assisted in administering therapeutic purgation for 4 chronic osteoarthritis patients; logged hourly vitals in the EHR.',
        deliverablesUrl: 'https://intern-portal.himalaya.demo/reports/w2_priya.pdf',
        mentorRating: 5,
        mentorFeedback: 'Flawless execution of diet transitions and vital monitoring. Highly commended.',
        status: 'APPROVED',
      },
      {
        applicationId: app1.id,
        weekNumber: 3,
        title: 'Digital Patient Outcome Documentation',
        description: 'Compiled before-and-after WOMAC mobility scores for 15 patients undergoing Basti treatment cycles.',
        deliverablesUrl: 'https://intern-portal.himalaya.demo/reports/w3_priya.pdf',
        status: 'SUBMITTED',
      },
    ],
  });

  // Student Application to Job 2 (Job - Shortlisted)
  await prisma.application.create({
    data: {
      studentId: student.id,
      jobId: job2.id,
      status: 'SHORTLISTED',
      note: 'Verified GCP certification and strong technical assessment score (83%). Invited for technical interview round.',
    },
  });

  console.log('✅ Seeded Job Listings, Applications, and Internship Milestones with Mentor Feedback');
  console.log('\n======================================================');
  console.log('🎉 YUKTHA DATABASE SUCCESSFULLY SEEDED!');
  console.log('======================================================');
  console.log('Demo Credentials (password: Demo@1234):');
  console.log('  1. Student:       student@ayushportal.demo');
  console.log('  2. Academician:   faculty@ayushportal.demo');
  console.log('  3. Industry:      company@ayushportal.demo');
  console.log('  4. Institution:   college@ayushportal.demo');
  console.log('  5. Ministry/Admin: admin@ayushportal.demo');
  console.log('======================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
