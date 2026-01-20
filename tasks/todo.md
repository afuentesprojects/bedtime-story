# Bedtime Story Generator - Task Tracking

## Project Goal
Deploy a cross-platform mobile app (Android + iOS) to Google Play Store and Apple App Store.

## Current Status: January 2026

### ✅ Completed (Web Prototype)
- [x] Flask backend with story generation (Groq API / Llama 3.3 70B)
- [x] Multi-language translation (Google AI Studio / Gemini 2.0 Flash)
- [x] Three story types: Original, Classic, Classic Remix
- [x] Classic tales catalog (80+ stories)
- [x] User authentication (email/password) - *will be replaced with Supabase*
- [x] Settings page with user preferences
- [x] Save/delete stories functionality
- [x] Web UI with two-step story generation flow

### 🎯 Current Phase: Phase 0 - Preparation
Setting up accounts and planning before development begins.

---

## Phase 0: Preparation (Do This First!)
**Timeline: 1-2 days**
**Goal: Get accounts ready while planning the work**

### Developer Accounts (START IMMEDIATELY)
- [ ] **Create Google Play Console Account**
  - URL: https://play.google.com/console
  - Cost: $25 one-time fee
  - Time: Instant approval
  
- [ ] **Create Apple Developer Account**
  - URL: https://developer.apple.com/programs/
  - Cost: $99/year
  - Time: 24-48 hours for approval (sometimes longer)
  - ⚠️ Do this NOW — don't wait until you need to submit

### Supabase Setup
- [x] **Create Supabase Project**
  - URL: https://supabase.com
  - Create new project for "Bedtime Story Generator"
  - Note down: Project URL, Anon Key, JWT Secret
  
- [ ] **Configure Authentication Providers**
  - Enable Email/Password authentication
  - Enable Google OAuth provider
  - Enable Apple OAuth provider
  - Configure redirect URLs for mobile app

### Development Environment
- [x] **Install Node.js** (LTS version, 18.x or 20.x)
- [x] **Install Expo CLI**: `npm install -g expo-cli`
- [x] **Install EAS CLI**: `npm install -g eas-cli`
- [x] **Create Expo Account**: https://expo.dev (for builds)

### Planning
- [ ] **Review this todo.md with Claude** before starting Phase 1
- [ ] **Sketch main screens** (paper or Figma - optional but helpful):
  - Home / Story Type Selection
  - Story Customization
  - Story Display
  - My Stories
  - Settings
  - Login / Register

---

## Phase 1: Backend Deployment
**Timeline: 1 week**
**Goal: Flask API accessible from the internet**

### 1.1 Backend Refactoring
*Reorganize code for clarity and maintainability*

- [ ] **Create backend folder structure**
  ```
  backend/
  ├── app.py           # Main Flask app
  ├── config.py        # Configuration
  ├── db.py            # Database helpers
  ├── routes/
  │   ├── __init__.py
  │   ├── stories.py   # Story generation routes
  │   └── settings.py  # Settings routes
  └── services/
      ├── llm_service.py
      └── translation_service.py
  ```

- [ ] **Extract database logic to `db.py`**
  - Database initialization
  - Connection helpers
  - Common queries

- [ ] **Extract routes to separate files**
  - Move story routes to `routes/stories.py`
  - Move settings routes to `routes/settings.py`
  - Use Flask Blueprints

- [ ] **Create `config.py`** for environment-based configuration

- [ ] **Test refactored backend locally** — all existing functionality works

### 1.2 Supabase Authentication Integration
*Replace custom auth with Supabase token verification*

- [ ] **Install Supabase Python library**
  ```bash
  pip install supabase
  ```

- [ ] **Create auth verification middleware**
  - Extract JWT from `Authorization: Bearer <token>` header
  - Verify token with Supabase
  - Extract user ID from token
  - Make user ID available to route handlers

