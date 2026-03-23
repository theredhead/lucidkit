# Gauge Component — TODO

## High Priority

- [x] **Animation / transitions** — `animated` input that interpolates between old → new value over ~300ms using `requestAnimationFrame`
- [ ] **Horizontal bar gauge strategy** — linear horizontal track + fill + optional ticks. Covers progress-like KPIs (CPU, battery, tank level)
- [ ] **`formatValue` callback** — `formatValue` input `(n: number) => string` on the component, passed through `GaugeRenderContext`, so consumers control formatting (locale, precision, "$", "%")

## Medium Priority

- [ ] **Semicircle / half-gauge** — 180° sweep variant for fuel/temp dashboards. Either a `sweep` config option on `AnalogGaugeStrategy` or a separate strategy
- [ ] **Zone labels** — optional `label?: string` on `GaugeZone` for legend/tooltip text ("Safe", "Warning", "Danger")
- [ ] **Threshold markers / set-point** — `thresholds` input (`readonly number[]`) for reference lines on the gauge face (e.g. target temperature)

## Lower Priority

- [ ] **Multi-needle / multi-value** — show two values on one gauge (current + target, or min/max recorded)
- [ ] **Responsive sizing** — `fit` mode using `ResizeObserver` to fill container instead of fixed width/height
- [ ] **Click-to-set** — interactive mode: click/drag on needle emits a new value (thermostat use case)
