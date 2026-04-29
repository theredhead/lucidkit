import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIChart } from "../../chart.component";
import { ScatterPlotStrategy } from "../../strategies/scatter-plot.strategy";

// ── Sample data ─────────────────────────────────────────────────

interface MonthlySales {
  month: string;
  revenue: number;
}

const salesData: MonthlySales[] = [
  { month: "Jan", revenue: 12400 },
  { month: "Feb", revenue: 18200 },
  { month: "Mar", revenue: 15600 },
  { month: "Apr", revenue: 22100 },
  { month: "May", revenue: 19800 },
  { month: "Jun", revenue: 25400 },
];

// ── Demo: Scatter (custom opacity) ───────────────────────────────

@Component({
  selector: "ui-chart-scatter-custom-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./scatter-custom-options.story.scss",
  templateUrl: "./scatter-custom-options.story.html",
})
export class ChartScatterCustomDemo {
  public readonly data = salesData;
  public readonly strategy = new ScatterPlotStrategy({
    markerRadius: 12,
    markerOpacity: 0.45,
  });
}
