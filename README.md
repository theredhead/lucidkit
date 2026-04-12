# LucidKit

## Mission

Provide a consistent, accessible, and themeable set of Angular UI building blocks
for all theredhead frontend applications. Every package in this workspace is built
with standalone components, signal-based reactivity, and **zero external runtime
dependencies** beyond Angular core and CDK.

### About the name

After brainstorming the name for this project for many days, taking in advice from both people and LLMs I eventually ended up with LucidKit because it embodies the kind of opinionated clarity I want this project to embody. -- then I realized the awesome Iconset i've been using for months now, is called [Lucide](https://github.com/lucide-icons/lucide) right as I was committing the rename. It's a "lucky" coincidence that may well have been informed subconciously by the Icons I've loved for a long time.

---

## What's in this repo

This is an **npm workspace** (`packages/*`) that publishes five independent
Angular libraries:

| Package               | npm name                       | Purpose                                                                |
| --------------------- | ------------------------------ | ---------------------------------------------------------------------- |
| `packages/foundation` | `@theredhead/lucid-foundation` | Logger, type utilities, base classes — shared by all other packages    |
| `packages/ui-theme`   | `@theredhead/lucid-theme`      | SCSS theme with light / dark mode, CSS custom properties, ThemeService |
| `packages/ui-kit`     | `@theredhead/lucid-kit`        | Core reusable components (Button, Table View, Filter, Tree View, …)    |
| `packages/ui-blocks`  | `@theredhead/lucid-blocks`     | Higher-level compositions (Master-Detail View, NavigationPage)         |
| `packages/ui-forms`   | `@theredhead/lucid-forms`      | Schema-driven forms, validation, conditional logic, form designer      |

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
# Build all packages in dependency order
npm run build

# Build a single package
cd packages/foundation  && npm run build
cd packages/ui-theme    && npm run build
cd packages/ui-kit      && npm run build
cd packages/ui-blocks   && npm run build
cd packages/ui-forms    && npm run build
```

Built artefacts are output to `dist/<package-name>/`.

> **Build order matters:** `lucid-kit` depends on `lucid-theme` and `lucid-foundation`;
> `lucid-blocks` and `lucid-forms` depend on `lucid-kit`. The root `npm run build`
> handles this order automatically.

---

## Packing (local distribution)

```bash
# Build all packages then pack each into a .tgz in dist/
npm run pack
```

Produces `.tgz` tarballs in `dist/` that can be installed locally via
`npm install /path/to/package.tgz` without publishing to a registry.

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
# Check for lint errors
npm run lint

# Auto-fix fixable lint errors
npm run lint:fix
```

---

## API documentation

Docs are generated from JSDoc comments using **TypeDoc**.

```bash
# Generate docs into dev-docs/
npm run docs

# Watch mode — regenerates on file changes
npm run docs:watch
```

Open `dev-docs/index.html` in a browser after generation.

---

## Docker

A multi-stage `Dockerfile` is included that builds **Storybook** and **TypeDoc** inside
the container and serves both from an nginx-based image.

### Pull from Docker Hub

The latest pre-built image is available on Docker Hub:

```bash
# Pull and run — Storybook at /storybook, TypeDoc at /docs
docker pull theredhead/lucidkit-docs:latest
docker run --rm -p 8080:80 theredhead/lucidkit-docs:latest
```

Open [http://localhost:8080/storybook](http://localhost:8080/storybook) and
[http://localhost:8080/docs](http://localhost:8080/docs).

### Build and run locally

```bash
# Build the image from source
npm run docker:build

# Run the locally built image
docker run --rm -p 8080:80 theredhead-lucidkit-docs
```

---

## Toolchain

| Tool       | Version                             | Notes                                                   |
| ---------- | ----------------------------------- | ------------------------------------------------------- |
| Angular    | 21                                  | Standalone components, signal APIs, OnPush everywhere   |
| TypeScript | 5.9+                                | `strict: true`, `noImplicitOverride`, `isolatedModules` |
| Build      | ng-packagr 21                       | Library builds via `npm run build --workspaces`         |
| Tests      | Vitest 4 + @analogjs/vitest-angular | `npx vitest run`, jsdom env, zoneless setup             |
| Lint       | ESLint 10 + angular-eslint 21       | `npm run lint`, flat config (`eslint.config.js`)        |
| Git hooks  | Husky + lint-staged                 | Pre-commit: lint staged `.ts` and `.html` files         |
| Storybook  | 10.x                                | `npm run storybook`                                     |
| Styles     | SCSS                                | Component-scoped, CSS custom property tokens            |

---

## Package READMEs

Each package has its own README with component API details and usage examples:

- [packages/foundation/README.md](packages/foundation/README.md)
- [packages/ui-theme/README.md](packages/ui-theme/README.md)
- [packages/ui-kit/README.md](packages/ui-kit/README.md)
- [packages/ui-blocks/README.md](packages/ui-blocks/README.md)
- [packages/ui-forms/README.md](packages/ui-forms/README.md)

---

## Contributing

1. Create a feature branch from `main`.
2. Make changes inside the relevant `packages/*` folder.
3. Add or update Storybook stories and Vitest specs alongside your changes.
4. Ensure `npm test` and `npm run lint` pass before opening a pull request.
5. Follow the existing code style — standalone Angular components, signals-first
   reactivity, and CSS custom-property theming.
