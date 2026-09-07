/**
 * Prisma Seed Script
 * Seeds the complete Ayush skill taxonomy and demo accounts
 * Run: node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ─── Ayush Skill Taxonomy ─────────────────────────────────────────────────────

const SKILLS = [
  // Ayurveda
  { name: 'Panchkarma', system: 'Ayurveda' },
  { name: 'Nadi Pariksha (Pulse Diagnosis)', system: 'Ayurveda' },
  { name: 'Kshar Sutra', system: 'Ayurveda' },
  { name: 'Basti Karma', system: 'Ayurveda' },
  { name: 'Abhyanga (Oil Massage)', system: 'Ayurveda' },
  { name: 'Shirodhara', system: 'Ayurveda' },
  { name: 'Virechana', system: 'Ayurveda' },
  { name: 'Vamana', system: 'Ayurveda' },
  { name: 'Nasya', system: 'Ayurveda' },
  { name: 'Raktamokshana', system: 'Ayurveda' },
  { name: 'Agnikarma', system: 'Ayurveda' },
  { name: 'Herbal Formulation', system: 'Ayurveda' },
  { name: 'Pharmacognosy', system: 'Ayurveda' },
  { name: 'Ayurvedic Dietetics', system: 'Ayurveda' },

  // Yoga & Naturopathy
  { name: 'Asana Instruction', system: 'Yoga & Naturopathy' },
  { name: 'Pranayama Therapy', system: 'Yoga & Naturopathy' },
  { name: 'Yoga Nidra', system: 'Yoga & Naturopathy' },
  { name: 'Meditation Facilitation', system: 'Yoga & Naturopathy' },
  { name: 'Hydrotherapy', system: 'Yoga & Naturopathy' },
  { name: 'Mud Therapy', system: 'Yoga & Naturopathy' },
  { name: 'Diet and Lifestyle Counselling', system: 'Yoga & Naturopathy' },
  { name: 'Acupressure', system: 'Yoga & Naturopathy' },

  // Unani
  { name: 'Ilaj-bil-Dawa (Pharmacotherapy)', system: 'Unani' },
  { name: 'Hijama (Wet Cupping)', system: 'Unani' },
  { name: 'Ilaj-bil-Tadbeer', system: 'Unani' },
  { name: 'Unani Pharmacy', system: 'Unani' },
  { name: 'Regimental Therapy', system: 'Unani' },

  // Siddha
  { name: 'Varma Therapy', system: 'Siddha' },
  { name: 'Thokkanam (Massage)', system: 'Siddha' },
  { name: 'Siddha Pharmacy', system: 'Siddha' },
  { name: 'Kayakalpa Treatment', system: 'Siddha' },

  // Homeopathy
  { name: 'Case Taking and Analysis', system: 'Homeopathy' },
  { name: 'Repertorization (Kent/Boericke)', system: 'Homeopathy' },
  { name: 'Materia Medica', system: 'Homeopathy' },
  { name: 'Homeopathic Pharmacy', system: 'Homeopathy' },
  { name: 'Constitutional Prescribing', system: 'Homeopathy' },

  // Research & Clinical
  { name: 'Clinical Trials in Ayush', system: 'Research & Clinical' },
  { name: 'GCP Compliance', system: 'Research & Clinical' },
  { name: 'CTRI Documentation', system: 'Research & Clinical' },
  { name: 'Pharmacovigilance', system: 'Research & Clinical' },
  { name: 'AYUSH Drug Standardisation', system: 'Research & Clinical' },
  { name: 'Biostatistics', system: 'Research & Clinical' },
  { name: 'Research Methodology', system: 'Research & Clinical' },
  { name: 'Scientific Writing', system: 'Research & Clinical' },
];

// ─── Demo Accounts ────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding Ayush skill taxonomy...');

  // Upsert skills
  for (const skill of SKILLS) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: { system: skill.system },
      create: skill,
    });
  }
  console.log(`✅ Seeded ${SKILLS.length} Ayush skills`);

  const hash = (pw) => bcrypt.hashSync(pw, 10);

  // ── Demo College Admin ──
  const collegeUser = await prisma.user.upsert({
    where: { email: 'college@ayushportal.demo' },
    update: {},
    create: {
      name: 'Gujarat Ayurved University',
      email: 'college@ayushportal.demo',
      password: hash('Demo@1234'),
      role: 'COLLEGE',
      isActive: true,
      college: {
        create: {
          name: 'Gujarat Ayurved University',
          city: 'Jamnagar',
          state: 'Gujarat',
          affiliation: 'Autonomous – Deemed University',
          verificationStatus: 'VERIFIED',
        },
      },
    },
    include: { college: true },
  });
  console.log('✅ Demo college account: college@ayushportal.demo / Demo@1234');

  // ── Demo Company ──
  const companyUser = await prisma.user.upsert({
    where: { email: 'company@ayushportal.demo' },
    update: {},
    create: {
      name: 'Himalaya Drug Company',
      email: 'company@ayushportal.demo',
      password: hash('Demo@1234'),
      role: 'COMPANY',
      isActive: true,
      company: {
        create: {
          name: 'Himalaya Drug Company',
          sector: 'Ayurveda Pharma',
          website: 'https://himalayawellness.in',
          city: 'Bengaluru',
          description:
            'A leading Ayurvedic pharmaceutical and wellness company with 90+ years of heritage in herbal research and manufacturing.',
        },
      },
    },
    include: { company: true },
  });
  console.log('✅ Demo company account: company@ayushportal.demo / Demo@1234');

  // ── Demo Student ──
  const allSkills = await prisma.skill.findMany();
  const getSkillId = (name) => allSkills.find((s) => s.name === name)?.id;

  const studentSkills = [
    'Panchkarma',
    'Shirodhara',
    'Abhyanga (Oil Massage)',
    'Herbal Formulation',
    'Ayurvedic Dietetics',
    'Clinical Trials in Ayush',
    'Research Methodology',
  ].map(getSkillId).filter(Boolean);

  const studentUser = await prisma.user.upsert({
    where: { email: 'student@ayushportal.demo' },
    update: {},
    create: {
      name: 'Priya Sharma',
      email: 'student@ayushportal.demo',
      password: hash('Demo@1234'),
      role: 'STUDENT',
      isActive: true,
      student: {
        create: {
          institution: 'Gujarat Ayurved University',
          degree: 'BAMS',
          graduationYear: 2025,
          city: 'Jamnagar',
          state: 'Gujarat',
          bio: 'Final year BAMS student with a passion for Panchkarma and herbal research. Completed internship at SDM Ayurveda Hospital, Udupi.',
          achievements:
            'Best Paper Award – AIAPRM 2024 Conference; National Merit Scholarship 2022',
          linkedinUrl: 'https://linkedin.com/in/priyasharma-bams',
          skills: {
            create: studentSkills.map((skillId) => ({ skillId })),
          },
        },
      },
    },
    include: { student: true },
  });
  console.log('✅ Demo student account: student@ayushportal.demo / Demo@1234');

  // ── Demo Job Listings ──
  const company = await prisma.company.findUnique({ where: { userId: companyUser.id } });

  const jobSkills1 = [
    'Panchkarma',
    'Herbal Formulation',
    'Ayurvedic Dietetics',
    'Abhyanga (Oil Massage)',
  ].map(getSkillId).filter(Boolean);

  const jobSkills2 = [
    'Clinical Trials in Ayush',
    'GCP Compliance',
    'Pharmacovigilance',
    'AYUSH Drug Standardisation',
    'Biostatistics',
  ].map(getSkillId).filter(Boolean);

  const jobSkills3 = [
    'Asana Instruction',
    'Pranayama Therapy',
    'Meditation Facilitation',
    'Diet and Lifestyle Counselling',
  ].map(getSkillId).filter(Boolean);

  const job1 = await prisma.jobListing.upsert({
    where: { id: 'seed-job-001' },
    update: {},
    create: {
      id: 'seed-job-001',
      companyId: company.id,
      title: 'Panchkarma Therapist – Clinical Internship',
      description:
        'We are looking for BAMS graduates to join our Panchkarma division in Bengaluru. You will work under senior Ayurvedic physicians, performing Snehana and Swedana procedures, assisting in Virechana protocols, and managing patient records using our digital health platform. Accommodation provided for outstation candidates.',
      type: 'INTERNSHIP',
      location: 'Bengaluru, Karnataka',
      stipend: '₹15,000/month',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      skills: {
        create: jobSkills1.map((skillId) => ({ skillId })),
      },
    },
  });

  const job2 = await prisma.jobListing.upsert({
    where: { id: 'seed-job-002' },
    update: {},
    create: {
      id: 'seed-job-002',
      companyId: company.id,
      title: 'Clinical Research Associate – Ayush Trials',
      description:
        'Himalaya Drug Company is expanding its clinical research division. We seek candidates with a background in Ayush systems and an understanding of GCP guidelines. Role involves assisting in CTRI registrations, pharmacovigilance reporting, data collection and monitoring at partner hospitals.',
      type: 'JOB',
      location: 'Bengaluru, Karnataka',
      stipend: '₹35,000/month',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      skills: {
        create: jobSkills2.map((skillId) => ({ skillId })),
      },
    },
  });

  const job3 = await prisma.jobListing.upsert({
    where: { id: 'seed-job-003' },
    update: {},
    create: {
      id: 'seed-job-003',
      companyId: company.id,
      title: 'Yoga Wellness Coach – Corporate Wellness Program',
      description:
        'Join our corporate wellness vertical delivering structured yoga and meditation programs to Fortune 500 companies. Responsibilities include conducting online and offline Asana sessions, building customised Pranayama schedules, maintaining wellness reports and client feedback analysis.',
      type: 'JOB',
      location: 'Remote / Pan-India',
      stipend: '₹28,000/month',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      skills: {
        create: jobSkills3.map((skillId) => ({ skillId })),
      },
    },
  });

  console.log('✅ Seeded 3 demo job listings');

  // ── Demo Application (student applied to job1) ──
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUser.id } });

  await prisma.application.upsert({
    where: { studentId_jobId: { studentId: student.id, jobId: job1.id } },
    update: {},
    create: {
      studentId: student.id,
      jobId: job1.id,
      status: 'SHORTLISTED',
    },
  });

  await prisma.application.upsert({
    where: { studentId_jobId: { studentId: student.id, jobId: job2.id } },
    update: {},
    create: {
      studentId: student.id,
      jobId: job2.id,
      status: 'APPLIED',
    },
  });

  console.log('✅ Seeded demo applications');
  console.log('\n🎉 Database seeded successfully!');
  console.log('\nDemo accounts (all passwords: Demo@1234):');
  console.log('  Student  → student@ayushportal.demo');
  console.log('  Company  → company@ayushportal.demo');
  console.log('  College  → college@ayushportal.demo');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
