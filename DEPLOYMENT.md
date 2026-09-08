# 🚀 Deployment Guide: Yuktha Platform

This guide covers the easiest, 100% free deployment methods for the **Yuktha Academia–Industry Collaboration Platform**.

---

## 🌟 Method 1: Render.com (Recommended — 1 Single URL, Zero CORS)

With this method, the backend runs Node.js and serves both the REST API (`/api/*`) and the built React frontend (`/*`) from a single domain (e.g. `https://yuktha.onrender.com`).

### Step-by-Step Instructions:

1. **Sign in to Render**:
   - Go to [https://render.com](https://render.com) and sign in with your GitHub account.

2. **Create a New Web Service**:
   - Click **"New +"** -> Select **"Web Service"**.
   - Connect your GitHub repository: `https://github.com/ndlokesh/yuktha.git`.

3. **Configure the Web Service**:
   - **Name**: `yuktha` (or your chosen name)
   - **Language / Runtime**: `Node`
   - **Branch**: `main`
   - **Root Directory**: *(leave blank to use repository root)*
   - **Build Command**:
     ```bash
     npm run render-build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Instance Type**: `Free`

4. **Environment Variables**:
   Under the **Environment Variables** section, add:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `JWT_SECRET` | `ayush_sih_2026_super_secret_key_yuktha` | For secure token signing |
   | `DATABASE_URL` | `file:./dev.db` | Uses the pre-seeded SQLite database |

5. **Deploy**:
   - Click **"Create Web Service"**.
   - Render will run `npm run render-build`, build the frontend, generate Prisma, and start the app.
   - Your live URL will be ready at: `https://yuktha.onrender.com`.

---

## ⚡ Method 2: Railway.app (Ultra-Fast 1-Click Deploy)

1. Go to [https://railway.app](https://railway.app) and sign in with GitHub.
2. Click **"New Project"** -> **"Deploy from GitHub repo"**.
3. Select `ndlokesh/yuktha`.
4. In Settings -> **Build Command**: `npm run render-build`
5. In Settings -> **Start Command**: `npm start`
6. Add Environment Variable:
   - `JWT_SECRET`: `ayush_sih_2026_super_secret_key_yuktha`
   - `DATABASE_URL`: `file:./dev.db`
7. Click **"Generate Domain"** to get your public `https://...up.railway.app` URL.

---

## 🌐 Method 3: Vercel (Frontend) + Render (Backend)

If you prefer hosting the React frontend on Vercel:

### 1. Deploy Backend on Render:
- Root Directory: `backend`
- Build Command: `npm install && npx prisma generate && npx prisma db push`
- Start Command: `node src/index.js`
- Copy your Render backend URL (e.g., `https://yuktha-api.onrender.com`).

### 2. Deploy Frontend on Vercel:
- Go to [https://vercel.com](https://vercel.com) -> **"Add New Project"**.
- Import `ndlokesh/yuktha`.
- Framework Preset: **Vite**.
- Root Directory: **`frontend`**.
- Add Environment Variable:
  - `VITE_API_URL`: `https://yuktha-api.onrender.com/api`
- Click **"Deploy"**.

---

## 🔑 Pre-Seeded Demo Credentials for Live Evaluation

All accounts use the password: **`Demo@1234`**

| Role | Email |
| :--- | :--- |
| **🎓 Student** | `student@ayushportal.demo` |
| **🔬 Faculty / Academician** | `faculty@ayushportal.demo` |
| **🏢 Industry Partner** | `company@ayushportal.demo` |
| **🏛️ College / Institution** | `college@ayushportal.demo` |
| **🇮🇳 National Admin** | `admin@ayushportal.demo` |
