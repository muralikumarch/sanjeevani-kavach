# Sanjeevani-Kavach 🛡️

**PromptWars India 2026 — Final Submission**

Sanjeevani-Kavach is an offline-first, multi-agent Progressive Web App (PWA) designed to fundamentally modernize India's Digital Public Infrastructure (DPI) at the extreme edge — where networks fail, paper dominates, and lives depend on accurate data.

---

## Problem Statement Alignment

### Hackathon Context

| Field | Detail |
|---|---|
| **Event** | PromptWars India 2026 |
| **Theme** | AI for Social Good — Edge Computing & Healthcare |
| **Track** | Healthcare & Digital Public Infrastructure (DPI) |
| **Problem** | Modernizing India's Maternal and Child Tracking System & Universal Immunization Programme (UIP) |

### The Problem We Solve

India's **Universal Immunization Programme (UIP)** is the world's largest public health initiative, targeting **27 million newborns** and **30 million pregnant women** annually. Despite its scale, the programme relies almost entirely on **handwritten paper "Yellow Cards"** for tracking immunization records at the last mile. This creates three systemic failures:

1. **Data Loss & Illegibility:** Handwritten entries on physical Yellow Cards are frequently illegible, torn, or lost entirely. ASHA workers cannot reliably reconstruct a child's vaccination history, leading to **duplicate doses or missed critical vaccines**.

2. **Data-Dark Environments:** Frontline ASHA Workers serve communities in deeply rural "Data-Dark Zones" with **zero internet connectivity**. Traditional cloud-first applications are completely unusable during village visits, which is precisely when data capture is most critical.

3. **Language & Literacy Barriers:** Complex clinical catch-up schedules from the National Immunization Schedule (NIS 2026) are printed in English. India has **22 official languages** and hundreds of dialects — ASHA workers and mothers in rural communities cannot parse English medical jargon, causing dangerous misinterpretation of dosage timings.

### How Sanjeevani-Kavach Directly Addresses the Problem

| Problem Statement Requirement | Our Solution | Implementation |
|---|---|---|
| Digitize handwritten Yellow Card records | **Vision-Agent** uses Gemini 2.5 Flash multimodal OCR with 3-pass Chain-of-Thought reasoning | `src/infrastructure/ai/vision-agent.ts` |
| Work in offline / Data-Dark zones | **Offline-first PWA** with Service Workers, IndexedDB caching, and Firebase offline persistence | `next-pwa` config + `useOfflineSync.ts` hook |
| Multilingual accessibility for ASHA workers | **Vani-Agent** translates clinical alerts into 12+ Indian languages using Google Cloud Translation + Neural2 TTS | `src/infrastructure/gcp/client.ts` |
| Validate against national immunization schedule | **Protocol-Agent** runs local RAG against NIS 2026 rules to compute catch-up schedules and urgency triage | `src/infrastructure/ai/protocol-agent.ts` |
| Protect patient privacy (Aadhaar, PII) | **PII Blur Engine** applies client-side Gaussian blur to names and numeric identifiers before any cloud processing | `src/infrastructure/pii/blur-engine.ts` |
| Sync with centralized health networks (U-WIN) | Firebase Firestore with offline persistence + Cloud Run sync microservice | `firestore.rules` + `cloud-run/` |

---

## Chosen Vertical

**Healthcare & Digital Public Infrastructure (DPI)**

We specifically target the "last mile" data-lag crisis where rural handwritten immunization records fail to synchronize with centralized health networks (like U-WIN), leading to millions of missed critical catch-up dosages across India.

---

## Approach and Logic

We deliberately rejected traditional CRUD interfaces. Rural health workers operate under extreme physical constraints — struggling with illegible paper cards, language dialect barriers, and zero network connectivity.

Our approach shifts the burden of computation entirely from the human to an **"Agentic Mesh"**:

- **Zero-Type Data Entry:** Users simply photograph records. The AI does all the heavy lifting — no typing, no forms, no dropdowns.
- **Audio-First UX:** Complex clinical dosages are spoken aloud in empathetic regional dialects rather than rendered as dense text. This bypasses literacy barriers entirely.
- **Data-Dark Resilience:** The architecture physically expects the internet to fail. It leverages asynchronous offline persistence via Service Workers and IndexedDB to store medical evaluations locally until cellular connectivity is restored.

---

## How the Solution Works

The architecture utilizes three distinct cooperating AI agents orchestrated through a clean domain-driven design:

