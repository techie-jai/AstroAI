# AstroAI Frontend

Modern React web UI for AstroAI platform with Firebase authentication and Tailwind CSS styling.

---

## 🎨 UI & Frontend Tech Stack

### **Core Framework & Build Tools**
- **React** `^18.2.0` - UI library
- **React DOM** `^18.2.0` - React rendering
- **Vite** `^5.0.8` - Build tool & dev server
- **TypeScript** `^5.3.3` - Type safety
- **Tailwind CSS** `^3.3.6` - Utility-first CSS framework

### **Routing & State Management**
- **React Router DOM** `^6.20.0` - Client-side routing
  - `Link`, `useNavigate()`, `useLocation()`, `useParams()`, `useSearchParams()`, `Navigate`
- **Zustand** `^4.4.1` - Lightweight state management
  - Used for: `authStore` (user authentication state)

### **UI Components & Icons**
- **Lucide React** `^0.294.0` - SVG icon library
  - 100+ icons: Navigation, Actions, Status, Data, UI controls
- **Radix UI** - Headless accessible components
  - `@radix-ui/react-dialog` - Modal/Dialog
  - `@radix-ui/react-dropdown-menu` - Dropdown menus
  - `@radix-ui/react-tabs` - Tab component

### **External Services & APIs**
- **Firebase** `^10.7.0` - Authentication & backend
  - Google OAuth, Email/Password auth, Auth state management
- **Axios** `^1.6.2` - HTTP client
  - Custom instance with auto base URL detection
  - 60-second timeout, token management
- **@react-google-maps/api** `^2.19.0` - Google Maps integration
  - Place autocomplete, location search

### **Notifications & Utilities**
- **React Hot Toast** `^2.4.1` - Toast notifications
- **date-fns** `^2.30.0` - Date formatting and manipulation
- **PostCSS** `^8.4.32` - CSS transformations
- **Autoprefixer** `^10.4.16` - Vendor prefixes

### **Custom Services & Utilities**
- **API Service** (`src/services/api.ts`)
  - Centralized Axios client with auto base URL detection
  - Methods for all backend endpoints
  - Token management and interceptors

- **Auth Store** (`src/store/authStore.ts`)
  - Zustand-based authentication state
  - User state, login/logout actions, auth checks

- **Google Maps Loader** (`src/utils/googleMapsLoader.ts`)
  - Async Google Maps API loading
  - Place details fetching

- **Cache Manager** (`src/utils/cacheManager.ts`)
  - Data caching for performance
  - Used in ResultsPage and ChatWithKundliPage

- **Kundli Helpers** (`src/utils/jyotishganitHelper.ts`)
  - Extract and format kundli data
  - Panchanga, Ayanamsa, planet positions

- **Cities Database** (`src/data/cities.ts`)
  - City search and location data

### **Styling Approach**
- **Tailwind CSS** - All styling done with utility classes
- **Custom CSS** (`src/index.css`)
  - 12+ custom animations (rotate, glow, float, shimmer, etc.)
  - Dark theme scrollbar styling
  - Global transitions and effects
  - Font smoothing and rendering optimization

### **Color Palette (Dark Theme)**
```
Primary Background:    #0f172a (slate-950)
Secondary Background:  #1e293b (slate-900)
Card Background:       #1e293b/50 with backdrop-blur
Card Border:           #475569/50 (slate-700 with opacity)
Text Primary:          #f1f5f9 (slate-100)
Text Secondary:        #cbd5e1 (slate-300)
Text Tertiary:         #94a3b8 (slate-400)

Accent Colors:
- Indigo:   #4f46e5 / #6366f1
- Purple:   #a855f7 / #d946ef
- Pink:     #ec4899 / #f43f5e
- Cyan:     #06b6d4 / #0891b2
- Amber:    #f59e0b / #fbbf24
- Green:    #10b981 / #34d399
```

### **Reusable Components**
- **Layout** - Main layout wrapper with Sidebar and Navbar
- **Sidebar** - Navigation menu with collapsible state
- **Navbar** - Top navigation bar with user menu
- **InsightCard** - Colored insight cards (6 color variants)
- **GooglePlacesAutocomplete** - Location search with CSV + Google Maps
- **BotShareModal** - Share bot conversation modal
- **ProtectedRoute** - Authentication guard for routes

### **Key Features**
✅ Mobile-first responsive design (sm, md, lg breakpoints)
✅ Glassmorphism effects (backdrop-blur, transparency)
✅ Smooth animations and transitions
✅ Dark theme with proper contrast ratios
✅ Accessible components (Radix UI)
✅ Type-safe with TypeScript
✅ Real-time notifications with toast
✅ Persistent authentication with Firebase
✅ Efficient data caching
✅ Google Maps integration for location search

---

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Update `.env.local` with your Firebase credentials:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Run Development Server

```bash
npm run dev
```

App will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Features

- **Firebase Authentication**: Google Sign-In and Email/Password
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Real-time Updates**: Toast notifications for user feedback
- **State Management**: Zustand for auth and app state
- **API Integration**: Axios with interceptors for API calls
- **Modern UI**: Lucide icons and smooth animations

