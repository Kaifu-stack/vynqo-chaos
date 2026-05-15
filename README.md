# 🔥 Vynqo Chaos

Vynqo Chaos is a realtime anonymous social debate platform where users can instantly join random rooms, chat, react with live emojis, and talk through voice chat.

Built using:

* React + Vite
* Socket.IO
* WebRTC
* Node.js + Express

---

# ✨ Features

## 🎲 Random Chaos Rooms

Users can instantly join random discussion rooms.

Examples:

* Instagram vs YouTube
* AI replacing jobs?
* Love or Career?
* Money vs Happiness?

---

## 🏠 Custom Room Creation

Users can:

* Create their own room
* Choose room timer
* Share room code with friends

---

## 🔑 Join via Room Code

Users can join private rooms using a unique room code.

---

## 💬 Realtime Chat

* Instant messaging
* Socket.IO powered
* Auto-scrolling chat
* Multi-user sync

---

## 🎤 Voice Chat (WebRTC)

* Realtime peer-to-peer voice chat
* Join/leave voice anytime
* Mute/unmute support
* Speaking detection

---

## 🎉 Live Emoji Reactions

Users can send animated emoji reactions across the screen.

Examples:
🔥 😂 💀 ❤️ 🚀 😎

---

## ⏳ Room Timers

Every room has a countdown timer.
When timer ends:

* Room automatically closes
* Users are disconnected

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* Socket.IO Client
* WebRTC
* CSS3

## Backend

* Node.js
* Express
* Socket.IO

---

# 📂 Project Structure

```bash
vynqo-chaos/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── socket/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── rooms/
│   │   ├── sockets/
│   │   ├── utils/
│   │   └── server.js
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/vynqo-chaos.git
```

---

## 2️⃣ Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3️⃣ Install Backend Dependencies

```bash
cd ../server
npm install
```

---

# ▶️ Running Locally

## Start Backend

```bash
cd server
npm run dev
```

OR

```bash
node src/server.js
```

---

## Start Frontend

```bash
cd client
npm run dev
```

---

# 🚀 Deployment

## Frontend Deployment (Vercel)

### Root Directory

```bash
client
```

### Build Command

```bash
npm run build
```

### Output Directory

```bash
dist
```

### Install Command

```bash
npm install
```

### Environment Variable

```env
VITE_BACKEND_URL=https://your-backend.onrender.com
```

---

## Backend Deployment (Render)

### Root Directory

```bash
server
```

### Build Command

```bash
npm install
```

### Start Command

```bash
node src/server.js
```

### Environment Variable

```env
PORT=10000
```

---

# 🔌 Socket Events

## Client → Server

| Event         | Description        |
| ------------- | ------------------ |
| joinRoom      | Join random room   |
| createRoom    | Create custom room |
| joinByCode    | Join room via code |
| sendMessage   | Send chat message  |
| sendEmoji     | Send live emoji    |
| leaveRoom     | Leave current room |
| offer         | WebRTC offer       |
| answer        | WebRTC answer      |
| ice-candidate | ICE exchange       |

---

## Server → Client

| Event          | Description       |
| -------------- | ----------------- |
| roomData       | Room information  |
| updateUsers    | User list updates |
| receiveMessage | New chat message  |
| receiveEmoji   | Live emoji event  |
| timer          | Room timer update |
| roomEnded      | Room closed       |

---

# 🧠 Future Plans

* User authentication
* AI moderation
* Trending debate topics
* Public voice spaces
* Topic voting system
* User profiles
* Matchmaking algorithm
* AI-generated discussion prompts

---


# 📜 License

MIT License

---

# 👨‍💻 Developer

Created by Kaif Alam.

Vynqo Chaos is an experimental realtime social interaction platform focused on anonymous debates, voice communication, and internet culture.
