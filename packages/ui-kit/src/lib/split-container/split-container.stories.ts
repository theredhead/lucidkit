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
  title: "@theredhead/UI Kit/Split Container",
  component: UISplitContainer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A resizable split container with a draggable divider. " +
          "Supports horizontal / vertical orientation, panel size constraints (min / max), " +
          "localStorage persistence, configurable divider width, and double-click-to-collapse.",
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

/** Default horizontal split — drag the divider to resize. */
export const Default: Story = {
  render: () => ({ template: `<ui-split-default-demo />` }),
};

/** Vertical split — panels stack top / bottom. */
export const Vertical: Story = {
  render: () => ({ template: `<ui-split-vertical-demo />` }),
};

/** Constrained panels — the sidebar is limited to 150–400 px, the main panel has a 200 px minimum. */
export const Constrained: Story = {
  render: () => ({ template: `<ui-split-constrained-demo />` }),
};

/** Double-click the divider to collapse / restore the first panel. */
export const DoubleClickCollapse: Story = {
  render: () => ({ template: `<ui-split-collapse-demo />` }),
};

/** Persistent sizes — resize and reload the page to see them restored. */
export const Persistent: Story = {
  render: () => ({ template: `<ui-split-persistent-demo />` }),
};

/** Custom divider width — 12 px instead of the default 6 px. */
export const CustomDividerWidth: Story = {
  render: () => ({ template: `<ui-split-divider-width-demo />` }),
};
