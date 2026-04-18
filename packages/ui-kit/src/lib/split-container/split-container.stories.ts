import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UISplitContainer } from "./split-container.component";
import { UISplitPanel } from "./split-panel.component";
import type { SplitResizeEvent } from "./split-container.types";

// ── Shared panel styles ──────────────────────────────────────────────

const PANEL_STYLE = `
  .demo-panel {
    padding: 1rem;
    height: 100%;
    box-sizing: border-box;
    color: var(--ui-text, #1d232b);
  }
  .demo-panel--a {
    background: color-mix(in srgb, var(--ui-divider-bg-active, #3584e4) 10%, transparent);
  }
  .demo-panel--b {
    background: color-mix(in srgb, var(--ui-divider-handle, #a0a8b4) 10%, transparent);
  }
  .demo-panel--c {
    background: color-mix(in srgb, var(--ui-accent, #3584e4) 15%, transparent);
  }
  .demo-host {
    display: block;
    height: 300px;
    border: 1px solid var(--ui-border, #d7dce2);
    border-radius: 6px;
    overflow: hidden;
  }
`;

// ── Demo: Default (horizontal, two panels) ───────────────────────────────────────

@Component({
  selector: "ui-split-default-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [PANEL_STYLE],
  template: `
    <div class="demo-host">
      <ui-split-container>
        <ui-split-panel>
          <div class="demo-panel demo-panel--a">
            <h4 style="margin: 0 0 .5rem">Left Panel</h4>
            <p style="margin: 0; font-size: .88rem">
              Drag the divider to resize. Content overflows and scrolls
              independently in each panel.
            </p>
          </div>
        </ui-split-panel>
        <ui-split-panel>
          <div class="demo-panel demo-panel--b">
            <h4 style="margin: 0 0 .5rem">Right Panel</h4>
            <p style="margin: 0; font-size: .88rem">This is the second panel.</p>
          </div>
        </ui-split-panel>
      </ui-split-container>
    </div>
  `,
})
class SplitDefaultDemo {}

// ── Demo: Vertical ───────────────────────────────────────────────────────────────────

@Component({
  selector: "ui-split-vertical-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [PANEL_STYLE],
  template: `
    <div class="demo-host">
      <ui-split-container orientation="vertical" [initialSizes]="[30, 70]">
        <ui-split-panel>
          <div class="demo-panel demo-panel--a">
            <h4 style="margin: 0 0 .5rem">Top Panel</h4>
            <p style="margin: 0; font-size: .88rem">30 % initial height.</p>
          </div>
        </ui-split-panel>
        <ui-split-panel>
          <div class="demo-panel demo-panel--b">
            <h4 style="margin: 0 0 .5rem">Bottom Panel</h4>
            <p style="margin: 0; font-size: .88rem">70 % initial height.</p>
          </div>
        </ui-split-panel>
      </ui-split-container>
    </div>
  `,
})
class SplitVerticalDemo {}

// ── Demo: Constrained ──────────────────────────────────────────────────────────────

@Component({
  selector: "ui-split-constrained-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [PANEL_STYLE],
  template: `
    <div class="demo-host">
      <ui-split-container>
        <ui-split-panel [min]="150" [max]="400">
          <div class="demo-panel demo-panel--a">
            <h4 style="margin: 0 0 .5rem">Sidebar</h4>
            <p style="margin: 0; font-size: .88rem">Min 150 px, max 400 px.</p>
          </div>
        </ui-split-panel>
        <ui-split-panel [min]="200">
          <div class="demo-panel demo-panel--b">
            <h4 style="margin: 0 0 .5rem">Main</h4>
            <p style="margin: 0; font-size: .88rem">Min 200 px.</p>
          </div>
        </ui-split-panel>
      </ui-split-container>
    </div>
  `,
})
class SplitConstrainedDemo {}

// ── Demo: Double-click collapse ──────────────────────────────────────────────────

