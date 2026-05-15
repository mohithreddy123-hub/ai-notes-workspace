# AI Notes Workspace

A production-ready, intelligence-driven note-taking platform that transforms standard text into actionable insights using Google Gemini AI.

---

## 🚀 Key Features

- **Intelligence-Driven Workflows**: 
    - **Smart Summaries**: Distill long notes into 2-4 key sentences.
    - **Action Item Extraction**: Automatically detect and list tasks from your writing.
    - **Title Suggestions**: AI-generated titles based on note context.
- **Productivity Analytics**: 
    - Full dashboard with **Recharts** visualizations.
    - Weekly activity heatmaps and note creation trends.
    - AI usage tracking (tokens, latency, and request counts).
- **Advanced Note Management**:
    - Real-time **Auto-save** (debounced).
    - Multi-tagging system with custom color coding.
    - Pinning and Archiving for deep organization.
- **Modern SaaS Experience**:
    - Ultra-responsive UI built with **Tailwind CSS**.
    - **Dark Mode** native support.
    - Secure JWT authentication with token refreshing.

---

## 🛠️ Technology Stack & Installations

### Backend (Django REST Framework)
- **Framework**: Django 5.0.6
- **API**: Django REST Framework (DRF)
- **AI Integration**: Google Generative AI SDK (`google-generativeai`)
- **Database**: SQLite (Development), PostgreSQL ready via `dj-database-url`
- **Auth**: SimpleJWT (JSON Web Tokens)
- **CORS**: `django-cors-headers`

**Setup Commands:**
```powershell
# Create environment
python -m venv venv
venv\Scripts\activate

# Install Core Requirements
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt python-dotenv google-generativeai dj-database-url whitenoise

# Initialize Apps
python manage.py startapp authentication
python manage.py startapp notes
python manage.py startapp ai_features
python manage.py startapp analytics
python manage.py startapp shared_notes
```

### Frontend (React + Vite)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack React Query (v5)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

