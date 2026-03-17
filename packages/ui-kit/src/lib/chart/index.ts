export { UIChart } from "./chart.component";
export {
  type ChartDataPoint,
  type ChartLayer,
  type ChartLegendEntry,
  type ChartRenderOutput,
  type ChartSeriesData,
  type ChartSize,
  type ChartArea,
  DEFAULT_CHART_PALETTE,
} from "./chart.types";
export { GraphPresentationStrategy } from "./strategies/graph-presentation-strategy";
export { LineGraphStrategy } from "./strategies/line-graph.strategy";
export { BarGraphStrategy } from "./strategies/bar-graph.strategy";
export { PieChartStrategy } from "./strategies/pie-chart.strategy";
export { ScatterPlotStrategy } from "./strategies/scatter-plot.strategy";
export {
  extractDataPoints,
  extractSeriesData,
  buildLegendEntries,
  buildSeriesLegendEntries,
  svgToImageData,
} from "./chart.utils";
