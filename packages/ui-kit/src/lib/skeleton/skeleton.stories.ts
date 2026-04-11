import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy } from "@angular/core";

import { type SkeletonVariant, UISkeleton } from "./skeleton.component";

@Component({
  selector: "ui-skeleton-demo",
  standalone: true,
  imports: [UISkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 32px; padding: 16px; background: var(--ui-surface, #fff); color: var(--ui-text, #1d232b);"
    >
      <div>
        <h4 style="margin: 0 0 12px; color: var(--ui-text, #1d232b);">
          Text — 1 line
        </h4>
        <ui-skeleton variant="text" [lines]="1" width="300px" />
      </div>
      <div>
        <h4 style="margin: 0 0 12px; color: var(--ui-text, #1d232b);">
          Text — 4 lines
        </h4>
        <ui-skeleton variant="text" [lines]="4" width="400px" />
      </div>
      <div>
        <h4 style="margin: 0 0 12px; color: var(--ui-text, #1d232b);">Rect</h4>
        <ui-skeleton variant="rect" width="240px" height="140px" />
      </div>
      <div>
        <h4 style="margin: 0 0 12px; color: var(--ui-text, #1d232b);">
          Circle (avatar)
        </h4>
        <ui-skeleton variant="circle" width="3rem" height="3rem" />
      </div>
      <div>
        <h4 style="margin: 0 0 12px; color: var(--ui-text, #1d232b);">
          Card skeleton
        </h4>
        <div
          style="display: flex; gap: 16px; align-items: flex-start; max-width: 380px;"
        >
          <ui-skeleton
            variant="circle"
            width="3rem"
            height="3rem"
            style="flex-shrink: 0;"
          />
          <div
            style="flex: 1; display: flex; flex-direction: column; gap: 8px;"
          >
            <ui-skeleton variant="text" [lines]="1" width="60%" />
            <ui-skeleton variant="text" [lines]="3" />
          </div>
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 12px; color: var(--ui-text, #1d232b);">
          Not animated
        </h4>
        <ui-skeleton
          variant="text"
          [lines]="2"
          width="300px"
          [animated]="false"
        />
      </div>
    </div>
  `,
})
class SkeletonDemo {}

const meta: Meta<UISkeleton> = {
  title: "@theredhead/UI Kit/Skeleton",
  component: UISkeleton,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [SkeletonDemo],
    }),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "rect", "circle"] satisfies SkeletonVariant[],
      description: "Shape of the placeholder.",
    },
    lines: {
      control: { type: "number", min: 1, max: 10 },
      description: "Number of text lines (text variant only).",
    },
    width: {
      control: "text",
      description: "CSS width applied to the host.",
    },
    height: {
      control: "text",
      description: "CSS height applied to the host (rect/circle only).",
    },
    animated: {
      control: "boolean",
      description: "Enable the shimmer animation.",
    },
  },
};
export default meta;
type Story = StoryObj<UISkeleton>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-skeleton [variant]="variant" [lines]="lines" [width]="width" [height]="height" [animated]="animated" />`,
  }),
  args: {
    variant: "text",
    lines: 3,
    width: "360px",
    height: "1rem",
    animated: true,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- Multi-line text placeholder -->
<ui-skeleton variant="text" [lines]="3" width="360px" />

<!-- Card image placeholder -->
<ui-skeleton variant="rect" width="100%" height="200px" />

<!-- Avatar placeholder -->
<ui-skeleton variant="circle" width="3rem" height="3rem" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UISkeleton } from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UISkeleton],
  template: \`<ui-skeleton variant="text" [lines]="3" />\`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — skeleton tokens handle theming. */
`,
      },
    },
  },
};

export const Showcase: Story = {
  render: () => ({
    template: `<ui-skeleton-demo />`,
  }),
  parameters: {
    docs: { source: { code: "See SkeletonDemo component in stories file." } },
  },
};
