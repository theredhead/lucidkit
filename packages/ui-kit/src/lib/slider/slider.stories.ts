import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UISlider } from "./slider.component";
import type { SliderTick } from "./slider.types";

@Component({
  selector: "ui-slider-demo",
  standalone: true,
  imports: [UISlider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 32px; max-width: 400px"
    >
      <div>
        <h4 style="margin: 0 0 8px">Single slider</h4>
        <ui-slider [(value)]="volume" [showValue]="true" ariaLabel="Volume" />
      </div>
      <div>
        <h4 style="margin: 0 0 8px">With step (10)</h4>
        <ui-slider
          [(value)]="stepped"
          [step]="10"
          [showValue]="true"
          ariaLabel="Stepped"
        />
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Disabled</h4>
        <ui-slider
          [value]="40"
          [disabled]="true"
          [showValue]="true"
          ariaLabel="Disabled"
        />
      </div>
    </div>
  `,
})
class SliderSingleDemo {
  public readonly volume = signal(50);
  public readonly stepped = signal(30);
}

@Component({
  selector: "ui-slider-range-demo",
  standalone: true,
  imports: [UISlider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 32px; max-width: 400px"
    >
      <div>
        <h4 style="margin: 0 0 8px">Price range</h4>
        <ui-slider
          mode="range"
          [(value)]="priceRange"
          [min]="0"
          [max]="1000"
          [step]="10"
          [showValue]="true"
          ariaLabel="Price"
        />
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Age range</h4>
        <ui-slider
          mode="range"
          [(value)]="ageRange"
          [min]="18"
          [max]="65"
          [showValue]="true"
          ariaLabel="Age"
        />
      </div>
    </div>
  `,
})
class SliderRangeDemo {
  public readonly priceRange = signal<readonly [number, number]>([200, 800]);
  public readonly ageRange = signal<readonly [number, number]>([25, 45]);
}

@Component({
  selector: "ui-slider-ticks-demo",
  standalone: true,
  imports: [UISlider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 40px; max-width: 400px"
    >
      <div>
        <h4 style="margin: 0 0 8px">Auto ticks (step = 20)</h4>
        <ui-slider
          [(value)]="auto"
          [step]="20"
          [showTicks]="true"
          [showValue]="true"
          ariaLabel="Auto ticks"
        />
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Labelled ticks</h4>
        <ui-slider
          [(value)]="labelled"
          [ticks]="labelledTicks"
          [showValue]="true"
          ariaLabel="Labelled"
        />
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Range with ticks</h4>
        <ui-slider
          mode="range"
          [(value)]="range"
          [min]="0"
          [max]="100"
          [step]="25"
          [showTicks]="true"
          [showValue]="true"
          ariaLabel="Range ticks"
        />
      </div>
    </div>
  `,
})
class SliderTicksDemo {
  public readonly auto = signal(40);
  public readonly labelled = signal(50);
  public readonly range = signal<readonly [number, number]>([25, 75]);
  public readonly labelledTicks: readonly SliderTick[] = [
    { value: 0, label: "Min" },
    { value: 25, label: "Low" },
    { value: 50, label: "Mid" },
    { value: 75, label: "High" },
    { value: 100, label: "Max" },
  ];
}

const meta: Meta<UISlider> = {
  title: "@theredhead/UI Kit/Slider",
  component: UISlider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A range-input component that supports both single-value and " +
          "dual-thumb range selection.\n\n" +
          "### Features\n" +
          "- **Single mode** — one draggable thumb for scalar values (e.g. volume)\n" +
          "- **Range mode** — two thumbs for selecting a min/max interval (e.g. price range)\n" +
          "- **Step snapping** — constrain values to discrete increments\n" +
          "- **Value display** — optional current-value label above the thumb\n" +
          "- **Two-way binding** — `[(value)]` model signal\n\n" +
          "### Inputs\n" +
          "| Input | Type | Default | Description |\n" +
          "|-------|------|---------|-------------|\n" +
          "| `mode` | `'single' \\| 'range'` | `'single'` | Selection mode |\n" +
          "| `value` | `number \\| [number, number]` | `0` | Current value (model) |\n" +
          "| `min` / `max` | `number` | `0` / `100` | Value bounds |\n" +
          "| `step` | `number` | `1` | Step increment |\n" +
          "| `showValue` | `boolean` | `false` | Show numeric label |\n" +
          "| `showTicks` | `boolean` | `false` | Show tick marks at each step |\n" +
          "| `ticks` | `SliderTick[]` | `[]` | Explicit tick definitions (overrides showTicks) |\n" +
          "| `disabled` | `boolean` | `false` | Disable interaction |",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [SliderSingleDemo, SliderRangeDemo, SliderTicksDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj<UISlider>;

/**
 * Single-thumb sliders with three configurations: a basic slider
 * with live value display, a stepped slider (increments of 10),
 * and a disabled slider frozen at 40.
 */
export const Single: Story = {
  render: () => ({
    template: `<ui-slider-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-slider [(value)]="volume" [showValue]="true" ariaLabel="Volume" />

<ui-slider [(value)]="stepped" [step]="10" [showValue]="true" ariaLabel="Stepped" />

<ui-slider [value]="40" [disabled]="true" [showValue]="true" ariaLabel="Disabled" />

<!-- Component class:
readonly volume = signal(50);
readonly stepped = signal(30); -->`,
        language: "html",
      },
    },
  },
};

/**
 * Dual-thumb range sliders for selecting an interval.
 * The price range uses a 10-step increment between 0–1000;
 * the age range allows free selection between 18–65.
 * Drag either thumb to adjust the bounds.
 */
export const Range: Story = {
  render: () => ({
    template: `<ui-slider-range-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-slider
  mode="range"
  [(value)]="priceRange"
  [min]="0" [max]="1000" [step]="10"
  [showValue]="true"
  ariaLabel="Price"
/>

<!-- Component class:
readonly priceRange = signal<readonly [number, number]>([200, 800]); -->`,
        language: "html",
      },
    },
  },
};

/**
 * Sliders with tick marks along the track. Auto-generated ticks appear
 * at each step interval. Explicit ticks support optional labels displayed
 * below the track. Works in both single and range modes.
 */
export const Ticks: Story = {
  render: () => ({
    template: `<ui-slider-ticks-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- Auto ticks at step intervals -->
<ui-slider [(value)]="auto" [step]="20" [showTicks]="true" [showValue]="true" ariaLabel="Auto" />

<!-- Explicit labelled ticks -->
<ui-slider [(value)]="labelled" [ticks]="ticks" [showValue]="true" ariaLabel="Labelled" />

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UISlider, type SliderTick } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UISlider],
  template: \\\`
    <ui-slider [(value)]="volume" [step]="20" [showTicks]="true" [showValue]="true" />
    <ui-slider [(value)]="rating" [ticks]="ticks" [showValue]="true" />
  \\\`,
})
export class ExampleComponent {
  readonly volume = signal(40);
  readonly rating = signal(50);
  readonly ticks: readonly SliderTick[] = [
    { value: 0, label: 'Min' },
    { value: 50, label: 'Mid' },
    { value: 100, label: 'Max' },
  ];
}

// ── SCSS ──
/* No custom styles needed — tick tokens follow the slider theme. */
`,
      },
    },
  },
};
