# Brand Guidelines Manager — Design Guidelines

## Overview

This document defines the visual design system for the Brand Guidelines Manager, an internal tool for Cake marketing agency. The design should feel professional, clean, and highly functional—prioritizing clarity and ease of use for collaborative brand guideline creation.

---

## Color Palette

### Primary Colors

| Name | HEX | Usage |
|------|-----|-------|
| **Cake Blue** | `#4074A8` | Primary actions, active states, links, selected items, header accents |
| **Cake Yellow** | `#F2A918` | Secondary actions, highlights, warnings, version badges, call-to-action accents |

### Blue Tints (for backgrounds, hover states, borders)

| Name | HEX | Usage |
|------|-----|-------|
| Blue 50 | `#EBF1F7` | Light backgrounds, hover states |
| Blue 100 | `#D1E0EE` | Selected item backgrounds, subtle highlights |
| Blue 200 | `#A3C1DD` | Borders, dividers on blue elements |
| Blue 700 | `#2D5276` | Darker text on blue, pressed states |
| Blue 900 | `#1A3044` | Deep contrast, headings on light backgrounds |

### Yellow Tints

| Name | HEX | Usage |
|------|-----|-------|
| Yellow 50 | `#FEF7E6` | Warning backgrounds, notification panels |
| Yellow 100 | `#FDE9B8` | Highlight backgrounds |
| Yellow 700 | `#B87D0E` | Warning text, darker accents |

### Grays (Neutral Palette)

| Name | HEX | Usage |
|------|-----|-------|
| Gray 50 | `#F9FAFB` | Page backgrounds, card backgrounds |
| Gray 100 | `#F3F4F6` | Sidebar background, input backgrounds |
| Gray 200 | `#E5E7EB` | Borders, dividers |
| Gray 300 | `#D1D5DB` | Disabled states, placeholder text |
| Gray 400 | `#9CA3AF` | Secondary text, icons |
| Gray 500 | `#6B7280` | Body text (secondary) |
| Gray 600 | `#4B5563` | Body text (primary) |
| Gray 700 | `#374151` | Headings, emphasis |
| Gray 800 | `#1F2937` | Dark headings, high contrast text |
| Gray 900 | `#111827` | Maximum contrast text |

### Semantic Colors

| Name | HEX | Usage |
|------|-----|-------|
| Success | `#059669` | Success states, saved indicators, applied imports |
| Success Light | `#D1FAE5` | Success backgrounds |
| Error | `#DC2626` | Error states, destructive actions |
| Error Light | `#FEE2E2` | Error backgrounds |
| Warning | `#F2A918` | Warnings (uses Cake Yellow) |
| Info | `#4074A8` | Info states (uses Cake Blue) |

---

## Typography

### Font Stack

- **Primary Font:** Roboto (Google Fonts)
- **Fallback:** -apple-system, BlinkMacSystemFont, Inter, "Segoe UI", sans-serif
- **Monospace:** "Roboto Mono", "SF Mono", "Fira Code", Consolas, monospace (for code/JSON)

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| H1 (Page Title) | 24px | 600 (Semibold) | 32px | -0.02em |
| H2 (Section Title) | 20px | 600 (Semibold) | 28px | -0.01em |
| H3 (Subsection Title) | 16px | 600 (Semibold) | 24px | 0 |
| H4 (Field Group Label) | 14px | 500 (Medium) | 20px | 0 |
| Body | 14px | 400 (Regular) | 22px | 0 |
| Body Small | 13px | 400 (Regular) | 20px | 0 |
| Caption | 12px | 400 (Regular) | 16px | 0.01em |
| Label | 13px | 500 (Medium) | 16px | 0 |
| Button | 14px | 500 (Medium) | 20px | 0 |

### Text Colors

- **Primary text:** Gray 800 (`#1F2937`)
- **Secondary text:** Gray 500 (`#6B7280`)
- **Muted/placeholder:** Gray 400 (`#9CA3AF`)
- **Links:** Cake Blue (`#4074A8`)
- **Error text:** Error (`#DC2626`)

---

## Spacing System

Use an 8px base grid with the following scale:

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Tight spacing, inline elements |
| space-2 | 8px | Small gaps, icon padding |
| space-3 | 12px | Input padding, small margins |
| space-4 | 16px | Standard gaps between elements |
| space-5 | 20px | Section padding |
| space-6 | 24px | Card padding, larger gaps |
| space-8 | 32px | Section margins |
| space-10 | 40px | Major section breaks |
| space-12 | 48px | Page margins |

