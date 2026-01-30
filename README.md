# Onboardly

Onboardly is a powerful, checklist-driven user onboarding and activation engine designed to help product teams improve user activation rates. It provides a suite of tools to create, manage, and analyze onboarding flows, identify friction points, and engage users contextually.

## Table of Contents

- [Features](#features)
  - [Must-Have Features](#must-have-features)
  - [Should-Have Features](#should-have-features)
  - [Recently Implemented](#recently-implemented)
- [Architecture and Data Flow](#architecture-and-data-flow)
  - [Data Models](#data-models)
  - [Core Logic](#core-logic)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Recent Updates](#recent-updates)

## Features

### Must-Have Features

1.  **Workspace & Project Model**: Supports multiple workspaces and multiple projects per workspace, allowing for organizational separation and role-based access.
2.  **Onboarding Flow Engine**: A step-based engine with conditional logic, allowing flows to be reordered and steps to be enabled or disabled without redeploying.
3.  **Checklist-Driven Activation**: Defines activation through a checklist of tasks, tracks progress with a percentage bar, and provides a clear "activated" state.
4.  **Contextual UI Triggers**: Delivers tooltips, modals, and inline hints triggered by page views, events, time, or user state.
5.  **Event Tracking**: A minimal but precise event tracking system for key actions like step completion, skips, and failures, with automatic timestamping and metadata attachment.
6.  **Activation Funnel Analytics**: Provides a clear funnel from signup to activation, with per-step drop-off percentages and average time per step, all segment-aware.
7.  **Failing Step Detection**: Automatically ranks onboarding steps by their failure rate to highlight critical blockers.
8.  **User Segmentation**: Basic user segmentation into categories like new users, returning inactive, power users, and churn risk, which can be used to filter analytics.
9.  **Dashboard (Single-Screen Truth)**: A comprehensive dashboard that provides an at-a-glance overview of activation rate, time to activate, drop-off risk, a funnel view, and a live events feed.
10. **Dev-First Integration**: A simple JS snippet for easy integration, with support for React, SSR frameworks (Next.js, Remix, Vite), and stable user ID mapping.

### Should-Have Features

1.  **Flow Templates**: Pre-built templates for common use cases like SaaS, creator tools, API/dev tools, and internal apps.
2.  **Visual Flow Editor**: A user-friendly interface for building and managing onboarding flows, with a step list, conditions panel, and live preview.
3.  **Insights / Recommendations Box**: An advisor mode that provides actionable recommendations based on user data.
4.  **Webhooks / Export**: Support for webhooks on activation events and data export to CSV for integration with other tools.

### Recently Implemented

1.  **Client Management System**: Full CRUD operations for client management including:
    - Edit client details (name, email, company, template, status, segment)
    - View client progress and task completion status
    - Delete clients with confirmation
    - Real-time updates across the dashboard
2.  **Flow Template Cloning**: Ability to clone flows from predefined templates with automatic task mapping
3.  **Enhanced Multi-Tenancy**: Complete workspace and project isolation with proper data scoping
4.  **Visual Flow Editor**: Interactive flow builder with step management and live preview
5.  **Webhooks Integration**: Webhook URL configuration and client data export capabilities

## Architecture and Data Flow

Onboardly is a client-side application built with React and Vite. All data is currently stored in the browser's `localStorage` via a centralized `store` module.

### Data Models

The core data models are defined in `src/lib/store.ts`:

-   **Workspace**: The top-level organizational unit.
-   **Project**: Belongs to a Workspace and contains Flows and Clients.
-   **Flow**: A sequence of steps that defines an onboarding experience.
-   **Step**: An individual action or piece of content within a Flow, with properties for conditional logic and UI triggers.
-   **Client**: Represents an end-user being onboarded, tracking their progress, activation status, and segment.
-   **Event**: A record of a user action, used for analytics and triggering UI elements.
-   **Trigger**: Defines the conditions under which a Step's UI element is displayed.

### Core Logic

All application state is managed within the `store` object in `src/lib/store.ts`. This object provides methods for creating, reading, updating, and deleting all data models. The UI components are responsible for calling these methods and re-rendering when data changes.

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd onboardly
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

To run the application in development mode, use the following command:

```bash
npm run dev
```

This will start a local development server, and you can view the application in your browser at `http://localhost:8080` (or `http://localhost:5173` depending on your Vite configuration).

## Project Structure

```
/src
|-- components/          # Reusable UI components
|   |-- dialogs/        # Modal and dialog components
|   |-- ui/             # Base UI components (buttons, inputs, etc.)
|-- hooks/              # Custom React hooks
|-- lib/                # Core logic and utilities (store.ts)
|-- pages/              # Main application pages and dashboard components
|   |-- dashboard/      # Dashboard-specific components
|-- App.tsx             # Main application component with routing
|-- main.tsx            # Application entry point
```

## Recent Updates

### Latest Changes (January 2026)

- **Fixed Client Management**: Resolved the empty "Manage" functionality by implementing a comprehensive client management dialog
- **Enhanced Store Functions**: Fixed duplicate `cloneFlowFromTemplate` function and ensured proper TypeScript compilation
- **Multi-Tenancy Verification**: Confirmed complete workspace and project isolation with proper data scoping
- **UI Improvements**: Updated various dashboard components for better user experience and functionality
- **Error Resolution**: Fixed TypeScript errors and ensured all components compile without issues

### Key Improvements

1. **Client Management Dialog**: 
   - Full editing capabilities for client details
   - Progress tracking and task management
   - Delete functionality with confirmation
   - Real-time updates across the application

2. **Flow Templates**: 
   - Working template cloning functionality
   - Automatic task mapping from templates to flows
   - Integration with the visual flow editor

3. **Data Integrity**: 
   - Proper multi-tenant data isolation
   - Consistent error handling
   - Type-safe operations throughout the application
