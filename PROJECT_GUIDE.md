# 🧠 PrepAI — AI-Powered Interview Prep App

## What is this project?

Think of it like this: You want to practice for a job interview, but you don't have anyone to ask you questions and give you honest feedback. This app solves that problem.

**PrepAI** is a full-stack web application where:
- You **sign up** and **log in** to your personal account
- You pick a **job role** (like "React Developer"), a **type** (Technical / Behavioral), and a **difficulty** (Easy / Medium / Hard)
- The app uses **AI (Grok / Gemini)** to generate real interview questions for you
- You **answer** each question one by one
- The AI **grades your answer**, tells you what you did wrong, and gives you a better answer
- At the end, you get an **overall score and feedback report**
- You can also get your **resume reviewed by AI**, chat with an **AI coach**, and practice **MCQ quizzes**

---

## Tech Stack (What tools are used to build this?)

| Layer | Technology | Why? |
|-------|-----------|------|
| **Frontend** (what user sees) | React 19 + Vite | Fast UI rendering, hot reload during development |
| **Styling** | Vanilla CSS with CSS variables | Custom dark theme, full control over design |
| **Icons** | Lucide React | Clean, modern icon library |
| **HTTP Client** | Axios | Makes API calls from frontend to backend |
| **Routing** | React Router DOM v7 | Navigate between pages without full page reload |
| **Backend** (server logic) | Node.js + Express.js | Handles API requests, business logic |
| **Database** | MongoDB + Mongoose | Stores users, interviews, scores |
| **Fallback DB** | Local JSON files | Works even if MongoDB is not available |
| **AI Brain** | xAI Grok API / Google Gemini API | Generates questions, evaluates answers |
| **Auth** | JWT (JSON Web Tokens) + bcrypt | Secure login system, password hashing |
| **Deployment** | Vercel + Render + Docker | Multiple deployment options ready |

---

## Project Folder Structure (The Big Picture)

Here is every folder and file in this project. I'll explain what each one does and **why it exists**.