## Project Structure

```
src/
├── pages/           # Page components
├── components/      # Reusable components
├── services/        # API and external services
├── store/           # State management (Zustand)
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Available Routes

- `/login` - Login page
- `/dashboard` - User dashboard
- `/generate` - Kundli generator
- `/results/:kundliId` - Results viewer
- `/history` - Calculation history
- `/settings` - User settings

---

## 📄 Page Components & Architecture

### **Public Pages (No Auth Required)**

#### **Landing Page** (`pages/LandingPage.tsx`)
- Hero section with animated zodiac wheel
- Features showcase
- Pricing tiers
- Call-to-action sections
- Footer with links
- **Components Used:** 12 custom landing components (Hero, Header, Pricing, etc.)
- **Status:** ✅ Complete with cosmic dark theme

#### **Login Page** (`pages/LoginPage.tsx`)
- Email/Password authentication
- Google OAuth integration
- Sign-up form
- **Dependencies:** Firebase auth, useAuthStore
- **Status:** ✅ Functional

### **Protected Pages (Auth Required)**

#### **Dashboard Page** (`pages/DashboardPage.tsx`) ⭐ PRIORITY 1
- Welcome header with user greeting
- Stats cards (4 KPIs)
- Generate new kundli form
- Quick actions card
- Features showcase
- Astrological insights section
- **Components Used:** InsightCard, GooglePlacesAutocomplete
- **Dependencies:** useAuthStore, api.getUserCalculations(), api.generateKundli()
- **Status:** ✅ Redesigned with cosmic theme
- **Theme:** Dark slate background, gradient cards, glowing effects

#### **Kundli Page** (`pages/KundliPage.tsx`) ⭐ PRIORITY 1
- List of user's generated kundlis
- Kundli cards with birth details
- View and Chat buttons
- Generate new button
- **Layout:** 3-column grid (responsive)
- **Status:** ✅ Functional
- **Needs Redesign:** Light theme → Dark theme

#### **Results Page** (`pages/ResultsPage.tsx`) ⭐ PRIORITY 1
- Kundli data display
- Horoscope information sections
- Charts and visualizations
- Download button
- Chat button
- Analysis section
- **Dependencies:** api.getKundli(), CacheManager
- **Status:** ✅ Functional
- **Needs Redesign:** Light theme → Dark theme

#### **Chat with Kundli Page** (`pages/ChatWithKundliPage.tsx`) ⭐ PRIORITY 1
- Chat interface with bot
- Kundli sidebar with birth data
- Quick questions section
- Message history
- Thinking indicator
- **Components Used:** MarkdownText (custom)
- **Status:** ✅ ~70% dark theme complete
- **Needs Refinement:** Verify glassmorphism, contrast ratios

#### **Analysis Page** (`pages/AnalysisPage.tsx`) ⭐ PRIORITY 1
- List of kundlis with analysis
- Download analysis button
- Status indicators
- **Dependencies:** api.getUserCalculations(), api.downloadAnalysis()
- **Status:** ✅ Functional
- **Needs Redesign:** Light theme → Dark theme

#### **Dosha-Dasha Analysis Page** (`pages/DoshDashaAnalysisPage.tsx`) ⭐ PRIORITY 2
- Kundli selector dropdown
- Summary cards (4 KPIs)
- Current dasha display with progress bars
- Major doshas section (8 doshas)
- Negative periods section
- Collapsible sections
- **Dependencies:** api.analyzeDoshaAndDasha()
- **Status:** ✅ Complete with logic
- **Needs Redesign:** Light theme → Dark theme

#### **Kundli Matching Page** (`pages/KundliMatchingPage.tsx`) ⭐ PRIORITY 2
- Two-person birth data form
- City autocomplete search
- Method selection (North/South Indian)
- Submit button
- **Components Used:** GooglePlacesAutocomplete, PersonFormComponent (custom)
- **Status:** ✅ Functional
- **Needs Redesign:** Light theme → Dark theme

#### **Kundli Matching Results Page** (`pages/KundliMatchingResultsPage.tsx`) ⭐ PRIORITY 2
- Matching score display
- Compatibility details
- Guna analysis
- Recommendations
- **Status:** ✅ Functional
- **Needs Redesign:** Light theme → Dark theme

#### **Generator Page** (`pages/GeneratorPage.tsx`) ⭐ PRIORITY 2
- Birth data form
- City autocomplete
- Date/time pickers
- Random data generator
- Submit button
- **Components Used:** GooglePlacesAutocomplete
- **Status:** ✅ Functional
- **Needs Redesign:** Light theme → Dark theme

#### **Live Chat Page** (`pages/LiveChatPage.tsx`) ⭐ PRIORITY 2
- Birth data form
- Chat interface
- Message display
- Input area
- **Components Used:** GooglePlacesAutocomplete
- **Status:** ✅ Functional
- **Needs Redesign:** Light theme → Dark theme

#### **Kundli Completion Page** (`pages/KundliCompletionPage.tsx`) ⭐ PRIORITY 2
- Success message
- Download button
- View Results button
- Chat button
- **Status:** ✅ Functional
- **Needs Redesign:** Light theme → Dark theme

#### **Settings Page** (`pages/SettingsPage.tsx`) ⭐ PRIORITY 4
- User preferences
- Account settings
- **Status:** ⚠️ Minimal implementation
- **Needs Redesign:** Complete implementation + dark theme

#### **History Page** (`pages/HistoryPage.tsx`) ⭐ PRIORITY 4
- Calculation history
- **Status:** ⚠️ Minimal implementation
- **Needs Redesign:** Complete implementation + dark theme

#### **Chat Page** (`pages/ChatPage.tsx`) ⭐ PRIORITY 4
- Chat interface
- **Status:** ⚠️ Needs review
- **Needs Redesign:** Dark theme

---

## 🔧 Component Dependency Map

```
App.tsx (Routes)
├── LandingPage (public)
├── LoginPage (public)
└── Layout (protected pages)
    ├── Sidebar
    │   ├── Navigation items
    │   └── Logout button
    ├── Navbar
    │   └── User menu
    └── Page Components
        ├── DashboardPage
        │   ├── InsightCard (multiple)
        │   └── GooglePlacesAutocomplete
        ├── KundliPage
        ├── ResultsPage
        ├── ChatWithKundliPage
        │   └── MarkdownText (custom)
        ├── AnalysisPage
        ├── DoshDashaAnalysisPage
        ├── KundliMatchingPage
        │   ├── PersonFormComponent (custom)
        │   └── GooglePlacesAutocomplete
        ├── KundliMatchingResultsPage
        ├── GeneratorPage
        │   └── GooglePlacesAutocomplete
        ├── LiveChatPage
        │   └── GooglePlacesAutocomplete
        ├── KundliCompletionPage
        ├── SettingsPage
        ├── HistoryPage
        ├── ChatPage
        │   └── BotShareModal
        └── ProtectedRoute (wrapper)
