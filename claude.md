# Bedtime Story Generator - Project Context

## Project Overview
A **cross-platform mobile application** that generates AI-powered bedtime stories for children ages 2-10 using the Groq API (Llama models). Users can customize story length, type, language, and tone. The app targets both Google Play Store and Apple App Store from a single codebase.

## Target Audience
Parents of children ages 2-10 who want personalized, engaging bedtime stories.

## Business Model
- **Launch:** Free app with full functionality
- **Future:** Subscription model (when usage justifies it)
- **Web:** Desirable but not essential (can be added later via Expo Web)

---

## Architecture Decision
**Decision Date:** January 2026 (Revised)**

We are building a **Cross-Platform Mobile App** using **React Native + Expo**, with a **Python/Flask backend** deployed to the cloud. This approach was chosen because:

- ✅ **One codebase** → Android + iOS deployment
- ✅ **Sustainable** for a solo founder (no duplicate maintenance)
- ✅ **Faster time to market** than native development
- ✅ **JavaScript-based** (leverages existing web development knowledge)
- ✅ **Expo simplifies** builds, testing, and store submission
- ✅ **Future web support** available via Expo Web

### What We're NOT Doing
- ❌ Native Android (Kotlin) — would require separate iOS app later
- ❌ Native iOS (Swift) — same problem in reverse
- ❌ Flutter — requires learning Dart, smaller ecosystem
- ❌ Ionic/WebView — inferior performance and user experience

---

## Tech Stack

### Mobile Frontend
| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | React Native | Cross-platform mobile UI |
| Toolchain | Expo (Managed Workflow) | Simplified builds, testing, deployment |
| Language | TypeScript | Type safety, better tooling |
| Navigation | React Navigation | Screen navigation |
| State | React Context + Hooks | Simple state management |
| HTTP Client | Fetch / Axios | API communication |

### Backend (API Server)
| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | Python 3.11 + Flask | REST API server |
| Hosting | Railway or Render | Cloud deployment (PaaS) |
| Database | SQLite → PostgreSQL | Data persistence (migrate later) |
| AI - Stories | Groq API (Llama 3.3 70B) | Story generation |
| AI - Translation | Google AI Studio (Gemini 2.0 Flash) | Multi-language support |

### Authentication
| Component | Technology | Purpose |
|-----------|------------|---------|
| Provider | Supabase Auth | User authentication service |
| Methods | Google Sign-In, Apple Sign-In, Email/Password | Frictionless login options |
| Tokens | JWT | Secure API authentication |

### Future (When Needed)
| Component | Technology | Purpose |
|-----------|------------|---------|
| Payments | RevenueCat | Subscription management |
| Database | Supabase PostgreSQL | Cloud database with sync |
| Analytics | Expo Analytics or Mixpanel | Usage tracking |

---

## Authentication Strategy

### User Experience Flow
```
┌─────────────────────────────────────────────────────────────┐
│                    APP DOWNLOAD                             │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              GUEST MODE (No Account Required)               │
│  • Generate stories ✓                                       │
│  • Read stories ✓                                           │
│  • Customize settings ✗ (prompts for account)               │
│  • Save stories ✗ (prompts for account)                     │
└─────────────────────┬───────────────────────────────────────┘
                      ▼ User wants to save a story
┌─────────────────────────────────────────────────────────────┐
│              FRICTIONLESS ACCOUNT CREATION                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [  Continue with Google  ]  ← One tap              │   │
│  │  [  Continue with Apple   ]  ← One tap (iOS)        │   │
│  │  ─────────── or ───────────                         │   │
│  │  [  Sign up with Email    ]  ← Fallback option      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              LOGGED IN USER                                 │
│  • All guest features ✓                                     │
│  • Save stories ✓                                           │
│  • Access saved stories across devices ✓                    │
│  • Sync settings ✓                                          │
└─────────────────────────────────────────────────────────────┘
```

### Why Supabase Auth?
1. **Social Login Built-in:** Google and Apple sign-in work out of the box
2. **Apple Requirement:** iOS apps with social login MUST offer "Sign in with Apple"
3. **Security:** Handles password hashing, token refresh, email verification correctly
4. **Free Tier:** Generous limits for early-stage apps
5. **React Native SDK:** Well-documented, actively maintained
6. **Future Database:** Can use Supabase PostgreSQL when ready to migrate from SQLite