- [ ] **Update protected routes** to use new auth middleware
  - `/api/stories` (GET, POST, DELETE)
  - `/api/settings` (GET, PUT)

- [ ] **Remove old auth routes** (login, register)
  - Authentication now handled by Supabase on mobile
  - Backend only verifies tokens

- [ ] **Update database schema**
  - User ID now comes from Supabase (UUID format)
  - Migrate or update existing tables if needed

- [ ] **Test auth flow** with Postman
  - Get test token from Supabase
  - Verify protected routes work with token
  - Verify routes reject invalid/missing tokens

### 1.3 API Adjustments for Mobile
*Small changes to make API mobile-friendly*

- [ ] **Add CORS headers** for mobile app requests
  ```python
  pip install flask-cors
  ```

- [ ] **Add `/api/health` endpoint** for connectivity checks

- [ ] **Ensure all responses are JSON** (no HTML error pages)

- [ ] **Add API versioning prefix** (optional but recommended)
  - `/api/v1/generate-story` instead of `/generate-story`

- [ ] **Document API endpoints** in `docs/API.md`

### 1.4 Cloud Deployment
*Deploy backend to Railway or Render*

- [ ] **Choose hosting provider** (Railway or Render)
  - Both have generous free tiers
  - Both support Python/Flask
  - Both connect to GitHub for auto-deploy

- [ ] **Prepare for deployment**
  - Create `Procfile`: `web: gunicorn app:app`
  - Add `gunicorn` to requirements.txt
  - Ensure all env vars are documented

- [ ] **Deploy to chosen platform**
  - Connect GitHub repository
  - Set environment variables (API keys, Supabase config)
  - Deploy and get public URL

- [ ] **Test deployed API**
  - Health check endpoint works
  - Story generation works
  - Auth verification works
  - Note the production URL (e.g., `https://bedtime-api.railway.app`)

### 1.5 Phase 1 Checkpoint
- [ ] ✅ Backend deployed and accessible via public URL
- [ ] ✅ Story generation works via API call
- [ ] ✅ Supabase auth token verification works
- [ ] ✅ All environment variables configured in cloud

---

## Phase 2: Mobile App Development
**Timeline: 2-4 weeks**
**Goal: Working app on physical devices**

### 2.1 Project Setup
*Initialize React Native + Expo project*

- [ ] **Create new Expo project**
  ```bash
  npx create-expo-app bedtime-stories --template expo-template-blank-typescript
  cd bedtime-stories
  ```

- [ ] **Install core dependencies**
  ```bash
  npx expo install expo-router react-native-safe-area-context react-native-screens
  npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
  npx expo install expo-auth-session expo-web-browser expo-secure-store
  ```

- [ ] **Set up Expo Router** for navigation
  - Create `app/` directory structure
  - Configure `app.json` for Expo Router

- [ ] **Configure Supabase client**
  - Create `services/supabase.ts`
  - Set up auth state listener
  - Test connection to Supabase project

- [ ] **Create API service**
  - Create `services/api.ts`
  - Configure base URL (from environment)
  - Add auth header injection
  - Add error handling

- [ ] **Run app on phone** via Expo Go
  - Download Expo Go from App Store / Play Store
  - Scan QR code from `npx expo start`
  - Verify app loads

### 2.2 Authentication Screens
*Implement frictionless login flow*

- [ ] **Create auth context/provider**
  - Track authentication state
  - Provide login/logout functions
  - Handle session persistence

- [ ] **Build Login screen**
  - "Continue with Google" button
  - "Continue with Apple" button (iOS only)
  - "Sign in with Email" option
  - Link to Register screen
  - Clean, welcoming design

- [ ] **Build Register screen** (email/password)
  - Email input
  - Password input (with visibility toggle)
  - Confirm password
  - Link to Login screen

- [ ] **Implement Google Sign-In**
  - Configure Expo Auth Session
  - Handle OAuth flow
  - Store session

