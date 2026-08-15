# KalaKriti Arts Studio — Deployment Guide

## 1. Primary Base Directory
All source code, database files, and related assets are configured to be stored under the primary installation directory:
`C:\Mangesh\Jules\GayatriPortal`

## 2. Overview
This application is built using Next.js 15, TypeScript, Tailwind CSS, and SQLite (`better-sqlite3`) / PostgreSQL-compatible architecture.

---

## 2. Deployment Steps (Vercel / Render / Self-Hosted Docker)

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Build complete India-based handmade arts and crafts e-commerce site"
git push origin main
```

### Step 2: Environment Variables Template (.env.example)
Create an `.env` file based on `.env.example`:
```env
DATABASE_FILE=/tmp/store.db
RAZORPAY_KEY_ID=rzp_test_sampleKey123
RAZORPAY_KEY_SECRET=sampleSecretKey456
STORE_URL=https://your-domain.vercel.app
```

### Step 3: Deploy to Vercel or Render
1. Connect GitHub repository to Vercel/Render.
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables.

---

## 3. Production Razorpay Setup
1. Log into [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Generate Live API Key ID and Key Secret.
3. Paste Key ID and Key Secret into Admin Dashboard ➔ Store Settings.
4. Save settings.
