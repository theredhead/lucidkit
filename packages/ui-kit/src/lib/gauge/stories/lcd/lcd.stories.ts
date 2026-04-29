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

import { LCDStorySource } from "./lcd.story";

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
  decorators: [moduleMetadata({ imports: [LCDStorySource] })]
} satisfies Meta<UIGauge>;

export default meta;
type Story = StoryObj<UIGauge>;

export const LCD: Story = {
  args: {
    value: 37.2,
    min: 0,
    max: 100,
    unit: "°C",
    strategy: new LcdGaugeStrategy({ decimals: 1, digitCount: 5 }),
    width: 260,
    height: 120,
    detailLevel: "high" as GaugeDetailLevel,
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-lcd-story-demo />",
    })
};
