# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Related Documents

📖 **[DEVLOG](./DEVLOG.md)** - Development narrative and decision rationale
📐 **[ADRs](./adr/README.md)** - Architectural decision records
📊 **[STATE](./STATE.md)** - Current project state and metrics

> **For AI Agents:** This file is a concise technical record of changes. For context on *why* decisions were made, see DEVLOG.md. For current project state, see DEVLOG.md → Current Context section.

---

## [Unreleased]

### Added
- Share URL button functionality - Copies current page URL to clipboard with toast confirmation. Files: `src/app/pages/ClientDashboard.tsx`
- Tooltips for icon-only buttons - Share URL and Version History buttons now show tooltips on hover. Files: `src/app/pages/ClientDashboard.tsx`
- Toast notification system - Added Sonner Toaster component to app root for global toast support. Files: `src/app/App.tsx`
- Auto-sync version from DEVLOG - Build script reads version from logs/DEVLOG.md and generates src/version.ts. Files: `scripts/sync-version.js`, `src/version.ts`, `package.json`
- Sidebar metadata display - Shows "Cake Websites" company name and app version below title. Files: `src/app/components/Sidebar.tsx`
- Version number in export filenames - Exported files now include version (e.g., `client-brand-guidelines-v1.0.md`). Files: `src/app/components/ExportDropdown.tsx`
- Document Import feature - Upload documents (PDF, DOCX, TXT, MD, JSON) to extract brand guidelines using Claude AI. Files: `src/app/components/ImportDocumentModal.tsx`, `src/app/components/ReviewExtractedFieldsModal.tsx`, `convex/documentImports.ts`, `convex/claudeExtraction.ts`, `convex/documentParsing.ts`
- PDF parsing with unpdf - Serverless-compatible PDF text extraction. Files: `convex/documentParsing.ts`
- DOCX parsing with mammoth - Word document text extraction. Files: `convex/documentParsing.ts`
- Claude API integration - Extracts structured brand guidelines fields from document text. Files: `convex/claudeExtraction.ts`
- Review modal for extracted fields - Accept/reject individual fields before applying to client data. Files: `src/app/components/ReviewExtractedFieldsModal.tsx`
- Log File Genius documentation system - Token-efficient log files for AI context management. Files: `logs/CHANGELOG.md`, `logs/DEVLOG.md`, `logs/STATE.md`, `.augment/rules/log-file-maintenance.md`
- Visual Identity tab - Complete form fields for logo, color, typography, imagery, and applications. Files: `src/app/components/tabs/VisualIdentityTab.tsx`
- Personality & Tone tab - Form fields for brand personality, voice, tone variations, and language guidelines. Files: `src/app/components/tabs/PersonalityTab.tsx`
- Target Audiences tab - Form fields for demographics, personas, and customer journey mapping. Files: `src/app/components/tabs/AudiencesTab.tsx`
- Version History across all tabs - View/Restore/Delete functionality with controlled components. Files: `src/app/components/tabs/*.tsx`, `src/app/pages/ClientDashboard.tsx`

### Changed
- Share URL button styling - Changed from text+icon to icon-only button matching Version History button style. Files: `src/app/pages/ClientDashboard.tsx`
- Client name input styling - Fixed height to prevent size change when editing (32px font, 44px height). Files: `src/app/pages/ClientDashboard.tsx`
- Schema validators - Made all nested object fields optional to support partial data extraction from documents. Files: `convex/schema.ts`
- Content area scrollbar - Changed from `overflow-y-auto` to `overflow-y-scroll` to prevent layout shift. Files: `src/app/pages/ClientDashboard.tsx`
- Yellow accent buttons - Changed text from white to black for better accessibility. Files: `src/app/components/VersionHistoryPanel.tsx`

### Fixed
- PDF parsing DOMMatrix error - Replaced pdf-parse with unpdf for serverless compatibility. Files: `convex/documentParsing.ts`
- Review modal [object] display - Improved formatValue function to properly display nested objects and arrays. Files: `src/app/components/ReviewExtractedFieldsModal.tsx`
- Schema validation errors - Made all nested fields optional to allow Claude to extract partial data. Files: `convex/schema.ts`
- JSX parsing error - Replaced escaped quotes with curly brace syntax in placeholder attributes. Files: `src/app/components/tabs/VisualIdentityTab.tsx`
- Version History View functionality - Converted all inputs from uncontrolled (`defaultValue`) to controlled components (`value` + `onChange`). Files: `src/app/components/tabs/FoundationsTab.tsx`

---

## Archive

**Versions older than 30 days** are archived for token efficiency.
<!-- No archives yet -->
