/**
 * Extra Jobs & Internships Seeder for Yuktha Portal
 * Adds 22 diverse job/internship/apprenticeship/live-project listings
 * across multiple Ayush-sector companies.
 *
 * Run: node prisma/seed_jobs.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const defaultPw = bcrypt.hashSync('Demo@1234', 10);
const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

async function main() {
  console.log('Seeding extra jobs & internships...\n');
  const allSkills = await prisma.skill.findMany();
  const skill = (name) => allSkills.find((s) => s.name === name);

  const companyDefs = [
    {
      email: 'patanjali@ayushportal.demo',
      name: 'Patanjali Ayurved Ltd',
      sector: 'Ayurveda Pharma & FMCG',
      city: 'Haridwar',
      website: 'https://patanjaliayurved.net',
      description: 'Leading Ayurvedic FMCG and pharmaceutical manufacturer with operations across India and 50+ countries.',
      logoUrl: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=128&auto=format&fit=crop&q=80',
    },
    {
      email: 'dabur@ayushportal.demo',
      name: 'Dabur India Limited',
      sector: 'Healthcare & Herbal Products',
      city: 'New Delhi',
      website: 'https://dabur.com',
      description: "India's largest Ayurvedic medicines and natural consumer products company with 135+ years of heritage.",
      logoUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=128&auto=format&fit=crop&q=80',
    },
    {
      email: 'sdu@ayushportal.demo',
      name: 'SDM Ayurveda Hospital',
      sector: 'Ayurveda Clinical Services',
      city: 'Udupi',
      website: 'https://sdmcah.org',
      description: 'Premier 600-bed Ayurveda hospital and teaching institution affiliated to Rajiv Gandhi University.',
      logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=128&auto=format&fit=crop&q=80',
    },
    {
      email: 'nimhans_yoga@ayushportal.demo',
      name: 'NIMHANS Integrative Health',
      sector: 'Mental Health & Yoga Therapy',
      city: 'Bengaluru',
      website: 'https://nimhans.ac.in',
      description: 'National Institute of Mental Health dedicated to integrative treatments combining Yoga and modern psychiatry.',
      logoUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=128&auto=format&fit=crop&q=80',
    },
    {
      email: 'zydus@ayushportal.demo',
      name: 'Zydus Wellness & Herbal',
      sector: 'Pharmaceutical & Regulatory',
      city: 'Ahmedabad',
      website: 'https://zyduswellness.com',
      description: 'Science-backed herbal healthcare and consumer wellness company with state-of-the-art formulation R&D.',
      logoUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=128&auto=format&fit=crop&q=80',
    },
  ];

  const companies = {};
  for (const def of companyDefs) {
    const u = await prisma.user.upsert({
      where: { email: def.email },
      update: {},
      create: {
        name: def.name,
        email: def.email,
        password: defaultPw,
        role: 'COMPANY',
        isActive: true,
        company: {
          create: {
            name: def.name,
            sector: def.sector,
            city: def.city,
            website: def.website,
            description: def.description,
            logoUrl: def.logoUrl,
          },
        },
      },
      include: { company: true },
    });
    companies[def.email] = u.company;
    console.log('  Company ready: ' + def.name);
  }

  const himalaya = await prisma.company.findFirst({ where: { name: { contains: 'Himalaya' } } });

  const jobs = [
    // PATANJALI
    { company: companies['patanjali@ayushportal.demo'], title: 'Herbal QC Analyst - Internship', description: 'Join Patanjali Quality Control division to perform identity, purity, and strength testing of raw herbs and finished formulations. Work includes TLC, HPLC, disintegration tests, and microbiological limit testing as per Ayurvedic Pharmacopoeia of India (API) specifications.', type: 'INTERNSHIP', workMode: 'ONSITE', experienceLevel: 'ENTRY', vacancies: 6, location: 'Haridwar, Uttarakhand', stipend: '15,000 / month + hostel', deadline: daysFromNow(35), skillNames: ['Herbal Formulation & Standardization', 'Pharmacognosy & Phytochemistry'] },
    { company: companies['patanjali@ayushportal.demo'], title: 'Digital Health Content Researcher', description: 'Research, validate, and write evidence-based Ayush wellness content for Patanjali digital health platform. Collaborate with senior vaidyas and data scientists to create structured health knowledge graphs and validated disease-herb association datasets.', type: 'INTERNSHIP', workMode: 'REMOTE', experienceLevel: 'ENTRY', vacancies: 4, location: 'Remote (India)', stipend: '12,000 / month', deadline: daysFromNow(28), skillNames: ['Scientific Manuscript Writing', 'Technical Communication & Presentation'] },
    { company: companies['patanjali@ayushportal.demo'], title: 'Regulatory Affairs Executive', description: 'Handle AYUSH product licensing dossiers, coordinate with CDSCO and State Licensing Authority for new product registrations, label compliance review, and maintain updated regulatory intelligence for Ayurvedic Proprietary Medicine (APM) filings.', type: 'JOB', workMode: 'ONSITE', experienceLevel: 'ENTRY', vacancies: 2, location: 'Haridwar, Uttarakhand', stipend: '38,000 / month (CTC 5 LPA)', deadline: daysFromNow(21), skillNames: ['Regulatory Affairs & FDA/AYUSH Guidelines', 'Scientific Manuscript Writing'] },
    { company: companies['patanjali@ayushportal.demo'], title: 'Ayurvedic Pharmacist - Live Formulation Project', description: 'Participate in a live product formulation project to develop and stability-test three new classical Asava-Arishta formulations. This 3-month project will directly feed into Patanjali product pipeline with a commercialization review at the end.', type: 'LIVE_PROJECT', workMode: 'HYBRID', experienceLevel: 'ENTRY', vacancies: 3, location: 'Haridwar, Uttarakhand', stipend: '18,000 / month + project completion bonus', deadline: daysFromNow(45), skillNames: ['Herbal Formulation & Standardization', 'Ayurvedic Dietetics & Nutrition'] },
    // DABUR
    { company: companies['dabur@ayushportal.demo'], title: 'Clinical Research Intern - Oral Health Portfolio', description: 'Support Dabur clinical research team in conducting post-market studies for the oral-care product line. Responsibilities include patient recruitment coordination, data entry in eCRF, adverse event monitoring, and CTRI database updates.', type: 'INTERNSHIP', workMode: 'HYBRID', experienceLevel: 'ENTRY', vacancies: 3, location: 'New Delhi / NCR', stipend: '20,000 / month', deadline: daysFromNow(30), skillNames: ['Clinical Trials & GCP Compliance', 'CTRI Documentation & Protocol Design'] },
    { company: companies['dabur@ayushportal.demo'], title: 'Health Data Analyst - Consumer Insights', description: 'Analyze consumer health survey datasets, clinical outcomes, and digital engagement metrics to derive insights supporting Dabur R&D investment decisions. Use Python/R for statistical analysis and build dashboards for leadership reports.', type: 'JOB', workMode: 'HYBRID', experienceLevel: 'ENTRY', vacancies: 2, location: 'New Delhi', stipend: '45,000 / month (CTC 6 LPA)', deadline: daysFromNow(20), skillNames: ['Health Data Analytics & Python', 'Biostatistics & Health Data Analysis'] },
    { company: companies['dabur@ayushportal.demo'], title: 'Pharmacovigilance Officer', description: 'Monitor and evaluate adverse drug reactions from Dabur post-market surveillance programs. Maintain Individual Case Safety Reports (ICSRs), prepare periodic benefit-risk evaluation reports (PBRERs), and coordinate with PVPI national reporting portals.', type: 'JOB', workMode: 'ONSITE', experienceLevel: 'ENTRY', vacancies: 1, location: 'Sahibabad, Uttar Pradesh', stipend: '40,000 / month (CTC 5.5 LPA)', deadline: daysFromNow(25), skillNames: ['Pharmacovigilance & Drug Safety', 'Regulatory Affairs & FDA/AYUSH Guidelines'] },
    { company: companies['dabur@ayushportal.demo'], title: 'Herbal R&D Apprentice - Standardization Lab', description: 'A 6-month paid apprenticeship in Dabur formulation R&D laboratory learning standardization workflows for classical churnas, avalehas, and modern encapsulated extracts. Training includes spectroscopic characterization and stability chamber protocols.', type: 'APPRENTICESHIP', workMode: 'ONSITE', experienceLevel: 'ENTRY', vacancies: 5, location: 'Baddi, Himachal Pradesh', stipend: '16,000 / month + insurance', deadline: daysFromNow(40), skillNames: ['Pharmacognosy & Phytochemistry', 'Herbal Formulation & Standardization'] },
    // SDM
    { company: companies['sdu@ayushportal.demo'], title: 'Panchkarma Therapist - OPD Internship', description: 'Gain hands-on clinical experience at SDM 600-bed Ayurveda hospital by assisting senior vaidyas in all classical Shodhana procedures. Rotate through Panchkarma, Kayachikitsa, and Shalakya departments over 3 months.', type: 'INTERNSHIP', workMode: 'ONSITE', experienceLevel: 'ENTRY', vacancies: 8, location: 'Udupi, Karnataka', stipend: '10,000 / month + accommodation', deadline: daysFromNow(50), skillNames: ['Panchkarma Procedures', 'Case Taking & Constitutional Analysis'] },
    { company: companies['sdu@ayushportal.demo'], title: 'Ayurveda Research Fellow - Kshara Sutra Study', description: 'Research fellowship to assist on SDM ongoing RCT on Kshara Sutra vs. conventional fistulotomy. Responsibilities include case data collection, imaging coordination, outcome measure documentation, and statistical entry.', type: 'JOB', workMode: 'ONSITE', experienceLevel: 'ENTRY', vacancies: 2, location: 'Udupi, Karnataka', stipend: '28,000 / month', deadline: daysFromNow(30), skillNames: ['Clinical Trials & GCP Compliance', 'Biostatistics & Health Data Analysis'] },
    { company: companies['sdu@ayushportal.demo'], title: 'Hospital Health Records & Data Coordinator', description: 'Digitize, verify, and manage electronic patient records in SDM integrated HMIS. Build outpatient data pipelines for the multi-centre epidemiology study on chronic lifestyle disease management through Ayurveda.', type: 'APPRENTICESHIP', workMode: 'ONSITE', experienceLevel: 'ENTRY', vacancies: 3, location: 'Udupi, Karnataka', stipend: '14,000 / month', deadline: daysFromNow(22), skillNames: ['Database Architecture & SQL', 'Health Data Analytics & Python'] },
    { company: companies['sdu@ayushportal.demo'], title: 'Medical Writer - Clinical Case Reports', description: 'Document interesting case studies from SDM OPD and IPD for publication in peer-reviewed Ayush journals. Collaborate with attending physicians to write structured clinical narratives, literature reviews, and discussion sections.', type: 'INTERNSHIP', workMode: 'HYBRID', experienceLevel: 'ENTRY', vacancies: 4, location: 'Udupi / Remote', stipend: '8,000 / month', deadline: daysFromNow(35), skillNames: ['Scientific Manuscript Writing', 'Technical Communication & Presentation'] },
    // NIMHANS
    { company: companies['nimhans_yoga@ayushportal.demo'], title: 'Yoga Therapy Research Assistant', description: 'Support ongoing RCTs evaluating yoga and pranayama interventions for anxiety disorder, PTSD, and treatment-resistant depression at NIMHANS. Assist in outcome measurements (HAM-A, DASS-21), yoga session facilitation, and biomarker sample logging.', type: 'INTERNSHIP', workMode: 'ONSITE', experienceLevel: 'ENTRY', vacancies: 5, location: 'Bengaluru, Karnataka', stipend: '18,000 / month', deadline: daysFromNow(28), skillNames: ['Asana & Therapeutic Yoga', 'Pranayama Therapy', 'Clinical Trials & GCP Compliance'] },
    { company: companies['nimhans_yoga@ayushportal.demo'], title: 'Yoga & Mindfulness Programme Coordinator', description: 'Plan, schedule, and facilitate structured Yoga therapy sessions for inpatient psychiatric wards. Coordinate with psychiatrists to individualize practice prescriptions and document weekly patient progress using validated outcome tools.', type: 'JOB', workMode: 'ONSITE', experienceLevel: 'ENTRY', vacancies: 2, location: 'Bengaluru, Karnataka', stipend: '32,000 / month', deadline: daysFromNow(18), skillNames: ['Asana & Therapeutic Yoga', 'Case Taking & Constitutional Analysis'] },
    { company: companies['nimhans_yoga@ayushportal.demo'], title: 'Health ML Researcher - Wearable Biomarker Analysis', description: 'Live project using wearable sensor datasets (HRV, galvanic skin response) collected during yoga sessions. Apply time-series ML models to predict anxiolytic response and publish findings as a conference paper.', type: 'LIVE_PROJECT', workMode: 'HYBRID', experienceLevel: 'ENTRY', vacancies: 2, location: 'Bengaluru / Remote', stipend: '22,000 / month + co-authorship', deadline: daysFromNow(60), skillNames: ['Machine Learning for Bio-Data', 'Health Data Analytics & Python'] },
    // ZYDUS
    { company: companies['zydus@ayushportal.demo'], title: 'Formulation Development Intern - Phyto-Extract Tablets', description: 'Work in Zydus tablet formulation division to develop and optimize Ayush-validated herbal tablets. Learn direct-compression and wet-granulation workflows, evaluate excipient compatibility, and conduct friability and dissolution studies.', type: 'INTERNSHIP', workMode: 'ONSITE', experienceLevel: 'ENTRY', vacancies: 4, location: 'Ahmedabad, Gujarat', stipend: '18,000 / month', deadline: daysFromNow(32), skillNames: ['Herbal Formulation & Standardization', 'Pharmacognosy & Phytochemistry'] },
    { company: companies['zydus@ayushportal.demo'], title: 'Regulatory Submissions Analyst', description: 'Prepare and submit registration dossiers to CDSCO, DCGI, and international markets (GCC, ASEAN). Maintain a regulatory intelligence tracker and assist in compiling safety data sheets, label artwork, and eCTD packages.', type: 'JOB', workMode: 'HYBRID', experienceLevel: 'ENTRY', vacancies: 2, location: 'Ahmedabad, Gujarat', stipend: '42,000 / month (CTC 5.8 LPA)', deadline: daysFromNow(24), skillNames: ['Regulatory Affairs & FDA/AYUSH Guidelines', 'CTRI Documentation & Protocol Design'] },
    { company: companies['zydus@ayushportal.demo'], title: 'DevOps & Cloud Engineer - Health-Tech Platform', description: 'Build and maintain Zydus Wellness cloud-native infrastructure on AWS. Set up CI/CD pipelines for the patient-facing app, manage Kubernetes clusters, implement monitoring dashboards with Grafana, and ensure HIPAA-equivalent data compliance.', type: 'JOB', workMode: 'HYBRID', experienceLevel: 'ENTRY', vacancies: 1, location: 'Ahmedabad, Gujarat', stipend: '55,000 / month (CTC 7.5 LPA)', deadline: daysFromNow(20), skillNames: ['Cloud Infrastructure & DevOps', 'RESTful API Engineering'] },
    { company: companies['zydus@ayushportal.demo'], title: 'Full-Stack Developer - Patient Portal', description: 'Develop features for Zydus Wellness integrated patient-portal web app (React + Node). Work on appointment booking modules, secure lab report uploads, prescription management, and an Ayush product recommendation engine.', type: 'JOB', workMode: 'REMOTE', experienceLevel: 'ENTRY', vacancies: 2, location: 'Remote (India)', stipend: '50,000 / month (CTC 7 LPA)', deadline: daysFromNow(26), skillNames: ['Full-Stack Web Development (React & Node)', 'Database Architecture & SQL'] },
    { company: companies['zydus@ayushportal.demo'], title: 'Biostatistics Apprentice - Clinical Outcomes', description: 'Six-month apprenticeship to support statistical analysis for Zydus clinical trial reports. Use R/SAS to perform ANCOVA, survival analysis, and non-inferiority calculations. Generate statistical analysis plans and produce table-listing-figures.', type: 'APPRENTICESHIP', workMode: 'HYBRID', experienceLevel: 'ENTRY', vacancies: 2, location: 'Ahmedabad, Gujarat', stipend: '20,000 / month', deadline: daysFromNow(38), skillNames: ['Biostatistics & Health Data Analysis', 'Health Data Analytics & Python'] },
  ];

  if (himalaya) {
    jobs.push(
      { company: himalaya, title: 'Agile Project Manager - R&D Operations', description: 'Lead sprint planning and delivery of Himalaya cross-functional digital health R&D projects. Manage backlogs, stakeholder communication, and sprint retrospectives using JIRA and Confluence.', type: 'JOB', workMode: 'HYBRID', experienceLevel: 'ENTRY', vacancies: 1, location: 'Bengaluru, Karnataka', stipend: '58,000 / month (CTC 8 LPA)', deadline: daysFromNow(22), skillNames: ['Agile Project Management', 'Cross-Functional Team Collaboration'] },
      { company: himalaya, title: 'Ayurvedic Dietitian & Nutrition Consultant - Internship', description: 'Create customized diet plans for patients enrolled in Himalaya corporate wellness program. Conduct nutritional assessments, adapt classical Ayurvedic Ahara principles to modern food systems, and present quarterly health outcome reports.', type: 'INTERNSHIP', workMode: 'HYBRID', experienceLevel: 'ENTRY', vacancies: 3, location: 'Bengaluru, Karnataka', stipend: '15,000 / month', deadline: daysFromNow(35), skillNames: ['Ayurvedic Dietetics & Nutrition', 'Case Taking & Constitutional Analysis'] }
    );
  }

  let created = 0;
  for (const j of jobs) {
    if (!j.company) { console.warn('Skipped: ' + j.title); continue; }
    const skillConnections = j.skillNames.map((n) => skill(n)).filter(Boolean).map((s) => ({ skillId: s.id }));
    await prisma.jobListing.create({
      data: {
        companyId: j.company.id,
        title: j.title,
        description: j.description,
        type: j.type,
        workMode: j.workMode,
        experienceLevel: j.experienceLevel,
        vacancies: j.vacancies,
        location: j.location,
        stipend: j.stipend,
        deadline: j.deadline,
        isActive: true,
        skills: { create: skillConnections },
      },
    });
    created++;
    console.log('  [' + j.type + '] ' + j.title);
  }

  const total = await prisma.jobListing.count();
  console.log('\nAdded ' + created + ' new listings. Total in DB: ' + total);
}

main()
  .catch((e) => { console.error('Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
