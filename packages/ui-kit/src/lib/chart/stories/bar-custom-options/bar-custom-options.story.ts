import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIChart } from "../../chart.component";
import { BarGraphStrategy } from "../../strategies/bar-graph.strategy";

interface QuarterlyMetric {
  quarter: string;
  value: number;
}

const quarterlyData: QuarterlyMetric[] = [
  { quarter: "Q1 2024", value: 4200 },
  { quarter: "Q2 2024", value: 5800 },
  { quarter: "Q3 2024", value: 4900 },
  { quarter: "Q4 2024", value: 7100 },
];

// ── Demo: Bar (custom options) ───────────────────────────────────

@Component({
  selector: "ui-chart-bar-custom-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./bar-custom-options.story.scss",
  templateUrl: "./bar-custom-options.story.html",
})
export class ChartBarCustomDemo {
  public readonly data = quarterlyData;
  public readonly strategy = new BarGraphStrategy({
    barWidthRatio: 0.85,
    borderRadius: 0,
  });
}
