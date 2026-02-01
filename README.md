# Onboardly Nexus

Onboardly is a high-performance, checklist-driven user activation engine designed to bridge the "Aha! Moment" gap. It transforms passive signups into activated power-users through structured onboarding flows, real-time analytics, and automated engagement relays.

## The Core Philosophy

Onboardly operates on the **"Nexus Protocol"**: A centralized command center where every partner (client) follows a pre-defined logic blueprint (flow) to reach full product activation.

## Key Architectural Pillars

### 1. Multi-Tenant Isolation (The Fort Knox Model)
The platform is built on a strict multi-tenant architecture. Every Admin (SaaS owner) operates in a secure, siloed workspace.
- **Privacy:** Data is scoped using unique `userId` filters at the database level.
- **Independence:** Tenants never share clients, flows, or templates.
- **Security:** Integrated Firebase Auth and Firestore Security Rules ensure zero data leakage.

### 2. Automated Blueprint Connection
Onboardly connects the "Admin's Vision" with the "Client's Reality."
- **Blueprints:** Admins create `Templates` with specific tasks and milestones.
- **Automated Sync:** When a new partner is integrated, the system automatically pulls the "DNA" (tasks) from the selected template and injects it into the client's onboarding record.
- **Dynamic Flows:** Reorder and edit steps in the **Visual Flow Editor** to adapt your strategy on the fly.

### 3. Invitation Relay System
Onboardly simplifies the "Handshake" between you and your partners.
- **Unique Nexus Links:** Every client gets a cryptographically unique `slug`.
- **Instant Invites:** Admins can generate and copy "Invitation Links" with one click.
- **Public Onboarding:** Partners access a branded, login-free onboarding page dedicated to their specific progress.

### 4. Financial Interface and Tier Gating
The platform features a built-in **NOWPayments** portal for seamless tier upgrades and hard feature gating.
- **Tier Escalation:** Move from the baseline *Nexus* tier to *Pro* ($16/mo or approx. 23,000 NGN).
- **Hard Gating:** Premium features like the Visual Flow Engine, Insights Feed, and Webhooks are restricted using the **LockedFeature** security component until a tier upgrade is verified.
- **Crypto Support:** Integrated support for leading digital assets via the embedded payment nexus.

## Analytics and Insights

- **Live Onboarding Funnel:** Track real-time drop-offs from signup to activation.
- **Activation Pulse:** High-fidelity metrics on activation rates and time-to-value.
- **Recent Events Feed:** A dedicated stream of partner activity (Task completions, skips, failures) logged in real-time.
- **Actionable Recommendations:** Smart insights that highlight which onboarding steps are actually blocking growth.

## Technology Stack

- **Frontend:** React + Vite + Tailwind CSS (Aesthetic: Modern Dark Mode / High-Performance UI)
- **Backend:** Firebase (Authentication + Firestore + Security Rules)
- **State Management:** React Hooks + Real-time Firestore Listeners
- **Visualization:** Recharts + Lucide Icons
- **Payments:** NOWPayments Crypto Integration

## Getting Started

### Prerequisites
- Node.js (v18+)
- Firebase Account (for database and auth)

### Installation
1. Clone the repository and navigate into the folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Establish your environment variables in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   NOWPAYMENTS_API_KEY=your_api_key_here
   ```
4. Launch the Dev Nexus:
   ```bash
   npm run dev
   ```

## Project Structure

- `/src/pages/Dashboard.tsx`: The primary Command Gateway.
- `/src/pages/dashboard/`: Isolated sub-modules (Emails, Flows, Templates, Settings).
- `/src/pages/PublicOnboarding.tsx`: The bridge for inbound partners with real-time event tracking.
- `/src/components/Loader.tsx`: The branded Nexus PageLoader for secure transitions.
- `/src/components/dashboard/LockedFeature.tsx`: Tier-verification security component.

---
*Created by the Onboardly Core Team. Designed for Product Growth Engineers.*
