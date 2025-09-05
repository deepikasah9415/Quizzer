# Quizzer 🎯

A clean, responsive Quiz App built with **React**.  
It fetches questions from the [Open Trivia DB](https://opentdb.com/) and provides scoring, results summary, difficulty levels, and persistent high scores.

---

## 🚀 Live Demo
- Main App: [Quizzer Live](https://quizzer10.netlify.app)  
- Direct Quiz Page: [Quizzer /quiz](https://quizzer10.netlify.app/quiz)  
- GitHub Repo: [Quizzer on GitHub](https://github.com/deepikasah9415/Quizzer)  

---

## ✨ Features
- Responsive UI/UX (desktop + mobile)
- Fetches 5–10 questions from **Open Trivia DB API**
- One question at a time with **4 options**
- Required selection before moving to the next
- **30s timer** per question with auto-lock
- Score tracking + results summary
- Persistent **high scores** via localStorage
- Difficulty selector (Any / Easy / Medium / Hard)
- Light/Dark theme toggle 🌗
- Accessible (keyboard navigation, ARIA labels)
- Routing with React Router (`/quiz`, `/results`)
- Error handling, loading states, and retry toast

---

## 🛠️ Tech Stack
- **React** (functional components + hooks)
- **React Router DOM**
- **Tailwind CSS** for styling
- **LocalStorage** for persistence
- **Netlify** for deployment

---

## 📂 Project Structure
```
quizzer/
│── public/
│    └── _redirects     # Netlify routing fix
│── src/
│    ├── components/    # Navbar, QuestionCard, Timer, etc.
│    ├── pages/         # QuizPage, ResultsPage
│    ├── App.jsx
│    ├── index.js
│── package.json
```

---

## 🚦 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/deepikasah9415/Quizzer.git
cd Quizzer
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Run Development Server
```bash
npm start
```
App runs on [http://localhost:3000](http://localhost:3000)

### 4️⃣ Build for Production
```bash
npm run build
```

---

## 🧑‍💻 Author
- **Deepika Sah**  
  - [GitHub](https://github.com/deepikasah9415)  
  - [Live Project](https://quizzer10.netlify.app)

---

