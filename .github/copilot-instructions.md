# Copilot Instructions — @theredhead Angular UI Library

**All project conventions, patterns, and architecture are documented in
[AGENTS.md](../AGENTS.md) at the repository root. That file is the single
source of truth — always follow it.**

Read and apply `AGENTS.md` before generating or modifying any code in this
workspace. It covers:

- Component conventions (standalone, OnPush, signal APIs, `UI<Name>` naming)
- CSS token namespace (`--ui-*`), centralised dark mode, and UISurface directive
- File structure, barrel exports, and public API surface
- Table-view column inheritance and DI forwarding pattern
- Testing conventions (Vitest + Analog, signal assertions)
- Storybook conventions (title hierarchy, `moduleMetadata` in decorators)
- Git commit conventions and verification checklist
