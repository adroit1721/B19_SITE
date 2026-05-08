# 🚀 Deployment Guide — Backbencher's 19

This guide outlines the steps to deploy the **Backbencher's 19** MERN application to **Vercel**.

---

## 📦 Prerequisites

1.  **GitHub Repository**: [github.com/adroit1721/B19_SITE](https://github.com/adroit1721/B19_SITE.git)
2.  **MongoDB Atlas**: Your cluster is already whitelisted and seeded.
3.  **Vercel Account**: Signed up at [vercel.com](https://vercel.com).

---

## 🛠️ Step 1: Vercel Project Setup

1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New"** > **"Project"**.
2.  Import the `B19_SITE` repository.
3.  **Project Name**: `backbenchers19`
4.  **Framework Preset**: Select **"Other"** (Vercel will use `vercel.json`).
5.  **Root Directory**: `./`

---

## 🔐 Step 2: Environment Variables

In the **"Environment Variables"** section of the Vercel setup, add the following three variables:

| Key | Value |
|-----|-------|
| `MONGO_URI` | `mongodb+srv://adroittech8_db_user:Adroit2026@cluster0.kzfpm1l.mongodb.net/backbenchers19?retryWrites=true&w=majority` |
| `JWT_SECRET` | `BackBenchers19_SuperSecret_JWT_Key_2024` |
| `NODE_ENV` | `production` |

> [!IMPORTANT]
> Make sure to copy the `MONGO_URI` exactly as shown above to ensure the database connects correctly.

---

## 🚀 Step 3: Deploy

1.  Click **"Deploy"**.
2.  Vercel will build the frontend (`client/`) and the backend (`server/`) as configured in `vercel.json`.
3.  Once finished, click on the **Deployment URL** to visit your live site!

---

## 🧪 Step 4: Post-Deployment

1.  **Admin Login**: Visit `your-site.vercel.app/admin/login`
2.  **Credentials**: 
    *   **Username**: `Admin`
    *   **Password**: `admin123`
3.  **Change Password**: After logging in, go to the **Dashboard** and change your password for security.

---

## ⚠️ File Upload Note

Vercel's filesystem is temporary. Images uploaded via the Admin panel (Gallery/Logo) will be visible immediately but may disappear if the server restarts. 

**Recommendation**: For permanent image storage, we can later integrate **Cloudinary** which is the industry standard for Vercel-based MERN apps.

---

*Made with ❤️ for the SSC Batch-2019 team*
