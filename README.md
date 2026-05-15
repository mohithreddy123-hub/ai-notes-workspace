# AI Notes Workspace

A modern, full-stack intelligence-driven note-taking platform. This application transforms standard notes into an intelligent productivity engine using Google Gemini AI and real-time analytics.

## 🚀 Features

- **Intelligent Workflows**: Generate summaries, extract action items, and suggest titles using AI.
- **Productivity Dashboard**: Visualize your note-taking habits with interactive charts and metrics.
- **Dynamic Tagging**: Organize notes with custom tags and color-coded categories.
- **Modern SaaS UI**: Beautiful, responsive interface with Dark Mode support.
- **Real-time Analytics**: Track AI usage, word counts, and weekly productivity trends.
- **Security First**: JWT-based authentication and secure environment configuration.

---

## 📂 Project Structure

### 🖥️ Frontend (React + Vite)
Located in `/frontend`, built with React, Tailwind CSS, and Recharts.

```text
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── notes/          # Note-specific components (Editor, Card, Tag Selector)
│   │   ├── ui/             # Core UI elements (Buttons, Cards, Modals)
│   │   └── Sidebar.jsx     # Navigation sidebar
│   ├── context/            # AuthContext for state management
│   ├── hooks/              # Custom React Query hooks (useNotes, useAI, useAnalytics)
│   ├── layouts/            # Page layouts (AppLayout)
│   ├── pages/              # Application pages
│   │   ├── auth/           # Login and Signup pages
│   │   ├── dashboard/      # Productivity Analytics Dashboard
│   │   └── notes/          # Notes listing and management
│   ├── services/           # API communication layers (Axios instances)
│   ├── routes/             # App routing and protection logic
│   └── utils/              # Constants and helper functions
├── tailwind.config.js      # Styling configuration
└── vite.config.js          # Build configuration
```

### ⚙️ Backend (Django REST Framework)
Located in `/backend`, a modular API architecture.

```text
backend/
├── ai_features/            # AI processing (Gemini integration, prompt engineering)
├── analytics/              # Aggregation logic for productivity metrics
├── authentication/         # Custom User model and JWT auth logic
├── core/                   # Project settings and root URL routing
├── notes/                  # Core Note and Tag CRUD operations
├── shared_notes/           # Logic for public note sharing (Phase 4)
├── manage.py               # Django CLI
└── .env                    # Environment variables (Private)
```

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Recharts, Lucide React, React Query.
- **Backend**: Python, Django, Django REST Framework, SQLite (Dev).
- **AI**: Google Gemini AI (Generative Language API).
- **Authentication**: SimpleJWT (JSON Web Tokens).

---

## ⚡ Quick Start

### 1. Backend Setup
1. Navigate to `/backend`.
2. Create a virtual environment: `python -m venv venv`.
3. Activate it: `venv\Scripts\activate`.
4. Install dependencies: `pip install -r requirements.txt`.
5. Run migrations: `python manage.py migrate`.
6. Start server: `python manage.py runserver`.

### 2. Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Start dev server: `npm run dev`.

---

## 🔑 Environment Variables

Create a `.env` file in the `/backend` directory:
```env
DEBUG=True
SECRET_KEY=your-django-secret-key
GEMINI_API_KEY=your-google-ai-studio-key
AI_PROVIDER=gemini
```

---

## 📈 Roadmap
- [x] Phase 1: Core Notes CRUD & Authentication
- [x] Phase 2: Tagging System & UI Polish
- [x] Phase 3: AI Integration & Analytics Dashboard
- [ ] Phase 4: Public Sharing & Deployment (Next)
