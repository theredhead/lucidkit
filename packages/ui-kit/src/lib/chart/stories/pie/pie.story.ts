import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIChart } from "../../chart.component";
import { PieChartStrategy } from "../../strategies/pie-chart.strategy";

interface BrowserShare {
  browser: string;
  share: number;
}

const browserData: BrowserShare[] = [
  { browser: "Chrome", share: 65 },
  { browser: "Safari", share: 18 },
  { browser: "Firefox", share: 7 },
  { browser: "Edge", share: 5 },
  { browser: "Other", share: 5 },
];

// ── Demo: Pie ────────────────────────────────────────────────────

@Component({
  selector: "ui-chart-pie-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./pie.story.scss",
  templateUrl: "./pie.story.html",
})
export class ChartPieDemo {
  public readonly data = browserData;
  public readonly strategy = new PieChartStrategy();
}
