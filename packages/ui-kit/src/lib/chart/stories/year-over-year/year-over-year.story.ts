import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIChart } from "../../chart.component";
import type { ChartLayer } from "../../chart.types";
import { LineGraphStrategy } from "../../strategies/line-graph.strategy";

interface YearlySales {
  month: string;
  revenue: number;
}

const sales2024: YearlySales[] = [
  { month: "Jan", revenue: 12400 },
  { month: "Feb", revenue: 18200 },
  { month: "Mar", revenue: 15600 },
  { month: "Apr", revenue: 22100 },
  { month: "May", revenue: 19800 },
  { month: "Jun", revenue: 25400 },
];

const sales2025: YearlySales[] = [
  { month: "Jan", revenue: 14800 },
  { month: "Feb", revenue: 21500 },
  { month: "Mar", revenue: 17200 },
  { month: "Apr", revenue: 24600 },
  { month: "May", revenue: 22100 },
  { month: "Jun", revenue: 28900 },
];

// ── Demo: Year-over-Year (different data arrays) ─────────────────

@Component({
  selector: "ui-chart-yoy-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./year-over-year.story.scss",
  templateUrl: "./year-over-year.story.html",
})
export class ChartYoyDemo {
  public readonly width = input<number>(560);
  public readonly height = input<number>(340);
  public readonly showLegend = input<boolean>(true);
  public readonly ariaLabel = input<string>("2024 vs 2025 revenue comparison");

  public readonly strategy = new LineGraphStrategy({
    strokeWidth: 2.5,
    markerRadius: 5,
  });
  public readonly layers: ChartLayer<YearlySales>[] = [
    { name: "2024", data: sales2024 },
    { name: "2025", data: sales2025 },
  ];
}
