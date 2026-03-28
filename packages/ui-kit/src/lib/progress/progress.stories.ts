import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { type ProgressMode, type ProgressVariant } from "./progress.types";
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
  argTypes: {
    variant: {
      control: "select",
      options: ["linear", "circular"] satisfies ProgressVariant[],
      description: "Shape of the progress indicator.",
    },
    mode: {
      control: "select",
      options: ["determinate", "indeterminate"] satisfies ProgressMode[],
      description:
        "Determinate shows a value; indeterminate animates continuously.",
    },
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Progress value (0–100). Only used in determinate mode.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A progress indicator available in two shapes and two modes.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ProgressDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIProgress>;

/**
 * Interactive playground — adjust every input via the Controls panel.
 */
export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-progress
      [variant]="variant"
      [mode]="mode"
      [value]="value"
      [ariaLabel]="ariaLabel"
    />`,
  }),
  args: {
    variant: "linear",
    mode: "determinate",
    value: 65,
    ariaLabel: "Progress",
  },
};

/**
 * All progress combinations in one view: linear (determinate &
 * indeterminate) and circular (determinate & indeterminate).
 * Drag the slider to adjust the determinate value in real time.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-progress-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "### Variants\n" +
          "| Variant | Shape | Use case |\n" +
          "|---------|-------|----------|\n" +
          "| `linear` | Horizontal bar | Page loads, file uploads |\n" +
          "| `circular` | Spinning ring | Inline loading spinners |\n\n" +
          "### Modes\n" +
          "- **Determinate** — shows a `value` (0–100) as a filled portion\n" +
          "- **Indeterminate** — animates continuously when the total is unknown\n\n" +
          "### Inputs\n" +
          "| Input | Type | Default |\n" +
          "|-------|------|---------|\n" +
          "| `variant` | `'linear' \\| 'circular'` | `'linear'` |\n" +
          "| `mode` | `'determinate' \\| 'indeterminate'` | `'determinate'` |\n" +
          "| `value` | `number` | `0` |\n" +
          "| `ariaLabel` | `string` | `'Progress'` |",
      },
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
