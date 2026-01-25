# Development Log

A narrative chronicle of the project journey - the decisions, discoveries, and pivots that shaped the work.

---

## Related Documents

📊 **[CHANGELOG](./CHANGELOG.md)** - Technical changes and version history
📈 **[STATE](./STATE.md)** - Current project state and metrics

> **For AI Agents:** This file tells the story of *why* decisions were made. Before starting work, read **Current Context** section. For technical details of *what* changed, see CHANGELOG.md.

---

## Current Context

**Last Updated:** 2026-01-25

### Project State
- **Project:** Brand Guidelines Manager
- **Version:** v0.1.0-dev
- **Active Branch:** `main`
- **Phase:** Feature Development - UI Polish

### Current Objectives
- [x] Implement Version History with real Convex data
- [x] Populate all 4 tabs with form fields (Foundations, Personality, Audiences, Visual Identity)
- [x] Fix controlled components for View/Restore functionality
- [x] Install Log File Genius for documentation
- [x] Document Import feature with Claude AI extraction
- [x] Add sidebar metadata (company name, version)
- [x] Auto-sync version from DEVLOG
- [x] Share URL button with clipboard copy and toast notification
- [x] Clickable version badge to open version history
- [x] Table of Contents repositioned inside content area
- [x] Multiple URL import support
- [x] PDF export functionality
- [x] AI Prompt export for use with any AI tool
- [ ] Test Version History across all tabs
- [ ] Add data validation and error handling

### Known Risks & Blockers
- None currently

---

## Daily Log - Newest First

### 2026-01-25: New Export Features - PDF and AI Prompts

**The Request:** User wanted two new export options: PDF export and AI prompts export. The AI prompts feature was suggested from a tool audit to generate optimized system prompts for different AI tools.

**The Implementation:**
1. **PDF Export** - Added jsPDF library for client-side PDF generation. The PDF includes all brand guidelines sections with proper formatting: headings, subheadings, bullet lists, and automatic page breaks.

2. **AI Prompts Export** - Initially implemented three separate prompts optimized for ChatGPT (markdown), Claude (XML), and Jasper (action-oriented). User feedback led to simplification: now a single general-purpose prompt that presents brand guidelines in a clean format usable with any AI tool.

**Key Decision:** Simplified from 3 AI-specific prompts to 1 universal prompt. The user's insight was that people will provide their own context - they just need the brand information in a clean, copy-paste format.

**Files Changed:** `src/app/components/ExportDropdown.tsx`

---

### 2026-01-25: Table of Contents UX Fix (with Claude Cowork)

**The Situation:** During a UX audit with Claude Cowork, we identified that the Table of Contents (ToC) highlight indicator wasn't working correctly. The blue dot that indicates expanded sections would not turn gray when collapsing a section directly by clicking its header—it only updated when clicking a different section in the ToC.

**The Root Cause:** The ToC component had two separate issues:
1. **Broken scroll spy:** The scroll-based "active section" highlighting didn't work properly with collapsible sections because collapsed sections have minimal height
2. **State sync gap:** The parent component (`ClientDashboard`) only read `expandedSections` from tab refs on tab change or ToC click, not when users toggled sections directly

**The Decision:** Remove the unreliable scroll-based highlighting entirely and fix the state synchronization:
- Removed ~55 lines of scroll spy code from `TableOfContents.tsx`
- Added `onExpandedSectionsChange` callback prop to all four tab components
- Connected the callback to update parent state whenever sections are toggled

**The Result:** The ToC now shows a simple, reliable indicator:
- Blue dot = section is expanded
- Gray dot = section is collapsed
- Updates immediately regardless of how the section was toggled

### 2026-01-25: Code Audit and Refactoring

**The Situation:** After months of rapid feature development, the codebase had accumulated significant technical debt. Each of the four tab components (FoundationsTab, PersonalityTab, AudiencesTab, VisualIdentityTab) contained duplicate implementations of controlled input components, field operations logic, and helper functions.

**The Challenge:**
1. **Code Duplication:** Each tab duplicated ~150 lines of component definitions (ControlledInput, ControlledTextarea, Section, FormField)
2. **Type Safety:** Components used `any` types throughout, losing TypeScript benefits
3. **Maintenance Burden:** Bug fixes or improvements had to be made in 4 places
4. **UX Issue:** ExportDropdown used browser `alert()` instead of toast notifications

**The Decision:** Conducted a comprehensive code audit and implemented a refactoring strategy:
- Extract shared components to a centralized `form/` directory
- Create a custom `useFieldOperations` hook for all data mutations
- Define comprehensive TypeScript interfaces matching the Convex schema
- Replace alerts with toast notifications for consistency

**Why This Matters:** The refactoring reduces total codebase size by ~400+ lines while improving maintainability. Future changes to form behavior, styling, or validation only need to be made in one place. Type safety catches errors at compile time rather than runtime.

**The Implementation:**
1. **Created Shared Form Components** (`src/app/components/form/`):
   - `ControlledInput.tsx` - Text input with blur-to-save pattern
   - `ControlledTextarea.tsx` - Multiline text with blur-to-save
   - `ControlledSelect.tsx` - Dropdown with immediate save on change
   - `Section.tsx` - Collapsible section with ARIA `aria-expanded` attribute
   - `FormField.tsx` - Label wrapper with optional description
   - `index.ts` - Barrel export with shared `inputClass` and `inputSmClass` constants

