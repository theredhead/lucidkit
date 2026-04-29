import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { UIChart } from "../../chart.component";
import { UIButton } from "../../../button/button.component";
import type { ChartLayer } from "../../chart.types";
import { BarGraphStrategy } from "../../strategies/bar-graph.strategy";
import { LineGraphStrategy } from "../../strategies/line-graph.strategy";
import { PieChartStrategy } from "../../strategies/pie-chart.strategy";
import { ScatterPlotStrategy } from "../../strategies/scatter-plot.strategy";
import { StackedBarGraphStrategy } from "../../strategies/stacked-bar-graph.strategy";
import type { GraphPresentationStrategy } from "../../strategies/graph-presentation-strategy";

interface CityTemperature {
  city: string;
  temp: number;
}

const temperatureData: CityTemperature[] = [
  { city: "Tokyo", temp: 28 },
  { city: "London", temp: 18 },
  { city: "New York", temp: 24 },
  { city: "Sydney", temp: 22 },
  { city: "Paris", temp: 20 },
  { city: "Berlin", temp: 17 },
  { city: "Mumbai", temp: 33 },
  { city: "Toronto", temp: 21 },
];

// ── Demo: Scatter ────────────────────────────────────────────────

@Component({
  selector: "ui-chart-scatter-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./scatter.story.scss",
  templateUrl: "./scatter.story.html",
})
export class ChartScatterDemo {
  public readonly data = temperatureData;
  public readonly strategy = new ScatterPlotStrategy({ markerRadius: 7 });
}
