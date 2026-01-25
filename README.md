# Brand Guidelines Manager

An internal tool for **Cake Websites** to create, manage, and maintain brand guidelines for clients in a collaborative environment.

## Overview

This application provides a professional interface for building comprehensive brand guidelines, covering:

- **Foundations** — Business info, brand identity, services & providers
- **Personality & Tone** — Brand voice, personality traits, language guidelines
- **Target Audiences** — Demographics, personas, customer journey mapping
- **Visual Identity** — Logos, colors, typography, photography, digital/print applications

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **Backend/Database:** Convex (real-time sync)
- **UI Components:** Radix UI primitives, shadcn/ui patterns
- **Icons:** Lucide React, FontAwesome
- **Notifications:** Sonner (toast notifications)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at **http://localhost:5173/**

### Build

```bash
npm run build
```

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── tabs/       # Tab content components (FoundationsTab, etc.)
│   │   │   ├── ui/         # Base UI primitives (Button, Input, etc.)
│   │   │   └── figma/      # Figma-specific components
│   │   ├── pages/          # Page components (ClientDashboard, etc.)
│   │   ├── data/           # Mock data
│   │   └── types.ts        # TypeScript definitions
│   ├── styles/             # Global styles and theme
│   └── main.tsx            # App entry point
├── convex/
│   ├── schema.ts           # Database schema
│   ├── clients.ts          # Client CRUD operations
│   └── versions.ts         # Version management (save, restore, delete)
├── guidelines/
│   └── Guidelines.md       # Design system documentation
└── index.html
```

## Design System

The app uses a custom design system with Cake agency branding:

| Color        | Hex       | Usage                          |
|--------------|-----------|--------------------------------|
| Cake Blue    | `#4074A8` | Primary actions, links, accents|
| Cake Yellow  | `#F2A918` | Accent buttons, highlights     |

### Button Styles

- **Primary** — Blue background, white text
- **Secondary** — White background, gray border
- **Accent** — Yellow background, black text (for key CTAs like "Save Version")
- **Ghost** — Transparent, blue text
- **Destructive** — Red background, white text

See `guidelines/Guidelines.md` for the complete design specification.

## Key Features

### Client Management
- Create and organize multiple client brand guidelines
- Edit client names inline
- Sort clients alphabetically or by last modified date

### Tabbed Navigation
- Organized sections for different aspects of brand identity
- Auto-saving form fields on blur
- Controlled inputs that sync with backend state

### Version History
- **Save** — Create named snapshots of current guidelines
- **View** — Preview historical versions in read-only mode
- **Restore** — Revert to a previous version (with confirmation)
- **Delete** — Remove unwanted versions (with confirmation)

### Real-time Sync
- Powered by Convex for collaborative editing
- All changes auto-save immediately
- Live updates across browser sessions

### Export Options
- Export guidelines in various formats (PDF, JSON)
- Share URL functionality

## Figma Source

Original design: [Figma File](https://www.figma.com/design/O8FDxzcm63LnvzLHNoLPFw/figma-make-brand-guidelines-manager-v1)
