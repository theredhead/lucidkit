import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIChart } from "../../chart.component";
import type { ChartLayer } from "../../chart.types";
import { StackedBarGraphStrategy } from "../../strategies/stacked-bar-graph.strategy";

interface FinancialMonth {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

const financialData: FinancialMonth[] = [
  { month: "Jan", revenue: 12400, cost: 8200, profit: 4200 },
  { month: "Feb", revenue: 18200, cost: 10100, profit: 8100 },
  { month: "Mar", revenue: 15600, cost: 9800, profit: 5800 },
  { month: "Apr", revenue: 22100, cost: 12500, profit: 9600 },
  { month: "May", revenue: 19800, cost: 11200, profit: 8600 },
  { month: "Jun", revenue: 25400, cost: 14300, profit: 11100 },
];

@Component({
  selector: "ui-stacked-bar-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIChart],
  templateUrl: "./stacked-bar.story.html",
  styleUrl: "./stacked-bar.story.scss",
})
export class StackedBarStorySource {
  public readonly width = input<number>(560);
  public readonly height = input<number>(340);
  public readonly showLegend = input<boolean>(true);
  public readonly ariaLabel = input<string>(
    "Revenue, cost and profit stacked bar chart",
  );

  public readonly financialData = financialData;
  public readonly stackedStrategy = new StackedBarGraphStrategy();
  public readonly layers: ChartLayer<FinancialMonth>[] = [
    { name: "Revenue", valueProperty: "revenue" },
    { name: "Cost", valueProperty: "cost" },
    { name: "Profit", valueProperty: "profit" },
  ];
}