@Component({
  selector: "ui-split-collapse-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [PANEL_STYLE],
  template: `
    <div class="demo-host">
      <ui-split-container
        [initialSizes]="[25, 75]"
        (resized)="onResized($event)"
      >
        <ui-split-panel>
          <div class="demo-panel demo-panel--a">
            <h4 style="margin: 0 0 .5rem">Sidebar</h4>
            <p style="margin: 0; font-size: .88rem">
              Double-click the divider to collapse this panel. Double-click again
              to restore.
            </p>
          </div>
        </ui-split-panel>
        <ui-split-panel>
          <div class="demo-panel demo-panel--b">
            <h4 style="margin: 0 0 .5rem">Main Content</h4>
            <p style="margin: 0; font-size: .88rem">
              Last resize: {{ lastResize() }}
            </p>
          </div>
        </ui-split-panel>
      </ui-split-container>
    </div>
  `,
})
class SplitCollapseDemo {

  protected readonly lastResize = signal("—");

  protected onResized(event: SplitResizeEvent): void {
    this.lastResize.set(event.sizes.map((s) => s.toFixed(1) + "%").join(" / "));
  }
}

// ── Demo: Persistent (localStorage) ───────────────────────────────────────────────

@Component({
  selector: "ui-split-persistent-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [PANEL_STYLE],
  template: `
    <div class="demo-host">
      <ui-split-container name="storybook-demo-split" [initialSizes]="[35, 65]">
        <ui-split-panel>
          <div class="demo-panel demo-panel--a">
            <h4 style="margin: 0 0 .5rem">Persistent Sidebar</h4>
            <p style="margin: 0; font-size: .88rem">
              Resize and reload the page — sizes are saved.
            </p>
          </div>
        </ui-split-panel>
        <ui-split-panel>
          <div class="demo-panel demo-panel--b">
            <h4 style="margin: 0 0 .5rem">Main</h4>
            <p style="margin: 0; font-size: .88rem">
              Stored under <code>ui-split-container:storybook-demo-split</code>.
            </p>
          </div>
        </ui-split-panel>
      </ui-split-container>
    </div>
  `,
})
class SplitPersistentDemo {}

// ── Demo: Custom divider width ───────────────────────────────────────────────────────────────

@Component({
  selector: "ui-split-divider-width-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [PANEL_STYLE],
  template: `
    <div class="demo-host">
      <ui-split-container [dividerWidth]="12">
        <ui-split-panel>
          <div class="demo-panel demo-panel--a">
            <h4 style="margin: 0 0 .5rem">Left</h4>
            <p style="margin: 0; font-size: .88rem">12 px wide divider.</p>
          </div>
        </ui-split-panel>
        <ui-split-panel>
          <div class="demo-panel demo-panel--b">
            <h4 style="margin: 0 0 .5rem">Right</h4>
          </div>
        </ui-split-panel>
      </ui-split-container>
    </div>
  `,
})
class SplitDividerWidthDemo {}

// ── Demo: Three panels ───────────────────────────────────────────────────────────────────

@Component({
  selector: "ui-split-three-panels-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [PANEL_STYLE],
  template: `
    <div class="demo-host">
      <ui-split-container [initialSizes]="[20, 60, 20]">
        <ui-split-panel [min]="80">
          <div class="demo-panel demo-panel--a">
            <h4 style="margin: 0 0 .5rem">Navigation</h4>
            <p style="margin: 0; font-size: .88rem">Min 80 px.</p>
          </div>
        </ui-split-panel>
        <ui-split-panel [min]="200">
          <div class="demo-panel demo-panel--b">
            <h4 style="margin: 0 0 .5rem">Editor</h4>
            <p style="margin: 0; font-size: .88rem">
              Each divider only adjusts its two adjacent panels.
            </p>
          </div>
        </ui-split-panel>
        <ui-split-panel [min]="80">
          <div class="demo-panel demo-panel--c">
            <h4 style="margin: 0 0 .5rem">Inspector</h4>
            <p style="margin: 0; font-size: .88rem">Min 80 px.</p>
          </div>
        </ui-split-panel>
      </ui-split-container>
    </div>
  `,
})
class SplitThreePanelsDemo {}

