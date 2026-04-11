# 🌍 Travoss – Premium Travel Agency Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js)](https://nodejs.org/)

**Travoss** is a sophisticated, full-stack travel management solution designed for modern travel agencies. It features a high-end startup aesthetic with glassmorphism, fluid animations, and a seamless booking experience.

---

## ✨ Key Features

- 💎 **Premium UI/UX**: Custom-designed hero section with multi-layer gradients and glassmorphism.
- 🚀 **Performance Optimized**: GPU-accelerated animations and responsive layouts for all devices.
- 🗺️ **Interactive Mapping**: Mapbox GL integration for route and destination visualization.
- 🔐 **Secure Authentication**: Separate secure portals for Users and Travel Agencies.
- 🚗 **Fleet Management**: Advanced tracking for Vehicles and Drivers.
- 🔔 **Real-time Notifications**: Keep users updated on booking status and platform activity.

## 🛠️ Tech Stack

**Frontend:**
- **Core**: React 18, React Router DOM
- **Styling**: Tailwind CSS (Custom Design System)
- **Icons**: Lucide React
- **Maps**: React Map GL / Mapbox GL

**Backend:**
- **Server**: Node.js & Express
- **Database**: MongoDB with Mongoose
- **Auth**: JWT & BcryptJS
- **Uploads**: Multer for media management

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.x or higher)
- MongoDB (Local or Atlas)

### 1. Installation
Clone the repository and install dependencies for both services:

```bash
git clone https://github.com/AnshShri9044/travoss-platform.git
cd travoss-platform
npm install
```

### 2. Run Locally
The platform uses `concurrently` to start both the Frontend and Backend with a single command from the root:

```bash
npm run dev
```
The Frontend will be available at `http://localhost:3000` and the Backend API at `http://localhost:5000`.

---

## 🎨 Design Philosophy
The UI follows a **modern premium startup aesthetic**, characterized by soft shadow systems, backdrop blurs, and staggered entry animations for an engaging user experience.

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.
