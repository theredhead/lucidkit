# @theredhead/lucid-theme-studio

Optional development tooling for inspecting and editing LucidKit CSS tokens.
`UIThemeStudio` renders a split-pane editor with a live component canvas. Changes
apply to the current document, and `ThemeStudioService` can export or reset them.

## Usage

Install the package alongside compatible Angular 21 and LucidKit packages:

```sh
npm install @theredhead/lucid-theme-studio
```

Import `UIThemeStudio` into a standalone component and give its container a height:

```typescript
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIThemeStudio } from "@theredhead/lucid-theme-studio";

@Component({
  selector: "app-theme-editor",
  imports: [UIThemeStudio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ui-theme-studio manifestUrl="assets/css-token-manifest.json" />',
  styles: [":host { display: block; height: 100vh; }"],
})
export class ThemeEditor {}
```

Generate the manifest in the LucidKit workspace with
`node scripts/generate-token-manifest.mjs`, then copy `css-token-manifest.json`
into the application's public assets. `manifestUrl` defaults to
`assets/css-token-manifest.json`; `ariaLabel` defaults to `Theme Studio`.

The token manifest is application-served JSON, not a package asset. Include the
LucidKit theme in the application styles so computed token values are available.

## Public API

- `UIThemeStudio`: editor and live sample canvas.
- `UIThemeTokenRow`: individual token editor.
- `ThemeStudioService`: token state, overrides, filtering, import/export, and reset.
- Token and sample types: see [components.agents.md](components.agents.md).

The root build, pack, and publish commands include this package after its core
dependencies. Keep the editor in application development tooling unless users
are deliberately offered theme customization.