- [ ] **Implement Apple Sign-In** (iOS)
  - Configure Apple authentication
  - Handle OAuth flow
  - Store session

- [ ] **Implement Email/Password auth**
  - Sign up with email verification
  - Sign in
  - Error handling (invalid credentials, etc.)

- [ ] **Add "Skip for now" option**
  - Allow guest usage
  - Prompt for account when saving stories

- [ ] **Test all auth flows** on physical device

### 2.3 Core Screens
*Build the main app screens*

#### Home Screen (Story Type Selection)
- [ ] **Create Home screen layout**
  - App title/branding
  - Three story type cards:
    - "Create Original Story"
    - "Choose a Classic Tale"
    - "Remix a Classic"
  - Clean, child-friendly design

- [ ] **Implement navigation** to customization screens

#### Story Customization Screens
- [ ] **Original Story screen**
  - Story length selector (1-12 minutes)
  - Text input for story ideas
  - "Generate Story" button

- [ ] **Classic Tale screen**
  - "Surprise Me!" button
  - Searchable tale list
  - Tale cards with emojis/descriptions
  - Story length selector
  - "Generate Story" button

- [ ] **Classic Remix screen**
  - Tale selection (no "Surprise Me!")
  - Story ideas input
  - Story length selector
  - "Generate Story" button

#### Story Display Screen
- [ ] **Create Story Display screen**
  - Story title
  - Story content (scrollable)
  - Story metadata (word count, reading time)
  - Rating selector (stars or emoji)
  - "Save Story" button (prompts login if guest)
  - "Generate Another" button
  - Share button (optional)

- [ ] **Implement story generation**
  - Loading state with animation
  - Error handling
  - Success display

#### My Stories Screen
- [ ] **Create My Stories screen**
  - List of saved stories
  - Story cards with title, date, rating
  - Tap to view full story
  - Delete button with confirmation
  - Empty state for no stories

- [ ] **Implement story management**
  - Fetch stories from API
  - Delete story
  - Pull-to-refresh

#### Settings Screen
- [ ] **Create Settings screen**
  - Language preference
  - Default story length
  - Child's name (for personalization)
  - Account section (if logged in)
  - Logout button
  - App version

- [ ] **Implement settings persistence**
  - Save to API (if logged in)
  - Save locally (if guest)

### 2.4 Guest Mode & Account Prompts
*Seamless transition from guest to authenticated*

- [ ] **Implement guest mode**
  - Allow story generation without account
  - Store settings locally
  - Track "pending" stories (not saved to cloud)

- [ ] **Create account prompt modal**
  - Triggered when guest tries to save
  - Explains benefits of account
  - Quick buttons to sign up
  - "Not now" option

- [ ] **Handle post-login story save**
  - If user had pending story, save it after login

### 2.5 Polish & Testing
*Ensure quality before store submission*

- [ ] **Add loading states** to all async operations

- [ ] **Add error handling** with user-friendly messages

- [ ] **Test on Android device**
  - All screens work
  - All auth flows work
  - Story generation works
  - Settings persist

- [ ] **Test on iOS device**
  - All screens work
  - Apple Sign-In works
  - All other auth flows work
  - Story generation works
  - Settings persist

- [ ] **Fix any platform-specific bugs**

- [ ] **Review UI on different screen sizes**

### 2.6 Phase 2 Checkpoint
- [ ] ✅ App runs on Android physical device
- [ ] ✅ App runs on iOS physical device
- [ ] ✅ All auth flows work (Google, Apple, Email)
- [ ] ✅ Guest mode works
- [ ] ✅ Story generation works
- [ ] ✅ Save/delete stories works
- [ ] ✅ Settings work

---

## Phase 3: Store Submission
**Timeline: 1-2 weeks**
**Goal: App live on both stores**

### 3.1 App Assets
*Create required store assets*

- [ ] **Design app icon**
  - 1024x1024 PNG (master file)
  - Child-friendly, recognizable
  - Works at small sizes

