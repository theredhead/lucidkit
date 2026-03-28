import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UITooltip } from "./tooltip.directive";
import type { TooltipPosition } from "./tooltip.types";
import { UIButton } from "../button/button.component";

const meta: Meta = {
  title: "@theredhead/UI Kit/Tooltip",
  decorators: [
    moduleMetadata({
      imports: [UITooltip, UIButton],
    }),
  ],
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A directive that displays a floating text tooltip on hover/focus.",
      },
    },
  },
  argTypes: {
    uiTooltip: {
      control: "text",
      description: "Tooltip text content.",
    },
    tooltipPosition: {
      control: "select",
      options: ["top", "bottom", "left", "right"] satisfies TooltipPosition[],
      description:
        "Controls where the tooltip appears relative to the anchor element. " +
        "The tooltip will reposition if it overflows the viewport.",
    },
    tooltipDelay: {
      control: "number",
      description: "Show delay in milliseconds.",
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * A single button with a top-positioned tooltip. Hover over the
 * button to see the tooltip appear after the default 200 ms delay.
 * Use the controls panel to change the position.
 */
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; justify-content: center; padding: 80px;">
        <ui-button
          [uiTooltip]="uiTooltip"
          [tooltipPosition]="tooltipPosition"
          [tooltipDelay]="tooltipDelay"
        >
          Hover me
        </ui-button>
      </div>
    `,
  }),
  args: {
    uiTooltip: "This is a tooltip",
    tooltipPosition: "top",
    tooltipDelay: 200,
  },
  parameters: {
    docs: {
      description: {
        story:
          "`UITooltip` is applied as an attribute directive on any element. It\n" +
          "creates an overlay anchored to the host element and removes it when\n" +
          "the pointer leaves.\n\n" +
          "### Inputs\n" +
          "| Input | Type | Default | Description |\n" +
          "|-------|------|---------|-------------|\n" +
          "| `uiTooltip` | `string` | *(required)* | Tooltip text content |\n" +
          "| `tooltipPosition` | `TooltipPosition` | `'top'` | Placement relative to the anchor |\n" +
          "| `tooltipDelay` | `number` | `200` | Show delay in milliseconds |\n\n" +
          "### Usage\n" +
          "```html\n" +
          '<button uiTooltip="Save changes" tooltipPosition="bottom">Save</button>\n' +
          "```",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<button
  uiTooltip="This is a tooltip"
  tooltipPosition="top"
  class="my-button"
>
  Hover me
</button>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UITooltip } from '@theredhead/ui-kit';

@Component({
  selector: 'app-tooltip-demo',
  standalone: true,
  imports: [UITooltip],
  templateUrl: './tooltip-demo.component.html',
  styleUrl: './tooltip-demo.component.scss',
})
export class TooltipDemoComponent {}

// ── SCSS ──
.my-button {
  padding: 8px 16px;
}
`,
      },
    },
  },
};

/**
 * All four tooltip positions rendered side-by-side. Hover each
 * button to compare placement: top, bottom, left, and right.
 */
export const AllPositions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 32px; justify-content: center; padding: 80px; flex-wrap: wrap;">
        <ui-button uiTooltip="Top tooltip" tooltipPosition="top">Top</ui-button>
        <ui-button uiTooltip="Bottom tooltip" tooltipPosition="bottom">Bottom</ui-button>
        <ui-button uiTooltip="Left tooltip" tooltipPosition="left">Left</ui-button>
        <ui-button uiTooltip="Right tooltip" tooltipPosition="right">Right</ui-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<div class="tooltip-grid">
  <button uiTooltip="Top tooltip" tooltipPosition="top">Top</button>
  <button uiTooltip="Bottom tooltip" tooltipPosition="bottom">Bottom</button>
  <button uiTooltip="Left tooltip" tooltipPosition="left">Left</button>
  <button uiTooltip="Right tooltip" tooltipPosition="right">Right</button>
</div>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UITooltip } from '@theredhead/ui-kit';

@Component({
  selector: 'app-all-positions-demo',
  standalone: true,
  imports: [UITooltip],
  templateUrl: './all-positions-demo.component.html',
  styleUrl: './all-positions-demo.component.scss',
})
export class AllPositionsDemoComponent {}

// ── SCSS ──
.tooltip-grid {
  display: flex;
  gap: 32px;
  justify-content: center;
  padding: 80px;
  flex-wrap: wrap;

  button {
    padding: 8px 16px;
  }
}
`,
      },
    },
  },
};
