import { UIChart } from '@theredhead/lucid-kit';
import {
  BarGraphStrategy,
  LineGraphStrategy,
  ScatterPlotStrategy,
  PieChartStrategy,
} from '@theredhead/lucid-kit';

readonly salesData = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 18200 },
  { month: 'Mar', revenue: 15600 },
  { month: 'Apr', revenue: 22100 },
  { month: 'May', revenue: 19800 },
  { month: 'Jun', revenue: 25400 },
];

readonly barStrategy = new BarGraphStrategy();
readonly lineStrategy = new LineGraphStrategy();
readonly scatterStrategy = new ScatterPlotStrategy();
readonly pieStrategy = new PieChartStrategy();
