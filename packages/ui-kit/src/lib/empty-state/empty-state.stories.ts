import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy } from "@angular/core";

import { UIEmptyState } from "./empty-state.component";
import { UIIcons } from "../icon";
import { UIButton } from "../button/button.component";

@Component({
  selector: "ui-empty-state-demo",
  standalone: true,
  imports: [UIEmptyState, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 40px; padding: 16px; background: var(--ui-surface, #fff); color: var(--ui-text, #1d232b);">
      <div>
        <h4 style="margin: 0 0 8px; color: var(--ui-text, #1d232b);">Heading only</h4>
        <ui-empty-state heading="No notifications" />
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: var(--ui-text, #1d232b);">With message</h4>
        <ui-empty-state
          heading="No results found"
          message="Try adjusting your search or filters to find what you're looking for."
        />
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: var(--ui-text, #1d232b);">With icon + action</h4>
        <ui-empty-state
          heading="Your inbox is empty"
          message="When you receive messages they'll appear here."
          [icon]="icon"
        >
          <ui-button action variant="outlined">Compose message</ui-button>
        </ui-empty-state>
      </div>
    </div>
  `,
})
class EmptyStateDemo {
  protected readonly icon = UIIcons.Lucide.Mail.Inbox;
}

const meta: Meta<UIEmptyState> = {
  title: "@theredhead/UI Kit/Empty State",
  component: UIEmptyState,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [EmptyStateDemo, UIButton],
    }),
  ],
  argTypes: {
    heading: {
      control: "text",
      description: "Primary heading.",
    },
    message: {
      control: "text",
      description: "Optional explanatory message.",
    },
    icon: {
      control: "text",
      description: "SVG inner-content for the illustration icon.",
    },
    iconSize: {
      control: { type: "number", min: 16, max: 96, step: 8 },
      description: "Icon size in px.",
    },
  },
};
export default meta;
type Story = StoryObj<UIEmptyState>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-empty-state
        [heading]="heading"
        [message]="message"
      />
    `,
  }),
  args: {
    heading: "No results found",
    message: "Try adjusting your filters or search query.",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-empty-state
  heading="No results found"
  message="Try adjusting your filters or search query."
>
  <button action>Clear filters</button>
</ui-empty-state>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIEmptyState } from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UIEmptyState],
  template: \`
    <ui-empty-state heading="No results found" message="Try adjusting your search.">
      <button action>Clear filters</button>
    </ui-empty-state>
  \`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

export const Showcase: Story = {
  render: () => ({
    template: `<ui-empty-state-demo />`,
  }),
  parameters: {
    docs: { source: { code: "See EmptyStateDemo component in stories file." } },
  },
};