- [ ] **Create screenshots**
  - Android: Phone (1080x1920) + Tablet (1200x1920)
  - iOS: 6.5" (1284x2778), 5.5" (1242x2208)
  - Show key screens: Home, Story, My Stories
  - Add captions highlighting features

- [ ] **Create feature graphic** (Android)
  - 1024x500 PNG
  - App branding and tagline

- [ ] **Write store description**
  - Short description (80 chars)
  - Full description (4000 chars)
  - Feature bullet points
  - Translate to Spanish (optional)

- [ ] **Create privacy policy**
  - Host on a public URL
  - Cover data collection, usage, children's privacy
  - Required by both stores

### 3.2 Expo Build Configuration
*Configure builds for both platforms*

- [ ] **Create EAS Build configuration**
  ```bash
  eas build:configure
  ```

- [ ] **Configure `app.json` / `app.config.js`**
  - App name
  - Bundle identifier (iOS): `com.yourcompany.bedtimestories`
  - Package name (Android): `com.yourcompany.bedtimestories`
  - Version number
  - Icons and splash screen

- [ ] **Set up credentials**
  - Android: Generate keystore (EAS can do this)
  - iOS: Connect Apple Developer account to EAS

- [ ] **Test production build** on physical devices
  ```bash
  eas build --profile preview --platform all
  ```

### 3.3 Google Play Submission
*Submit to Google Play Store*

- [ ] **Create app in Google Play Console**
  - Set up store listing
  - Upload screenshots and graphics
  - Add description and categorization
  - Set content rating (complete questionnaire)

- [ ] **Configure app content**
  - Target audience: Children (under 13)
  - Ads: No
  - Content rating questionnaire

- [ ] **Build Android App Bundle**
  ```bash
  eas build --platform android --profile production
  ```

- [ ] **Upload to Play Console**
  - Internal testing track first
  - Test on multiple devices

- [ ] **Submit for review**
  - Move to production track
  - Submit for review
  - Timeline: 1-3 days typically

- [ ] **Handle any rejection feedback**

### 3.4 Apple App Store Submission
*Submit to Apple App Store*

- [ ] **Create app in App Store Connect**
  - Set up app record
  - Fill in metadata
  - Upload screenshots

- [ ] **Configure app information**
  - Age rating: 4+
  - Category: Entertainment or Books
  - Privacy policy URL

- [ ] **Build iOS app**
  ```bash
  eas build --platform ios --profile production
  ```

- [ ] **Submit via EAS Submit** (or manually via Transporter)
  ```bash
  eas submit --platform ios
  ```

- [ ] **Complete App Store review information**
  - Demo account (if needed)
  - Notes for reviewer

- [ ] **Submit for review**
  - Timeline: 1-7 days typically

- [ ] **Handle any rejection feedback**

### 3.5 Phase 3 Checkpoint
- [ ] ✅ App approved on Google Play Store
- [ ] ✅ App approved on Apple App Store
- [ ] ✅ Both apps downloadable and functional
- [ ] ✅ Celebrate! 🎉

---

## Phase 4: Post-Launch
**Timeline: Ongoing**
**Goal: Improve based on real usage**