```

---

## 🎯 Dark Theme Redesign Phases

### **Phase 1: Foundation (CRITICAL)**
- [ ] Update `Layout.tsx` background
- [ ] Update `Sidebar.tsx` (verify dark theme)
- [ ] Update `Navbar.tsx`
- [ ] Update `index.css` with dark utilities
- [ ] Update `InsightCard.tsx` colors
- **Impact:** Affects ALL pages

### **Phase 2: High-Traffic Pages (IMPORTANT)**
- [ ] DashboardPage
- [ ] KundliPage
- [ ] ResultsPage
- [ ] ChatWithKundliPage (refine)
- [ ] AnalysisPage
- **Impact:** Users see these daily

### **Phase 3: Supporting Pages (MEDIUM)**
- [ ] DoshDashaAnalysisPage
- [ ] KundliMatchingPage
- [ ] KundliMatchingResultsPage
- [ ] GeneratorPage
- [ ] LiveChatPage
- [ ] KundliCompletionPage

### **Phase 4: Utility Pages (LOW)**
- [ ] LoginPage
- [ ] SettingsPage
- [ ] HistoryPage
- [ ] ChatPage

---

## 📋 Redesign Checklist

### **For Each Page:**
- [ ] Update background color (`bg-gray-50` → `bg-slate-950`)
- [ ] Update card styling (white → dark transparent)
- [ ] Update text colors (dark → light)
- [ ] Update border colors (light → subtle dark)
- [ ] Update button styling (light → gradient dark)
- [ ] Update form inputs (light → dark transparent)
- [ ] Update icon colors (ensure visibility)
- [ ] Test contrast ratios (WCAG AA minimum)
- [ ] Test on mobile devices
- [ ] Test responsive design

### **Global Checks:**
- [ ] No white flashes on page load
- [ ] All text is readable
- [ ] All buttons are clickable
- [ ] All form inputs are visible
- [ ] Hover states work correctly
- [ ] Focus states are visible
- [ ] Scrollbars are styled correctly
- [ ] Gradients look good on dark background

---

## 🚀 Development Tips

### **Using Tailwind Classes**
```tsx
// Dark theme colors
bg-slate-950        // Primary background
bg-slate-900        // Secondary background
bg-slate-800/50     // Card background with opacity
border-slate-700/50 // Card borders
text-slate-100      // Primary text
text-slate-300      // Secondary text

// Gradients
bg-gradient-to-br from-purple-600 to-indigo-600
bg-gradient-to-r from-indigo-400 to-purple-400

// Effects
backdrop-blur-md    // Glassmorphism
shadow-lg shadow-purple-500/20  // Colored shadows
rounded-2xl         // Rounded corners
```

### **Common Patterns**
```tsx
// Dark card
<div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">

// Dark button
<button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg transition">

// Dark input
<input className="bg-slate-800/60 border border-slate-700/50 text-slate-100 placeholder-slate-400 rounded-lg px-4 py-2" />
```

---

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Lucide Icons](https://lucide.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com)
