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
          <h4 style="margin: 0 0 8px; color: inherit">
            tabAlign="{{ align }}"
          </h4>
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
            <div style="padding: 0.5rem; font-size: 0.88rem">
              File operations
            </div>
          </ui-tab>
          <ui-tab label="Edit">
            <div style="padding: 0.5rem; font-size: 0.88rem">
              Edit operations
            </div>
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
        <h4 style="margin: 0 0 8px; color: inherit">
          Spacer pushing tabs apart
        </h4>
        <ui-tab-group>
          <ui-tab label="Main">
            <div style="padding: 0.5rem; font-size: 0.88rem">Main content</div>
          </ui-tab>
          <ui-tab label="Dashboard">
            <div style="padding: 0.5rem; font-size: 0.88rem">
              Dashboard view
            </div>
          </ui-tab>
          <ui-tab-spacer />
          <ui-tab label="Settings">
            <div style="padding: 0.5rem; font-size: 0.88rem">
              Settings pushed to the right
            </div>
          </ui-tab>
        </ui-tab-group>
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: inherit">
          Combined: separator + spacer
        </h4>
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
            <div style="padding: 0.5rem; font-size: 0.88rem">
              Omega pushed to the end
            </div>
          </ui-tab>
        </ui-tab-group>
      </div>
    </div>
  `,
})
class TabsSeparatorSpacerDemo {}

// ── IDE-style toolbar tabs demo ──────────────────────────────────────

@Component({
  selector: "ui-tabs-ide-toolbar-demo",
  standalone: true,
  imports: [UITabGroup, UITab, UITabSeparator, UITabSpacer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-tab-group panelStyle="flat">
      <ui-tab label="main.ts">
        <div
          style="font-family: monospace; font-size: 0.82rem; line-height: 1.7; padding: 0.75rem 0; white-space: pre"
        >
          export function bootstrap() &lbrace; const app = createApp();
          app.listen(3000); console.log('Server started'); &rbrace;
        </div>
      </ui-tab>
      <ui-tab label="app.module.ts">
        <div
          style="font-family: monospace; font-size: 0.82rem; line-height: 1.7; padding: 0.75rem 0; white-space: pre"
        >
          &#64;NgModule(&lbrace; declarations: [], imports: [CommonModule],
          &rbrace;) export class AppModule &lbrace;&rbrace;
        </div>
      </ui-tab>
      <ui-tab-separator />
      <ui-tab label="styles.scss">
        <div
          style="font-family: monospace; font-size: 0.82rem; line-height: 1.7; padding: 0.75rem 0; white-space: pre"
        >
          :root &lbrace; --primary: #3b82f6; --surface: #ffffff; &rbrace;
        </div>
      </ui-tab>
      <ui-tab-spacer />
      <ui-tab label="README.md">
        <div style="font-size: 0.88rem; padding: 0.75rem 0">
          <strong>Project README</strong> — documentation and setup
          instructions.
        </div>
      </ui-tab>
    </ui-tab-group>
  `,
})
class TabsIdeToolbarDemo {}

// ── Centered nav with actions demo ───────────────────────────────────

