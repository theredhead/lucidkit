import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIChart } from "../../chart.component";
import { LineGraphStrategy } from "../../strategies/line-graph.strategy";

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

// ── Demo: Line ───────────────────────────────────────────────────

@Component({
  selector: "ui-chart-line-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./line.story.scss",
  templateUrl: "./line.story.html",
})
export class ChartLineDemo {
  public readonly width = input<number>(520);
  public readonly height = input<number>(320);
  public readonly showLegend = input<boolean>(true);
  public readonly ariaLabel = input<string>("Monthly revenue line chart");

  public readonly data = salesData;
  public readonly strategy = new LineGraphStrategy();
}
