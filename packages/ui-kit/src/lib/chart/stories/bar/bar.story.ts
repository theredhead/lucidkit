import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIChart } from "../../chart.component";
import { BarGraphStrategy } from "../../strategies/bar-graph.strategy";

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

// ── Demo: Bar ────────────────────────────────────────────────────

@Component({
  selector: "ui-chart-bar-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./bar.story.scss",
  templateUrl: "./bar.story.html",
})
export class ChartBarDemo {
  public readonly width = input<number>(520);
  public readonly height = input<number>(320);
  public readonly showLegend = input<boolean>(true);
  public readonly ariaLabel = input<string>("Monthly revenue bar chart");

  public readonly data = salesData;
  public readonly strategy = new BarGraphStrategy();
}
