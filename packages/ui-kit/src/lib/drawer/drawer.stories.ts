import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UIDrawer } from "./drawer.component";
import { UIButton } from "../button/button.component";

@Component({
  selector: "ui-demo-drawer-left",
  standalone: true,
  imports: [UIDrawer, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-button (click)="open.set(true)">Open Left Drawer</ui-button>
    <ui-drawer [(open)]="open" position="left" width="medium">
      <h3 style="margin: 0 0 1rem;">Navigation</h3>
      <nav style="display: flex; flex-direction: column; gap: 0.5rem;">
        <a href="javascript:void(0)">Dashboard</a>
        <a href="javascript:void(0)">Settings</a>
        <a href="javascript:void(0)">Profile</a>
        <a href="javascript:void(0)">Help</a>
      </nav>
    </ui-drawer>
  `,
})
class DemoDrawerLeftComponent {
  public readonly open = signal(false);
}

@Component({
  selector: "ui-demo-drawer-right",
  standalone: true,
  imports: [UIDrawer, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-button (click)="open.set(true)">Open Right Drawer</ui-button>
    <ui-drawer [(open)]="open" position="right" width="wide">
      <h3 style="margin: 0 0 1rem;">Detail Panel</h3>
      <p>
        This is a wide drawer on the right side, suitable for detail views,
        forms, or settings panels.
      </p>
      <div style="margin-top: 1rem;">
        <ui-button (click)="open.set(false)">Close</ui-button>
      </div>
    </ui-drawer>
  `,
})
class DemoDrawerRightComponent {
  public readonly open = signal(false);
}

@Component({
  selector: "ui-demo-drawer-widths",
  standalone: true,
  imports: [UIDrawer, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <ui-button (click)="narrow.set(true)">Narrow (16rem)</ui-button>
      <ui-button (click)="medium.set(true)">Medium (24rem)</ui-button>
      <ui-button (click)="wide.set(true)">Wide (36rem)</ui-button>
    </div>
    <ui-drawer [(open)]="narrow" width="narrow">
      <h3 style="margin: 0 0 1rem;">Narrow</h3>
      <p>Compact side panel.</p>
    </ui-drawer>
    <ui-drawer [(open)]="medium" width="medium">
      <h3 style="margin: 0 0 1rem;">Medium</h3>
      <p>Default width, good for most content.</p>
    </ui-drawer>
    <ui-drawer [(open)]="wide" width="wide">
      <h3 style="margin: 0 0 1rem;">Wide</h3>
      <p>Extra space for complex forms or detail views.</p>
    </ui-drawer>
  `,
})
class DemoDrawerWidthsComponent {
  public readonly narrow = signal(false);
  public readonly medium = signal(false);
  public readonly wide = signal(false);
}

const meta: Meta<UIDrawer> = {
  title: "@Theredhead/UI Kit/Drawer",
  component: UIDrawer,
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["left", "right"],
      description: "Which edge the drawer slides in from.",
    },
    width: {
      control: "select",
      options: ["narrow", "medium", "wide"],
      description: "Width preset or a custom CSS value.",
    },
    closeOnBackdropClick: {
      control: "boolean",
      description: "Close when the backdrop overlay is clicked.",
    },
    closeOnEscape: {
      control: "boolean",
      description: "Close on Escape key.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the drawer panel.",
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        UIButton,
        DemoDrawerLeftComponent,
        DemoDrawerRightComponent,
        DemoDrawerWidthsComponent,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "A slide-in side panel for navigation, detail views, or form sidebars.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<UIDrawer>;

/**
 * Interactive playground — adjust every input via the Controls panel.
 * Click the button to open the drawer.
 */
export const Playground: Story = {
  render: (args) => ({
    props: { ...args, open: false },
    template: `
      <ui-button (click)="open = !open">Toggle drawer</ui-button>
      <ui-drawer
        [(open)]="open"
        [position]="position"
        [width]="width"
        [closeOnBackdropClick]="closeOnBackdropClick"
        [closeOnEscape]="closeOnEscape"
        [ariaLabel]="ariaLabel"
      >
        <p style="padding: 16px">Drawer content goes here.</p>
      </ui-drawer>
    `,
  }),
  args: {
    position: "left",
    width: "medium",
    closeOnBackdropClick: true,
    closeOnEscape: true,
    ariaLabel: "Side panel",
  },
};

export const Left: Story = {
  render: () => ({
    template: `<ui-demo-drawer-left />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "### Features\n" +
          "- Slides in from `left` or `right` edge\n" +
          "- Three width presets: `narrow` (16rem), `medium` (24rem), `wide` (36rem)\n" +
          "- Custom CSS width values supported (e.g. `400px`, `30vw`)\n" +
          "- Overlay backdrop with click-to-close\n" +
          "- Escape key to close\n" +
          "- Two-way `[(open)]` binding\n" +
          "- Full dark-mode support",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<button (click)="drawerOpen = true">Open Drawer</button>

<ui-drawer [(open)]="drawerOpen" position="left" width="medium">
  <h3>Navigation</h3>
  <nav>
    <a routerLink="/dashboard">Dashboard</a>
    <a routerLink="/settings">Settings</a>
  </nav>
</ui-drawer>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIDrawer } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIDrawer],
  template: \`
    <button (click)="drawerOpen.set(true)">Open Drawer</button>
    <ui-drawer [(open)]="drawerOpen" position="left" width="medium">
      <h3>Navigation</h3>
      <p>Drawer content here.</p>
    </ui-drawer>
  \`,
})
export class ExampleComponent {
  readonly drawerOpen = signal(false);
}

// ── SCSS ──
/* No custom styles needed — drawer tokens handle theming. */
`,
      },
    },
  },
};

export const Right: Story = {
  render: () => ({
    template: `<ui-demo-drawer-right />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<button (click)="open.set(true)">Open Right Drawer</button>

<ui-drawer [(open)]="open" position="right" width="wide">
  <h3>Detail Panel</h3>
  <p>Form or detail content here.</p>
  <button (click)="open.set(false)">Close</button>
</ui-drawer>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIDrawer } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIDrawer],
  template: \`
    <button (click)="open.set(true)">Open Right Drawer</button>
    <ui-drawer [(open)]="open" position="right" width="wide">
      <h3>Detail Panel</h3>
      <p>Form or detail content here.</p>
      <button (click)="open.set(false)">Close</button>
    </ui-drawer>
  \`,
})
export class ExampleComponent {
  readonly open = signal(false);
}

// ── SCSS ──
/* No custom styles needed — drawer tokens handle theming. */
`,
      },
    },
  },
};

export const Widths: Story = {
  render: () => ({
    template: `<ui-demo-drawer-widths />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- Width presets: narrow (16rem), medium (24rem), wide (36rem) -->
<ui-drawer [(open)]="open" width="narrow">Compact panel</ui-drawer>
<ui-drawer [(open)]="open" width="medium">Standard panel</ui-drawer>
<ui-drawer [(open)]="open" width="wide">Spacious panel</ui-drawer>

<!-- Or use a custom CSS width value -->
<ui-drawer [(open)]="open" width="400px">Custom width</ui-drawer>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIDrawer } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIDrawer],
  template: \`
    <button (click)="open.set(true)">Open</button>
    <ui-drawer [(open)]="open" width="medium">
      <p>Content in a medium-width drawer.</p>
    </ui-drawer>
  \`,
})
export class ExampleComponent {
  readonly open = signal(false);
}

// ── SCSS ──
/* No custom styles needed — width presets are built in. */
`,
      },
    },
  },
};