```
interview-prep-app/                    ← Root of the entire project
│
│── package.json                       ← Root-level scripts to run both frontend & backend together
│── docker-compose.yml                 ← Docker config to run frontend + backend in containers
│── vercel.json                        ← Vercel deployment config (how to host this app online)
│── render.yaml                        ← Render.com deployment config (alternative hosting)
│── api/index.js                       ← Vercel serverless entry point (just imports backend)
│── scripts/test_api.js                ← Quick script to test if backend APIs work
│
├── backend/                           ← 🔧 THE SERVER (handles all logic behind the scenes)
│   │
│   ├── server.js                      ← 🚀 STARTING POINT of the backend
│   │                                     This file boots up Express, registers all
│   │                                     middleware, connects routes, and starts listening
│   │                                     on port 5000.
│   │
│   ├── config/
│   │   └── db.js                      ← 🔌 DATABASE CONNECTION
│   │                                     Connects to MongoDB. If MongoDB is down,
│   │                                     it automatically switches to local JSON files
│   │                                     so the app still works (fallback mode).
│   │
│   ├── middleware/
│   │   └── auth.js                    ← 🔒 SECURITY GUARD
│   │                                     Every time a user makes a request to a protected
│   │                                     route (like starting an interview), this file
│   │                                     checks: "Does this person have a valid JWT token?"
│   │                                     If yes → let them through
│   │                                     If no → block them with 401 error
│   │
│   ├── models/                        ← 📦 DATABASE BLUEPRINTS (Schemas)
│   │   │                                 These define the SHAPE of data stored in MongoDB.
│   │   │                                 Think of them like table definitions in SQL.
│   │   │
│   │   ├── User.js                    ← Defines what a "User" looks like in the database:
│   │   │                                 { name, email, password (hashed), createdAt }
│   │   │                                 Also has fallback logic to read/write from
│   │   │                                 data/users.json when MongoDB is unavailable.
│   │   │
│   │   └── Interview.js               ← Defines what an "Interview Session" looks like:
│   │                                     { userId, role, type, difficulty, status,
│   │                                       questions[ {questionText, userAnswer, feedback} ],
│   │                                       overallScore, overallFeedback }
│   │                                     Also has fallback to data/interviews.json.
│   │
│   ├── routes/                        ← 🛣️ API ENDPOINTS (URLs the frontend calls)
│   │   │                                 Each file here maps URLs to functions.
│   │   │
│   │   ├── auth.js                    ← Handles 3 endpoints:
│   │   │                                 POST /api/auth/register  → Create new account
│   │   │                                 POST /api/auth/login     → Login & get JWT token
│   │   │                                 GET  /api/auth/me        → Get current user's profile
│   │   │
│   │   └── interviews.js             ← Handles 8 endpoints:
│   │                                     POST /api/interviews           → Start a new interview
│   │                                     POST /api/interviews/:id/answer → Submit answer, get feedback + next question
│   │                                     GET  /api/interviews/history    → Get all past interviews
│   │                                     GET  /api/interviews/history/:id → Get one interview's details
│   │                                     DELETE /api/interviews/:id      → Delete an interview
│   │                                     POST /api/interviews/resume     → AI resume review
│   │                                     POST /api/interviews/coach-chat → Chat with AI coach
│   │                                     POST /api/interviews/mcq        → Start MCQ quiz
│   │                                     POST /api/interviews/:id/mcq-answer → Submit MCQ answer
│   │
│   ├── services/                      ← 🤖 AI SERVICE WRAPPERS
│   │   │                                 These files talk to external AI APIs.
│   │   │                                 The routes DON'T call AI directly — they call
│   │   │                                 these services instead. This keeps things clean.
│   │   │
│   │   ├── gemini.js                  ← Wrapper for Google Gemini API
│   │   └── grok.js                    ← Wrapper for xAI Grok API (currently active)
│   │                                     Contains functions like:
│   │                                     - generateQuestion()    → Makes AI create a question
│   │                                     - evaluateAnswer()      → Makes AI grade your answer
│   │                                     - generateOverallFeedback() → Final report card
│   │                                     - analyzeResume()       → AI reviews your resume
│   │                                     - chatWithCoach()       → AI coach conversation
│   │                                     - generateMcqQuestion() → MCQ with options
│   │
│   ├── data/                          ← 📁 FALLBACK DATABASE (JSON files)
│   │   ├── users.json                 ← Stores users when MongoDB is not connected
│   │   └── interviews.json            ← Stores interviews when MongoDB is not connected
│   │
│   └── .env                           ← 🔑 SECRET KEYS (never commit this to GitHub!)
│                                         Contains: MONGODB_URI, JWT_SECRET, GROK_API_KEY
│
├── frontend/                          ← 🎨 THE USER INTERFACE (what people see and click)
│   │
│   ├── index.html                     ← The single HTML page (React mounts into this)
│   ├── vite.config.js                 ← Vite build tool configuration
│   │
│   └── src/
│       │
│       ├── main.jsx                   ← 🚀 STARTING POINT of the frontend
│       │                                 Renders the <App /> component into index.html
│       │
│       ├── App.jsx                    ← 🧭 THE BRAIN OF THE FRONTEND
│       │                                 - Manages login/logout state
│       │                                 - Defines ALL page routes (which URL shows which page)
│       │                                 - Contains the Sidebar navigation layout
│       │                                 - Protects pages (redirects to login if not logged in)
│       │
│       ├── App.css                    ← Styles specific to App layout
│       ├── index.css                  ← Global styles, CSS variables, dark theme
│       │
│       ├── services/
│       │   └── api.js                 ← 📡 HTTP CLIENT SETUP
│       │                                 Creates an Axios instance with:
│       │                                 - Base URL pointing to backend
│       │                                 - Auto-attaches JWT token to every request
│       │                                 - Auto-attaches Grok API key if user set one
│       │
│       └── pages/                     ← 📄 ALL THE SCREENS/PAGES
│           │
│           ├── Login.jsx              ← Login form → calls POST /api/auth/login
│           ├── Signup.jsx             ← Registration form → calls POST /api/auth/register
│           ├── Dashboard.jsx          ← Home screen after login. Pick role, type, difficulty
│           │                             to start a mock interview or MCQ test.
│           ├── InterviewRoom.jsx      ← The live interview screen. Shows AI question,
│           │                             user types answer, submits, gets instant feedback,
│           │                             then gets next question. Repeats up to 20 questions.
│           ├── McqRoom.jsx            ← Multiple-choice quiz mode. 10 questions with
│           │                             4 options each. Instant right/wrong feedback.
│           ├── ResumeReview.jsx       ← Paste your resume text, AI analyzes it and gives
│           │                             suggestions on what to improve.
│           ├── CoachChat.jsx          ← Free-form chat with an AI interview coach.
│           │                             Ask it anything about interview preparation.
│           └── History.jsx            ← View all your past interviews with scores,
│                                         feedback, and detailed question-by-question review.
```

