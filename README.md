# Onboardly: Stop Losing Users at Signup

Most users sign up for your product and never reach the "Aha! moment." They get confused, they get distracted, and they ghost you. **Onboardly fixes the signup-to-churn gap automatically.**

If you don't have a structured way to guide new users, you are bleeding revenue. Onboardly is the workspace that ensures every single customer reaches full activation.

## The Single Source of Truth
Stop guessing where your users are stuck. Onboardly provides a clear, documented path for every customer, ensuring no user is ever left behind or forgotten.

---

## The Growth Arsenal (Mk-II)

### 1. Automated Recovery (Ghost Nudges)
An unfinished setup is a slow death for your SaaS. Onboardly acts as your safety net.
- **Inactivity Detection:** The system knows the second a user stops moving forward.
- **Automatic Retention:** If a customer stalls for more than 48 hours, Onboardly sends a friendly nudge via email to bring them back into the product. Stop the churn before it starts.

### 2. Zero-Thinking Setup (AI Forge)
You don't need to spend weeks writing onboarding documentation. 
- **Instant Blueprints:** Enter your website URL and a short description.
- **AI Generation:** The system analyzes your product and builds a professional, high-conversion onboarding plan in seconds. No thinking required.

### 3. The Trojan Horse (Embedded Widget)
Don't force your users to leave your app to learn how to use it.
- **In-App Checklist:** Place the Onboardly HUD directly inside your own product with three lines of code.
- **Seamless Guidance:** Users see exactly what they need to do next without ever losing focus or leaving your environment.

### 4. Real-time Signaling (Relays)
Connect your onboarding logic to your entire tech stack.
- **Webhooks:** Instant data pushes to your server the moment an objective is reached.
- **Victory Notifications:** Automatic "Task Completed" notifications sent via Resend to keep stakeholders in the loop.

### 5. Dopamine Loops (Celebrations)
Success should feel like a win. Onboardly uses high-performance celebrations and completion badges to reward users for taking action, turning a boring setup into a series of victories.

---

## Identify Your Revenue Leaks
Stop looking at vanity metrics. Get the raw truth.
- **Funnel Visibility:** See the exact step where users are quitting.
- **Activation Pulse:** Real-time data on who is actually using your product and who is just a ghost.
- **Kill the Friction:** Identify the specific tasks that are blocking your growth and fix them instantly.

---

## Technical Backbone
- **Core:** React 18 + Vite + Tailwind CSS
- **Cloud Database:** Firebase (Real-time Sync)
- **Execution:** Vercel Serverless & Cron
- **Communication:** Resend API
- **Intelligence:** Automated Sequence Generation

---

## 3-Line Integration

### The Widget Snippet
Copy and paste this before your `</body>` tag to turn on the Trojan Horse:
```html
<script 
  src="https://onboardly-nexus.vercel.app/widget-loader.js" 
  data-onboardly-id="YOUR_CUSTOMER_ID"
></script>
```

### Environment Configuration
```env
VITE_FIREBASE_API_KEY=...
RESEND_API_KEY=...
GEMINI_API_KEY=... 
APP_URL=https://your-app.vercel.app
```

---

## Project Structure
- `/api/`: High-performance backend relays.
- `/public/widget-loader.js`: The embedded JS entry point.
- `/src/pages/WidgetView.tsx`: The in-app checklist design.
- `/src/pages/dashboard/IntegrationView.tsx`: The primary developer gateway.

---
*Built for founders who are tired of losing users. Stop the ghosting. Start the activation.*
