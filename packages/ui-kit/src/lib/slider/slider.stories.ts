import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UISlider } from "./slider.component";

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
          "| `disabled` | `boolean` | `false` | Disable interaction |",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [SliderSingleDemo, SliderRangeDemo],
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