---

## How Does the App Actually Work? (Step-by-Step Flows)

### Flow 1: User Signs Up & Logs In

Imagine a new user opens the app for the first time:

```
STEP 1: User opens the app
         → React loads App.jsx
         → App.jsx checks: "Is there a JWT token in localStorage?"
         → No token found → Redirect user to /login page

STEP 2: User clicks "Sign Up" link → goes to Signup.jsx
         → Fills in: Name, Email, Password
         → Clicks "Sign Up" button

STEP 3: Frontend sends the data to the backend
         → Axios POST request to /api/auth/register
         → JWT token is auto-attached by api.js interceptor (none yet, that's fine)

STEP 4: Backend receives the request (routes/auth.js)
         → Checks if email already exists in database
         → If new: Hash the password using bcrypt (so we never store plain passwords)
         → Save the new user to MongoDB (or users.json fallback)
         → Create a JWT token containing the user's ID
         → Send back: { token: "xyz...", user: { id, name, email } }

STEP 5: Frontend receives the response (Signup.jsx)
         → Stores the JWT token in localStorage
         → Updates App.jsx state: user = { id, name, email }
         → React re-renders → user is now logged in → Redirect to /dashboard
```

### Flow 2: User Takes a Mock Interview (The Core Feature)

This is the heart of the app. Here's exactly what happens:

```
STEP 1: User is on Dashboard.jsx
         → Selects: Role = "React Developer"
         → Selects: Type = "Technical"
         → Selects: Difficulty = "Medium"
         → Clicks "Start Interview"

STEP 2: Frontend sends POST /api/interviews
         → Body: { role: "React Developer", type: "Technical", difficulty: "Medium" }
         → JWT token auto-attached by Axios interceptor

STEP 3: Backend receives request (routes/interviews.js)
         → middleware/auth.js runs FIRST → verifies JWT → extracts user ID
         → Route handler calls: GrokService.generateQuestion("React Developer", "Technical", "Medium")

STEP 4: AI Service (services/grok.js) talks to the Grok API
         → Sends a carefully crafted prompt like:
           "You are an expert interviewer. Generate a medium-difficulty technical
            question for a React Developer position..."
         → Grok API returns: "Explain the difference between useEffect and useLayoutEffect"

STEP 5: Backend saves the interview to database
         → Creates a new Interview document:
           { userId: "abc", role: "React Developer", status: "active",
             questions: [{ questionText: "Explain the difference...", userAnswer: "", feedback: null }] }
         → Returns the full interview object to frontend

STEP 6: Frontend navigates to InterviewRoom.jsx
         → Displays the first question: "Explain the difference between useEffect and useLayoutEffect"
         → User types their answer in a text area
         → Clicks "Submit Answer"

STEP 7: Frontend sends POST /api/interviews/:id/answer
         → Body: { answer: "useEffect runs after paint, useLayoutEffect runs before..." }

STEP 8: Backend evaluates the answer
         → Calls GrokService.evaluateAnswer() with the question + user's answer
         → AI returns: { score: 82, comments: "Good explanation but you missed...",
                          betterAnswer: "A complete answer would include..." }

STEP 9: Backend generates the NEXT question
         → Calls GrokService.generateQuestion() again, this time passing
           all previous questions so AI doesn't repeat itself
         → AI returns a new, different question

STEP 10: Backend updates the database
          → Saves the user's answer + AI feedback to the current question
          → Adds the new question to the questions array
          → Returns everything to frontend

STEP 11: Frontend shows the feedback for previous answer + displays next question
          → This loop repeats for up to 20 questions

STEP 12: After 20 questions (or when user finishes)
          → Backend calls GrokService.generateOverallFeedback()
          → AI reviews ALL 20 answers together and gives:
            { overallScore: 78, overallFeedback: "Strong on React basics, needs work on..." }
          → Interview status changes from "active" to "completed"
          → User sees their final report card
```