2. **Created Custom Hook** (`src/app/hooks/useFieldOperations.ts`):
   - `saveField(path, value)` - Save any field by path
   - `addToArray(path, item)` - Add item to array field
   - `removeFromArray(path, index)` - Remove item from array
   - `saveArrayItem(path, index, value)` - Update simple array item
   - `saveArrayItemField(path, index, field, value)` - Update object array item field
   - Includes error handling with toast notifications

3. **Created TypeScript Interfaces** (`src/app/types/brandGuidelines.ts`):
   - Complete type definitions for all nested data structures
   - Matches Convex schema exactly (~400 lines)
   - Includes: Asset, Foundations, PersonalityAndTone, TargetAudiences, VisualIdentity, ClientData, Client, Version

4. **Updated All Tab Components**:
   - Removed duplicate component definitions
   - Imported shared components and hook
   - Added proper TypeScript typing for data props
   - Reduced each file by ~150-200 lines

5. **Fixed UX Issue**:
   - Updated `ExportDropdown.tsx` to use `toast.success()` instead of `alert()`

**The Result:**
- FoundationsTab: ~580 → ~370 lines (36% reduction)
- PersonalityTab: ~540 → ~340 lines (37% reduction)
- AudiencesTab: ~670 → ~495 lines (26% reduction)
- VisualIdentityTab: ~795 → ~610 lines (23% reduction)
- Total: ~400+ lines of duplicate code eliminated
- Full TypeScript coverage for brand guidelines data
- Improved accessibility with ARIA attributes
- Consistent error handling and user feedback

**Files Created:**
- `src/app/components/form/ControlledInput.tsx`
- `src/app/components/form/ControlledTextarea.tsx`
- `src/app/components/form/ControlledSelect.tsx`
- `src/app/components/form/Section.tsx`
- `src/app/components/form/FormField.tsx`
- `src/app/components/form/index.ts`
- `src/app/hooks/useFieldOperations.ts`
- `src/app/types/brandGuidelines.ts`

**Files Modified:**
- `src/app/components/tabs/FoundationsTab.tsx`
- `src/app/components/tabs/PersonalityTab.tsx`
- `src/app/components/tabs/AudiencesTab.tsx`
- `src/app/components/tabs/VisualIdentityTab.tsx`
- `src/app/components/ExportDropdown.tsx`

---

### 2026-01-25: Quality of Life Improvements

**The Situation:** Users requested several small but impactful UX improvements: (1) clicking the version badge should open version history, (2) the Table of Contents should be inside the content area rather than a fixed sidebar, (3) importing from multiple URLs at once should be supported.

**The Challenge:** The ToC repositioning required restructuring the layout from a fixed sidebar to an inline element that stays sticky within the scrollable content area. The multi-URL import required converting single-object state to array-based state with individual status tracking.

**The Decision:** Implemented all three improvements: version badge as clickable button, ToC moved inside content area with 3/4 - 1/4 split layout, and multi-URL import with add/remove controls.

**Why This Matters:** These small improvements significantly enhance the user experience. Version badge click is intuitive, ToC inside content area feels more natural, and multi-URL import saves time when onboarding clients with multiple source documents.

**The Implementation:**
- Converted version badge from `<span>` to `<button>` with onClick to open version history panel
- Restructured content area layout: moved scroll container to wrap both content and ToC
- Created flex container with `max-w-[1200px]`, main content at 3/4 width, ToC at 1/4 width
- Changed ToC sticky positioning to `top-8` to align with first accordion
- Converted URL import state from single object to array of `UrlImportItem` with UUID-based IDs
- Added helper functions: `addUrlInput`, `removeUrlInput`, `updateUrlValue`, `clearUrlInput`
- Updated UI to show multiple URL inputs with add button and trash icon for removal
- Modified import logic to process URLs sequentially with individual status tracking

**The Result:** Version badge opens version history on click. ToC appears inside content area and stays sticky while scrolling. Users can import from multiple URLs simultaneously, with each URL showing its own processing status.

**Files Changed:** `src/app/pages/ClientDashboard.tsx`, `src/app/components/TableOfContents.tsx`, `src/app/components/ImportDocumentModal.tsx`

---

### 2026-01-25: Share URL Button and Toast Notifications

**The Situation:** The Share URL button in the client dashboard header was non-functional and displayed both icon and text, inconsistent with the icon-only Version History button.

**The Challenge:** (1) Button needed copy-to-clipboard functionality, (2) Users needed visual confirmation when URL was copied, (3) Icon-only buttons needed tooltips for accessibility.

**The Decision:** Implemented clipboard copy with `navigator.clipboard.writeText()`, added Sonner toast notifications for user feedback, and wrapped both icon-only buttons with Radix UI Tooltip components.

**Why This Matters:** Share URL is essential for collaboration - users can quickly share a direct link to a client's brand guidelines. Toast notifications provide immediate feedback, and tooltips ensure icon-only buttons remain accessible.

**The Implementation:**
- Added `Toaster` component from Sonner to `App.tsx` for global toast support
- Updated Share URL button to copy `window.location.href` and show success toast
- Changed Share URL button to icon-only style (matching Version History)
- Wrapped both buttons with `Tooltip`, `TooltipTrigger`, and `TooltipContent` components

**The Result:** Share URL button copies current page URL to clipboard with "URL copied to clipboard" toast confirmation. Both icon-only buttons show descriptive tooltips on hover.

**Files Changed:** `src/app/App.tsx`, `src/app/pages/ClientDashboard.tsx`

---

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
