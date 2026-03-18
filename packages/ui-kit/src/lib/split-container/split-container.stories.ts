import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UISplitContainer } from "./split-container.component";
import type { SplitResizeEvent } from "./split-container.types";

// ── Shared panel styles ──────────────────────────────────────────────

const PANEL_STYLE = `
  .demo-panel {
    padding: 1rem;
    height: 100%;
    box-sizing: border-box;
  }
  .demo-panel--a {
    background: color-mix(in srgb, var(--ui-divider-bg-active, #3584e4) 10%, transparent);
  }
  .demo-panel--b {
    background: color-mix(in srgb, var(--ui-divider-handle, #a0a8b4) 10%, transparent);
  }
  .demo-host {
    display: block;
    height: 300px;
    border: 1px solid var(--ui-border, #d7dce2);
    border-radius: 6px;
    overflow: hidden;
  }
`;

// ── Demo: Default (horizontal) ───────────────────────────────────────

@Component({
  selector: "ui-split-default-demo",
  standalone: true,
  imports: [UISplitContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [PANEL_STYLE],
  template: `
    <div class="demo-host">
      <ui-split-container>
        <div first class="demo-panel demo-panel--a">
          <h4 style="margin: 0 0 .5rem">Left Panel</h4>
          <p style="margin: 0; font-size: .88rem">
            Drag the divider to resize. Content overflows and scrolls
            independently in each panel.
          </p>
        </div>
        <div second class="demo-panel demo-panel--b">
          <h4 style="margin: 0 0 .5rem">Right Panel</h4>
          <p style="margin: 0; font-size: .88rem">This is the second panel.</p>
        </div>
      </ui-split-container>
    </div>
  `,
})
class SplitDefaultDemo {}

// ── Demo: Vertical ───────────────────────────────────────────────────

@Component({
  selector: "ui-split-vertical-demo",
  standalone: true,
  imports: [UISplitContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [PANEL_STYLE],
  template: `
    <div class="demo-host">
      <ui-split-container orientation="vertical" [initialSizes]="[30, 70]">
        <div first class="demo-panel demo-panel--a">
          <h4 style="margin: 0 0 .5rem">Top Panel</h4>
          <p style="margin: 0; font-size: .88rem">30 % initial height.</p>
        </div>
        <div second class="demo-panel demo-panel--b">
          <h4 style="margin: 0 0 .5rem">Bottom Panel</h4>
          <p style="margin: 0; font-size: .88rem">70 % initial height.</p>
        </div>
      </ui-split-container>
    </div>
  `,
})
class SplitVerticalDemo {}

// ── Demo: Constrained ────────────────────────────────────────────────

@Component({
  selector: "ui-split-constrained-demo",
  standalone: true,
  imports: [UISplitContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [PANEL_STYLE],
  template: `
    <div class="demo-host">
      <ui-split-container
        [firstConstraints]="{ min: 150, max: 400 }"
        [secondConstraints]="{ min: 200 }"
      >
        <div first class="demo-panel demo-panel--a">
          <h4 style="margin: 0 0 .5rem">Sidebar</h4>
          <p style="margin: 0; font-size: .88rem">Min 150 px, max 400 px.</p>
        </div>
        <div second class="demo-panel demo-panel--b">
          <h4 style="margin: 0 0 .5rem">Main</h4>
          <p style="margin: 0; font-size: .88rem">Min 200 px.</p>
        </div>
      </ui-split-container>
    </div>
  `,
})
class SplitConstrainedDemo {}

// ── Demo: Double-click collapse ──────────────────────────────────────

@Component({
  selector: "ui-split-collapse-demo",
  standalone: true,
  imports: [UISplitContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [PANEL_STYLE],
  template: `
    <div class="demo-host">
      <ui-split-container
        collapseTarget="first"
        [initialSizes]="[25, 75]"
        (resized)="onResized($event)"
      >
        <div first class="demo-panel demo-panel--a">
          <h4 style="margin: 0 0 .5rem">Sidebar</h4>
          <p style="margin: 0; font-size: .88rem">
            Double-click the divider to collapse this panel. Double-click again
            to restore.
          </p>
        </div>
        <div second class="demo-panel demo-panel--b">
          <h4 style="margin: 0 0 .5rem">Main Content</h4>
          <p style="margin: 0; font-size: .88rem">
            Last resize: {{ lastResize() }}
          </p>
        </div>
      </ui-split-container>
    </div>
  `,
})
class SplitCollapseDemo {
  protected readonly lastResize = signal("—");

  protected onResized(event: SplitResizeEvent): void {
    const [a, b] = event.sizes;
    this.lastResize.set(`${a.toFixed(1)}% / ${b.toFixed(1)}%`);
  }
}

// ── Demo: Persistent (localStorage) ─────────────────────────────────

@Component({
  selector: "ui-split-persistent-demo",
  standalone: true,
  imports: [UISplitContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [PANEL_STYLE],
  template: `
    <div class="demo-host">
      <ui-split-container name="storybook-demo-split" [initialSizes]="[35, 65]">
        <div first class="demo-panel demo-panel--a">
          <h4 style="margin: 0 0 .5rem">Persistent Sidebar</h4>
          <p style="margin: 0; font-size: .88rem">
            Resize and reload the page — sizes are saved.
          </p>
        </div>
        <div second class="demo-panel demo-panel--b">
          <h4 style="margin: 0 0 .5rem">Main</h4>
          <p style="margin: 0; font-size: .88rem">
            Stored under <code>ui-split-container:storybook-demo-split</code>.
          </p>
        </div>
      </ui-split-container>
    </div>
  `,
})
class SplitPersistentDemo {}

// ── Demo: Custom divider width ───────────────────────────────────────

@Component({
  selector: "ui-split-divider-width-demo",
  standalone: true,
  imports: [UISplitContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [PANEL_STYLE],
  template: `
    <div class="demo-host">
      <ui-split-container [dividerWidth]="12">
        <div first class="demo-panel demo-panel--a">
          <h4 style="margin: 0 0 .5rem">Left</h4>
          <p style="margin: 0; font-size: .88rem">12 px wide divider.</p>
        </div>
        <div second class="demo-panel demo-panel--b">
          <h4 style="margin: 0 0 .5rem">Right</h4>
        </div>
      </ui-split-container>
    </div>
  `,
})
class SplitDividerWidthDemo {}

// ── Storybook meta ───────────────────────────────────────────────────

const meta: Meta<UISplitContainer> = {
  title: "@Theredhead/UI Kit/Split Container",
  component: UISplitContainer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UISplitContainer` is a resizable split-pane layout with a draggable divider. Project two child elements with `first` and `second` attributes to fill each panel.",
          "",
          "## Key Features",
          "",
          '- **Orientation** — `"horizontal"` (side-by-side, default) or `"vertical"` (stacked)',
          "- **Size constraints** — set `min` / `max` pixel limits per panel via `firstConstraints` and `secondConstraints`",
          '- **Initial sizes** — provide a `[initialSizes]="[30, 70]"` percentage tuple',
          '- **Double-click collapse** — set `collapseTarget` to `"first"` or `"second"` to enable collapse/restore on double-click',
          "- **Persistence** — give the container a `name` and sizes are saved to `localStorage` automatically",
          "- **Divider width** — customise via `[dividerWidth]` (default 6 px)",
          "- **Resize event** — `(resized)` emits a `SplitResizeEvent` with the new percentage sizes",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          '| `orientation` | `"horizontal" \\| "vertical"` | `"horizontal"` | Split direction |',
          "| `initialSizes` | `[number, number]` | `[50, 50]` | Initial panel sizes as percentages |",
          "| `firstConstraints` | `{ min?: number; max?: number }` | — | Pixel constraints for the first panel |",
          "| `secondConstraints` | `{ min?: number; max?: number }` | — | Pixel constraints for the second panel |",
          '| `collapseTarget` | `"first" \\| "second"` | — | Which panel collapses on divider double-click |',
          "| `dividerWidth` | `number` | `6` | Divider thickness in pixels |",
          "| `name` | `string` | — | If set, sizes are persisted to localStorage under this key |",
          "",
          "## Outputs",
          "",
          "| Output | Payload | Description |",
          "|--------|---------|-------------|",
          "| `resized` | `SplitResizeEvent` | Emitted after a drag ends with the new sizes |",
        ].join("\n"),
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        SplitDefaultDemo,
        SplitVerticalDemo,
        SplitConstrainedDemo,
        SplitCollapseDemo,
        SplitPersistentDemo,
        SplitDividerWidthDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<UISplitContainer>;

/**
 * **Default (horizontal)** — The simplest configuration: two panels side by
 * side with a draggable divider in the middle. Drag left/right to resize.
 * Both panels scroll independently.
 */
export const Default: Story = {
  render: () => ({ template: `<ui-split-default-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-split-container>
  <div first class="sidebar">
    <h4>Left Panel</h4>
    <p>Drag the divider to resize.</p>
  </div>
  <div second class="main">
    <h4>Right Panel</h4>
    <p>This is the second panel.</p>
  </div>
</ui-split-container>

// ── TypeScript ──
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISplitContainer } from "@theredhead/ui-kit";

@Component({
  selector: "app-split-demo",
  standalone: true,
  imports: [UISplitContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./split-demo.component.html",
  styleUrl: "./split-demo.component.scss",
})
export class SplitDemo {}

// ── SCSS ──
:host {
  display: block;
  height: 300px;
  border: 1px solid var(--ui-border);
  border-radius: 6px;
  overflow: hidden;
}
.sidebar,
.main {
  padding: 1rem;
  height: 100%;
  box-sizing: border-box;
}
`,
      },
    },
  },
};

/**
 * **Vertical** — Panels are stacked top/bottom. The divider is horizontal
 * and drags up/down. Initial sizes are set to 30% / 70%.
 */
export const Vertical: Story = {
  render: () => ({ template: `<ui-split-vertical-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-split-container orientation="vertical" [initialSizes]="[30, 70]">
  <div first class="top-panel">
    <h4>Top Panel</h4>
    <p>30 % initial height.</p>
  </div>
  <div second class="bottom-panel">
    <h4>Bottom Panel</h4>
    <p>70 % initial height.</p>
  </div>
</ui-split-container>

// ── TypeScript ──
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISplitContainer } from "@theredhead/ui-kit";

@Component({
  selector: "app-vertical-split-demo",
  standalone: true,
  imports: [UISplitContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./vertical-split-demo.component.html",
  styleUrl: "./vertical-split-demo.component.scss",
})
export class VerticalSplitDemo {}

// ── SCSS ──
:host {
  display: block;
  height: 300px;
  border: 1px solid var(--ui-border);
  border-radius: 6px;
  overflow: hidden;
}
.top-panel,
.bottom-panel {
  padding: 1rem;
  height: 100%;
  box-sizing: border-box;
}
`,
      },
    },
  },
};

/**
 * **Constrained** — Demonstrates pixel-based panel constraints. The sidebar
 * (first panel) is limited to 150–400 px, while the main area (second panel)
 * has a 200 px minimum. The divider respects these limits during drag.
 */
export const Constrained: Story = {
  render: () => ({ template: `<ui-split-constrained-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-split-container
  [firstConstraints]="{ min: 150, max: 400 }"
  [secondConstraints]="{ min: 200 }"
>
  <div first class="sidebar">
    <h4>Sidebar</h4>
    <p>Min 150 px, max 400 px.</p>
  </div>
  <div second class="main">
    <h4>Main</h4>
    <p>Min 200 px.</p>
  </div>
</ui-split-container>

// ── TypeScript ──
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISplitContainer } from "@theredhead/ui-kit";

@Component({
  selector: "app-constrained-split-demo",
  standalone: true,
  imports: [UISplitContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./constrained-split-demo.component.html",
  styleUrl: "./constrained-split-demo.component.scss",
})
export class ConstrainedSplitDemo {}

// ── SCSS ──
:host {
  display: block;
  height: 300px;
  border: 1px solid var(--ui-border);
  border-radius: 6px;
  overflow: hidden;
}
.sidebar,
.main {
  padding: 1rem;
  height: 100%;
  box-sizing: border-box;
}
`,
      },
    },
  },
};

/**
 * **Double-click collapse** — Double-click the divider to collapse the
 * first panel to zero width. Double-click again to restore it to its
 * previous size. The `(resized)` output logs each size change.
 */
export const DoubleClickCollapse: Story = {
  render: () => ({ template: `<ui-split-collapse-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-split-container
  collapseTarget="first"
  [initialSizes]="[25, 75]"
  (resized)="onResized($event)"
>
  <div first class="sidebar">
    <h4>Sidebar</h4>
    <p>Double-click the divider to collapse this panel.</p>
  </div>
  <div second class="main">
    <h4>Main Content</h4>
    <p>Last resize: {{ lastResize() }}</p>
  </div>
</ui-split-container>

// ── TypeScript ──
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { UISplitContainer, SplitResizeEvent } from "@theredhead/ui-kit";

@Component({
  selector: "app-collapse-split-demo",
  standalone: true,
  imports: [UISplitContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./collapse-split-demo.component.html",
  styleUrl: "./collapse-split-demo.component.scss",
})
export class CollapseSplitDemo {
  protected readonly lastResize = signal("—");

  protected onResized(event: SplitResizeEvent): void {
    const [a, b] = event.sizes;
    this.lastResize.set(a.toFixed(1) + "% / " + b.toFixed(1) + "%");
  }
}

// ── SCSS ──
:host {
  display: block;
  height: 300px;
  border: 1px solid var(--ui-border);
  border-radius: 6px;
  overflow: hidden;
}
.sidebar,
.main {
  padding: 1rem;
  height: 100%;
  box-sizing: border-box;
}
`,
      },
    },
  },
};

/**
 * **Persistent (localStorage)** — Giving the container a `name` enables
 * automatic size persistence. Resize the panels, reload the page, and
 * the sizes are restored. Stored under the key
 * `ui-split-container:<name>` in `localStorage`.
 */
export const Persistent: Story = {
  render: () => ({ template: `<ui-split-persistent-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-split-container name="my-app-sidebar" [initialSizes]="[35, 65]">
  <div first class="sidebar">
    <h4>Persistent Sidebar</h4>
    <p>Resize and reload — sizes are saved to localStorage.</p>
  </div>
  <div second class="main">
    <h4>Main</h4>
    <p>Stored under <code>ui-split-container:my-app-sidebar</code>.</p>
  </div>
</ui-split-container>

// ── TypeScript ──
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISplitContainer } from "@theredhead/ui-kit";

@Component({
  selector: "app-persistent-split-demo",
  standalone: true,
  imports: [UISplitContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./persistent-split-demo.component.html",
  styleUrl: "./persistent-split-demo.component.scss",
})
export class PersistentSplitDemo {}

// ── SCSS ──
:host {
  display: block;
  height: 300px;
  border: 1px solid var(--ui-border);
  border-radius: 6px;
  overflow: hidden;
}
.sidebar,
.main {
  padding: 1rem;
  height: 100%;
  box-sizing: border-box;
}
`,
      },
    },
  },
};

/**
 * **Custom divider width** — Sets `[dividerWidth]="12"` for a 12 px wide
 * divider instead of the default 6 px. Useful for touch-friendly interfaces
 * or when the divider needs more visual prominence.
 */
export const CustomDividerWidth: Story = {
  render: () => ({ template: `<ui-split-divider-width-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-split-container [dividerWidth]="12">
  <div first class="left">
    <h4>Left</h4>
    <p>12 px wide divider for touch-friendly interfaces.</p>
  </div>
  <div second class="right">
    <h4>Right</h4>
  </div>
</ui-split-container>

// ── TypeScript ──
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISplitContainer } from "@theredhead/ui-kit";

@Component({
  selector: "app-divider-width-demo",
  standalone: true,
  imports: [UISplitContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./divider-width-demo.component.html",
  styleUrl: "./divider-width-demo.component.scss",
})
export class DividerWidthDemo {}

// ── SCSS ──
:host {
  display: block;
  height: 300px;
  border: 1px solid var(--ui-border);
  border-radius: 6px;
  overflow: hidden;
}
.left,
.right {
  padding: 1rem;
  height: 100%;
  box-sizing: border-box;
}
`,
      },
    },
  },
};
