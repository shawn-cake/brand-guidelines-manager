# Development Log

A narrative chronicle of the project journey - the decisions, discoveries, and pivots that shaped the work.

---

## Related Documents

📊 **[CHANGELOG](./CHANGELOG.md)** - Technical changes and version history
📈 **[STATE](./STATE.md)** - Current project state and metrics

> **For AI Agents:** This file tells the story of *why* decisions were made. Before starting work, read **Current Context** section. For technical details of *what* changed, see CHANGELOG.md.

---

## Current Context

**Last Updated:** 2026-01-24

### Project State
- **Project:** Brand Guidelines Manager
- **Version:** v0.1.0-dev
- **Active Branch:** `main`
- **Phase:** Feature Development - Document Import complete

### Current Objectives
- [x] Implement Version History with real Convex data
- [x] Populate all 4 tabs with form fields (Foundations, Personality, Audiences, Visual Identity)
- [x] Fix controlled components for View/Restore functionality
- [x] Install Log File Genius for documentation
- [x] Document Import feature with Claude AI extraction
- [x] Add sidebar metadata (company name, version)
- [x] Auto-sync version from DEVLOG
- [ ] Test Version History across all tabs
- [ ] Add data validation and error handling

### Known Risks & Blockers
- None currently

---

## Daily Log - Newest First

### 2026-01-24: Added Sidebar Metadata and Auto-Sync Version

**The Situation:** The sidebar needed to display company branding ("Cake Websites") and the app version. The version should stay in sync with the DEVLOG automatically.

**The Challenge:** Manually updating version numbers in multiple places leads to inconsistency. Need a single source of truth.

**The Decision:** Created a build-time script that reads the version from DEVLOG.md and generates `src/version.ts`. The script runs automatically on `npm run dev` and `npm run build`.

**Why This Matters:** Version is now defined in one place (DEVLOG.md) and automatically propagates to the UI. Also added version numbers to export filenames for better file organization.

**The Implementation:**
- Created `scripts/sync-version.js` to parse DEVLOG.md and generate version.ts
- Added `src/version.ts` with APP_VERSION, APP_NAME, COMPANY_NAME exports
- Updated Sidebar to display "Cake Websites • v0.1.0-dev" below title
- Updated ExportDropdown to include version in filenames (e.g., `client-brand-guidelines-v1.0.md`)
- Fixed client name input to maintain consistent size when editing

**The Result:** Single source of truth for version in DEVLOG.md, auto-synced to UI on every build.

**Files Changed:** `scripts/sync-version.js`, `src/version.ts`, `src/app/components/Sidebar.tsx`, `src/app/components/ExportDropdown.tsx`, `src/app/pages/ClientDashboard.tsx`, `package.json`

---

### 2026-01-24: Completed Document Import Feature with Claude AI

**The Situation:** Users needed a way to quickly populate brand guidelines from existing documents (PDFs, Word docs, text files) rather than manually entering all data.

**The Challenge:** Multiple technical hurdles: (1) PDF parsing in serverless environments fails with browser API errors, (2) Claude extracts partial data that may have null values, (3) Schema validators had required fields that rejected partial data.

**The Decision:** Built a 5-phase document import system: file upload → text extraction → Claude analysis → user review → selective field application. Used `unpdf` for serverless-compatible PDF parsing and made all schema fields optional.

**Why This Matters:** This dramatically reduces the time to onboard new clients. Instead of hours of manual data entry, users can upload existing brand documents and have Claude extract the key information automatically.

**The Implementation:**
- Created `ImportDocumentModal.tsx` with drag-and-drop file upload
- Created `convex/documentParsing.ts` with Node.js actions for PDF (unpdf) and DOCX (mammoth) parsing
- Created `convex/claudeExtraction.ts` for Claude API integration with structured brand guidelines schema
- Created `ReviewExtractedFieldsModal.tsx` for user review with accept/reject controls
- Updated `convex/schema.ts` to make all nested fields optional for partial data support

**The Result:** Full document import pipeline working for PDF, DOCX, TXT, MD, and JSON files. Users can review and selectively apply extracted fields to client data.

**Files Changed:** `src/app/components/ImportDocumentModal.tsx`, `src/app/components/ReviewExtractedFieldsModal.tsx`, `convex/documentImports.ts`, `convex/claudeExtraction.ts`, `convex/documentParsing.ts`, `convex/schema.ts`, `src/app/pages/ClientDashboard.tsx`

---

### 2026-01-22: Installed Log File Genius for AI Context Management

**The Situation:** Working on a complex Brand Guidelines Manager application with 4 tabs, each containing many form fields. AI context was getting lost between sessions, requiring repeated explanations.

**The Challenge:** How do we maintain project context efficiently for AI assistants without bloating the context window with verbose documentation?

**The Decision:** Adopted Log File Genius - a five-document system (CHANGELOG, DEVLOG, STATE, ADRs, incidents) that reduces AI context bloat by 93% while improving project memory. Chose "team" profile for consistent documentation standards.

**Why This Matters:** With structured logs, AI assistants can understand project history, decisions, and current state without lengthy re-explanations. The token-efficient format keeps context windows free for actual coding work.

**The Implementation:** Installed as git submodule, ran install script, configured for Augment AI assistant with team profile. Created initial log entries documenting recent work.

**The Result:** Clear documentation structure in place. AI rules installed to `.augment/rules/` to enforce log maintenance before commits.

**Files Changed:** `logs/CHANGELOG.md`, `logs/DEVLOG.md`, `logs/STATE.md`, `.augment/rules/log-file-maintenance.md`, `.logfile-config.yml`

---

### 2026-01-22: Completed All 4 Brand Guidelines Tabs

**The Situation:** Brand Guidelines Manager had only the Foundations tab functional. Three tabs (Personality & Tone, Target Audiences, Visual Identity) showed "Coming Soon" placeholders.

**The Challenge:** Each tab needed dozens of form fields, all supporting controlled components for Version History View/Restore functionality. The key issue was React's `defaultValue` doesn't update when props change.

**The Decision:** Created reusable `ControlledInput` and `ControlledTextarea` components that sync with external values via `useEffect` and only save on blur. Applied this pattern consistently across all tabs.

**Why This Matters:** Version History is a core feature - users must be able to view historical snapshots in read-only mode. Without controlled components, the View button showed stale data.

**The Implementation:** Rewrote PersonalityTab, AudiencesTab, and VisualIdentityTab from scratch with proper Convex integration, controlled components, and readOnly support. Fixed JSX parsing errors from escaped quotes.

**The Result:** All 4 tabs fully functional with Version History support. Users can Save, View, Restore, and Delete versions across the entire brand guidelines document.

**Files Changed:** `src/app/components/tabs/PersonalityTab.tsx`, `src/app/components/tabs/AudiencesTab.tsx`, `src/app/components/tabs/VisualIdentityTab.tsx`, `src/app/pages/ClientDashboard.tsx`

---

## Archive

**Entries older than 14 days** are archived for token efficiency.
<!-- No archives yet -->
