import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIGauge } from "../../gauge.component";
import type { GaugeDetailLevel } from "../../gauge.types";
import type { GaugePresentationStrategy } from "../../strategies/gauge-presentation-strategy";
import { AnalogGaugeStrategy } from "../../strategies/analog-gauge.strategy";
import { VuMeterStrategy } from "../../strategies/vu-meter.strategy";
import { DigitalGaugeStrategy } from "../../strategies/digital-gauge.strategy";
import { LcdGaugeStrategy } from "../../strategies/lcd-gauge.strategy";
import { BarGaugeStrategy } from "../../strategies/bar-gauge.strategy";

const detailLevels: GaugeDetailLevel[] = ["high", "medium", "low"];

const strategies: Record<string, GaugePresentationStrategy> = {
  Analog: new AnalogGaugeStrategy(),
  "VU Meter": new VuMeterStrategy(),
  Digital: new DigitalGaugeStrategy(),
  LCD: new LcdGaugeStrategy(),
  Bar: new BarGaugeStrategy(),
};

import { CustomFormatterStorySource } from "./custom-formatter.story";

const meta = {
  title: "@theredhead/UI Kit/Gauge",
  component: UIGauge,
  tags: ["autodocs"],
  argTypes: {
    strategy: {
      control: "select",
      options: Object.keys(strategies),
      mapping: strategies,
    },
    detailLevel: {
      control: "select",
      options: detailLevels,
    },
  },
  decorators: [moduleMetadata({ imports: [CustomFormatterStorySource] })]
} satisfies Meta<UIGauge>;

export default meta;
type Story = StoryObj<UIGauge>;

export const CustomFormatter: Story = {
  args: {
    value: 1234.5,
    min: 0,
    max: 5000,
    strategy: new AnalogGaugeStrategy(),
    width: 260,
    height: 260,
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-custom-formatter-story-demo />",
    })
};
