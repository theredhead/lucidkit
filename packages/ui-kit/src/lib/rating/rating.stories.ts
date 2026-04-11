import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UIRating, type RatingSize } from "./rating.component";

@Component({
  selector: "ui-rating-demo",
  standalone: true,
  imports: [UIRating],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 28px; padding: 16px; background: var(--ui-surface, #fff); color: var(--ui-text, #1d232b);"
    >
      <div>
        <h4 style="margin: 0 0 8px; color: var(--ui-text, #1d232b);">
          Interactive
        </h4>
        <ui-rating [(value)]="rating" />
        <p
          style="margin: 8px 0 0; font-size: 0.875rem; color: var(--ui-text-muted, #5a6470);"
        >
          Value: {{ rating() }}
        </p>
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: var(--ui-text, #1d232b);">
          Read-only
        </h4>
        <ui-rating [value]="4" [readonly]="true" />
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: var(--ui-text, #1d232b);">Sizes</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <ui-rating [value]="3" size="small" [readonly]="true" />
          <ui-rating [value]="3" size="medium" [readonly]="true" />
          <ui-rating [value]="3" size="large" [readonly]="true" />
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: var(--ui-text, #1d232b);">
          Custom max (10)
        </h4>
        <ui-rating [value]="7" [max]="10" [readonly]="true" size="small" />
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: var(--ui-text, #1d232b);">
          Disabled
        </h4>
        <ui-rating [value]="3" [disabled]="true" />
      </div>
    </div>
  `,
})
class RatingDemo {
  protected readonly rating = signal(3);
}

const meta: Meta<UIRating> = {
  title: "@theredhead/UI Kit/Rating",
  component: UIRating,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [RatingDemo],
    }),
  ],
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 10 },
      description: "Current value.",
    },
    max: {
      control: { type: "number", min: 1, max: 10 },
      description: "Maximum stars.",
    },
    readonly: { control: "boolean", description: "Display-only mode." },
    disabled: { control: "boolean", description: "Disable input." },
    size: {
      control: "select",
      options: ["small", "medium", "large"] satisfies RatingSize[],
      description: "Visual size.",
    },
  },
};
export default meta;
type Story = StoryObj<UIRating>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-rating [value]="value" [max]="max" [readonly]="readonly" [disabled]="disabled" [size]="size" />`,
  }),
  args: { value: 3, max: 5, readonly: false, disabled: false, size: "medium" },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-rating [(value)]="stars" />

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIRating } from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UIRating],
  template: \`<ui-rating [(value)]="stars" />\`,
})
export class ExampleComponent {
  public readonly stars = signal(0);
}

// ── SCSS ──
/* Override star colour with CSS custom properties:
   --ui-rating-filled, --ui-rating-hover, --ui-rating-empty */
`,
      },
    },
  },
};

export const Showcase: Story = {
  render: () => ({ template: `<ui-rating-demo />` }),
  parameters: {
    docs: { source: { code: "See RatingDemo component in stories file." } },
  },
};
