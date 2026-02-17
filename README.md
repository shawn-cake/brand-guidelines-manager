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
- **PDF Generation:** jsPDF (client-side PDF export)
- **AI Integration:** Claude API (document extraction via Convex actions)

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
│   │   │   ├── tabs/       # Tab content (FoundationsTab, PersonalityTab, AudiencesTab, VisualIdentityTab)
│   │   │   ├── ui/         # Base UI primitives (Button, Input, Tooltip, etc.)
│   │   │   ├── form/       # Shared form components (ControlledInput, Section, FormField, etc.)
│   │   │   └── figma/      # Figma-specific components
│   │   ├── pages/          # Page components (ClientDashboard, EmptyState)
│   │   ├── hooks/          # Custom hooks (useFieldOperations)
│   │   ├── types/          # TypeScript interfaces (brandGuidelines.ts)
│   │   ├── data/           # Mock data
│   │   └── types.ts        # Core TypeScript definitions
│   ├── styles/             # Global styles and theme
│   ├── version.ts          # Auto-generated version info
│   └── main.tsx            # App entry point
├── convex/
│   ├── schema.ts           # Database schema (clients, versions, document_imports)
│   ├── clients.ts          # Client CRUD operations
│   ├── versions.ts         # Version management (save, restore, delete)
│   ├── documentImports.ts  # Document import tracking
│   ├── documentParsing.ts  # PDF/DOCX text extraction (unpdf, mammoth)
│   └── claudeExtraction.ts # Claude AI field extraction
├── scripts/
│   └── sync-version.js     # Auto-sync version from DEVLOG to version.ts
├── guidelines/
│   └── Guidelines.md       # Design system documentation
├── logs/
│   ├── CHANGELOG.md        # Technical change history
│   ├── DEVLOG.md           # Development narrative and decisions
│   └── STATE.md            # Current project state
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

## Shared Form Components

The app uses a centralized form component library (`src/app/components/form/`) for consistent styling and behavior:

| Component | Description |
|-----------|-------------|
| `ControlledInput` | Text input with blur-to-save pattern |
| `ControlledTextarea` | Multiline text with blur-to-save |
| `ControlledSelect` | Dropdown with immediate save on change |
| `Section` | Collapsible accordion with ARIA attributes |
| `FormField` | Label wrapper with optional description |

### useFieldOperations Hook

Custom hook (`src/app/hooks/useFieldOperations.ts`) for centralized data mutations:

```typescript
const { saveField, addToArray, removeFromArray, saveArrayItem, saveArrayItemField } = useFieldOperations(clientId, fullData);
```

## Key Features

### Client Management
- Create and organize multiple client brand guidelines
- Edit client names inline with consistent sizing
- Sort clients alphabetically or by last modified date
- Sidebar displays company name ("Cake Websites") and app version

### Tabbed Navigation
- **Foundations** — Business info, brand identity, services & providers
- **Personality & Tone** — Brand voice, personality traits, language guidelines
- **Target Audiences** — Demographics, personas, customer journey mapping
- **Visual Identity** — Logos, colors, typography, photography, applications
- Auto-saving form fields on blur
- Collapsible sections with Table of Contents navigation
- Controlled inputs that sync with backend state

### Version History
- **Save** — Create named snapshots of current guidelines
- **View** — Preview historical versions in read-only mode (yellow banner)
- **Restore** — Revert to a previous version (with confirmation)
- **Delete** — Remove unwanted versions (with confirmation)
- Clickable version badge opens version history panel

### Document Import (AI-Powered)
- **File Upload** — Drag-and-drop PDF, DOCX, TXT, MD, JSON files
- **URL Import** — Import from multiple URLs simultaneously
- **Paste Text** — Paste content directly for AI analysis
- Claude AI extracts structured brand guidelines fields
- Review modal to accept/reject individual extracted fields

### Real-time Sync
- Powered by Convex for collaborative editing
- All changes auto-save immediately
- Live updates across browser sessions

### Export Options
- **Markdown** — Download .md file or copy to clipboard
- **JSON** — Download .json file or copy to clipboard
- **PDF** — Generate formatted PDF with jsPDF
- **AI Prompt** — Copy general-purpose prompt for any AI tool
- Share URL button copies page link with toast confirmation
- Version numbers included in export filenames

## Figma Source

Original design: [Figma File](https://www.figma.com/design/O8FDxzcm63LnvzLHNoLPFw/figma-make-brand-guidelines-manager-v1)