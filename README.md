# 🌿 SIH26044 — Ayush Academia-Industry Collaboration Portal

**Smart India Hackathon 2026 | Ministry of Ayush | Problem Statement SIH26044**

A full-stack web portal connecting Ayush academic institutions (Ayurveda, Yoga, Naturopathy, Unani, Siddha, Homeopathy) with industry players — featuring Ayush-specific skill taxonomy, skill-match scoring, and end-to-end placement workflow.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + Recharts |
| Backend | Node.js + Express.js |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT + bcrypt |
| File Upload | Multer (local disk / Cloudinary) |
| Email | Nodemailer (console log in dev) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or [Railway](https://railway.app))

### 1. Clone & set up

```bash
git clone <repo-url>
cd sih26044-ayush-portal
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET
npm install
npx prisma db push        # Create tables
node prisma/seed.js       # Seed Ayush skills + demo accounts
npm run dev               # Start on http://localhost:5000
```

### 3. Frontend setup

```bash
cd frontend
# .env already contains VITE_API_URL=http://localhost:5000/api
npm install
npm run dev               # Start on http://localhost:5173
```

---

## 🔐 Demo Accounts (all passwords: `Demo@1234`)

| Role | Email | Description |
|---|---|---|
| Student | `student@ayushportal.demo` | Priya Sharma, BAMS, Gujarat Ayurved University |
| Company | `company@ayushportal.demo` | Himalaya Drug Company |
| College | `college@ayushportal.demo` | Gujarat Ayurved University admin |

---

## 📋 Required Environment Variables

### Backend (`.env`)

```env
DATABASE_URL="postgresql://user:pass@host:5432/ayush_portal"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"

# Optional — email (no-op/logged in dev if not set)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password

# Optional — Cloudinary (falls back to local disk)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🌐 Deploy to Vercel + Railway

### Backend → Railway
1. Create a Railway project, add PostgreSQL service
2. Deploy the `backend/` folder
3. Set all env vars in Railway dashboard
4. Run `prisma db push` and `node prisma/seed.js` via Railway shell

### Frontend → Vercel
1. Connect `frontend/` folder to Vercel
2. Set `VITE_API_URL` to your Railway backend URL
3. Deploy

---

## 🏷️ Ayush Skill Taxonomy (46 skills across 6 systems)

| System | Example Skills |
|---|---|
| **Ayurveda** | Panchkarma, Nadi Pariksha, Shirodhara, Kshar Sutra, Abhyanga, Basti Karma |
| **Yoga & Naturopathy** | Asana Instruction, Pranayama Therapy, Yoga Nidra, Mud Therapy, Hydrotherapy |
| **Unani** | Hijama (Wet Cupping), Ilaj-bil-Dawa, Ilaj-bil-Tadbeer, Regimental Therapy |
| **Siddha** | Varma Therapy, Thokkanam, Kayakalpa Treatment, Siddha Pharmacy |
| **Homeopathy** | Repertorization (Kent/Boericke), Constitutional Prescribing, Materia Medica |
| **Research & Clinical** | GCP Compliance, CTRI Documentation, Pharmacovigilance, Biostatistics |

---

## 📡 API Reference

```
POST /api/auth/register          Register (student/company/college)
POST /api/auth/login             Login → JWT
GET  /api/auth/me                Current user
GET  /api/skills                 All skills grouped by system
GET  /api/student/profile        Student profile (Student)
PUT  /api/student/profile        Update profile (Student)
POST /api/student/skills         Set skill IDs (Student)
POST /api/student/resume         Upload resume (Student)
GET  /api/student/applications   Own applications (Student)
GET  /api/jobs                   List jobs with filters
GET  /api/jobs/:id               Job detail
POST /api/jobs                   Create job (Company)
PUT  /api/jobs/:id               Update job (Company)
GET  /api/jobs/company/mine      Company's own jobs
GET  /api/company/profile        Company profile
GET  /api/company/applicants/:id Applicants + skill-match % (Company)
PATCH /api/applications/:id      Update status (Company) — email triggered
POST /api/apply/:jobId           Apply to job (Student) — email triggered
GET  /api/college/students       Institution students (College)
GET  /api/college/pending        Pending verifications (College)
PATCH /api/college/verify/:uid   Verify student (College)
GET  /api/college/analytics      College placement analytics
GET  /api/analytics/overview     National Ministry analytics
```

---

## 👥 Three User Roles

### Student
- Registers → pending college verification → activated
- Builds profile: degree, skills (Ayush taxonomy), resume, LinkedIn
- Browses jobs with skill-match % scoring
- Applies → tracks status: Applied → Shortlisted → Accepted/Rejected

### Company
- Registers → immediately active
- Posts internships/jobs with required Ayush skills
- Views applicants sorted by skill-match %, shortlists/accepts/rejects
- Email notification sent to student at each status change

### College / Admin
- Verifies student registrations
- Views batch-wise placement analytics (charts)
- College: sees own institution's students
- Admin: sees national Ministry analytics dashboard

---

## 📁 Project Structure

```
sih26044-ayush-portal/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── index.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── skills.js
│   │   │   ├── student.js
│   │   │   ├── jobs.js
│   │   │   ├── applications.js
│   │   │   ├── company.js
│   │   │   ├── college.js
│   │   │   └── analytics.js
│   │   └── utils/
│   │       └── email.js
│   ├── uploads/          ← local file storage fallback
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/client.js
    │   ├── contexts/AuthContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Badges.jsx
    │   │   └── Skeletons.jsx
    │   └── pages/
    │       ├── Landing.jsx
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── student/
    │       ├── company/
    │       ├── college/
    │       └── admin/
    ├── package.json
    └── .env
```

---

*Built for SIH 2026 · Ministry of Ayush, Government of India*