---

## Layout

### Overall Structure

```
┌─────────────────────────────────────────────────────────────┐
│ App Header (optional - can integrate into main layout)      │
├──────────────┬──────────────────────────────────────────────┤
│              │  Main Header                                  │
│   Sidebar    │  ─────────────────────────────────────────── │
│   (280px)    │  Section Tabs                                │
│              │  ─────────────────────────────────────────── │
│              │  ┌──────────────────────┬─────────────┐      │
│              │  │  Content Area        │ Table of    │      │
│              │  │  (3/4 width)         │ Contents    │      │
│              │  │                      │ (1/4 width) │      │
│              │  │  max-width: 1200px   │ sticky      │      │
│              │  └──────────────────────┴─────────────┘      │
└──────────────┴──────────────────────────────────────────────┘
```

### Dimensions

- **Sidebar width:** 280px (fixed)
- **Content area max-width:** 1200px (3/4 - 1/4 split with ToC)
- **Table of Contents width:** 192px (w-48, sticky within content)
- **Minimum viewport:** 1280px (desktop-first)
- **Header height:** 64px
- **Tab bar height:** 48px
- **Content scroll:** Independent scrolling with `overflow-y-scroll`

---

## Components

### Buttons

**Primary Button**
- Background: Cake Blue (`#4074A8`)
- Text: White
- Border radius: 6px
- Padding: 10px 16px
- Hover: Blue 700 (`#2D5276`)
- Active: Blue 900 (`#1A3044`)

**Secondary Button**
- Background: White
- Border: 1px solid Gray 300 (`#D1D5DB`)
- Text: Gray 700 (`#374151`)
- Border radius: 6px
- Padding: 10px 16px
- Hover: Gray 50 (`#F9FAFB`) background

**Accent Button (for "Save Version", key CTAs)**
- Background: Cake Yellow (`#F2A918`)
- Text: Gray 900 (`#111827`) — changed from white for better accessibility
- Border radius: 6px
- Hover: Yellow 600 (`#D99A15`) - maintains contrast with dark text

**Ghost/Text Button**
- Background: Transparent
- Text: Cake Blue (`#4074A8`)
- Padding: 8px 12px
- Hover: Blue 50 (`#EBF1F7`) background

**Destructive Button**
- Background: Error (`#DC2626`)
- Text: White
- Hover: Darker red (`#B91C1C`)

**Icon-Only Button (for Share URL, Version History)**
- Background: White
- Border: 1px solid Gray 300 (`#D1D5DB`)
- Text: Gray 700 (`#374151`)
- Padding: 12px (px-3 py-2)
- Border radius: 6px
- Hover: Gray 50 (`#F9FAFB`) background
- Requires tooltip for accessibility

### Input Fields

- Background: White
- Border: 1px solid Gray 300 (`#D1D5DB`)
- Border radius: 6px
- Padding: 10px 12px
- Font size: 14px
- Focus: Border Cake Blue (`#4074A8`), box-shadow: 0 0 0 3px Blue 100 (`#D1E0EE`)
- Error: Border Error (`#DC2626`)
- Placeholder: Gray 400 (`#9CA3AF`)

### Text Areas

- Same styling as inputs
- Minimum height: 80px
- Resize: vertical

### Select/Dropdown

- Same base styling as inputs
- Chevron icon: Gray 400

### Cards

- Background: White
- Border: 1px solid Gray 200 (`#E5E7EB`)
- Border radius: 8px
- Padding: 24px
- Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)

### Sidebar

- Background: Gray 100 (`#F3F4F6`)
- Border right: 1px solid Gray 200 (`#E5E7EB`)

**Client List Item**
- Padding: 12px 16px
- Hover: White background
- Selected: Blue 50 (`#EBF1F7`) background, left border 3px Cake Blue

### Tabs

- Background: Gray 50 (`#F9FAFB`)
- Border bottom: 1px solid Gray 200 (`#E5E7EB`)
- Active tab: Cake Blue text, bottom border 2px Cake Blue
- Inactive tab: Gray 500 text
- Hover: Gray 700 text

