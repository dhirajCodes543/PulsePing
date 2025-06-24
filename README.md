# 🌐 Pulse Ping – API Uptime Monitoring Tool

Pulse Ping is a full-stack web application that monitors the uptime of your APIs or websites. It allows users to add URLs, automatically checks them every 5 minutes, and sends email alerts if any go down.

🚀 Live Demo: [pulseping.netlify.app](https://pulseping.netlify.app)  
📂 GitHub Repo: [github.com/dhirajCodes543/PulsePing](https://github.com/dhirajCodes543/PulsePing)

---

## ✨ Features

- 🔒 Firebase Authentication for user login/signup
- 🔗 Add, view, and delete URLs to monitor
- 🔄 Auto-checks URLs every 5 minutes using `node-cron`
- 📧 Email alert system powered by Brevo (when a URL goes down)
- 💾 Stores user URLs and status logs in MongoDB
- 🌐 Backend stays awake via internal pinging

---

## 🛠 Tech Stack

### 💻 Frontend
- React.js
- Tailwind CSS
- Zustand (state management)
- Firebase Authentication

### 🖥️ Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Firebase Admin SDK
- node-cron + p-limit (job scheduling)
- Brevo (formerly Sendinblue) for transactional email alerts
- Render (backend hosting)

### 🔧 Dev Tools
- Git & GitHub
- Netlify (frontend hosting)