```
┌─────────────────────────────────────────────────────────────┐
│                    ASHA Worker's Phone                       │
│                                                             │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  Camera   │───▶│ PII Blur     │───▶│ Vision-Agent │       │
│  │  (Scan)   │    │ Engine       │    │ (Gemini 2.5) │       │
│  └──────────┘    └──────────────┘    └──────┬───────┘       │
│                                             │               │
│                                    ┌────────▼────────┐      │
│                                    │ Protocol-Agent   │      │
│                                    │ (NIS 2026 RAG)   │      │
│                                    └────────┬────────┘      │
│                                             │               │
│                                    ┌────────▼────────┐      │
│                                    │ Vani-Agent       │      │
│                                    │ (Translation+TTS)│      │
│                                    └────────┬────────┘      │
│                                             │               │
│                                    ┌────────▼────────┐      │
│                                    │ Offline Cache    │      │
│                                    │ (IndexedDB/SW)   │      │
│                                    └────────┬────────┘      │
└─────────────────────────────────────────────┼───────────────┘
                                              │ (When online)
                                    ┌─────────▼─────────┐
                                    │ Firebase Firestore │
                                    │ + Cloud Run Sync   │
                                    └───────────────────┘
```

1. **Vision-Agent (Gemini 2.5 Flash):** An ASHA worker photographs a handwritten Yellow Card. The PII Blur Engine applies client-side Gaussian blur to names and Aadhaar numbers. Gemini then evaluates the anonymized image using a 3-pass Chain-of-Thought (CoT) prompt to extract chronological vaccine dates and batch numbers with high confidence scores.

2. **Protocol-Agent (Clinical RAG):** Extracted data is validated against a local NIS 2026 rules engine. The agent mathematically computes missed dosages, contraindication risks, and assigns Red/Yellow/Green urgency triage scores.

3. **Vani-Agent (Google Cloud Translation + TTS):** Clinical results are translated into 12+ Indian languages and synthesized into Neural2 speech. The phone speaks instructions like *"Paracetamol 1.5ml har 6 ghante mein"* — completely bypassing literacy limitations.

4. **Offline Synchronization:** The structured data packet is persisted locally via Service Workers. When connectivity returns, Firebase Firestore's offline persistence layer automatically syncs to the central database.

---

## Key Assumptions Made

- **Hardware Baseline:** ASHA workers possess a mid-range Android smartphone capable of running a PWA with WebGL support.
- **Network Initialization:** The PWA is initially installed in an area with WiFi/LTE to cache Service Workers and static assets. Subsequent village visits work fully offline.
- **Data Integration Schema:** Since live access to India's U-WIN sandbox API is not publicly available, the system syncs to a standardized NIS-2026 JSON compliance schema.

---

