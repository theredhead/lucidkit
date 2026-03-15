import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UIProgress } from "./progress.component";
import { UISlider } from "../slider/slider.component";

@Component({
  selector: "ui-progress-demo",
  standalone: true,
  imports: [UIProgress, UISlider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 32px; max-width: 400px"
    >
      <div>
        <h4 style="margin: 0 0 8px">Linear determinate</h4>
        <ui-progress [value]="val()" />
        <ui-slider
          [(value)]="val"
          [showValue]="true"
          ariaLabel="Progress value"
          style="margin-top: 12px"
        />
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Linear indeterminate</h4>
        <ui-progress mode="indeterminate" />
      </div>
      <div style="display: flex; gap: 24px; align-items: center">
        <div>
          <h4 style="margin: 0 0 8px">Circular</h4>
          <ui-progress variant="circular" [value]="val()" />
        </div>
        <div>
          <h4 style="margin: 0 0 8px">Circular indeterminate</h4>
          <ui-progress variant="circular" mode="indeterminate" />
        </div>
      </div>
    </div>
  `,
})
class ProgressDemo {
  public readonly val = signal(65);
}

const meta: Meta<UIProgress> = {
  title: "@Theredhead/UI Kit/Progress",
  component: UIProgress,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [ProgressDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIProgress>;

/** All progress variants and modes. */
export const Default: Story = {
  render: () => ({
    template: `<ui-progress-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<!-- Linear determinate -->
<ui-progress [value]="65" />

<!-- Linear indeterminate -->
<ui-progress mode="indeterminate" />

<!-- Circular determinate -->
<ui-progress variant="circular" [value]="65" />

<!-- Circular indeterminate -->
<ui-progress variant="circular" mode="indeterminate" />`,
        language: "html",
      },
    },
  },
};
