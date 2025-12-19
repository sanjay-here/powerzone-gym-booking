# 🏋️ POWERZONE : GYM BOOKER AND TRACKER

> A full-stack gym management system that enables members to book workout slots, track their fitness activity, and helps gyms prevent overcrowding through slot-based scheduling.

---

## 📌 Overview

**POWERZONE** is designed for modern gyms to efficiently manage member workouts.  
Members can book time-based workout slots and track their workout statistics, while admins maintain full control over user creation and system rules.

---

## 🚀 Features

### 👤 Member Capabilities
- Secure authentication using **Supabase Auth**
- Book available workout slots
- Prevent duplicate slot bookings
- View booking history with unique booking codes
- Track workout statistics:
  - Total workout sessions
  - Total workout hours
- Visual analytics for:
  - Last **30 days**
  - Last **365 days**
- Interactive charts:
  - 📊 Bar charts
  - 📈 Dot graphs

---

### 🛠️ Admin Capabilities
- Admin-only dashboard access
- Create new gym members
- Assign user roles (Admin / Member)
- Delete users with safeguards
- Manage slot capacity per session
- Prevent overcrowding using slot limits

---

## 🧠 Key Concepts
- Slot-based booking with fixed capacity
- Real-time availability updates
- Role-based access control (RBAC)
- Stateless JWT authentication
- Clean separation of concerns (Frontend / Backend / DB)

---

## 🧰 Tech Stack

### 🎨 Frontend
- **React.js**
- TypeScript
- Tailwind CSS
- Chart libraries (Bar & Dot graphs)
- Supabase JavaScript Client

### ⚙️ Backend
- **Java Spring Boot**
- Spring Security (JWT based)
- REST APIs
- JDBC for database access
- WebClient for Supabase Admin APIs

### 🗄️ Database & Authentication
- **Supabase**
  - PostgreSQL
  - Supabase Auth
  - Row Level Security (RLS)
  - Triggers & SQL functions

---


## 🔐 Authentication & Authorization

- Authentication handled by **Supabase**
- JWTs validated by Spring Boot
- User roles managed via `user_roles` table
- Admin-only actions enforced at backend level

---

## 📊 Workout Tracking Logic

- Each slot booking = one workout session
- Slot duration contributes to total workout hours
- Statistics aggregated for:
  - Last **30 days**
  - Last **365 days**
- Data visualized using charts for consistency tracking

---

## 🌍 Deployment

- **Frontend**: Vercel
- **Backend**: Render / Railway / Fly.io
- **Database & Auth**: Supabase

---

## 🎯 Why POWERZONE?

- Prevents gym overcrowding
- Encourages workout consistency
- Provides meaningful fitness insights
- Scalable architecture for real-world gyms

---

## 👨‍💻 Developer

**POWERZONE TEAM**

> Built as a real-world full-stack project focusing on clean architecture, security, and scalability.

---