## Project Architecture

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/vision/         # Vision-Agent API endpoint
│   ├── api/vani/           # Vani-Agent API endpoint
│   ├── scan/               # Camera scanning page
│   ├── timeline/           # 3D vaccine timeline (React Three Fiber)
│   ├── medicine/           # Drug-dose safety scanner
│   ├── sync/               # U-WIN sync verification dashboard
│   ├── error.tsx           # App-level error boundary
│   ├── global-error.tsx    # Layout-level error boundary
│   └── not-found.tsx       # Custom 404 page
├── core/                   # Domain layer (Clean Architecture)
│   ├── entities/           # Domain models
│   ├── interfaces/         # Agent contracts (DI boundaries)
│   └── usecases/           # Business logic orchestration
├── infrastructure/         # External service adapters
│   ├── ai/                 # Gemini client, Vision-Agent, Protocol-Agent
│   ├── gcp/                # Google Cloud Translation + TTS client
│   ├── firebase/           # Firebase configuration
│   ├── pii/                # Client-side PII blur engine
│   └── uwin/               # U-WIN schema adapter
├── presentation/           # UI layer
│   ├── components/         # GlassButton, GlassCard, Timeline3D, etc.
│   └── hooks/              # useCamera, useOfflineSync, useFirebaseAuth
└── data/                   # Static NIS 2026 rules, catch-up schedules
```

---

## Evaluation Criteria Coverage

### 🌟 Code Quality

- **Clean Architecture:** Rigid separation between Presentation, Domain (Core), and Infrastructure layers with dependency inversion through interfaces (`IVisionAgent`, `IProtocolAgent`, `IVaniAgent`).
- **Custom React Hooks:** Business logic extracted into reusable hooks (`useCamera`, `useOfflineSync`, `useFirebaseAuth`) — keeping UI components pure.
- **Strict TypeScript:** `strict: true` in `tsconfig.json`, `@typescript-eslint/no-explicit-any: "error"` enforced via ESLint. Zero `any` types in production code.
- **Error Boundaries:** Both route-level (`error.tsx`) and layout-level (`global-error.tsx`) error boundaries prevent full-app crashes.
- **Loading States:** Proper `loading.tsx` and `not-found.tsx` components for graceful UX during page transitions.

### 🔒 Security (Safe & Responsible AI)

- **Zero PII Leaks:** `blur-engine.ts` applies client-side Gaussian blur to names and Aadhaar numbers *before* images ever leave the device for Gemini processing.
- **HTTP Security Headers:** `next.config.mjs` enforces Content-Security-Policy, Strict-Transport-Security (HSTS), X-Frame-Options (DENY), X-XSS-Protection, X-Content-Type-Options, and Referrer-Policy on all routes.
- **Tenant-Isolated Firestore Rules:** `firestore.rules` enforces `request.auth.uid == resource.data.userId` — users can only access their own children's records.
- **Storage Sandboxing:** `storage.rules` restricts uploads to user-specific directories with 10MB file size limits and content-type validation.
- **Input Validation:** All API routes validate request payloads and return structured error responses. No raw error messages are exposed to clients.
- **Environment Variable Validation:** Runtime checks ensure all required API keys (`GEMINI_API_KEY`, Firebase config) are present before server startup.

### ⚡ Efficiency

- **Edge-First Architecture:** Heavy AI processing runs server-side via API routes and Google Cloud Run, keeping the client lightweight for low-end devices.
- **PWA Caching:** `next-pwa` pre-caches all static assets, 3D models, and NIS 2026 rules data for instant offline availability.
- **Dynamic Imports:** 3D timeline (`Timeline3D`) is dynamically imported with `ssr: false` to prevent blocking initial page load.
- **Optimized Docker Builds:** Custom `Dockerfile` with multi-stage builds for Cloud Run deployment, bypassing React 19 peer-dependency issues.

### 🧪 Testing

- **Unit Tests:** Vitest test suite covering Vision-Agent, Protocol-Agent, Vani-Agent, PII blur engine, and UI components.
- **Component Tests:** `@testing-library/react` tests for `GlassButton`, `GlassCard`, `StatusBadge` — including disabled state, click handling, and rendering.
- **Hook Tests:** `useCamera` lifecycle testing with mocked `navigator.mediaDevices` — verifying initialization, permission handling, and cleanup.
- **Integration Tests:** End-to-end workflow tests simulating the full Scan → Vision → Protocol → Vani pipeline.
- **Security Tests:** Input validation tests for API routes, XSS prevention, payload size limits.
- **Accessibility Tests:** ARIA attribute validation, keyboard navigation, and screen reader compatibility tests.
- **CI/CD:** GitHub Actions workflow (`.github/workflows/ci.yml`) runs the full test suite on every push.

### ♿ Accessibility

- **Audio-First Design:** All clinical readouts are vocalized via Google Cloud TTS, completely bypassing visual/literacy barriers.
- **WCAG 2.1 AA Compliance:** All interactive elements have `aria-label`, `aria-disabled`, and proper `role` attributes. Semantic HTML throughout.
- **Keyboard Navigation:** Full keyboard operability with visible focus rings on all interactive elements.
- **Color Contrast:** Urgency badges (Red/Yellow/Green) meet WCAG AA contrast ratios. Dark mode support via `prefers-color-scheme`.
- **Skip Navigation:** Skip-to-content link for screen reader users.
- **Responsive Design:** Mobile-first layout constrained to 600px for optimal PWA experience on low-end devices.

### ☁️ Integration of Google Services

| Google Service | Usage | File |
|---|---|---|
| **Gemini 2.5 Flash** | Multimodal OCR with Chain-of-Thought reasoning for Yellow Card extraction | `gemini-client.ts`, `vision-agent.ts` |
| **Google Cloud Run** | Hosts Next.js frontend + containerized Python inference engines | `Dockerfile`, `cloud-run/` |
| **Google Cloud Translation** | Real-time translation of clinical alerts into 12+ Indian languages | `gcp/client.ts` |
| **Google Cloud Text-to-Speech** | Neural2 voice synthesis for audio nudges in regional dialects | `gcp/client.ts` |
| **Firebase Firestore** | Offline-first database with automatic sync when connectivity returns | `firebase/config.ts` |
| **Firebase Storage** | Secure storage for anonymized Yellow Card images | `storage.rules` |
| **Firebase Authentication** | Phone-based auth for ASHA worker identity verification | `useFirebaseAuth.ts` |

---

## Setup & Deployment

### Prerequisites

- Node.js 20+
- Google Cloud account with Gemini API, Translation, and TTS APIs enabled
- Firebase project with Firestore, Storage, and Authentication configured

### Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Configure environment
cp .env.example .env
# Fill in GEMINI_API_KEY, Firebase config, etc.

# Start development server
npm run dev

# Run tests
npx vitest run
```

### Production Deployment (Google Cloud Run)

```bash
# Build and deploy
gcloud run deploy sanjeevani-kavach \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated
```

### Important Notes

- **Camera Access:** The `/scan` page requires HTTPS or localhost. On Cloud Run, grant Chrome camera permissions via Site Settings.
- **API Keys:** Supply `GEMINI_API_KEY` and Firebase configuration via environment variables (`.env`).

---

## License

Built for PromptWars India 2026. All rights reserved.