@Component({
  selector: "ui-tabs-centered-nav-demo",
  standalone: true,
  imports: [UITabGroup, UITab, UITabSpacer, UITabSeparator],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 32px">
      <div>
        <h4 style="margin: 0 0 8px; color: inherit">
          Centered navigation with action pushed right
        </h4>
        <ui-tab-group tabAlign="start">
          <ui-tab label="Home">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              Welcome to the dashboard. Select a section to get started.
            </div>
          </ui-tab>
          <ui-tab label="Projects">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              3 active projects, 12 completed this quarter.
            </div>
          </ui-tab>
          <ui-tab label="Team">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              8 members across 2 time zones.
            </div>
          </ui-tab>
          <ui-tab-spacer />
          <ui-tab label="My Account">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              Profile settings, notifications, and security preferences.
            </div>
          </ui-tab>
        </ui-tab-group>
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: inherit">
          Grouped sections with multiple separators
        </h4>
        <ui-tab-group panelStyle="outline">
          <ui-tab label="All">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              Showing all 142 items across every category.
            </div>
          </ui-tab>
          <ui-tab-separator />
          <ui-tab label="Active">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              87 active items in progress right now.
            </div>
          </ui-tab>
          <ui-tab label="Archived">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              55 items archived this month.
            </div>
          </ui-tab>
          <ui-tab-separator />
          <ui-tab label="Drafts">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              12 unpublished drafts waiting for review.
            </div>
          </ui-tab>
        </ui-tab-group>
      </div>
    </div>
  `,
})
class TabsCenteredNavDemo {}

// ── Kitchen sink: icons + spacer + separator + alignment ─────────────

@Component({
  selector: "ui-tabs-kitchen-sink-demo",
  standalone: true,
  imports: [UITabGroup, UITab, UITabSeparator, UITabSpacer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 32px">
      <div>
        <h4 style="margin: 0 0 8px; color: inherit">
          End-aligned with icons and spacer
        </h4>
        <ui-tab-group tabAlign="end" panelStyle="outline">
          <ui-tab [icon]="icons.inbox" label="Inbox">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              <strong>23 unread</strong> messages across 4 threads.
            </div>
          </ui-tab>
          <ui-tab [icon]="icons.send" label="Sent">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              12 messages sent today.
            </div>
          </ui-tab>
          <ui-tab-separator />
          <ui-tab [icon]="icons.archive" label="Archive">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              1,847 archived conversations since January.
            </div>
          </ui-tab>
        </ui-tab-group>
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: inherit">
          Primary nav + icon-only actions (right-pushed)
        </h4>
        <ui-tab-group panelStyle="flat">
          <ui-tab label="Overview">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              System overview with live metrics and alerts.
            </div>
          </ui-tab>
          <ui-tab label="Logs">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              Streaming application logs from all services.
            </div>
          </ui-tab>
          <ui-tab label="Alerts">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              3 active alerts requiring attention.
            </div>
          </ui-tab>
          <ui-tab-spacer />
          <ui-tab [icon]="icons.settings" ariaLabel="Settings">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              Configure monitoring thresholds and notification channels.
            </div>
          </ui-tab>
          <ui-tab [icon]="icons.help" ariaLabel="Help">
            <div style="padding: 0.75rem 0; font-size: 0.88rem">
              Documentation, guides, and support resources.
            </div>
          </ui-tab>
        </ui-tab-group>
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: inherit">
          Bottom tabs with centered alignment + separator
        </h4>
        <ui-tab-group
          tabPosition="bottom"
          tabAlign="center"
          style="min-height: 140px"
        >
          <ui-tab [icon]="icons.home" label="Home">
            <div style="font-size: 0.88rem">Home screen content.</div>
          </ui-tab>
          <ui-tab [icon]="icons.search" label="Explore">
            <div style="font-size: 0.88rem">Discover trending content.</div>
          </ui-tab>
          <ui-tab-separator />
          <ui-tab [icon]="icons.bell" label="Alerts">
            <div style="font-size: 0.88rem">3 new notifications.</div>
          </ui-tab>
          <ui-tab [icon]="icons.user" label="Profile">
            <div style="font-size: 0.88rem">Your profile and preferences.</div>
          </ui-tab>
        </ui-tab-group>
      </div>
    </div>
  `,
})
class TabsKitchenSinkDemo {
  protected readonly icons = {
    inbox: UIIcons.Lucide.Mail.Inbox,
    send: UIIcons.Lucide.Mail.Send,
    archive: UIIcons.Lucide.Mail.Archive,
    settings: UIIcons.Lucide.Account.Settings,
    help: UIIcons.Lucide.Accessibility.BadgeQuestionMark,
    home: UIIcons.Lucide.Buildings.House,
    search: UIIcons.Lucide.Social.Search,
    bell: UIIcons.Lucide.Account.Bell,
    user: UIIcons.Lucide.Account.User,
  } as const;
}

const meta: Meta<UITabGroup> = {
  title: "@theredhead/UI Kit/Tabs",
  component: UITabGroup,
  tags: ["autodocs"],
  argTypes: {
    tabPosition: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Position of the tab strip relative to the panel content.",
    },
    panelStyle: {
      control: "select",
      options: ["flat", "outline", "raised"],
      description: "Visual style of the active panel.",
    },
    tabAlign: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Alignment of tabs within the tab strip.",
    },
    selectedIndex: {
      control: "number",
      description: "Zero-based index of the initially selected tab.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the entire tab group.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the tab group.",
    },
  },
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
        TabsIdeToolbarDemo,
        TabsCenteredNavDemo,
        TabsKitchenSinkDemo,
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

// ── IDE Toolbar story ────────────────────────────────────────────────

/**
 * Mimics an IDE-style file tabbar: related files are grouped with a
 * separator, and an outlier tab is pushed to the far end via a spacer.
 */
