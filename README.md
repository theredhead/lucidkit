# theredhead Frontend Library

## Mission

Provide a consistent, accessible, and themeable set of Angular UI building blocks
for all theredhead frontend applications. Every package in this workspace is built
with standalone components, signal-based reactivity, and **zero external runtime
dependencies** beyond Angular core and CDK.

---

## What's in this repo

This is an **npm workspace** (`packages/*`) that publishes three independent
Angular libraries:

| Package              | npm name                | Purpose                                                                |
| -------------------- | ----------------------- | ---------------------------------------------------------------------- |
| `packages/ui-theme`  | `@theredhead/ui-theme`  | SCSS theme with light / dark mode, CSS custom properties, ThemeService |
| `packages/ui-kit`    | `@theredhead/ui-kit`    | Core reusable components (Button, Table View, Filter, Tree View, …)    |
| `packages/ui-blocks` | `@theredhead/ui-blocks` | Higher-level compositions (Master-Detail View)                         |

A shared **Storybook** host is wired up at the workspace root for interactive
component development and documentation.

---

## Prerequisites

- **Node.js** 20+ and **npm** 10+
- **Angular CLI** 21+ (`npm install -g @angular/cli`)

---

## Getting started

```bash
# Install all workspace dependencies (runs once for all packages)
npm install
```

---

## Building

```bash
# Build all packages
npm run build

# Build a single package
cd packages/ui-theme  && npm run build
cd packages/ui-kit    && npm run build
cd packages/ui-blocks && npm run build
```

Built artefacts are output to `dist/<package-name>/`.

> **Build order matters.** `ui-kit` depends on `ui-theme`, so build `ui-theme`
> first when building packages individually.

---

## Running tests

Tests are powered by **Vitest** with `@analogjs/vitest-angular`.

```bash
# Run all tests once
npm test

# Run tests in watch / interactive mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

---

## Storybook (component explorer)

Storybook lets you develop, preview and document components in isolation.

```bash
# Start the Storybook dev server (hot-reload)
npm run storybook

# Build a static Storybook site
npm run build-storybook
```

Open `http://localhost:6006` after the dev server starts.

---

## Linting

```bash
npm run lint
```

---

## Toolchain

| Tool       | Version                             | Notes                                                   |
| ---------- | ----------------------------------- | ------------------------------------------------------- |
| Angular    | 21                                  | Standalone components, signal APIs, OnPush everywhere   |
| TypeScript | 5.9+                                | `strict: true`, `noImplicitOverride`, `isolatedModules` |
| Build      | ng-packagr 21                       | Library builds via `npm run build --workspaces`         |
| Tests      | Vitest 4 + @analogjs/vitest-angular | `npx vitest run`, jsdom env, zone.js setup              |
| Lint       | ESLint 10 + angular-eslint 21       | `npm run lint`, flat config (`eslint.config.js`)        |
| Git hooks  | Husky + lint-staged                 | Pre-commit: lint staged `.ts` and `.html` files         |
| Storybook  | 10.x                                | `npm run storybook`                                     |
| Styles     | SCSS                                | Component-scoped, CSS custom property tokens            |

---

## Package READMEs

Each package has its own README with component API details and usage examples:

- [packages/ui-theme/README.md](packages/ui-theme/README.md)
- [packages/ui-kit/README.md](packages/ui-kit/README.md)
- [packages/ui-blocks/README.md](packages/ui-blocks/README.md)

---

## Contributing

1. Create a feature branch from `main`.
2. Make changes inside the relevant `packages/*` folder.
3. Add or update Storybook stories and Vitest specs alongside your changes.
4. Ensure `npm test` and `npm run lint` pass before opening a pull request.
5. Follow the existing code style — standalone Angular components, signals-first
   reactivity, and CSS custom-property theming.