---

## Project Structure

```
bedtime-story-generator/
├── mobile/                          # React Native + Expo app
│   ├── app/                         # App screens (Expo Router)
│   │   ├── (tabs)/                  # Tab navigation screens
│   │   │   ├── index.tsx            # Home / Story Generation
│   │   │   ├── my-stories.tsx       # Saved Stories
│   │   │   └── settings.tsx         # User Settings
│   │   ├── auth/                    # Authentication screens
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   └── _layout.tsx              # Root layout
│   ├── components/                  # Reusable UI components
│   │   ├── StoryCard.tsx
│   │   ├── StoryTypeSelector.tsx
│   │   └── ...
│   ├── services/                    # API and auth services
│   │   ├── api.ts                   # Flask API client
│   │   ├── auth.ts                  # Supabase auth wrapper
│   │   └── storage.ts               # Local storage utilities
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useStories.ts
│   ├── constants/                   # App constants
│   │   └── config.ts                # API URLs, etc.
│   ├── app.json                     # Expo configuration
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                         # Flask API server
│   ├── app.py                       # Main Flask app, imports routes
│   ├── config.py                    # Configuration settings
│   ├── db.py                        # Database setup and helpers
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py                  # Auth routes (verify Supabase tokens)
│   │   ├── stories.py               # Story generation and management
│   │   └── settings.py              # User settings
│   ├── services/
│   │   ├── llm_service.py           # Groq API integration
│   │   └── translation_service.py   # Google AI translation
│   ├── llm_config.py                # Prompts and LLM settings
│   ├── requirements.txt
│   ├── .env                         # Environment variables (not in git)
│   └── .env.example                 # Template for environment variables
│
├── web/                             # Legacy web frontend (reference only)
│   ├── templates/
│   │   └── index.html
│   └── static/
│       └── style.css
│
└── docs/                            # Documentation
    ├── API.md                       # API documentation
    └── DEPLOYMENT.md                # Deployment guide
```

---

## Key Features

### Story Generation
1. **Story Length:** 1-12 minutes reading time (~180 words/minute)
2. **Story Types:**
   - **Original:** AI generates based on user input and settings
   - **Classic:** Traditional tales from curated catalog (80+ stories)
   - **Classic Remix:** Classic tale combined with user's ideas
3. **Languages:** English, Spanish, French, Portuguese, German, Italian

### User Flow
1. **Step 1:** Choose story type (Original / Classic / Classic Remix)
2. **Step 2:** Customize (length, ideas input, classic tale selection)
3. **Step 3:** Generate and display story
4. **Step 4:** Rate and save (requires account)

---

## API Endpoints

### Public (No Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate-story` | Generate a new story |
| GET | `/api/classic-tales` | Get catalog of classic tales |
| GET | `/api/health` | Health check |

### Protected (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stories` | Get user's saved stories |
| POST | `/api/stories` | Save a story |
| DELETE | `/api/stories/<id>` | Delete a saved story |
| PUT | `/api/stories/<id>/rating` | Update story rating |
| GET | `/api/settings` | Get user settings |
| PUT | `/api/settings` | Update user settings |

### Authentication Flow
1. User authenticates via Supabase (Google/Apple/Email)
2. Supabase returns a JWT access token
3. Mobile app sends token in `Authorization: Bearer <token>` header
4. Flask backend verifies token with Supabase
5. Backend extracts user ID from token for data operations

---

## Environment Variables

### Backend (.env)
```bash
# AI Services
GROQ_API_KEY=your-groq-api-key
GOOGLE_API_KEY=your-google-ai-studio-key

# Supabase (for token verification)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret

# App Settings
FLASK_ENV=production
DATABASE_URL=sqlite:///stories.db  # Will change to PostgreSQL URL later
```