export const IdeToolbar: Story = {
  render: () => ({
    template: `<ui-tabs-ide-toolbar-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "A code-editor-style tab bar. The separator visually groups " +
          "TypeScript sources apart from stylesheets, while the spacer " +
          "pushes the README tab to the right edge.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-tab-group panelStyle="flat">
  <ui-tab label="main.ts">TypeScript entry point</ui-tab>
  <ui-tab label="app.module.ts">Angular module</ui-tab>
  <ui-tab-separator />
  <ui-tab label="styles.scss">Global styles</ui-tab>
  <ui-tab-spacer />
  <ui-tab label="README.md">Project docs</ui-tab>
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
/* No custom styles needed. */
`,
      },
    },
  },
};

// ── App Navigation story ─────────────────────────────────────────────

/**
 * Real-world application navigation patterns combining spacer, separator,
 * and multiple visual groupings.
 */
export const AppNavigation: Story = {
  render: () => ({
    template: `<ui-tabs-centered-nav-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Two navigation patterns: (1) primary nav with a user account " +
          "tab pushed right via spacer, and (2) filter tabs using " +
          "separators to create visual groupings.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- Nav with spacer — account tab pushed right -->
<ui-tab-group>
  <ui-tab label="Home">Home content</ui-tab>
  <ui-tab label="Projects">Projects list</ui-tab>
  <ui-tab label="Team">Team directory</ui-tab>
  <ui-tab-spacer />
  <ui-tab label="My Account">Account settings</ui-tab>
</ui-tab-group>

<!-- Filter tabs with separators -->
<ui-tab-group panelStyle="outline">
  <ui-tab label="All">All items</ui-tab>
  <ui-tab-separator />
  <ui-tab label="Active">Active items</ui-tab>
  <ui-tab label="Archived">Archived items</ui-tab>
  <ui-tab-separator />
  <ui-tab label="Drafts">Draft items</ui-tab>
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
/* No custom styles needed. */
`,
      },
    },
  },
};

// ── Kitchen Sink story ───────────────────────────────────────────────

/**
 * Comprehensive demo combining icons, alignment, spacers, separators,
 * tab positions, and panel styles — showcasing how all features compose.
 */
export const KitchenSink: Story = {
  render: () => ({
    template: `<ui-tabs-kitchen-sink-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Three examples showcasing feature composition:\n" +
          "1. **End-aligned email client** — icons + separator + end alignment\n" +
          "2. **Monitoring dashboard** — labelled nav + spacer + icon-only action tabs\n" +
          "3. **Mobile-style bottom bar** — bottom position + center alignment + separator",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- End-aligned mail tabs with icons -->
<ui-tab-group tabAlign="end" panelStyle="outline">
  <ui-tab [icon]="icons.inbox" label="Inbox">Messages</ui-tab>
  <ui-tab [icon]="icons.send" label="Sent">Sent mail</ui-tab>
  <ui-tab-separator />
  <ui-tab [icon]="icons.archive" label="Archive">Archived</ui-tab>
</ui-tab-group>

<!-- Dashboard with icon-only actions pushed right -->
<ui-tab-group panelStyle="flat">
  <ui-tab label="Overview">System metrics</ui-tab>
  <ui-tab label="Logs">App logs</ui-tab>
  <ui-tab label="Alerts">Active alerts</ui-tab>
  <ui-tab-spacer />
  <ui-tab [icon]="icons.settings" ariaLabel="Settings">Config</ui-tab>
  <ui-tab [icon]="icons.help" ariaLabel="Help">Docs</ui-tab>
</ui-tab-group>

<!-- Bottom bar with centered alignment -->
<ui-tab-group tabPosition="bottom" tabAlign="center">
  <ui-tab [icon]="icons.home" label="Home">Home</ui-tab>
  <ui-tab [icon]="icons.search" label="Explore">Explore</ui-tab>
  <ui-tab-separator />
  <ui-tab [icon]="icons.bell" label="Alerts">Notifications</ui-tab>
  <ui-tab [icon]="icons.user" label="Profile">Profile</ui-tab>
</ui-tab-group>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UITabGroup, UITab, UITabSeparator, UITabSpacer, UIIcons } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITabGroup, UITab, UITabSeparator, UITabSpacer],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  protected readonly icons = {
    inbox: UIIcons.Lucide.Mail.Inbox,
    send: UIIcons.Lucide.Mail.Send,
    archive: UIIcons.Lucide.Mail.Archive,
    settings: UIIcons.Lucide.Account.Settings,
    help: UIIcons.Lucide.Accessibility.BadgeQuestionMark,
    home: UIIcons.Lucide.Buildings.House,
    search: UIIcons.Lucide.Social.Search,
    bell: UIIcons.Lucide.Account.Bell,
    user: UIIcons.Lucide.Account.User,
  } as const;
}

// ── SCSS ──
/* No custom styles needed — all features compose through inputs. */
`,
      },
    },
  },
};
