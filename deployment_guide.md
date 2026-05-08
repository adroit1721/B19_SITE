# 🚀 Deployment Guide — Backbencher's 19

This guide outlines the steps to deploy the **Backbencher's 19** MERN application to **Vercel**.

---

## 📦 Prerequisites

1.  **GitHub Repository**: Ensure your code is pushed to [github.com/adroit1721/B19_SITE](https://github.com/adroit1721/B19_SITE.git).
2.  **MongoDB Atlas**: A running MongoDB cluster.
3.  **Vercel Account**: Signed up at [vercel.com](https://vercel.com).

---

## 🛠️ Step 1: Vercel Project Setup

1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New"** > **"Project"**.
2.  Import the `B19_SITE` repository.
3.  **Project Name**: `backbenchers19` (or your preferred name).
4.  **Framework Preset**: Select **"Other"** (Vercel will detect settings from `vercel.json`).
5.  **Root Directory**: Leave as `./` (Project Root).

---

## 🔐 Step 2: Environment Variables

In the **"Environment Variables"** section of the Vercel setup, add the following:

| Key | Value | Description |
|-----|-------|-------------|
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB connection string |
| `JWT_SECRET` | `your_secret_key` | A strong random string for security |
| `NODE_ENV` | `production` | Ensures the app runs in production mode |

> [!IMPORTANT]
> Make sure your `MONGO_URI` includes the database name (e.g., `.../backbenchers19?retryWrites=true...`).

---

## 🚀 Step 3: Deploy

1.  Click **"Deploy"**.
2.  Vercel will build the frontend (`client/`) and prepare the backend (`server/`).
3.  Once finished, you will receive a production URL (e.g., `backbenchers19.vercel.app`).

---

## 🧪 Step 4: Post-Deployment Check

1.  **Admin Login**: Visit `your-url.vercel.app/admin/login`.
2.  **Credentials**: Use your seeded admin credentials (default: `Admin` / `admin123`).
3.  **Uploads**: Test a logo upload to ensure the `/uploads` route and storage are working (Note: Vercel uses a read-only filesystem except for `/tmp`, so for permanent uploads, consider integrating **Cloudinary** or **AWS S3** in the future).

---

## ⚠️ Important Note on File Uploads (Vercel)

Vercel's serverless environment does **not** support permanent local file storage. Files uploaded to `/uploads` will disappear when the serverless function restarts.

**Recommended Solution:**
For a production-ready gallery, you should update the backend to upload images to **Cloudinary** or **S3** instead of the local disk.

---

*Made with ❤️ for the SSC Batch-2019 team*
