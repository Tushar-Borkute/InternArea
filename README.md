# InternArea 🚀

A full-stack internship and job portal platform — built for students to discover opportunities, apply, build resumes, and connect through a public community space. Admins can manage listings and review applications through a dedicated dashboard.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Admin Credentials](#admin-credentials)
- [Subscription Plans](#subscription-plans)
- [Security Rules](#security-rules)
- [API Overview](#api-overview)

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| React Router DOM v7 | Client-side routing |
| Firebase | Google OAuth authentication |
| Axios | HTTP client |
| React Toastify | Notifications |
| Swiper | Carousel / slider |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Nodemailer | OTP & invoice emails |
| Bcryptjs | Password hashing |
| Razorpay | Payment gateway |
| Nodemon | Dev auto-restart |

---

## ✨ Features

- 🔍 **Browse Jobs & Internships** — filter by role, location, and type
- 📄 **Apply to Listings** — track application status per job/internship
- 🧾 **Resume Builder** — create and download a formatted resume
- 🌐 **Public Space** — community posts, friendship system, social feed
- 👤 **User Profile** — login history, subscription info, applied listings
- 🔐 **Google OAuth Login** — via Firebase with OTP verification on Chrome
- 💳 **Subscription Plans** — Free / Bronze / Silver / Gold tiers with application limits
- 🌍 **Multilingual** — Language selector with OTP-gated French mode
- 🛡️ **Admin Panel** — post & manage jobs, internships, and view applications

---

## 📁 Project Structure

```
InternArea/
├── backend/
│   ├── Routes/
│   │   ├── admin.js          # Admin login
│   │   ├── auth.js           # OTP & login history
│   │   ├── job.js            # Job CRUD
│   │   ├── internship.js     # Internship CRUD
│   │   ├── application.js    # Applications
│   │   ├── resume.js         # Resume builder
│   │   ├── publicSpace.js    # Community posts & friends
│   │   └── subscription.js   # Subscription plans & payments
│   ├── model/                # Mongoose schemas
│   ├── utils/                # Mailer helpers
│   ├── db.js                 # MongoDB connection
│   ├── index.js              # Express entry point (port 5000)
│   └── .env                  # Environment variables (not committed)
│
└── frontend/
    └── src/
        ├── Pages/
        │   ├── Home/             # Landing page
        │   ├── Jobs/             # Job listings
        │   ├── Internship/       # Internship listings
        │   ├── JobDetail/        # Single job view
        │   ├── InternshipDetail/ # Single internship view
        │   ├── Applications/     # My applications
        │   ├── Profile/          # User profile & login history
        │   ├── ResumeBuilder/    # Resume builder tool
        │   ├── PublicSpace/      # Community feed
        │   ├── ResetPassword/    # Password reset
        │   ├── Admin/            # Admin login page
        │   └── AdminPanel/       # Admin dashboard
        ├── components/           # Shared UI components
        ├── context/              # Auth & Language context providers
        ├── api/                  # Axios API call helpers
        ├── firebase/             # Firebase config
        └── locales/              # i18n translation files
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- A MongoDB Atlas cluster (or local MongoDB)

### 1. Clone the repository
```bash
git clone <repo-url>
cd InternArea
```

### 2. Setup the Backend
```bash
cd backend
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables) below):
```bash
cp .env.example .env
# then edit .env with your values
```

Start the backend server:
```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Setup the Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 🔐 Environment Variables

Create a `backend/.env` file with the following variables:

```env
# MongoDB connection string
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appName>

# Email credentials (for OTP and invoice emails via Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Razorpay keys (for subscription payments)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

> **Note:** Never commit the `.env` file. It is listed in `.gitignore`.

---

## 🔑 Admin Credentials

Navigate to `/Admin` to access the admin login page.

| Field    | Value    |
|----------|----------|
| Username | `Tushar` |
| Password | `Tushar` |

> 💡 **Tip:** On the Admin login page, click the amber **"Demo Credentials"** box to auto-fill these values instantly.

After logging in, you will be redirected to the **Admin Panel** (`/adminPanel`) where you can:
- Post new jobs and internships
- View and manage all applications

---

## 💳 Subscription Plans

Application limits are enforced per user based on their active plan.

| Plan   | Price (INR) | Max Applications |
|--------|-------------|-----------------|
| Free   | ₹0          | 1               |
| Bronze | ₹100        | 3               |
| Silver | ₹300        | 5               |
| Gold   | ₹1,000      | Unlimited        |

> **Payment Window:** Subscription payments are only accepted **between 10:00 AM – 11:00 AM IST**.

---

## 🛡️ Security Rules

The platform enforces the following environment-based login security rules:

| Rule | Details |
|------|---------|
| **Mobile Login Time Window** | Mobile device logins are only permitted between **10:00 AM – 1:00 PM**. Attempts outside this window are blocked and logged. |
| **Chrome OTP Verification** | Logging in via **Google Chrome** triggers an OTP sent to the registered email. The login is completed only after OTP verification. |
| **Login History** | All login attempts (success, blocked, OTP pending, OTP failed) are recorded and accessible from the user's Profile page. |

---

## 📡 API Overview

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/admin/adminlogin` | Admin authentication |
| `GET`  | `/job` | List all jobs |
| `POST` | `/job` | Create a new job (admin) |
| `GET`  | `/internship` | List all internships |
| `POST` | `/internship` | Create a new internship (admin) |
| `POST` | `/application` | Submit an application |
| `GET`  | `/application` | View all applications (admin) |
| `GET`  | `/resume/:email` | Fetch user resume |
| `POST` | `/resume` | Save/update resume |
| `POST` | `/auth/record-login` | Record login attempt & enforce rules |
| `POST` | `/auth/verify-otp` | Verify Chrome OTP |
| `GET`  | `/auth/login-history/:email` | Fetch login history |
| `GET`  | `/subscription/:email` | Get user subscription |
| `POST` | `/subscription/create-order` | Initiate payment order |
| `POST` | `/subscription/process-payment` | Confirm payment & upgrade plan |
| `GET`  | `/public-space` | Fetch community posts |
| `POST` | `/public-space` | Create a post |

---

## 📄 License

This project was built as part of an internship assignment. All rights reserved.
