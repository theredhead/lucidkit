import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIChart } from "../../chart.component";
import { ScatterPlotStrategy } from "../../strategies/scatter-plot.strategy";

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
  public readonly width = input<number>(560);
  public readonly height = input<number>(340);
  public readonly showLegend = input<boolean>(true);
  public readonly ariaLabel = input<string>("City temperature scatter plot");

  public readonly data = temperatureData;
  public readonly strategy = new ScatterPlotStrategy({ markerRadius: 7 });
}
