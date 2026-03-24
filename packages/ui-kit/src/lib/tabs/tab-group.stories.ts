import { ChangeDetectionStrategy, Component } from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UITabGroup } from "./tab-group.component";
import type { TabPosition } from "./tab-group.component";
import type { TabPanelStyle } from "./tab-group.component";
import { UITab } from "./tab.component";
import { UITabSeparator } from "./tab-separator.component";
import { UITabSpacer } from "./tab-spacer.component";
import type { TabAlignment } from "./tab-header-item";
import { UIIcons } from "../icon/lucide-icons.generated";

// ── Gallery demo ─────────────────────────────────────────────────────

@Component({
  selector: "ui-tabs-gallery-demo",
  standalone: true,
  imports: [UITabGroup, UITab],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 32px">
      <div>
        <h4 style="margin: 0 0 8px">Standard tabs</h4>
        <ui-tab-group>
          <ui-tab label="Overview">
            <div
              style="padding: 0.75rem 0; font-size: 0.88rem; line-height: 1.6"
            >
              <strong>Project Dashboard</strong> — Track progress, review
              milestones, and manage team activity from a single view.
            </div>
          </ui-tab>
          <ui-tab label="Activity">
            <div
              style="padding: 0.75rem 0; font-size: 0.88rem; line-height: 1.6"
            >
              Recent commits, pull requests, and deployment events appear here.
            </div>
          </ui-tab>
          <ui-tab label="Settings">
            <div
              style="padding: 0.75rem 0; font-size: 0.88rem; line-height: 1.6"
            >
              Configure notifications, permissions, and integration preferences.
            </div>
          </ui-tab>
        </ui-tab-group>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">With disabled tab</h4>
        <ui-tab-group>
          <ui-tab label="Active">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              This tab is active and interactive.
            </div>
          </ui-tab>
          <ui-tab label="Disabled" [disabled]="true">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              This content is hidden.
            </div>
          </ui-tab>
          <ui-tab label="Also Active">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              Another active tab — disabled tabs are skipped by keyboard
              navigation.
            </div>
          </ui-tab>
        </ui-tab-group>
      </div>
    </div>
  `,
})
class TabsGalleryDemo {}

// ── Tab-position gallery demo ────────────────────────────────────────

@Component({
  selector: "ui-tabs-position-demo",
  standalone: true,
  imports: [UITabGroup, UITab],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px">
      @for (pos of positions; track pos) {
        <div>
          <h4 style="margin: 0 0 8px; color: inherit">
            tabPosition="{{ pos }}"
          </h4>
          <ui-tab-group [tabPosition]="pos" style="min-height: 160px">
            <ui-tab label="Alpha">
              <div style="padding: 0.5rem; font-size: 0.88rem">Alpha panel</div>
            </ui-tab>
            <ui-tab label="Beta">
              <div style="padding: 0.5rem; font-size: 0.88rem">Beta panel</div>
            </ui-tab>
            <ui-tab label="Gamma">
              <div style="padding: 0.5rem; font-size: 0.88rem">Gamma panel</div>
            </ui-tab>
          </ui-tab-group>
        </div>
      }
    </div>
  `,
})
class TabsPositionDemo {
  protected readonly positions: TabPosition[] = [
    "top",
    "bottom",
    "left",
    "right",
  ];
}

// ── Panel-style gallery demo ─────────────────────────────────────────

@Component({
  selector: "ui-tabs-panel-style-demo",
  standalone: true,
  imports: [UITabGroup, UITab],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 32px">
      @for (style of styles; track style) {
        <div>
          <h4 style="margin: 0 0 8px; color: inherit">
            panelStyle="{{ style }}"
          </h4>
          <ui-tab-group [panelStyle]="style">
            <ui-tab label="Alpha">
              <div style="font-size: 0.88rem">Alpha panel content.</div>
            </ui-tab>
            <ui-tab label="Beta">
              <div style="font-size: 0.88rem">Beta panel content.</div>
            </ui-tab>
            <ui-tab label="Gamma">
              <div style="font-size: 0.88rem">Gamma panel content.</div>
            </ui-tab>
          </ui-tab-group>
        </div>
      }
    </div>
  `,
})
class TabsPanelStyleDemo {
  protected readonly styles: TabPanelStyle[] = ["raised", "outline", "flat"];
}

// ── Alignment gallery demo ───────────────────────────────────────────

@Component({
  selector: "ui-tabs-alignment-demo",
  standalone: true,
  imports: [UITabGroup, UITab],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 32px">
      @for (align of alignments; track align) {
        <div>
          <h4 style="margin: 0 0 8px; color: inherit">tabAlign="{{ align }}"</h4>
          <ui-tab-group [tabAlign]="align">
            <ui-tab label="Alpha">
              <div style="padding: 0.5rem; font-size: 0.88rem">Alpha panel</div>
            </ui-tab>
            <ui-tab label="Beta">
              <div style="padding: 0.5rem; font-size: 0.88rem">Beta panel</div>
            </ui-tab>
            <ui-tab label="Gamma">
              <div style="padding: 0.5rem; font-size: 0.88rem">Gamma panel</div>
            </ui-tab>
          </ui-tab-group>
        </div>
      }
    </div>
  `,
})
class TabsAlignmentDemo {
  protected readonly alignments: TabAlignment[] = ["start", "center", "end"];
}