**Setup Commands:**
```powershell
# Initialize Project
npm create vite@latest frontend -- --template react

# Install Core Dependencies
npm install axios react-router-dom @tanstack/react-query lucide-react recharts date-fns react-hot-toast

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 📂 Project Structure (Exhaustive)

### 🖥️ Frontend Architecture
```text
frontend/
├── src/
│   ├── components/
│   │   ├── notes/
│   │   │   ├── NoteCard.jsx            # Component for note previews in the grid
│   │   │   ├── NoteEditor.jsx          # Full-screen editor with AI Action toolbar
│   │   │   ├── TagManager.jsx          # Global tag management interface
│   │   │   └── TagSelector.jsx         # Inline tag picker with search
│   │   ├── ui/
│   │   │   ├── Button.jsx              # Custom styled button system
│   │   │   ├── Card.jsx                # Layout cards for statistics
│   │   │   ├── Feedback.jsx            # Skeleton loaders and error states
│   │   │   ├── Input.jsx               # Controlled form inputs
│   │   │   └── Modal.jsx               # Universal modal portal system
│   │   ├── Sidebar.jsx              # Main navigation sidebar
│   │   └── ErrorBoundary.jsx           # React Error Boundary for crash protection
│   ├── context/
│   │   └── AuthContext.jsx             # User session and preference management
│   ├── hooks/
│   │   ├── useAI.js                    # AI mutation hooks (Summary/Actions/Title)
│   │   ├── useAnalytics.js             # Data hooks for dashboard stats
│   │   ├── useAutoSave.js              # Custom hook for debounced persistence
│   │   └── useNotes.js                 # Unified hooks for Note/Tag CRUD
│   ├── layouts/
│   │   └── AppLayout.jsx               # Shell layout with Sidebar and Main content
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx               # User authentication entry
│   │   │   └── Signup.jsx              # New user registration
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx           # Main Analytics & Productivity page
│   │   ├── notes/
│   │   │   └── NotesList.jsx           # Workspace hub (Grid/List of notes)
│   │   └── NotFound.jsx                # Custom 404 handler
│   ├── routes/
│   │   ├── AppRoutes.jsx               # Route definition and navigation tree
│   │   └── RouteWrappers.jsx           # ProtectedRoute & PublicRoute logic
│   ├── services/
│   │   ├── aiService.js                # AI backend API interaction
│   │   ├── analyticsService.js         # Statistics API interaction
│   │   ├── api.js                      # Axios interceptor (Auth headers/Base URL)
│   │   ├── notesService.js             # Core Notes/Tags API interaction
│   │   └── authService.js              # Login/Signup API interaction
│   ├── utils/
│   │   └── constants.js                # App-wide API and URL constants
│   ├── App.jsx                         # Main Component (Theme/Query Provider)
│   ├── main.jsx                        # React DOM Entry
│   └── index.css                       # Global Tailwind & Font styling
├── eslint.config.js                    # Linting configuration
├── index.html                          # Entry HTML file
├── package.json                        # Dependencies and scripts
├── postcss.config.js                   # CSS transformation config
├── tailwind.config.js                  # Design tokens and theme config
└── vite.config.js                      # Build and Proxy settings
```

### ⚙️ Backend Architecture
```text
backend/
├── ai_features/                        # AI Orchestration Module
│   ├── migrations/                     # Database version history
│   │   ├── 0001_initial.py
│   │   ├── 0002_initial.py
│   │   └── __init__.py
│   ├── __init__.py
│   ├── apps.py                         # App configuration
│   ├── models.py                       # AIUsageLog (token tracking, latency)
│   ├── providers.py                    # Multi-provider client (Gemini/OpenAI)
│   ├── serializers.py                  # AI usage history serialization
│   ├── urls.py                         # AI action routing
│   └── views.py                        # Summary/Action/Title logic
├── analytics/                          # Business Intelligence Module
│   ├── __init__.py
│   ├── apps.py
│   ├── urls.py                         # Stats routing
│   └── views.py                        # Dashboard aggregation logic
├── authentication/                     # Identity Management
│   ├── migrations/                     # Database version history
│   │   ├── 0001_initial.py
│   │   └── __init__.py
│   ├── __init__.py
│   ├── admin.py                        # Admin interface config
│   ├── apps.py
│   ├── models.py                       # Custom User (Preferences, Avatar, Bio)
│   ├── serializers.py                  # Auth/Profile serialization
│   ├── urls.py                         # JWT & Profile routing
│   └── views.py                        # Login/Signup/Preference logic
├── notes/                              # Core Content Engine
│   ├── migrations/                     # Database version history
│   │   ├── 0001_initial.py
│   │   └── __init__.py
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── filters.py                      # Advanced filtering (Status, Tags, Search)
│   ├── models.py                       # Note and Tag database schemas
│   ├── serializers.py                  # Nested Note/Tag serialization
│   ├── urls.py                         # Workspace routing
│   └── views.py                        # CRUD & Search logic
├── shared_notes/                       # Collaboration Engine
│   ├── __init__.py
│   ├── apps.py
│   ├── urls.py                         # Public sharing routing
│   └── views.py                        # Anonymous access logic
├── core/                               # Main Project Config
│   ├── __init__.py
│   ├── settings.py                     # Security, Auth, and AI settings
│   ├── urls.py                         # Root API routing table
│   ├── wsgi.py                         # Sync server gateway
│   └── asgi.py                         # Async server gateway
├── .env                                # Private Configuration (Private)
├── db.sqlite3                          # Local database file
├── manage.py                           # Django CLI management
├── requirements.txt                    # Project dependencies
└── PHASE_1_SUMMARY.txt                 # Archival phase summary
```

---

## ⚡ Setup & Installation

### 1. Backend
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend
```powershell
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Configuration
Create a `.env` in the `/backend` folder:
```env
DEBUG=True
SECRET_KEY=your_django_key
DATABASE_URL=sqlite:///db.sqlite3
AI_PROVIDER=gemini
GEMINI_API_KEY=your_google_ai_key
```

---

## 📊 Roadmap
- [x] Part 1: Core Notes Workspace
- [x] Part 2: Tagging & UI System
- [x] Part 3: AI Intelligence & Dashboard
- [ ] Part 4: Public Sharing & Deployment