// ── Storybook meta ───────────────────────────────────────────────────────────────────

const meta: Meta<UISplitContainer> = {
  title: "@theredhead/UI Kit/Split Container",
  component: UISplitContainer,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Layout direction of the panels.",
    },
    dividerWidth: {
      control: "number",
      description: "Width of the draggable divider in pixels.",
    },
    disabled: {
      control: "boolean",
      description: "Disables resizing.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for each resize handle.",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "`UISplitContainer` is a resizable N-panel layout. Place any number of `<ui-split-panel>` children inside — dividers are automatically inserted between adjacent panels. Each divider only ever adjusts its two immediately adjacent panels.",
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
        SplitThreePanelsDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<UISplitContainer>;

/**
 * **Default (horizontal)** — Two panels side by side with a draggable divider.
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
  <ui-split-panel>
    <div class="sidebar"><h4>Left Panel</h4></div>
  </ui-split-panel>
  <ui-split-panel>
    <div class="main"><h4>Right Panel</h4></div>
  </ui-split-panel>
</ui-split-container>

// ── TypeScript ──
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISplitContainer, UISplitPanel } from "@theredhead/lucid-kit";

@Component({
  selector: "app-split-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./split-demo.component.html",
})
export class SplitDemo {}
`,
      },
    },
  },
};

/**
 * **Vertical** — Panels stacked top/bottom with initial 30 / 70 split.
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
  <ui-split-panel>
    <div class="top-panel"><h4>Top Panel</h4></div>
  </ui-split-panel>
  <ui-split-panel>
    <div class="bottom-panel"><h4>Bottom Panel</h4></div>
  </ui-split-panel>
</ui-split-container>

// ── TypeScript ──
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISplitContainer, UISplitPanel } from "@theredhead/lucid-kit";

@Component({
  selector: "app-vertical-split-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./vertical-split-demo.component.html",
})
export class VerticalSplitDemo {}
`,
      },
    },
  },
};

/**
 * **Constrained** — Per-panel \`[min]\` / \`[max]\` pixel constraints.
 */
export const Constrained: Story = {
  render: () => ({ template: `<ui-split-constrained-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-split-container>
  <ui-split-panel [min]="150" [max]="400">
    <div class="sidebar"><h4>Sidebar (150–400 px)</h4></div>
  </ui-split-panel>
  <ui-split-panel [min]="200">
    <div class="main"><h4>Main (min 200 px)</h4></div>
  </ui-split-panel>
</ui-split-container>

// ── TypeScript ──
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISplitContainer, UISplitPanel } from "@theredhead/lucid-kit";

@Component({
  selector: "app-constrained-split-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./constrained-split-demo.component.html",
})
export class ConstrainedSplitDemo {}
`,
      },
    },
  },
};

/**
 * **Double-click collapse** — Double-click any divider to collapse the
 * smaller adjacent panel. Double-click again to restore.
 */
export const DoubleClickCollapse: Story = {
  render: () => ({ template: `<ui-split-collapse-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-split-container [initialSizes]="[25, 75]" (resized)="onResized($event)">
  <ui-split-panel>
    <div class="sidebar"><h4>Sidebar</h4></div>
  </ui-split-panel>
  <ui-split-panel>
    <div class="main"><h4>Main</h4><p>{{ lastResize() }}</p></div>
  </ui-split-panel>
</ui-split-container>

// ── TypeScript ──
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";
import { UISplitContainer, UISplitPanel, SplitResizeEvent } from "@theredhead/lucid-kit";

@Component({
  selector: "app-collapse-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./collapse-demo.component.html",
})
export class CollapseSplitDemo {
  protected readonly lastResize = signal("—");

  protected onResized(event: SplitResizeEvent): void {
    this.lastResize.set(event.sizes.map((s) => s.toFixed(1) + "%").join(" / "));
  }
}
`,
      },
    },
  },
};

