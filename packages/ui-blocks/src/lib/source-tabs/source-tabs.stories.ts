import { ChangeDetectionStrategy, Component } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISourceTabs, type UISourceTab } from "./source-tabs.component";

const SAMPLE_TABS: readonly UISourceTab[] = [
  {
    label: "Markup",
    language: "HTML",
    filename: "profile-card.component.html",
    code: `<ui-card>
  <ui-card-header subtitle="Updated 2m ago">Profile</ui-card-header>
  <ui-card-body>
    <p>Card content here.</p>
  </ui-card-body>
</ui-card>`,
  },
  {
    label: "TypeScript",
    language: "TypeScript",
    filename: "profile-card.component.ts",
    code: `import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UICard, UICardBody, UICardHeader } from "@theredhead/lucid-kit";

@Component({
  selector: "app-profile-card",
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody],
  templateUrl: "./profile-card.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent {}`,
  },
  {
    label: "Styles",
    language: "SCSS",
    filename: "profile-card.component.scss",
    code: `:host {
  display: block;
}

ui-card {
  max-inline-size: 28rem;
}`,
  },
];

@Component({
  selector: "ui-source-tabs-story-demo",
  standalone: true,
  imports: [UISourceTabs],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-source-tabs [tabs]="tabs" ariaLabel="Source tabs example" />
  `,
})
class UISourceTabsStoryDemo {
  public readonly tabs = SAMPLE_TABS;
}

const meta: Meta<UISourceTabs> = {
  title: "@theredhead/UI Blocks/Source Tabs",
  component: UISourceTabs,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [UISourceTabsStoryDemo],
    }),
  ],
  argTypes: {
    ariaLabel: {
      control: "text",
      description: "Accessible label for the source tab list.",
    },
    emptyMessage: {
      control: "text",
      description: "Fallback message shown when no source panes are present.",
    },
  },
};

export default meta;
type Story = StoryObj<UISourceTabs>;

export const Default: Story = {
  render: () => ({
    template: `<ui-source-tabs-story-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-source-tabs [tabs]="tabs" ariaLabel="Implementation example" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UISourceTabs, type UISourceTab } from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-source-demo',
  standalone: true,
  imports: [UISourceTabs],
  template: \
    '<ui-source-tabs [tabs]="tabs" ariaLabel="Implementation example" />',
})
export class SourceDemoComponent {
  readonly tabs: UISourceTab[] = [
    { label: 'Markup', language: 'HTML', code: '<div>Hello</div>' },
    { label: 'TypeScript', language: 'TypeScript', code: 'export class Demo {}' },
    { label: 'Styles', language: 'SCSS', code: ':host { display: block; }' },
  ];
}

// ── SCSS ──
/* No custom styles needed — ui-source-tabs follows theme tokens. */
`,
      },
    },
  },
};
