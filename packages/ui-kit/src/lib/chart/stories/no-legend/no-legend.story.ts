import { ChangeDetectionStrategy, Component, input } from "@angular/core";
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

// ── Demo: No Legend ──────────────────────────────────────────────

@Component({
  selector: "ui-chart-no-legend-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./no-legend.story.scss",
  templateUrl: "./no-legend.story.html",
})
export class ChartNoLegendDemo {
  public readonly width = input<number>(300);
  public readonly height = input<number>(300);
  public readonly showLegend = input<boolean>(false);
  public readonly ariaLabel = input<string>("Data chart");

  public readonly data = browserData;
  public readonly strategy = new PieChartStrategy();
}
