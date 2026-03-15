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
  title: "@Theredhead/UI Kit/Slider",
  component: UISlider,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [SliderSingleDemo, SliderRangeDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj<UISlider>;

/** Single-thumb slider with various configurations. */
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

/** Dual-thumb range slider. */
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
