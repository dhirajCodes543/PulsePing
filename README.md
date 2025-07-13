# 🌐 PulsePing – API Uptime Monitoring Tool

PulsePing is a full-stack monitoring tool that helps you track the uptime of your websites or APIs.  
It pings your added URLs every few minutes and alerts you if any service goes down — so you never miss a beat.

> 🚀 Live Demo: [pulseping.netlify.app](https://pulseping.netlify.app)

---

## ✨ Features

- 🔐 **User Authentication** with Firebase (Email/Password or Google)
- 🌐 **Real-time Monitoring** of API/URL uptime
- 📊 **Analytics Dashboard** to track status and performance
- 🔔 **Email + Toast Alerts** when services go down
- 💾 **Persistent Storage** using Firebase Firestore
- 🎨 **Modern UI** – Responsive, dark-themed, animated with Framer Motion

---

## 🛠 Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Zustand (state management)
- Framer Motion (animations)

**Backend & Infra:**
- Firebase Auth + Firestore
- Netlify (CI/CD + Deployment)

---

## 🧪 How It Works

1. 🔑 User signs in with Firebase Auth.
2. ➕ User adds a URL they want to monitor.
3. ⏱️ PulsePing periodically pings that URL in the background.
4. 🧠 Status gets stored in Firestore and reflected on the dashboard.
5. 📢 If an endpoint goes down, a toast alert or email is triggered (optional).

---
-----------------------

🧑‍💻 Made with ❤️ by Dhiraj Barnwal  
🔗 GitHub: https://github.com/dhirajbarnwal  
🔗 LinkedIn: https://www.linkedin.com/in/dhirajbarnwal12