### Badges/Tags

**Version Badge**
- Background: Yellow 100 (`#FDE9B8`)
- Text: Yellow 700 (`#B87D0E`)
- Border radius: 4px
- Padding: 2px 8px
- Font size: 12px, weight 500

**Status Badge**
- Saved: Success background, Success text
- Saving: Blue 100 background, Blue text
- Error: Error Light background, Error text

### Collapsible Sections

- Header: Gray 700 text, clickable with chevron icon
- Chevron rotates 90° when expanded
- Content area has subtle top border when expanded

### File Upload Zone

- Border: 2px dashed Gray 300 (`#D1D5DB`)
- Background: Gray 50 (`#F9FAFB`)
- Border radius: 8px
- Padding: 32px
- Hover/Drag active: Border Cake Blue, Background Blue 50
- Icon: Upload icon in Gray 400, turns Blue on hover

### Modals

- Overlay: Black at 50% opacity
- Modal: White background, border radius 12px
- Shadow: 0 25px 50px rgba(0, 0, 0, 0.25)
- Max width: 600px (review modal can be wider: 800px)
- Padding: 24px

### Toast/Notifications

Implemented using **Sonner** library for consistent toast notifications.

- Background: Gray 800 (`#1F2937`)
- Text: White
- Border radius: 8px
- Padding: 12px 16px
- Position: Bottom right
- Success variant: Left border 4px Success
- Error variant: Left border 4px Error

### Table of Contents

Sticky sidebar for navigating collapsible sections within a tab.

- **Desktop:** Fixed 192px width (w-48) within content area, sticky at `top-8`
- **Mobile:** Floating button (bottom-right) opens dropdown
- **Section indicators:** Blue dot (expanded), Gray dot (collapsed)
- Background (mobile dropdown): White with border Gray 200
- Section text: Gray 500, hover Gray 700
- Header: "On this page" in uppercase, 12px, Gray 500

### Version Viewing Banner

Shows when viewing a historical version (read-only mode).

- Background: Yellow 100 (`#FDE9B8`)
- Border bottom: Yellow (`#F2A918`)
- Text: Yellow 700 (`#B87D0E`)
- "Back to Current Draft" button: Primary blue style
- Padding: 12px 32px (py-3 px-8)

---

## Icons

Use **FontAwesome** icons throughout.

### Common Icons

| Action | Icon |
|--------|------|
| New/Add | `fa-plus` |
| Delete | `fa-trash` |
| Edit | `fa-pen` |
| Save | `fa-save` |
| Download | `fa-download` |
| Upload | `fa-upload` |
| Copy | `fa-copy` |
| Expand/Collapse | `fa-chevron-down` / `fa-chevron-right` |
| Close | `fa-times` |
| Search | `fa-search` |
| Settings | `fa-cog` |
| Version/History | `fa-clock-rotate-left` |
| Client/User | `fa-user` |
| Check/Success | `fa-check` |
| Warning | `fa-exclamation-triangle` |
| Info | `fa-info-circle` |
| External Link | `fa-external-link` |
| Document/File | `fa-file` |
| Image | `fa-image` |
| Sort A-Z | `fa-arrow-down-a-z` |
| Sort Date | `fa-calendar-days` |

### Icon Sizes

- Small (inline): 12px
- Default: 16px
- Medium: 20px
- Large (empty states): 48px

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | 0 1px 2px rgba(0, 0, 0, 0.05) | Subtle lift |
| shadow | 0 1px 3px rgba(0, 0, 0, 0.1) | Cards, dropdowns |
| shadow-md | 0 4px 6px rgba(0, 0, 0, 0.1) | Elevated elements |
| shadow-lg | 0 10px 15px rgba(0, 0, 0, 0.1) | Modals, popovers |
| shadow-xl | 0 25px 50px rgba(0, 0, 0, 0.25) | Large modals |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 4px | Badges, small elements |
| radius | 6px | Buttons, inputs |
| radius-md | 8px | Cards, panels |
| radius-lg | 12px | Modals, large containers |

---

## States

### Interactive Element States

1. **Default** — Base appearance
2. **Hover** — Slight background/color change
3. **Focus** — Blue outline ring (for accessibility)
4. **Active/Pressed** — Darker shade
5. **Disabled** — 50% opacity, cursor not-allowed
6. **Loading** — Spinner icon, disabled interaction