// ── Separator / Spacer demo ──────────────────────────────────────────

@Component({
  selector: "ui-tabs-separator-spacer-demo",
  standalone: true,
  imports: [UITabGroup, UITab, UITabSeparator, UITabSpacer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 32px">
      <div>
        <h4 style="margin: 0 0 8px; color: inherit">Separator between tabs</h4>
        <ui-tab-group>
          <ui-tab label="File">
            <div style="padding: 0.5rem; font-size: 0.88rem">File operations</div>
          </ui-tab>
          <ui-tab label="Edit">
            <div style="padding: 0.5rem; font-size: 0.88rem">Edit operations</div>
          </ui-tab>
          <ui-tab-separator />
          <ui-tab label="View">
            <div style="padding: 0.5rem; font-size: 0.88rem">View settings</div>
          </ui-tab>
          <ui-tab label="Help">
            <div style="padding: 0.5rem; font-size: 0.88rem">Help content</div>
          </ui-tab>
        </ui-tab-group>
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: inherit">Spacer pushing tabs apart</h4>
        <ui-tab-group>
          <ui-tab label="Main">
            <div style="padding: 0.5rem; font-size: 0.88rem">Main content</div>
          </ui-tab>
          <ui-tab label="Dashboard">
            <div style="padding: 0.5rem; font-size: 0.88rem">Dashboard view</div>
          </ui-tab>
          <ui-tab-spacer />
          <ui-tab label="Settings">
            <div style="padding: 0.5rem; font-size: 0.88rem">Settings pushed to the right</div>
          </ui-tab>
        </ui-tab-group>
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: inherit">Combined: separator + spacer</h4>
        <ui-tab-group>
          <ui-tab label="Alpha">
            <div style="padding: 0.5rem; font-size: 0.88rem">Alpha content</div>
          </ui-tab>
          <ui-tab-separator />
          <ui-tab label="Beta">
            <div style="padding: 0.5rem; font-size: 0.88rem">Beta content</div>
          </ui-tab>
          <ui-tab-spacer />
          <ui-tab label="Omega">
            <div style="padding: 0.5rem; font-size: 0.88rem">Omega pushed to the end</div>
          </ui-tab>
        </ui-tab-group>
      </div>
    </div>
  `,
})
class TabsSeparatorSpacerDemo {}

const meta: Meta<UITabGroup> = {
  title: "@theredhead/UI Kit/Tabs",
  component: UITabGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A tabbed content container. Each `<ui-tab>` defines a panel " +
          "with a label; only the active panel is rendered.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        UITab,
        UITabSeparator,
        UITabSpacer,
        TabsGalleryDemo,
        TabsPositionDemo,
        TabsPanelStyleDemo,
        TabsAlignmentDemo,
        TabsSeparatorSpacerDemo,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<UITabGroup>;

/**
 * Standard and disabled tab configurations shown together.
 * Click tab labels or use arrow keys to navigate between panels.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-tabs-gallery-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
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

// ── Tab-position stories ─────────────────────────────────────────────

/**
 * All four `tabPosition` values shown side-by-side.
 * Left and right positions rotate the tab labels for a vertical reading direction.
 */
export const TabPositions: Story = {
  render: () => ({
    template: `<ui-tabs-position-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- Top (default) -->
<ui-tab-group tabPosition="top">
  <ui-tab label="Alpha">Alpha panel</ui-tab>
  <ui-tab label="Beta">Beta panel</ui-tab>
</ui-tab-group>

<!-- Bottom -->
<ui-tab-group tabPosition="bottom">
  <ui-tab label="Alpha">Alpha panel</ui-tab>
  <ui-tab label="Beta">Beta panel</ui-tab>
</ui-tab-group>

<!-- Left (rotated labels) -->
<ui-tab-group tabPosition="left">
  <ui-tab label="Alpha">Alpha panel</ui-tab>
  <ui-tab label="Beta">Beta panel</ui-tab>
</ui-tab-group>

<!-- Right (rotated labels) -->
<ui-tab-group tabPosition="right">
  <ui-tab label="Alpha">Alpha panel</ui-tab>
  <ui-tab label="Beta">Beta panel</ui-tab>
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
/* No custom styles needed — position is handled by the tabPosition input. */
`,
      },
    },
  },
};

/**
 * Tabs positioned at the bottom of the container. Tab headers
 * appear below the panel content.
 */
export const BottomTabs: Story = {
  render: () => ({
    template: `
      <ui-tab-group tabPosition="bottom" style="min-height: 160px">
        <ui-tab label="Overview">The overview panel is above the tabs.</ui-tab>
        <ui-tab label="Details">Detail content renders above.</ui-tab>
        <ui-tab label="Settings">Settings panel.</ui-tab>
      </ui-tab-group>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-tab-group tabPosition="bottom">
  <ui-tab label="Overview">Content above the tabs.</ui-tab>
  <ui-tab label="Details">Detail content.</ui-tab>
</ui-tab-group>
`,
      },
    },
  },
};

/**
 * Tabs positioned on the left edge with rotated labels reading
 * bottom-to-top.
 */
export const LeftTabs: Story = {
  render: () => ({
    template: `
      <ui-tab-group tabPosition="left" style="min-height: 200px">
        <ui-tab label="Overview">Content to the right of the tabs.</ui-tab>
        <ui-tab label="Details">Detail panel beside the tab strip.</ui-tab>
        <ui-tab label="Settings">Settings panel.</ui-tab>
      </ui-tab-group>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-tab-group tabPosition="left">
  <ui-tab label="Overview">Content beside the tabs.</ui-tab>
  <ui-tab label="Details">Detail content.</ui-tab>
</ui-tab-group>
`,
      },
    },
  },
};

/**
 * Tabs positioned on the right edge with rotated labels reading
 * top-to-bottom.
 */
export const RightTabs: Story = {
  render: () => ({
    template: `
      <ui-tab-group tabPosition="right" style="min-height: 200px">
        <ui-tab label="Overview">Content to the left of the tabs.</ui-tab>
        <ui-tab label="Details">Detail panel beside the tab strip.</ui-tab>
        <ui-tab label="Settings">Settings panel.</ui-tab>
      </ui-tab-group>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-tab-group tabPosition="right">
  <ui-tab label="Overview">Content beside the tabs.</ui-tab>
  <ui-tab label="Details">Detail content.</ui-tab>
</ui-tab-group>
`,
      },
    },
  },
};

// ── Panel-style stories ─────────────────────────────────────────────

/**
 * All three `panelStyle` values shown together: raised (shadow),
 * outline (border), and flat (no decoration).
 */
export const PanelStyles: Story = {
  render: () => ({
    template: `<ui-tabs-panel-style-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- Raised (default) -->
<ui-tab-group panelStyle="raised">
  <ui-tab label="Alpha">Alpha panel</ui-tab>
  <ui-tab label="Beta">Beta panel</ui-tab>
</ui-tab-group>

<!-- Outline -->
<ui-tab-group panelStyle="outline">
  <ui-tab label="Alpha">Alpha panel</ui-tab>
  <ui-tab label="Beta">Beta panel</ui-tab>
</ui-tab-group>

<!-- Flat -->
<ui-tab-group panelStyle="flat">
  <ui-tab label="Alpha">Alpha panel</ui-tab>
  <ui-tab label="Beta">Beta panel</ui-tab>
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
/* No custom styles needed — panelStyle handles appearance. */
`,
      },
    },
  },
};

// ── Icon stories ─────────────────────────────────────────────────────

/**
 * Tabs can display an icon before the label via the `[icon]` input.
 * Pass any SVG content from `UIIcons` or a custom SVG string.
 */
export const WithIcons: Story = {
  render: () => ({
    props: {
      houseIcon: UIIcons.Lucide.Buildings.House,
      activityIcon: UIIcons.Lucide.Account.Activity,
      settingsIcon: UIIcons.Lucide.Account.Settings,
    },
    template: `
      <ui-tab-group>
        <ui-tab label="Home" [icon]="houseIcon">
          <div style="font-size: 0.88rem">Welcome home.</div>
        </ui-tab>
        <ui-tab label="Activity" [icon]="activityIcon">
          <div style="font-size: 0.88rem">Recent activity feed.</div>
        </ui-tab>
        <ui-tab label="Settings" [icon]="settingsIcon">
          <div style="font-size: 0.88rem">Configure your preferences.</div>
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
  <ui-tab label="Home" [icon]="icons.house">Home content</ui-tab>
  <ui-tab label="Activity" [icon]="icons.activity">Activity feed</ui-tab>
  <ui-tab label="Settings" [icon]="icons.settings">Settings panel</ui-tab>
</ui-tab-group>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UITabGroup, UITab, UIIcons } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITabGroup, UITab],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  protected readonly icons = {
    house: UIIcons.Lucide.Buildings.House,
    activity: UIIcons.Lucide.Account.Activity,
    settings: UIIcons.Lucide.Account.Settings,
  } as const;
}

