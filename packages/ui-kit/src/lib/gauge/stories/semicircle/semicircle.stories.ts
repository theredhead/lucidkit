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

import { SemicircleStorySource } from "./semicircle.story";

const meta = {
  title: "@theredhead/UI Kit/Gauge",
  component: SemicircleStorySource,
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
  decorators: [moduleMetadata({ imports: [SemicircleStorySource] })]
} satisfies Meta<SemicircleStorySource>;

export default meta;
type Story = StoryObj<SemicircleStorySource>;

export const Semicircle: Story = {
  args: {
    value: 65,
    min: 0,
    max: 100,
    unit: "°C",
    strategy: new AnalogGaugeStrategy({ sweepDegrees: 180, majorTicks: 5 }),
    width: 280,
    height: 160,
    detailLevel: "high" as GaugeDetailLevel,
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-semicircle-story-demo />",
    })
};
