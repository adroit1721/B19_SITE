# Backbencher's 19 — Official Website

> SSC Batch-2019 · Rajabari Hat High School

A full-stack MERN web application for the Backbencher's 19 alumni group.

---

## 🚀 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React + Vite, Redux Toolkit, Tailwind CSS |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB Atlas                        |
| Auth      | JWT (jsonwebtoken + bcryptjs)       |
| Deploy    | Vercel                              |

---

## 📁 Project Structure

```
Backbencher's_web/
├── client/              # React frontend
│   ├── src/
│   │   ├── app/         # Redux store
│   │   ├── features/    # Redux slices (auth, events, gallery, blogs, footer, about)
│   │   ├── components/  # Reusable components (Header, Footer, EventRegistrationBanner)
│   │   ├── pages/       # Public pages + Admin pages
│   │   └── services/    # Axios API service
│   ├── public/images/   # logo.png, favicon.ico
│   └── tailwind.config.js
│
├── server/              # Express backend
│   ├── config/          # MongoDB connection
│   ├── models/          # Mongoose models
│   ├── controllers/     # Route handlers
│   ├── routes/          # Express routers
│   ├── middleware/       # JWT auth middleware
│   ├── server.js        # Entry point
│   └── seed.js          # Database seeder
│
├── images/              # Static assets
└── vercel.json          # Deployment config
```

---

## ⚡ Quick Start

### 1. Backend Setup

```bash
cd server
npm install
npm run seed     # Seeds default admin + sample data
npm run dev      # Starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev      # Starts on http://localhost:5173
```

---

## 🔐 Admin Access

- **URL:** `http://localhost:5173/admin/login`
- **Username:** `Admin`
- **Password:** `admin123`

> ⚠️ Change the password after first login from the Dashboard.

---

## 🌟 Features

### Public Site
- **Glassmorphic Header** with backdrop-blur navigation
- **Dynamic Home Page** — shows active event registration banner if event is active
- **About Page** — dynamically editable from admin
- **Events Page** — list all events, active event shows registration form
- **Gallery** — masonry grid with lightbox, filter by photo/video
- **Blogs** — published blog posts
- **Dynamic Footer** — fetched from MongoDB

### Admin Panel (`/admin`)
- **Dashboard** — stats overview, change password
- **Event Management** — create events with JSON-based dynamic form builder
- **Registrations** — view participants, download CSV
- **Gallery Upload** — upload photos/videos (file or URL)
- **Blog Editor** — create/edit/publish blog posts
- **About Us Editor** — edit hero, story, stats, team members
- **Footer Config** — edit all footer fields

---

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `MONGO_URI` = your MongoDB connection string
   - `JWT_SECRET` = your secret key
4. Deploy!

---

## 📄 API Endpoints

| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| PUT | `/api/auth/change-password` | Private |
| GET | `/api/events` | Public |
| GET | `/api/events/active` | Public |
| POST | `/api/events` | Private |
| PUT | `/api/events/:id` | Private |
| DELETE | `/api/events/:id` | Private |
| POST | `/api/events/:id/register` | Public |
| GET | `/api/events/:id/registrations` | Private |
| GET | `/api/events/:id/registrations/csv` | Private |
| GET | `/api/events/:id/participants` | Public |
| GET | `/api/gallery` | Public |
| POST | `/api/gallery` | Private |
| DELETE | `/api/gallery/:id` | Private |
| GET | `/api/blogs` | Public |
| POST | `/api/blogs` | Private |
| GET | `/api/footer` | Public |
| PUT | `/api/footer` | Private |
| GET | `/api/about` | Public |
| PUT | `/api/about` | Private |

---

*Made with ❤️ by the SSC Batch-2019 team*
