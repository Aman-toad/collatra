<h1 align="center">✨ Collatra ✨</h1>

<p align="center">
  A modern collaboration platform built with the <b>MERN Stack</b> — designed for teams to connect, create, and collaborate seamlessly.  
  <br/>
  <i>Manage workspaces, documents, tasks, and calendars — all in one place.</i>
</p>

---

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/API-Axios-5A29E4?style=for-the-badge&logo=axios" />
</p>

---

## 🚀 Overview

**Collatra** is a team collaboration web app inspired by tools like Notion, Trello, and Linear.  
It offers a unified workspace where users can:
- Create and manage team workspaces
- Organize boards and tasks visually
- Collaborate on shared docs
- Schedule events with an integrated calendar  

Everything built using the **MERN stack** and designed with **TailwindCSS** for a sleek, responsive UI.

---

## 🧱 Folder Structure
```
collatra/
│
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Login, Register, Home, Workspace, Docs, Calendar
│ │ ├── utils/ # Helper functions, Axios setup
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
│
├── server/ # Node.js + Express backend
│ ├── routes/ # API routes (auth, workspace, docs, etc.)
│ ├── models/ # MongoDB schemas
│ ├── controllers/ # Business logic
│ ├── config/ # Database connection
│ ├── server.js
│ └── package.json
│
└── README.md

```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, TailwindCSS, Axios |
| **Backend** | Node.js, Express |
| **Database** | MongoDB |
| **State Management** | React Hooks / Context |
| **Version Control** | Git + GitHub |

---

## ⚙️ Setup Instructions

1. **Clone the repo**
   ```bash

git clone https://github.com/yourusername/collatra.git
cd collatra

2. **Install Dependencies**
```
cd client && npm install
cd ../server && npm install
```

3. **Add Environment variables**
create a .env file inside server/
MONGO_URI=your_mongo_db_connection
PORT=5000
JWT_SECRET=your_secret

4. **Run both servers**
```
# in two terminals
cd client && npm run dev
cd server && npm start
```

🌟 Features

✅ User Authentication (Login & Register)
✅ Create & Manage Workspaces
✅ Task Boards (Kanban Style)
✅ Shared Docs Editor
✅ Integrated Calendar
✅ Theme toggle mode 

🔮 Future Enhancements

🚀 Real-time Collaboration using WebSockets / Socket.io
💬 Team Chat & Notifications
🧠 AI Assistant for summarizing workspace updates
📂 File Uploads & Sharing
📱 Mobile-Responsive PWA version