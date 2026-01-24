# ADR-001: Adopt Log File Genius for Project Documentation

**Status:** Accepted
**Date:** 2026-01-22
**Deciders:** Development Team
**Related:** [Log File Genius](https://github.com/clark-mackey/log-file-genius)

---

## Context

The Brand Guidelines Manager is a complex application with 4 major tabs, each containing dozens of form fields, Version History functionality, and real-time Convex integration. During development, AI assistants frequently lost context between sessions, requiring repeated explanations of project structure, decisions made, and current state.

Traditional documentation approaches either consumed too many tokens (verbose READMEs) or lacked structure (ad-hoc notes). We needed a system optimized for AI-assisted development.

---

## Decision

Adopt Log File Genius as the project documentation standard. This includes:

1. **CHANGELOG.md** - Technical record of what changed (files, versions, facts)
2. **DEVLOG.md** - Narrative of why decisions were made (context, reasoning)
3. **STATE.md** - Current project state for multi-agent coordination
4. **ADRs** - Architectural Decision Records for significant decisions
5. **AI Rules** - Augment-specific rules enforcing log maintenance before commits

---

## Consequences

### Positive
- **93% token reduction** - Structured logs consume ~7-10k tokens vs 90-110k for verbose docs
- **Improved AI context** - Assistants understand project history without lengthy re-explanations
- **Separation of concerns** - Facts (CHANGELOG) vs narrative (DEVLOG) vs decisions (ADRs)
- **Automatic enforcement** - AI rules require log updates before commits
- **Scalable** - Built-in archiving strategy keeps logs lean over time

### Negative
- **Initial overhead** - Must update logs with each significant change
- **Learning curve** - Team must understand the five-document structure
- **Submodule dependency** - Log File Genius installed as git submodule

### Neutral
- Existing README.md remains for human-readable project overview
- Log files are version-controlled alongside code

---

## Alternatives Considered

### Alternative 1: Detailed README.md only
**Rejected because:** Single-file documentation becomes bloated and consumes excessive AI context tokens. No separation between facts and narrative.

### Alternative 2: No structured documentation
**Rejected because:** AI assistants lose context between sessions, requiring repeated explanations and leading to inconsistent decisions.

### Alternative 3: Custom documentation system
**Rejected because:** Log File Genius is battle-tested, well-documented, and provides ready-made templates and AI rules. Building custom would duplicate effort.

---

## Notes

- Installed as git submodule to `.log-file-genius/` for easy updates
- Configured with "team" profile for consistent documentation standards
- AI rules installed to `.augment/rules/log-file-maintenance.md`
- Configuration stored in `.logfile-config.yml`