/**
 * **Persistent** — \`name\` enables localStorage size persistence.
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
  <ui-split-panel>
    <div class="sidebar"><h4>Persistent Sidebar</h4></div>
  </ui-split-panel>
  <ui-split-panel>
    <div class="main">
      <p>Stored under \`ui-split-container:my-app-sidebar\`.</p>
    </div>
  </ui-split-panel>
</ui-split-container>

// ── TypeScript ──
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISplitContainer, UISplitPanel } from "@theredhead/lucid-kit";

@Component({
  selector: "app-persistent-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./persistent-demo.component.html",
})
export class PersistentSplitDemo {}
`,
      },
    },
  },
};

/**
 * **Custom divider width** — \`[dividerWidth]="12"\` for a wider grab target.
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
  <ui-split-panel><div class="left"><h4>Left</h4></div></ui-split-panel>
  <ui-split-panel><div class="right"><h4>Right</h4></div></ui-split-panel>
</ui-split-container>

// ── TypeScript ──
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISplitContainer, UISplitPanel } from "@theredhead/lucid-kit";

@Component({
  selector: "app-divider-width-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./divider-width-demo.component.html",
})
export class DividerWidthDemo {}
`,
      },
    },
  },
};

/**
 * **Three panels** — Three \`<ui-split-panel>\` children produce two independent
 * dividers. Dragging one never affects the far panel.
 */
export const ThreePanels: Story = {
  render: () => ({ template: `<ui-split-three-panels-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-split-container [initialSizes]="[20, 60, 20]">
  <ui-split-panel [min]="80">
    <nav class="nav"><h4>Navigation</h4></nav>
  </ui-split-panel>
  <ui-split-panel [min]="200">
    <main class="editor"><h4>Editor</h4></main>
  </ui-split-panel>
  <ui-split-panel [min]="80">
    <aside class="inspector"><h4>Inspector</h4></aside>
  </ui-split-panel>
</ui-split-container>

// ── TypeScript ──
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISplitContainer, UISplitPanel } from "@theredhead/lucid-kit";

@Component({
  selector: "app-three-panel-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./three-panel-demo.component.html",
})
export class ThreePanelDemo {}
`,
      },
    },
  },
};

/**
 * _API Reference_ — inputs, outputs, and panel configuration.
 */
export const Documentation: Story = {
  tags: ["!dev"],
  render: () => ({ template: " " }),
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **N-panel layout** — place any number of `<ui-split-panel>` children; dividers are inserted automatically",
          "- **Orientation** — `\"horizontal\"` or `\"vertical\"` (default: horizontal)",
          "- **Per-panel constraints** — set `[min]` and `[max]` pixel limits on each `<ui-split-panel>`",
          "- **Independent dividers** — each divider only adjusts its two immediately adjacent panels",
          "- **Double-click collapse** — double-click any divider to collapse the smaller adjacent panel",
          "- **Persistence** — give the container a `name` to save sizes in localStorage",
          "",
          "## Container Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `orientation` | `string` | `\"horizontal\"` | Split direction |",
          "| `initialSizes` | `number[]` | equal split | Panel sizes as percentages |",
          "| `dividerWidth` | `number` | `6` | Divider thickness in pixels |",
          "| `name` | `string` | — | Key for localStorage persistence |",
          "| `disabled` | `boolean` | `false` | Disables resizing |",
          "| `ariaLabel` | `string` | `\"Resize panels\"` | Label for each divider |",
          "",
          "## Panel Inputs (`<ui-split-panel>`)",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `min` | `number` | — | Minimum panel size in pixels |",
          "| `max` | `number` | — | Maximum panel size in pixels |",
          "",
          "## Container Outputs",
          "",
          "| Output | Payload | Description |",
          "|--------|---------|-------------|",
          "| `resized` | `SplitResizeEvent` | Emitted after drag ends |",
          "| `resizing` | `SplitResizeEvent` | Emitted while dragging |",
        ].join("\n"),
      },
      source: { code: " " },
    },
  },
};
