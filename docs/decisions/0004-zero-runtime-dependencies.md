# ADR-0004: Zero Runtime Dependencies Beyond Angular

## Status

Accepted

## Context

Component libraries commonly pull in third-party packages for charting
(Chart.js, D3), rich-text editing (Quill, ProseMirror), QR code generation
(qrcode), icon sets (Font Awesome), and media embedding. Each dependency adds:

- Bundle size to every consuming application.
- Version management burden (peer-dep conflicts, breaking upgrades).
- Licensing obligations that consumers inherit.
- Risk of supply-chain attacks through transitive dependencies.

As a proof-of-concept library exploring how far Angular 21 signals and modern
browser APIs can go, we wanted to minimise external coupling.

## Decision

The library has **no runtime dependencies** beyond Angular core packages
(`@angular/core`, `@angular/common`, `@angular/cdk`). All functionality is
implemented from scratch:

- **Charts and gauges:** SVG rendering via strategy classes using native SVG
  elements.
- **QR codes:** Pure TypeScript QR matrix generator.
- **Rich-text editing:** `contenteditable`-based editor with HTML and Markdown
  strategies, including a built-in Markdown parser.
- **Icons:** Generated SVG registry from Lucide sources — no icon font.
- **Media player:** Iframe embed providers for YouTube/Vimeo/Dailymotion using
  their public embed APIs.
- **Form engine:** Custom JSON schema interpreter and validation system.

Dev-time dependencies (Vitest, Storybook, ESLint, TypeDoc) are not shipped to
consumers.

## Consequences

### Positive

- **Minimal consumer footprint:** No transitive dependencies to audit, version,
  or bundle.
- **Full control:** Every rendering path is owned code, so bugs can be fixed
  directly without waiting for upstream releases.
- **No version conflicts:** Consumers cannot hit peer-dependency collisions from
  this library.
- **Licensing clarity:** The library carries only its own license.

### Negative

- **Feature depth:** Purpose-built implementations are less feature-rich than
  mature third-party libraries (e.g. the chart strategies do not match D3's full
  capability).
- **Maintenance cost:** All rendering, parsing, and generation code must be
  maintained in-house.
- **Not production-grade:** As a proof-of-concept, the trade-off is acceptable.
  A production library might choose to wrap established libraries instead.
