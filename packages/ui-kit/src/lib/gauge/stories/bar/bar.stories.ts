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

import { BarStorySource } from "./bar.story";

const meta = {
  title: "@theredhead/UI Kit/Gauge",
  component: BarStorySource,
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
  decorators: [moduleMetadata({ imports: [BarStorySource] })]
} satisfies Meta<BarStorySource>;

export default meta;
type Story = StoryObj<BarStorySource>;

export const Bar: Story = {
  args: {
    value: 65,
    min: 0,
    max: 100,
    unit: "%",
    strategy: new BarGaugeStrategy({ ticks: 10 }),
    width: 300,
    height: 80,
    detailLevel: "high" as GaugeDetailLevel,
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-bar-story-demo />",
    })
};