// ── SCSS ──
/* No custom styles needed — icons inherit the tab's text colour. */
`,
      },
    },
  },
};

/**
 * Tabs can be icon-only by omitting the `label` input. When no visible
 * label is provided, set `ariaLabel` so the tab remains accessible.
 * Icon-only tabs can be mixed with labelled tabs in the same group.
 */
export const IconOnly: Story = {
  render: () => ({
    props: {
      houseIcon: UIIcons.Lucide.Buildings.House,
      activityIcon: UIIcons.Lucide.Account.Activity,
      settingsIcon: UIIcons.Lucide.Account.Settings,
    },
    template: `
      <ui-tab-group>
        <ui-tab [icon]="houseIcon" ariaLabel="Home">
          <div style="font-size: 0.88rem">Welcome home.</div>
        </ui-tab>
        <ui-tab [icon]="activityIcon" ariaLabel="Activity">
          <div style="font-size: 0.88rem">Recent activity feed.</div>
        </ui-tab>
        <ui-tab label="Settings" [icon]="settingsIcon">
          <div style="font-size: 0.88rem">This tab has both icon and label.</div>
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
  <!-- Icon-only tabs need ariaLabel for accessibility -->
  <ui-tab [icon]="icons.house" ariaLabel="Home">Home content</ui-tab>
  <ui-tab [icon]="icons.activity" ariaLabel="Activity">Activity feed</ui-tab>
  <!-- Mix with labelled tabs -->
  <ui-tab label="Settings" [icon]="icons.settings">Settings panel</ui-tab>
