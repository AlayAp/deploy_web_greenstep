# 🌱 GreenSteps Web App

## Team: CodeAlchemy  
**Course:** Web Programming & Framework 2 (ITE-5425-0NB)  
**Institution:** Humber College  
**Semester:** Summer 2025

---

## 🚀 Project Description

**GreenSteps** is a modern eco-action tracking web application built using **Next.js**, **TypeScript**, and **Tailwind CSS**, designed to promote sustainable living within Canada. It empowers users to log eco-friendly activities, take part in green challenges, and visualize their carbon footprint reduction over time.

This responsive and interactive application simulates a full-stack experience with a front-end focus using local JSON and mock APIs. Each module was developed independently by team members to ensure modular and collaborative design.

---

## 🔗 Live Deployment

🌐 Deployed on Vercel: [https://greensteps.vercel.app](https://greensteps.vercel.app)  
📁 GitHub Repository: [Project CodeAlchemy](https://github.com/2025-Summer-ITE-5425-ONB/project-phases-codealchemy.git)

---

## 🧪 Features Overview

| Developer          | Module / Route         | Key Features                                                                                   |
|--------------------|-----------------------|------------------------------------------------------------------------------------------------|
| **Mit Patel**      | `/activity-logger`     | Dropdowns and sliders for daily eco-actions, real-time CO₂ calculation, localStorage/context API for log saving |
| **Sheryaben Italia** | `/challenge-feed`      | Dynamic challenge cards from JSON, join/complete buttons, filtering and sorting                |
| **Alay Patel** (Team Lead) | `/dashboard`            | CO₂ savings graph using Chart.js, weekly streak logic, earned badge display                    |
| **Om Patel**       | `/info-tips`, `/settings` | Regional eco tips, optional dark mode toggle, mock profile and notification settings            |

---

## 📦 Tech Stack

- **Framework:** Next.js (v15+)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Chart.js via `react-chartjs-2`
- **Authentication:** `next-auth`
- **Theme:** `next-themes` (for dark mode toggle)
- **Icons:** `react-icons`
- **UI Library:** `@nextui-org/react` (deprecated; consider migrating to `@heroui/*`)
- **State & Storage:** React Context API, localStorage
- **Database:** MongoDB (for future backend integration)

---

## ⚙️ Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/2025-Summer-ITE-5425-ONB/project-phases-codealchemy.git
   cd project-phases-codealchemy


2. **Create a .env.local file in the root directory and add:**
MONGODB_URI=mongodb+srv://root:root@ite5315-om.lwf6c.mongodb.net/?retryWrites=true&w=majority&appName=ITE5315-OM
NEXTAUTH_SECRET=your_generated_secret_key

Run the development server:

3, **For run**
npm run dev