### Flow 3: Resume Review

```
STEP 1: User goes to ResumeReview.jsx
         → Pastes their resume text into a text area
         → Clicks "Analyze Resume"

STEP 2: Frontend sends POST /api/interviews/resume
         → Body: { resumeText: "John Doe, Software Engineer..." }

STEP 3: Backend calls GrokService.analyzeResume()
         → AI reads the resume and returns structured feedback:
           - Strengths, Weaknesses, Suggestions, Score

STEP 4: Frontend displays the AI's analysis beautifully
```

### Flow 4: AI Coach Chat

```
STEP 1: User goes to CoachChat.jsx
         → Types: "How do I answer 'Tell me about yourself'?"

STEP 2: Frontend sends POST /api/interviews/coach-chat
         → Body: { message: "How do I answer...", chatHistory: [...previous messages] }

STEP 3: Backend calls GrokService.chatWithCoach()
         → AI responds with coaching advice

STEP 4: Frontend adds the response to the chat UI
         → Looks like a messaging app conversation
```

---

## The Architecture Pattern (How the code is organized)

This project follows a layered architecture. Each layer has ONE job:

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│  User sees pages → clicks buttons → triggers API calls       │
│  Pages: Login, Signup, Dashboard, InterviewRoom, etc.        │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTP Requests (Axios + JWT)
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                   MIDDLEWARE LAYER                            │
│  auth.js → Checks "Is this user allowed to do this?"         │
│  If JWT is valid → let the request continue                  │
│  If JWT is invalid → block with 401 error                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    ROUTES LAYER                               │
│  auth.js → handles /register, /login, /me                    │
│  interviews.js → handles /interviews, /answer, /history      │
│  This layer RECEIVES requests, VALIDATES input,              │
│  and DELEGATES work to Models and Services                   │
└──────────┬──────────────────────────┬───────────────────────┘
           │                          │
           ▼                          ▼
┌────────────────────┐    ┌────────────────────────────────────┐
│   MODELS LAYER     │    │       SERVICES LAYER                │
│  User.js           │    │  grok.js / gemini.js                │
│  Interview.js      │    │  Talks to AI APIs                   │
│  Talks to MongoDB  │    │  Generates questions, grades answers│
│  or JSON fallback  │    │  Analyzes resumes, coaches users    │
└────────┬───────────┘    └──────────────┬─────────────────────┘
         │                               │
         ▼                               ▼