</ui-tab-group>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UITabGroup, UITab, UIIcons } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITabGroup, UITab],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  protected readonly icons = {
    house: UIIcons.Lucide.Buildings.House,
    activity: UIIcons.Lucide.Account.Activity,
    settings: UIIcons.Lucide.Account.Settings,
  } as const;
}

// ── SCSS ──
/* No custom styles needed — icons inherit the tab's text colour. */
`,
      },
    },
  },
};

// ── Alignment stories ────────────────────────────────────────────────

/**
 * All three \`tabAlign\` values — start (default), center, and end —
 * control horizontal alignment of the tab headers within the header bar.
 */
export const Alignment: Story = {
  render: () => ({
    template: `<ui-tabs-alignment-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- Start (default) -->
<ui-tab-group tabAlign="start">
  <ui-tab label="Alpha">Alpha panel</ui-tab>
  <ui-tab label="Beta">Beta panel</ui-tab>
</ui-tab-group>

<!-- Center -->
<ui-tab-group tabAlign="center">
  <ui-tab label="Alpha">Alpha panel</ui-tab>
  <ui-tab label="Beta">Beta panel</ui-tab>
</ui-tab-group>

<!-- End -->
<ui-tab-group tabAlign="end">
  <ui-tab label="Alpha">Alpha panel</ui-tab>
  <ui-tab label="Beta">Beta panel</ui-tab>
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
/* No custom styles needed — tabAlign handles header alignment. */
`,
      },
    },
  },
};

// ── Separator / Spacer stories ───────────────────────────────────────

/**
 * \`<ui-tab-separator>\` renders a thin visual divider between tab groups.
 * \`<ui-tab-spacer>\` pushes subsequent tabs to the far end of the header.
 *
 * Both components can be combined for complex toolbar-style layouts.
 */
export const SeparatorAndSpacer: Story = {
  render: () => ({
    template: `<ui-tabs-separator-spacer-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- Separator adds a visual divider -->
<ui-tab-group>
  <ui-tab label="File">File content</ui-tab>
  <ui-tab label="Edit">Edit content</ui-tab>
  <ui-tab-separator />
  <ui-tab label="View">View content</ui-tab>
</ui-tab-group>

<!-- Spacer pushes tabs to the right -->
<ui-tab-group>
  <ui-tab label="Main">Main content</ui-tab>
  <ui-tab-spacer />
  <ui-tab label="Settings">Settings pushed right</ui-tab>
</ui-tab-group>

<!-- Combined -->
<ui-tab-group>
  <ui-tab label="Alpha">Alpha</ui-tab>
  <ui-tab-separator />
  <ui-tab label="Beta">Beta</ui-tab>
  <ui-tab-spacer />
  <ui-tab label="Omega">Omega pushed right</ui-tab>
</ui-tab-group>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UITabGroup, UITab, UITabSeparator, UITabSpacer } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITabGroup, UITab, UITabSeparator, UITabSpacer],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — separator and spacer are styled automatically. */
`,
      },
    },
  },
};