### Save Status Indicator

Display in header, near client name:
- **Idle:** No indicator
- **Saving:** "Saving..." with spinner, Gray 500 text
- **Saved:** "All changes saved" with checkmark, Success text (fades after 2s)
- **Error:** "Save failed" with retry link, Error text

---

## Responsive Considerations

While desktop-first (1280px minimum), ensure:
- Sidebar can collapse to icons-only mode if viewport < 1280px
- Content area scrolls independently
- Modals are scrollable if content exceeds viewport

---

## Accessibility

- Minimum touch target: 44x44px
- Focus states visible on all interactive elements
- Color contrast minimum 4.5:1 for text
- Form labels associated with inputs
- Error messages linked to fields via aria-describedby
- Keyboard navigation support for all interactions

---

## Animation & Transitions

- Duration: 150ms for micro-interactions, 200ms for larger transitions
- Easing: ease-in-out for most, ease-out for enters, ease-in for exits
- Properties to animate: opacity, transform, background-color, border-color
- Avoid animating width/height (use transform: scale instead)

---

## Shared Form Components

The application uses a centralized form component library (`src/app/components/form/`) for consistent styling and behavior across all tabs.

### ControlledInput

Text input with blur-to-save pattern for auto-saving.

```
inputClass = 'w-full px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-md text-sm
              text-[#1F2937] placeholder:text-[#9CA3AF] focus:border-[#4074A8]
              focus:outline-none focus:ring-3 focus:ring-[#D1E0EE]'
```

### ControlledTextarea

Multiline text with same styling as input, blur-to-save.

### ControlledSelect

Dropdown with immediate save on change.

### Section

Collapsible accordion section with ARIA `aria-expanded` attribute.

- Chevron rotates 90° when expanded
- Content area has subtle top border when expanded

### FormField

Label wrapper with optional description text.

---

## File Structure Reference

When designing screens, reference these main views:

1. **Client List (Sidebar)** — List of all clients with sort toggle, company name + version display
2. **Client Dashboard (Main Area)** — Header + tabs + content area with ToC
3. **Section Content** — Form fields organized by collapsible subsections
4. **Version History Panel** — Slide-in panel with version list and view/restore/delete actions
5. **Document Import Modal** — Three modes: File Upload, URL Import, Paste Text
6. **Review Extracted Fields Modal** — Accept/reject individual AI-extracted fields
7. **Export Dropdown** — Markdown, JSON, PDF, AI Prompt formats
8. **Empty States** — No clients, no versions, no data in section

---

## New Feature Patterns

### Document Import Flow

Three import modes with consistent processing flow:

1. **File Upload** — Drag-and-drop zone supporting PDF, DOCX, TXT, MD, JSON
2. **URL Import** — Multiple URLs with individual status tracking
3. **Paste Text** — Large textarea with word count display

**Processing States:**
- Pending: Gray spinner
- Processing: Blue spinner with status text
- Ready for Review: Green success icon
- Failed: Red error message

### Export Options

Dropdown with four export formats:

| Format | Actions |
|--------|---------|
| Markdown | Download .md, Copy to clipboard |
| JSON | Download .json, Copy to clipboard |
| PDF | Download .pdf (uses jsPDF) |
| AI Prompt | Copy to clipboard (general-purpose) |

**Filename pattern:** `{client-name}-brand-guidelines-v{version}.{ext}`

### Version History Panel

Slide-in panel from the right side.

- Panel width: 400px
- Header: "Version History" with close button
- "Save New Version" form at top with name/description inputs
- Version list with View, Restore, Delete actions
- Currently viewing version highlighted

### Tooltips

Used for icon-only buttons to maintain accessibility.

- Library: Radix UI Tooltip
- Position: Bottom (side="bottom")
- Delay: Default (no custom delay)

---

## Design Principles

1. **Clarity over cleverness** — Every element should have obvious purpose
2. **Generous whitespace** — Don't crowd the interface
3. **Progressive disclosure** — Collapse complexity, reveal on demand
4. **Consistent patterns** — Same action = same appearance everywhere
5. **Informative feedback** — Always show system status (toast notifications)
6. **Error prevention** — Confirm destructive actions, validate inputs
7. **Accessibility first** — Tooltips for icons, ARIA attributes, keyboard navigation