┌────────────────────┐    ┌────────────────────────────────────┐
│  MongoDB Database  │    │   External AI APIs                  │
│  (or JSON files)   │    │   (Grok API / Gemini API)           │
└────────────────────┘    └────────────────────────────────────┘
```

**Why this structure?**
- **Frontend** only cares about UI. It doesn't know how the database works.
- **Middleware** only cares about security. It doesn't know what the routes do.
- **Routes** only coordinate. They say "get me this data" and "call this AI function" — they don't implement the details.
- **Models** only handle database operations. They don't know about HTTP requests.
- **Services** only talk to AI APIs. They don't know about users or databases.

> This is called **Separation of Concerns**. Each part does ONE thing well. If you want to change the AI provider from Grok to ChatGPT, you only edit `services/grok.js`. Nothing else changes.

---

## The Smart Fallback System (Unique Feature)

One clever thing about this project: **it works even without MongoDB**.

Look at [db.js](file:///c:/Users/AYUSH%20TANDON/OneDrive/Desktop/interview-prep-app/backend/config/db.js):
- It tries to connect to MongoDB
- If connection fails → it sets `fallbackMode = true`
- Then in [User.js](file:///c:/Users/AYUSH%20TANDON/OneDrive/Desktop/interview-prep-app/backend/models/User.js) and [Interview.js](file:///c:/Users/AYUSH%20TANDON/OneDrive/Desktop/interview-prep-app/backend/models/Interview.js), every function checks: `if (isFallback())` → use JSON files instead of MongoDB

This means you can demo the app on any machine without installing MongoDB. The data just gets saved in `backend/data/users.json` and `backend/data/interviews.json`.

---

## How to Run This Project

```bash
# Step 1: Install dependencies for root, backend, and frontend
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Step 2: Set up environment variables
# Create backend/.env with:
#   MONGODB_URI=your_mongo_connection_string
#   JWT_SECRET=any_random_secret_string
#   GROK_API_KEY=your_grok_api_key

# Step 3: Run both frontend and backend together
npm run dev
# This starts backend on port 5000 and frontend on port 5173
```

---

## How Deployment Works

This project is configured for **3 different deployment options**:

| Platform | Config File | How it works |
|----------|-------------|--------------|
| **Vercel** | `vercel.json` + `api/index.js` | Frontend builds as static site. Backend runs as serverless function through `api/index.js` which just imports `server.js`. |
| **Render** | `render.yaml` | Backend deploys as a web service from the `backend/` folder. Frontend deployed separately. |
| **Docker** | `docker-compose.yml` + `Dockerfile`s | Both frontend and backend run in isolated containers. Frontend served via nginx on port 80. |

---

## Key API Endpoints (Quick Reference)

### Auth APIs (Public — no login needed)
| Method | URL | What it does |
|--------|-----|--------------|
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Login and receive JWT token |

### Auth APIs (Private — JWT required)
| Method | URL | What it does |
|--------|-----|--------------|
| GET | `/api/auth/me` | Get logged-in user's profile |

### Interview APIs (Private — JWT required)
| Method | URL | What it does |
|--------|-----|--------------|
| POST | `/api/interviews` | Start a new mock interview |
| POST | `/api/interviews/:id/answer` | Submit answer → get AI feedback + next question |
| GET | `/api/interviews/history` | Get all past interviews |
| GET | `/api/interviews/history/:id` | Get details of one interview |
| DELETE | `/api/interviews/:id` | Delete an interview |
| POST | `/api/interviews/resume` | AI resume analysis |
| POST | `/api/interviews/coach-chat` | Chat with AI coach |
| POST | `/api/interviews/mcq` | Start MCQ quiz |
| POST | `/api/interviews/:id/mcq-answer` | Submit MCQ answer |

---

## Frontend Pages & Routes

| Route Path | Page Component | What user sees |
|------------|---------------|----------------|
| `/login` | Login.jsx | Email + Password form |
| `/signup` | Signup.jsx | Name + Email + Password form |
| `/dashboard` | Dashboard.jsx | Home screen to configure and start interviews |
| `/interview` | InterviewRoom.jsx | Live Q&A interview with AI |
| `/mcq` | McqRoom.jsx | Multiple choice quiz with AI |
| `/resume` | ResumeReview.jsx | Paste resume → get AI feedback |
| `/coach` | CoachChat.jsx | Chat with AI interview coach |
| `/history` | History.jsx | View past interview scores and feedback |

> All routes except `/login` and `/signup` are **protected** — if you're not logged in, you get redirected to `/login` automatically. This is handled in [App.jsx](file:///c:/Users/AYUSH%20TANDON/OneDrive/Desktop/interview-prep-app/frontend/src/App.jsx) using conditional rendering.
