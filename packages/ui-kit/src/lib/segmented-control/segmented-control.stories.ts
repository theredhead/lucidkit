import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import {
  UISegmentedControl,
  type SegmentedItem,
} from "./segmented-control.component";
import { UIIcons } from "../icon";

@Component({
  selector: "ui-segmented-control-demo",
  standalone: true,
  imports: [UISegmentedControl],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 32px; padding: 16px; background: var(--ui-surface, #fff); color: var(--ui-text, #1d232b);"
    >
      <div>
        <h4 style="margin: 0 0 8px; color: var(--ui-text, #1d232b);">Basic</h4>
        <ui-segmented-control [items]="viewItems" [(value)]="view" />
        <p
          style="margin: 8px 0 0; font-size: 0.875rem; color: var(--ui-text-muted, #5a6470);"
        >
          Active: {{ view() }}
        </p>
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: var(--ui-text, #1d232b);">
          With icons
        </h4>
        <ui-segmented-control [items]="iconItems" [(value)]="iconView" />
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: var(--ui-text, #1d232b);">
          Disabled item
        </h4>
        <ui-segmented-control [items]="mixedItems" [(value)]="mixed" />
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: var(--ui-text, #1d232b);">
          Entire control disabled
        </h4>
        <ui-segmented-control
          [items]="viewItems"
          [(value)]="view"
          [disabled]="true"
        />
      </div>
    </div>
  `,
})
class SegmentedControlDemo {
  protected readonly view = signal("week");
  protected readonly iconView = signal("grid");
  protected readonly mixed = signal("a");

  protected readonly viewItems: SegmentedItem[] = [
    { id: "day", label: "Day" },
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
    { id: "year", label: "Year" },
  ];

  protected readonly iconItems: SegmentedItem[] = [
    { id: "list", label: "List", icon: UIIcons.Lucide.Design.LayoutList },
    { id: "grid", label: "Grid", icon: UIIcons.Lucide.Design.LayoutGrid },
  ];

  protected readonly mixedItems: SegmentedItem[] = [
    { id: "a", label: "Option A" },
    { id: "b", label: "Option B", disabled: true },
    { id: "c", label: "Option C" },
  ];
}

const meta: Meta<UISegmentedControl> = {
  title: "@theredhead/UI Kit/Segmented Control",
  component: UISegmentedControl,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [SegmentedControlDemo],
    }),
  ],
  argTypes: {
    value: { control: "text", description: "Active segment id." },
    disabled: {
      control: "boolean",
      description: "Disable the entire control.",
    },
  },
};
export default meta;
type Story = StoryObj<UISegmentedControl>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      items: [
        { id: "day", label: "Day" },
        { id: "week", label: "Week" },
        { id: "month", label: "Month" },
      ] satisfies SegmentedItem[],
      value: "week",
    },
    template: `<ui-segmented-control [items]="items" [(value)]="value" [disabled]="disabled" />`,
  }),
  args: { disabled: false },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-segmented-control [items]="viewItems" [(value)]="activeView" />

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UISegmentedControl, type SegmentedItem } from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UISegmentedControl],
  template: \`<ui-segmented-control [items]="viewItems" [(value)]="activeView" />\`,
})
export class ExampleComponent {
  public readonly activeView = signal('week');
  public readonly viewItems: SegmentedItem[] = [
    { id: 'day',   label: 'Day' },
    { id: 'week',  label: 'Week' },
    { id: 'month', label: 'Month' },
  ];
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

export const Showcase: Story = {
  render: () => ({ template: `<ui-segmented-control-demo />` }),
  parameters: {
    docs: {
      source: { code: "See SegmentedControlDemo component in stories file." },
    },
  },
};
