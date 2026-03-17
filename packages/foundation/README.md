# @theredhead/foundation

Core utilities, types, and base classes for the **theredhead** Angular UI
library family.

---

## Installation

```bash
npm install @theredhead/foundation
```

---

## Overview

`@theredhead/foundation` is the lowest-level package in the theredhead
ecosystem. It provides framework-agnostic helpers that the higher-level
packages (`@theredhead/ui-kit`, `@theredhead/ui-blocks`, `@theredhead/ui-theme`)
can depend on without creating circular references.

Typical contents include:

- **Type utilities** — branded types, nominal helpers, type guards
- **Base classes** — abstract foundations for components and services
- **Pure functions** — formatting, validation, data-structure helpers
- **Constants & enums** — shared across multiple packages

---

## Usage

Import anything you need directly:

```ts
import {} from /* … */ "@theredhead/foundation";
```

---

## Peer Dependencies

| Package           | Version   |
| ----------------- | --------- |
| `@angular/core`   | `^21.0.0` |
| `@angular/common` | `^21.0.0` |