### Mobile (app.json or .env)
```bash
EXPO_PUBLIC_API_URL=https://your-api.railway.app
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Development Guidelines

### Code Standards
- **TypeScript** for mobile app (type safety)
- **Python type hints** for backend (clarity)
- **Functional components** with hooks (React Native)
- **Small, focused functions** (single responsibility)
- **Meaningful names** (self-documenting code)

### Git Workflow
- **Main branch:** Always deployable
- **Feature branches:** One branch per feature/fix
- **Meaningful commits:** Describe what and why
- **No secrets in git:** Use environment variables

### Testing Strategy
- **Manual testing** during development (Expo Go app)
- **Physical device testing** before store submission
- **API testing** with Postman or similar tool
- **Unit tests** for critical business logic (future)

---

## Store Requirements

### Google Play Store
- **Account:** Google Play Console ($25 one-time)
- **Rating:** "Everyone" (ages 2-10 target audience)
- **Content Policy:** Family-friendly content only
- **Required Assets:**
  - App icon (512x512 PNG)
  - Feature graphic (1024x500)
  - Screenshots (phone + tablet)
  - Privacy policy URL
  - App description

### Apple App Store
- **Account:** Apple Developer Program ($99/year)
- **Rating:** 4+ (suitable for children)
- **Requirements:**
  - "Sign in with Apple" (required if any social login offered)
  - Privacy policy URL
  - App icons (multiple sizes)
  - Screenshots (various device sizes)
  - App description

---

## Notes for Development

### Priorities
1. **Functionality over perfection** — Ship working features
2. **Simplicity over complexity** — Minimal viable implementation
3. **User experience over technical elegance** — What users see matters most

### What NOT to Change
- Don't modify API keys or secrets directly
- Don't remove word count estimation logic
- Don't break existing story generation flow

### Common Commands

#### Mobile (Expo)
```bash
cd mobile
npm install              # Install dependencies
npx expo start           # Start development server
npx expo start --ios     # Start iOS simulator
npx expo start --android # Start Android emulator
eas build --platform all # Build for both stores
```

#### Backend (Flask)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\Activate.ps1 on Windows
pip install -r requirements.txt
python app.py             # Run locally
```

---

## Current Limitations (To Address Later)
- SQLite doesn't sync across devices (migrate to PostgreSQL)
- No offline story generation (requires internet)
- No push notifications
- No analytics/crash reporting

---

## Notes for Claude Code
1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made, be didactical as the user (although he knows how to code) is not a software engineer
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.
8. DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY
9. MAKE ALL FIXES AND CODE CHANGES AS SIMPLE AS HUMANLY POSSIBLE. THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOUR GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY
10. This is is not a prototype, although it is a simple app - prioritize functionality over perfection
11. Maintain the simple architecture unless explicitly asked to scale up
12. Always test that changes work with the Groq API integration
13. Perform one logical change at a time: don't do massive changes to the code base in one single step, break the big changes down to managable and understandable sub-steps.
14. When accomplishing a task ALWAYS update the .\tasks\todo.md

## Reference Documents
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Supabase Auth for React Native](https://supabase.com/docs/guides/auth/quickstarts/react-native)
- [RevenueCat React Native](https://www.revenuecat.com/docs/reactnative)
- [Railway Deployment](https://docs.railway.app/)

# Current Development Status

## ✅ Phase 2.1 Mobile UI Foundation - COMPLETED (January 2026)

### Mobile App Status
The React Native + Expo mobile app now has a complete, professional UI foundation:

- **Story Type Selection**: Beautiful cards with prominent images and clean titles
- **Dark Violet Theme**: Cohesive design throughout the entire app (#5b2c87)
- **3-Tab Navigation**: Home, My Stories, Settings (all with working icons)
- **Child-Friendly Design**: Rounded fonts, engaging visuals, optimal mobile UX
- **Cross-Platform Icons**: Fixed icon mappings for iOS, Android, and web

### Ready for Phase 2.2
The mobile app UI is complete and ready for the next development phase:
- Story customization screens (Original, Classic, Remix flows)
- Integration with existing Flask backend API
- Story generation and display functionality
- User authentication integration (Supabase)

### Technical Foundation
- **Mobile Framework**: React Native + Expo (managed workflow)
- **Backend**: Python Flask with Groq API integration (already working)
- **Database**: SQLite (ready to migrate to PostgreSQL when needed)
- **Authentication**: Ready for Supabase Auth integration
