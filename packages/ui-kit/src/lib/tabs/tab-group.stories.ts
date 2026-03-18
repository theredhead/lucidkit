import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UITabGroup } from "./tab-group.component";
import { UITab } from "./tab.component";

const meta: Meta<UITabGroup> = {
  title: "@theredhead/UI Kit/Tabs",
  component: UITabGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A tabbed content container. Each `<ui-tab>` defines a panel " +
          "with a label; only the active panel is rendered.\n\n" +
          "### Composition\n" +
          "`UITabGroup` wraps `UITab` children. Tabs are activated by " +
          "clicking their label or pressing arrow keys.\n\n" +
          "### Features\n" +
          '- **Declarative** — project `<ui-tab label="...">` children directly\n' +
          "- **Initial selection** — set `[selectedIndex]` to start on a specific tab\n" +
          "- **Disabled tabs** — individual tabs can be disabled\n" +
          "- **Keyboard navigation** — left/right arrow keys cycle through tabs\n\n" +
          "### Usage\n" +
          "```html\n" +
          "<ui-tab-group>\n" +
          '  <ui-tab label="Overview">Content here.</ui-tab>\n' +
          '  <ui-tab label="Details">More content.</ui-tab>\n' +
          "</ui-tab-group>\n" +
          "```",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [UITab],
    }),
  ],
};

export default meta;
type Story = StoryObj<UITabGroup>;

/**
 * A basic three-tab layout. Click a tab label to switch panels.
 * Arrow keys also cycle through tab labels when a tab is focused.
 */
export const Default: Story = {
  render: () => ({
    template: `
      <ui-tab-group>
        <ui-tab label="Overview">
          <p>This is the overview panel.</p>
        </ui-tab>
        <ui-tab label="Details">
          <p>Detailed information goes here.</p>
        </ui-tab>
        <ui-tab label="History">
          <p>History log content.</p>
        </ui-tab>
      </ui-tab-group>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-tab-group>
  <ui-tab label="Overview">
    <p>This is the overview panel.</p>
  </ui-tab>
  <ui-tab label="Details">
    <p>Detailed information goes here.</p>
  </ui-tab>
  <ui-tab label="History">
    <p>History log content.</p>
  </ui-tab>
</ui-tab-group>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UITabGroup, UITab } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITabGroup, UITab],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — default styling applies. */
`,
      },
    },
  },
};

/**
 * The `selectedIndex` input controls which tab is active on initial
 * render. Here it’s set to `1` so the second tab (\"Second\") is
 * displayed first.
 */
export const SecondTabSelected: Story = {
  render: () => ({
    template: `
      <ui-tab-group [selectedIndex]="1">
        <ui-tab label="First">First content</ui-tab>
        <ui-tab label="Second">Second content — initially active</ui-tab>
        <ui-tab label="Third">Third content</ui-tab>
      </ui-tab-group>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-tab-group [selectedIndex]="1">
  <ui-tab label="First">First content</ui-tab>
  <ui-tab label="Second">Second content — initially active</ui-tab>
  <ui-tab label="Third">Third content</ui-tab>
</ui-tab-group>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UITabGroup, UITab } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITabGroup, UITab],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — default styling applies. */
`,
      },
    },
  },
};

/**
 * Individual tabs can be disabled with `[disabled]=\"true\"`. A
 * disabled tab is visible in the tab bar but cannot be selected
 * by click or keyboard.
 */
export const DisabledTab: Story = {
  render: () => ({
    template: `
      <ui-tab-group>
        <ui-tab label="Active">Active tab content</ui-tab>
        <ui-tab label="Disabled" [disabled]="true">This won't show</ui-tab>
        <ui-tab label="Also Active">Another active tab</ui-tab>
      </ui-tab-group>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-tab-group>
  <ui-tab label="Active">Active tab content</ui-tab>
  <ui-tab label="Disabled" [disabled]="true">This won't show</ui-tab>
  <ui-tab label="Also Active">Another active tab</ui-tab>
</ui-tab-group>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UITabGroup, UITab } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITabGroup, UITab],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — default styling applies. */
`,
      },
    },
  },
};

/**
 * A tab group with six tabs to demonstrate horizontal scrolling
 * behaviour in narrow containers.
 */
export const ManyTabs: Story = {
  render: () => ({
    template: `
      <ui-tab-group>
        <ui-tab label="Tab 1"><p>Content 1</p></ui-tab>
        <ui-tab label="Tab 2"><p>Content 2</p></ui-tab>
        <ui-tab label="Tab 3"><p>Content 3</p></ui-tab>
        <ui-tab label="Tab 4"><p>Content 4</p></ui-tab>
        <ui-tab label="Tab 5"><p>Content 5</p></ui-tab>
        <ui-tab label="Tab 6"><p>Content 6</p></ui-tab>
      </ui-tab-group>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-tab-group>
  <ui-tab label="Tab 1"><p>Content 1</p></ui-tab>
  <ui-tab label="Tab 2"><p>Content 2</p></ui-tab>
  <ui-tab label="Tab 3"><p>Content 3</p></ui-tab>
  <ui-tab label="Tab 4"><p>Content 4</p></ui-tab>
  <ui-tab label="Tab 5"><p>Content 5</p></ui-tab>
  <ui-tab label="Tab 6"><p>Content 6</p></ui-tab>
</ui-tab-group>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UITabGroup, UITab } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITabGroup, UITab],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — default styling applies. */
`,
      },
    },
  },
};
