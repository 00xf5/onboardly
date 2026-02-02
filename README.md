# Onboardly Nexus Mk-II 🚀

Onboardly is a high-performance, checklist-driven **User Activation Engine** designed to bridge the "Aha! Moment" gap. It transforms passive signups into activated power-users through structured onboarding logic, real-time telemetry, and automated engagement relays.

## 🌌 The Nexus Protocol
Onboardly operates as a centralized command center where every partner (client) follows a pre-defined **Sequence Logic Blueprint** to reach full product activation.

---

## 💎 Advanced Features (Mk-II)

### 1. 👻 Ghost Nudge Subsystem (Retention Engine)
Passive tracking is a thing of the past. Onboardly now includes an automated retention daemon.
- **Idle Detection:** The system monitors partner activity timestamps.
- **Automated Re-activation:** If a partner stagnates for >48 hours, a "Ghost Nudge" signal is automatically dispatched via email to bring them back into the flow.
- **Vercel Cron Powered:** Reliable, serverless execution of retention logic.

### 2. 🤖 AI Blueprint Forge
Eliminate the "Blank Page" friction for new SaaS owners. 
- **Sequence Generation:** Input any product URL and description.
- **Automated Logic:** The AI Forge analyzes the context and generates a 5-step strategic onboarding sequence designed for maximum conversion.

### 3. 🛡️ Trojan Horse Widget (Deep Integration)
Don't force users to leave your app. The Trojan Horse Widget allows you to embed the entire Onboardly experience into your own product via a 3-line JS script.
- **Floating HUD:** A non-intrusive activator that sits in the corner of your app.
- **Iframe Isolation:** Secure, cross-origin communication between your product and the Nexus.

### 4. 🪝 Nexus Relay MK-II (Outbound Signals)
Bridge your product core with external marketing stacks.
- **Webhooks:** Instant JSON payloads pushed to your backend on task completion.
- **Automated Emails:** Real-time "Objective Accomplished" notifications via **Resend**.
- **Telemetry Logs:** Full visibility into outbound signals through the Relay Telemetry feed.

### 5. 🎢 Dopamine Loops & Celebrations
Onboarding should feel like a win. 
- **Milestone Confetti:** High-performance canvas celebrations trigger on objective completion.
- **Success Overlays:** Branded status modals that reinforce progress and incentivize completion.

---

## 📊 High-Fidelity Intelligence
- **Live Funnel Analysis:** Real-time calculation of drop-offs based on actual database heuristics.
- **Activation Pulse:** Dynamic insight into activation rates, time-to-value, and risk levels.
- **Failing Steps Identification:** Automated detection of specific blueprint tasks that are blocking your growth.

---

## 🛠️ Technology Stack
- **Core:** React 18 + Vite + Tailwind CSS (Aesthetic: Modern Glassmorphism)
- **Persistence:** Firebase (Auth + Firestore Real-time Listeners)
- **Backend:** Vercel Serverless Functions + Vercel Cron Jobs
- **Communication:** Resend API + Webhook Relays
- **Intelligence:** AI Blueprint Forge (Sequence Generation Logic)
- **Celebrations:** Canvas-Confetti (Dynamic Load)

---

## 🚀 Rapid Integration

### JS Widget Snippet
Paste this at the end of your `<body>` tag:
```html
<script 
  src="https://onboardly-nexus.vercel.app/widget-loader.js" 
  data-onboardly-id="YOUR_PARTNER_SLUG"
></script>
```

### Environment Configuration
```env
VITE_FIREBASE_API_KEY=...
RESEND_API_KEY=...
GEMINI_API_KEY=... # For AI Forge
APP_URL=https://your-deployment.vercel.app
```

---

## 📂 Project Architecture
- `/api/`: Serverless Backend (Relays, AI Forge, Crons).
- `/public/widget-loader.js`: The standalone JS entry point.
- `/src/lib/relay.ts`: Outbound signal orchestration.
- `/src/pages/WidgetView.tsx`: The high-density embedded experience.
- `/src/pages/dashboard/IntegrationView.tsx`: The primary developer portal.

---
*Created for Product Growth Engineers by the Onboardly Core Team. Accelerate your path to "Aha!".*
