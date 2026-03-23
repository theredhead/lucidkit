export { UIGauge } from "./gauge.component";
export {
  type GaugeDetailLevel,
  type GaugeRenderContext,
  type GaugeRenderOutput,
  type GaugeSize,
  type GaugeTokens,
  type GaugeZone,
} from "./gauge.types";
export { GaugePresentationStrategy } from "./strategies/gauge-presentation-strategy";
export { AnalogGaugeStrategy } from "./strategies/analog-gauge.strategy";
export type { AnalogGaugeOptions } from "./strategies/analog-gauge.strategy";
export { VuMeterStrategy } from "./strategies/vu-meter.strategy";
export { DigitalGaugeStrategy } from "./strategies/digital-gauge.strategy";
export { LcdGaugeStrategy } from "./strategies/lcd-gauge.strategy";
export { BarGaugeStrategy } from "./strategies/bar-gauge.strategy";
export type { BarGaugeOptions } from "./strategies/bar-gauge.strategy";
