# Onboardly Mk-II

Onboardly is a high-performance **User Onboarding Platform** designed to help your customers start using your product successfully. It helps you guide new users through organized checklists, live progress tracking, and automatic updates.

## How it Works
Onboardly acts as a central workspace where every customer follows a clear **Onboarding Plan** to get the most out of your software.

---

## Features (Mk-II)

### 1. Automatic Reminders
Simple tracking isn't enough. Onboardly helps you bring users back when they stop moving forward.
- **Inactivity Detection:** The system knows when a customer hasn't made progress.
- **Gentle Nudges:** If a customer stops for more than 48 hours, a friendly reminder is automatically sent via email to help them jump back in.

### 2. AI Step Generator
Stop worrying about what steps to include.
- **Quick Setup:** Just enter your product link and a short description.
- **Smart Suggestions:** The AI analyzes your product and generates a 5-step onboarding plan designed to get your users active quickly.

### 3. Integrated Widget
You don't have to send users to another website. You can put Onboardly right inside your own app.
- **Floating Button:** A small, clean button that stays in the corner of your app.
- **Built-in Checklist:** Users can see and complete their tasks without ever leaving your product.

### 4. Notifications & Webhooks
Connect Onboardly to the other tools you use.
- **Webhooks:** Send data to your own server automatically when a task is finished.
- **Automatic Emails:** Send real-time "Task Completed" updates using Resend.
- **Activity Logs:** See exactly when notifications were sent and if they were successful.

### 5. Success Moments & Celebrations
Onboarding should feel rewarding for your customers.
- **Celebration Effects:** Fun screen effects trigger whenever a customer reaches a goal.
- **Completion Badges:** Professional messages that congratulate users when they finish their setup.

---

## Smart Analytics
- **Funnel Tracking:** See exactly where users are dropping off in your onboarding process.
- **Activation Rates:** Get clear insights into how many users are successfully finishing their setup.
- **Problem Detection:** Automatically find which specific steps are confusing or blocking your customers.

---

## Technology Behind the Scenes
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Database:** Firebase Real-time Data
- **Backend:** Vercel Serverless Functions
- **Emails:** Resend API
- **AI Logic:** Smart Sequence Generation

---

## Quick Integration

### JS Widget Snippet
Add this small piece of code to your website:
```html
<script 
  src="https://onboardly-nexus.vercel.app/widget-loader.js" 
  data-onboardly-id="YOUR_CUSTOMER_ID"
></script>
```

### Environment Settings
```env
VITE_FIREBASE_API_KEY=...
RESEND_API_KEY=...
GEMINI_API_KEY=... 
APP_URL=https://your-app.vercel.app
```

---

## Project Layout
- `/api/`: Backend functions for emails and AI.
- `/public/widget-loader.js`: The script for the embedded widget.
- `/src/lib/`: Logic for sending updates.
- `/src/pages/WidgetView.tsx`: The design for the embedded checklist.
- `/src/pages/dashboard/IntegrationView.tsx`: The developer guide in the dashboard.

---
*Created by the Onboardly Team. Built to help your customers succeed.*
