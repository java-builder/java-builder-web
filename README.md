<p align="center">
  <img src="https://res.cloudinary.com/drdskl2up/image/upload/v1780847977/java-logo_facxkn.png" alt="JavaBuilder Logo" width="120" />
</p>

<h1 align="center">☕ JavaBuilder – Online Learning Platform</h1>

<p align="center">
  <strong>A modern, full-featured online learning platform built for Java developers</strong>
</p>

<p align="center">
  <a href="https://www.javabuilder.online">
    <img src="https://img.shields.io/badge/Live-javabuilder.online-blue?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/i18n-4_languages-orange?style=flat-square" alt="i18n" />
</p>

---

## 📖 Introduction

**JavaBuilder** is a comprehensive online learning platform designed specifically for Java developers. It provides structured courses, coding exercises with AI-powered review, technical interview preparation, community blogs, and personalized learning roadmaps — all wrapped in a beautiful, responsive interface with multi-language support.

## 🌐 Demo

| Environment | URL |
|-------------|-----|
| Production  | [https://www.javabuilder.online](https://www.javabuilder.online/) |

## 📸 Screenshots

<p align="center">
  <img src="https://res.cloudinary.com/drdskl2up/image/upload/v1780847742/cebfe55a-ed9f-4193-bf40-51e98e6ab79c.png" alt="Homepage" width="80%" />
</p>

## ✨ Key Features

| Category | Features |
|----------|----------|
| 📚 **Courses** | Structured Java/Spring Boot courses with video lessons, chapter organization, and progress tracking |
| 💻 **Exercises** | Coding exercises with submission system, AI-powered code review, and detailed feedback |
| 🤖 **AI Coach** | AI training assistant for personalized feedback and learning recommendations |
| 🎯 **Interview Prep** | Curated interview questions across Java Core, Spring, Database, Docker, Git, and more |
| 📝 **Blogs** | Community blog system with markdown support, comments, and favorites |
| 🗺️ **Roadmap** | Personalized learning roadmaps tailored to your goals |
| 💬 **Messages** | Real-time private & group chat with optimistic UI, media/document attachments (< 100MB), member-level cleared history, and live typing indicators |
| 💬 **Q&A** | Community question and answer forum |
| 🔔 **Notifications** | Real-time push notifications via Firebase Cloud Messaging |
| 💳 **Subscriptions** | Payment integration with subscription plans |
| 🌍 **i18n** | Multi-language support (Vietnamese, English, Japanese, Korean) |
| 🌙 **Dark Mode** | Full dark/light theme support |
| 🔐 **Security** | OAuth2, 2FA, session management |

## 🏗️ Project Architecture

```
src/
├── api/                    # Axios instance & API configuration
│   ├── api.ts
│   └── axios.ts
├── app/                    # Next.js App Router pages
│   ├── (home)/             # Landing page
│   ├── admin/              # Admin dashboard
│   ├── blogs/              # Blog listing & detail
│   ├── chatbot/            # AI chatbot interface
│   ├── courses/            # Course catalog
│   ├── exercises/          # Exercise workspace
│   ├── interview/          # Interview questions
│   ├── learn/              # Learning interface
│   ├── my-exercises/       # Exercise submissions & review
│   ├── personalized-roadmap/ # AI-generated roadmaps
│   ├── pricing/            # Subscription plans
│   ├── qna/               # Q&A forum
│   ├── roadmap/            # Static roadmap
│   └── ...                 # Auth, profile, settings, etc.
├── components/             # Reusable React components
│   ├── admin/              # Admin panel components
│   ├── chatbot/            # Chatbot UI components
│   ├── common/             # Shared components
│   ├── courses/            # Course-related components
│   ├── exercises/          # Exercise components
│   ├── interview/          # Interview question components
│   ├── layouts/            # Layout wrappers
│   ├── my-exercises/       # Exercise review components
│   ├── ui/                 # Base UI primitives
│   └── ...
├── configuration/          # Third-party config (Firebase, Google, LinkedIn)
├── contexts/               # React Context providers
├── data/                   # Static data & mock data
├── hooks/                  # Custom React hooks
├── i18n/                   # Internationalization (4 languages)
├── lib/                    # Utility libraries (SEO, WebSocket, settings)
├── providers/              # App-level providers composition
├── services/               # API service layer (one per domain)
├── types/                  # TypeScript type definitions
└── utils/                  # Helper utilities
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router + Turbopack) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Data Fetching** | [TanStack React Query 5](https://tanstack.com/query) + [Axios](https://axios-http.com/) |
| **State Management** | React Context API |
| **Forms** | [React Hook Form](https://react-hook-form.com/) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **3D Graphics** | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + Three.js |
| **Rich Text** | [TipTap](https://tiptap.dev/) + [TinyMCE](https://www.tiny.cloud/) |
| **Markdown** | [React Markdown](https://github.com/remarkjs/react-markdown) + [MDEditor](https://uiwjs.github.io/react-md-editor/) |
| **Charts** | [Recharts](https://recharts.org/) + [Chart.js](https://www.chartjs.org/) |
| **Tables** | [TanStack Table](https://tanstack.com/table) |
| **Notifications** | [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging) |
| **Real-time** | [STOMP over WebSocket](https://stomp.github.io/) |
| **Auth** | OAuth2 (Google, LinkedIn) + 2FA |
| **i18n** | Custom implementation (vi, en, ja, ko) |
| **Icons** | [Lucide React](https://lucide.dev/) + [React Icons](https://react-icons.github.io/react-icons/) + [Heroicons](https://heroicons.com/) |
| **Video** | [Video.js](https://videojs.com/) |
| **Alerts** | [SweetAlert2](https://sweetalert2.github.io/) + [React Hot Toast](https://react-hot-toast.com/) |
| **Linting** | [ESLint 9](https://eslint.org/) |

### 💬 Real-time WebSocket & Typing Indicator Integration

Real-time messaging and live typing feedback are managed using **STOMP over WebSocket** (`@stomp/stompjs`) via the app-level `PresenceProvider` context (`useWebSocket()`).

#### 1. STOMP Protocol Architecture
- **WebSocket Endpoint**: `wss://api.javabuilder.online/ws` (JWT Bearer Token authenticated)
- **Active Connection**: Single shared TCP WebSocket connection per session

#### 2. STOMP Destinations & Subscriptions
- **Inbound Typing Trigger (`client.publish`)**:
  - Destination: `/app/chat/{conversationId}/typing`
  - Payload: `{ "isTyping": boolean, "username": string }`
  - Logic: Triggered on input change with a 2-second debounce timer, canceled immediately upon sending a message.
- **Outbound Topic Subscriptions (`client.subscribe`)**:
  - `/topic/conversations/{conversationId}` — Real-time chat messages stream
  - `/topic/conversations/{conversationId}/typing` — Live typing indicator stream (`{ conversationId, userId, username, isTyping }`)
  - `/user/queue/chat-messages` — Active user notification queue for unread counts

#### 3. Features & UI Capabilities
- **Debounced Input Detection**: 2s idle timeout to automatically stop typing state.
- **Auto-Cleanup Timer**: 4s fallback timeout for incoming typing states to prevent stuck indicators.
- **Floating Typing Indicator UI**: Glassmorphic animated bubble (`backdrop-blur-md`, 3-dot bounce animation) positioned floating right above the input bar in `ChatWindow`.
- **Dual Interface Support**: Fully integrated into both User (`/messages`) and Admin (`/admin/messages`) workspaces.

---

## 📋 Prerequisites

Ensure you have the following installed:

| Tool | Version | Required |
|------|---------|----------|
| Node.js | >= 18.x | ✅ |
| npm | >= 9.x | ✅ |
| Git | Latest | ✅ |

## 🔐 Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://flearning.vn
NEXT_PUBLIC_API_URL=https://api.flearning.vn
NEXT_PUBLIC_WS_URL=wss://api.flearning.vn/ws

# SEO Configuration
NEXT_PUBLIC_SITE_NAME="F Learning"
NEXT_PUBLIC_SITE_DESCRIPTION="Nền tảng học tập trực tuyến hiện đại"

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Search Console Verification (optional)
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
```

## 📦 Build for Production

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

The build uses **Turbopack** for fast compilation.

## 📏 Coding Conventions

| Rule | Standard |
|------|----------|
| **Components** | PascalCase (`CourseCard.tsx`) |
| **Hooks** | camelCase with `use` prefix (`useCourses.ts`) |
| **Services** | kebab-case with `.service.ts` suffix (`course.service.ts`) |
| **Types** | PascalCase in dedicated type files (`course.ts`) |
| **Utilities** | camelCase (`formatters.ts`) |
| **CSS** | Tailwind utility-first; no custom CSS unless necessary |
| **Imports** | Absolute paths via `@/` alias |
| **State** | React Query for server state; Context for UI state |
| **Error Handling** | Centralized via API interceptors + toast notifications |

## 📱 Responsive Design

The application is fully responsive across all breakpoints:

| Breakpoint | Range | Target |
|-----------|-------|--------|
| `sm` | ≥ 640px | Mobile landscape |
| `md` | ≥ 768px | Tablet |
| `lg` | ≥ 1024px | Desktop |
| `xl` | ≥ 1280px | Large desktop |
| `2xl` | ≥ 1536px | Ultra-wide |

## 🌍 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |
| Mobile Chrome | Latest |
| Mobile Safari | Latest |

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

<p align="center">
  <strong>Le Khanh Duc</strong>
</p>

<p align="center">
  <a href="https://www.javabuilder.online">🌐 Website</a> •
  <a href="https://github.com/lekhanhduc">💻 GitHub</a> •
  <a href="https://linkedin.com/in/lekhanhduc">💼 LinkedIn</a>
</p>

---

<p align="center">
  Made with ❤️ for the Java developer community
</p>
