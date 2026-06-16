# 🧠 AI Notes Workspace

> A production-grade, intelligence-driven note-taking SaaS application built with Django REST Framework and React. Transform your notes into actionable insights with Google Gemini AI.

[![Django](https://img.shields.io/badge/Django-5.0.6-green?style=flat-square&logo=django)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini-purple?style=flat-square&logo=google)](https://aistudio.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Summarization** | Auto-generate 2-4 sentence summaries of any note using Gemini |
| ✅ **Action Item Extraction** | Detect and list concrete tasks from your writing |
| 💡 **AI Title Suggestion** | Get intelligent, context-aware title recommendations |
| 📊 **Analytics Dashboard** | Visualize your productivity with weekly activity charts |
| 🔗 **Public Sharing** | Share notes publicly with a unique, secure URL |
| 🏷️ **Smart Tagging** | Organize with color-coded, searchable tags |
| 📌 **Pin & Archive** | Keep important notes front-and-center |
| 🌙 **Dark Mode** | Native dark/light mode with system preference detection |
| 🔒 **JWT Auth** | Secure, stateless authentication with token refresh |
| 💾 **Auto-Save** | Debounced auto-save on every keystroke |

---

## 🛠️ Technology Stack

### Backend
| Technology | Purpose |
|---|---|
| **Django 5.0.6** | Core web framework |
| **Django REST Framework** | REST API layer |
| **SimpleJWT** | JWT-based authentication |
| **Google Generative AI** | Gemini AI integration |
| **WhiteNoise** | Static file serving in production |
| **Gunicorn** | Production WSGI server |
| **SQLite / MySQL** | Dev / Production database |
| **dj-database-url** | Database URL parsing |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Vite** | Ultra-fast build tool |
| **Tailwind CSS** | Utility-first styling |
| **TanStack React Query** | Server state management and caching |
| **Axios** | HTTP client with interceptors |
| **Recharts** | Analytics dashboard charts |
| **Lucide React** | Icon system |
| **React Hot Toast** | Notification system |
| **date-fns** | Date formatting |

---

## 🏛️ Architecture Overview

```
[Browser] ──HTTPS──► [Netlify CDN] ──► [React SPA]
                                              │
                                         [Axios + JWT]
                                              │
                                         [Render/Railway]
                                              │
                                       [Django + DRF]
                                              │
                              ┌───────────────┴──────────────┐
                         [MySQL]                    [Gemini AI API]
                         (Production DB)            (AI Operations)
```

---

## 📂 Project Structure

### 🖥️ Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── components/
│   │   ├── notes/
│   │   │   ├── NoteCard.jsx            # Note preview card (grid/list view)
│   │   │   ├── NoteEditor.jsx          # Full editor with AI toolbar & share
│   │   │   ├── TagManager.jsx          # Tag creation and management UI
│   │   │   └── TagSelector.jsx         # Inline tag picker with search
│   │   ├── ui/
│   │   │   ├── Button.jsx              # Reusable styled button system
│   │   │   ├── Card.jsx                # Layout cards for stats/dashboard
│   │   │   ├── Feedback.jsx            # Skeletons and error states
│   │   │   ├── Input.jsx               # Controlled form inputs
│   │   │   └── Modal.jsx               # Portal-based modal system
│   │   ├── ErrorBoundary.jsx           # React crash protection
│   │   └── Sidebar.jsx                 # Main navigation sidebar
│   ├── context/
│   │   └── AuthContext.jsx             # Global auth + theme state
│   ├── hooks/
│   │   ├── useAI.js                    # AI mutation hooks (Summary/Actions/Title)
│   │   ├── useAnalytics.js             # Dashboard statistics fetching
│   │   ├── useAutoSave.js              # Debounced auto-save logic
│   │   ├── useNotes.js                 # CRUD hooks for notes and tags
│   │   └── useShare.js                 # Share/Unshare and public note hooks
│   ├── layouts/
│   │   └── AppLayout.jsx               # Shell with sidebar and outlet
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx               # Sign-in page
│   │   │   └── Signup.jsx              # Registration page
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx           # Analytics + productivity charts
│   │   ├── notes/
│   │   │   └── NotesList.jsx           # Main workspace (note grid)
│   │   ├── settings/
│   │   │   └── SettingsPage.jsx        # User profile, preferences, and security settings
│   │   ├── shared/
│   │   │   └── SharedNotePage.jsx      # Public read-only note view
│   │   └── NotFound.jsx                # 404 handler
│   ├── routes/
│   │   ├── AppRoutes.jsx               # Lazy-loaded route definitions
│   │   └── RouteWrappers.jsx           # ProtectedRoute & PublicRoute
│   ├── services/
│   │   ├── aiService.js                # AI endpoint communication
│   │   ├── analyticsService.js         # Analytics API calls
│   │   ├── api.js                      # Axios + JWT interceptor base
│   │   ├── authService.js              # Auth API calls
│   │   ├── notesService.js             # Notes/Tags API calls
│   │   └── shareService.js             # Share/Unshare API calls
│   ├── utils/
│   │   └── constants.js                # API routes and app constants
│   ├── App.jsx                         # Root with providers
│   ├── main.jsx                        # React DOM entry
│   └── index.css                       # Global Tailwind + custom styles
├── .env.example                        # Environment variable template
├── index.html                          # SPA HTML entry
├── package.json                        # Dependencies and scripts
├── tailwind.config.js                  # Design system tokens
└── vite.config.js                      # Build and proxy configuration
```

### ⚙️ Backend (`/backend`)
```
backend/
├── ai_features/                        # AI Intelligence Module
│   ├── migrations/
│   ├── models.py                       # AIUsageLog (token tracking, latency)
│   ├── providers.py                    # Multi-provider client (Gemini/OpenAI)
│   ├── serializers.py                  # AI usage history serialization
│   ├── urls.py                         # AI action endpoint routing
│   └── views.py                        # Summary / Actions / Title handlers
├── analytics/                          # Business Intelligence Module
│   ├── urls.py                         # Statistics endpoint routing
│   └── views.py                        # Dashboard data aggregation
├── authentication/                     # Identity & Access Module
│   ├── migrations/
│   ├── models.py                       # Custom User (preferences, avatar, bio)
│   ├── serializers.py                  # Auth / profile serialization
│   ├── tests.py                        # Signup, login, auth tests
│   ├── urls.py                         # JWT & profile routing
│   └── views.py                        # Signup / Login / Profile handlers
├── notes/                              # Core Content Engine
│   ├── migrations/
│   ├── filters.py                      # Advanced filter backends
│   ├── models.py                       # Note and Tag schemas
│   ├── serializers.py                  # Nested Note/Tag serializers
│   ├── tests.py                        # Full notes API test suite
│   ├── urls.py                         # Notes workspace routing
│   └── views.py                        # CRUD + Pin/Archive/Share handlers
├── shared_notes/                       # Public Sharing Module
│   ├── migrations/
│   ├── models.py                       # SharedNoteAccess log
│   ├── urls.py                         # Public sharing routing
│   └── views.py                        # Anonymous read-only access + logging
├── core/                               # Project Configuration
│   ├── settings.py                     # All environment-aware settings
│   ├── urls.py                         # Root API URL table
│   ├── wsgi.py                         # Gunicorn/WSGI entry
│   └── asgi.py                         # ASGI entry
├── .env                                # Your local secrets (gitignored)
├── .env.example                        # Template — safe to commit
├── Procfile                            # Render/Railway deployment command
├── manage.py                           # Django management CLI
└── requirements.txt                    # All Python dependencies
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 18+
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Backend Setup
```powershell
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv ../venv
..\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# ← Edit .env and add your GEMINI_API_KEY

# Initialize database
python manage.py migrate

# Run development server
python manage.py runserver
# ✅ Backend running at http://localhost:8000
```

### 2. Frontend Setup
```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# ✅ Frontend running at http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
SECRET_KEY=your-strong-random-secret-key
DEBUG=True

# Database (SQLite for local, MySQL for production)
DATABASE_URL=sqlite:///db.sqlite3

# AI Provider (gemini is free!)
AI_PROVIDER=gemini
GEMINI_API_KEY=your-google-ai-studio-key

# CORS & Hosts
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup/` | Register new user |
| POST | `/api/auth/login/` | Login + get JWT tokens |
| POST | `/api/auth/logout/` | Blacklist refresh token |
| GET/PATCH | `/api/auth/profile/` | View/update user profile |
| POST | `/api/auth/token/refresh/` | Refresh access token |

### Notes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes/notes/` | List all notes (with search/filter) |
| POST | `/api/notes/notes/` | Create a new note |
| GET | `/api/notes/notes/:id/` | Get single note |
| PATCH | `/api/notes/notes/:id/` | Update note |
| DELETE | `/api/notes/notes/:id/` | Delete note |
| POST | `/api/notes/notes/:id/pin/` | Toggle pin |
| POST | `/api/notes/notes/:id/archive/` | Archive note |
| POST | `/api/notes/notes/:id/share/` | Generate public link |
| POST | `/api/notes/notes/:id/unshare/` | Revoke public link |

### AI Features
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/notes/:id/generate-summary/` | Generate AI summary |
| POST | `/api/ai/notes/:id/extract-actions/` | Extract action items |
| POST | `/api/ai/notes/:id/suggest-title/` | Suggest a title |
| GET | `/api/ai/history/` | View AI usage log |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/dashboard/` | Get 7-day productivity stats |

### Public Sharing
| Method | Endpoint | Auth Required |
|---|---|---|
| GET | `/api/shared/:share_id/` | ❌ No |

---

## 🚀 Deployment

### Frontend → Netlify

1. Connect your GitHub repo to Netlify.
2. Set **Build command**: `npm run build`
3. Set **Publish directory**: `dist`
4. Set **Base directory**: `frontend`
5. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
6. The `netlify.toml` file handles SPA routing automatically.

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repo.
3. Set **Build Command**: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
4. Set **Start Command**: `gunicorn core.wsgi --log-file -`
5. Set **Root Directory**: `backend`
6. Add all environment variables from `.env.example` (with production values).

---

## 🧪 Testing

### Run backend tests
```powershell
cd backend
..\venv\Scripts\activate
python manage.py test authentication notes --verbosity=2
```

**12 tests covering:**
- ✅ User registration and validation
- ✅ Login and JWT token issuance
- ✅ Notes CRUD operations
- ✅ Public note sharing workflow
- ✅ Pin and archive actions
- ✅ Unauthenticated access protection

---

## 📊 Roadmap

- [x] **Part 1** — Core Notes Workspace & JWT Authentication
- [x] **Part 2** — Tagging System & UI Design System
- [x] **Part 3** — Gemini AI Integration & Analytics Dashboard
- [x] **Part 4** — Public Sharing, Deployment Preparation & Production Polish
- [ ] **Future** — Collaborative editing, mobile app, note templates

---

## 👤 Author

Built by **Mohith Reddy** as a full-stack SaaS engineering portfolio project.

---

## 📄 License

MIT License — free to use, modify, and distribute.
