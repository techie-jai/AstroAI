# AstroAI Frontend

Modern React web UI for AstroAI platform with Firebase authentication and Tailwind CSS styling.

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