### 4.1 Monitoring & Feedback
- [ ] Set up crash reporting (Expo's built-in or Sentry)
- [ ] Monitor app store reviews
- [ ] Create feedback mechanism in app
- [ ] Track basic usage metrics

### 4.2 Database Migration (When Needed)
*Migrate SQLite → PostgreSQL for multi-device sync*

- [ ] Set up Supabase PostgreSQL database
- [ ] Migrate schema to PostgreSQL
- [ ] Update backend to use PostgreSQL
- [ ] Test thoroughly before switching
- [ ] Update production environment

### 4.3 Subscription Integration (When Ready)
*Add monetization when traction justifies it*

- [ ] Integrate RevenueCat SDK
- [ ] Design subscription tiers
- [ ] Implement paywall
- [ ] Configure products in App Store / Play Store
- [ ] Test purchase flows

### 4.4 Future Features (Backlog)
- [ ] Offline mode with cached stories
- [ ] Push notifications (bedtime reminders)
- [ ] Story illustrations (AI-generated)
- [ ] Voice narration (text-to-speech)
- [ ] Multiple child profiles
- [ ] Family sharing
- [ ] Web version via Expo Web

---

## Quick Reference

### Key URLs
| Service | URL |
|---------|-----|
| Production API | `https://your-api.railway.app` (TBD) |
| Supabase Dashboard | `https://app.supabase.com/project/your-project` |
| Google Play Console | `https://play.google.com/console` |
| App Store Connect | `https://appstoreconnect.apple.com` |
| Expo Dashboard | `https://expo.dev` |

### Common Commands
```bash
# Start development
cd mobile && npx expo start

# Build for testing
eas build --profile preview --platform all

# Build for production
eas build --profile production --platform all

# Submit to stores
eas submit --platform android
eas submit --platform ios

# Run backend locally
cd backend && python app.py
```

### Environment Variables Needed
```
# Backend (Railway/Render)
GROQ_API_KEY
GOOGLE_API_KEY
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_JWT_SECRET

# Mobile (app.config.js)
EXPO_PUBLIC_API_URL
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
```

---

## Notes

### Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| Jan 2026 | React Native + Expo over native Kotlin | Single codebase for iOS + Android, sustainable for solo founder |
| Jan 2026 | Supabase Auth over custom Flask auth | Social login required for frictionless UX, Apple requires Sign in with Apple |
| Jan 2026 | Guest mode with account prompt | Maximize initial engagement, convert to accounts for retention |
| Jan 2026 | RevenueCat for future subscriptions | Industry standard, handles both platforms, no custom receipt validation |

### Lessons Learned
*Add notes here as you progress*

- **January 20, 2026**: Completed Expo project cleanup - Simple, incremental changes work best for mobile development
- Template removal was straightforward - Removed all demo content, tabs, and unused components
- Folder structure setup prepares for organized development (services/, app/stories/, app/auth/)

---

## Recent Progress - January 20, 2026

### ✅ Phase 0 Cleanup Completed
**Goal: Clean up Expo project template for bedtime story app development**

#### Completed Tasks:
- [x] **Remove template demo content from home screen**
  - Replaced complex template layout with simple "Bedtime Stories" interface
  - Added placeholder for three story types: Original, Classic, Remix
  - Created clean, centered layout with proper styling

- [x] **Remove explore tab and modal screen**
  - Removed explore tab from navigation (app/(tabs)/_layout.tsx)
  - Deleted explore.tsx file completely
  - Deleted modal.tsx file completely
  - Now has clean single-tab interface

- [x] **Update app.json name and description**
  - Changed name from "bedtime-stories" to "Bedtime Story Generator"
  - Updated slug to "bedtime-story-generator"
  - Keeps existing bundle identifiers and configuration

- [x] **Remove unused template components**
  - Deleted hello-wave.tsx (animated component)
  - Deleted parallax-scroll-view.tsx (complex scroll component)
  - Deleted external-link.tsx (demo link component)
  - Deleted ui/collapsible.tsx (demo UI component)

- [x] **Create basic folder structure for bedtime stories app**
  - Created services/ folder for API and auth logic
  - Created app/stories/ folder for story-related screens
  - Created app/auth/ folder for authentication screens
  - Added placeholder api.ts file in services/

#### Current State:
- ✅ Clean Expo project ready for development
- ✅ Simple home screen showing app purpose
- ✅ Proper folder structure for organized development
- ✅ All template clutter removed
- ✅ App properly named and configured

#### Next Steps:
Ready to begin Phase 2.1 - Building the actual story type selection UI on the home screen.

---

*Last updated: January 20, 2026*
