# Gauge Component — TODO

## High Priority

- [x] **Animation / transitions** — `animated` input that interpolates between old → new value over ~300ms using `requestAnimationFrame`
- [x] **Horizontal bar gauge strategy** — linear horizontal track + fill + optional ticks. Covers progress-like KPIs (CPU, battery, tank level)
- [x] **`formatValue` callback** — `formatValue` input `(n: number) => string` on the component, passed through `GaugeRenderContext`, so consumers control formatting (locale, precision, "$", "%")

## Medium Priority

- [x] **Semicircle / half-gauge** — `sweepDegrees` config option on `AnalogGaugeStrategy` (30°–360°); 180° for fuel/temp dashboards
- [x] **Zone labels** — optional `label?: string` on `GaugeZone` rendered at high detail ("Safe", "Warning", "Danger")
- [x] **Threshold markers / set-point** — `thresholds` input (`readonly number[]`) for dashed reference lines on the gauge face

## Lower Priority

- [ ] **Multi-needle / multi-value** — show two values on one gauge (current + target, or min/max recorded)
- [x] **Responsive sizing** — `fit` mode using `ResizeObserver` to fill container instead of fixed width/height
- [ ] **Click-to-set** — interactive mode: click/drag on needle emits a new value (thermostat use case)
