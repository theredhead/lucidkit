# theredhead/lucidkit-docs

Documentation server for **LucidKit** — a set of accessible, themeable Angular UI
component libraries built with standalone components, signals, and zero external
runtime dependencies beyond Angular core and CDK.

This image bundles two documentation sites served by nginx:

| Path         | Contents                                          |
| ------------ | ------------------------------------------------- |
| `/storybook` | Interactive component explorer (Storybook)        |
| `/docs`      | Full API reference generated from JSDoc (TypeDoc) |

## Quick start

```bash
docker run --rm -p 8080:80 theredhead/lucidkit-docs:latest
```

Then open:

- **http://localhost:8080/storybook** — browse and interact with every component
- **http://localhost:8080/docs** — full API reference

## Tags

| Tag      | Description              |
| -------- | ------------------------ |
| `latest` | Most recent stable build |

## Packages

The libraries documented here are published to npm:

| npm package                    | Purpose                                                          |
| ------------------------------ | ---------------------------------------------------------------- |
| `@theredhead/lucid-foundation` | Logger, type utilities, base classes                             |
| `@theredhead/lucid-theme`      | SCSS theme, light/dark mode, CSS custom properties, ThemeService |
| `@theredhead/lucid-kit`        | Core components — Button, Table View, Filter, Tree View, …       |
| `@theredhead/lucid-blocks`     | Higher-level compositions — Master-Detail, NavigationPage, …     |
| `@theredhead/lucid-forms`      | Schema-driven forms, validation, conditional logic               |

```bash
npm install @theredhead/lucid-kit
```

## Source

[github.com/theredhead/lucidkit](https://github.com/theredhead/lucidkit)
