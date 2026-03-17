import { describe, expect, it } from "vitest";
import type {
  ChartDataPoint,
  ChartSeriesData,
  ChartSize,
} from "../chart.types";
import { BarGraphStrategy } from "./bar-graph.strategy";
import { LineGraphStrategy } from "./line-graph.strategy";
import { PieChartStrategy } from "./pie-chart.strategy";
import { ScatterPlotStrategy } from "./scatter-plot.strategy";

const samplePoints: ChartDataPoint[] = [
  { label: "Jan", value: 100, color: "#4285f4" },
  { label: "Feb", value: 200, color: "#ea4335" },
  { label: "Mar", value: 150, color: "#fbbc04" },
  { label: "Apr", value: 300, color: "#34a853" },
];

/** Wrap points in a single-series array (backward-compat helper). */
function singleSeries(points: readonly ChartDataPoint[]): ChartSeriesData[] {
  return [{ name: "", color: points[0]?.color ?? "#000", points }];
}

/** Build a multi-series array from two point lists. */
function multiSeries(): ChartSeriesData[] {
  return [
    {
      name: "Revenue",
      color: "#4285f4",
      points: [
        { label: "Jan", value: 100, color: "#4285f4" },
        { label: "Feb", value: 200, color: "#4285f4" },
        { label: "Mar", value: 150, color: "#4285f4" },
      ],
    },
    {
      name: "Cost",
      color: "#ea4335",
      points: [
        { label: "Jan", value: 60, color: "#ea4335" },
        { label: "Feb", value: 90, color: "#ea4335" },
        { label: "Mar", value: 80, color: "#ea4335" },
      ],
    },
  ];
}

const size: ChartSize = { width: 400, height: 300 };

describe("GraphPresentationStrategy implementations", () => {
  // ── LineGraphStrategy ───────────────────────────────────────────

  describe("LineGraphStrategy", () => {
    it("should have name 'Line'", () => {
      const strategy = new LineGraphStrategy();
      expect(strategy.name).toBe("Line");
    });

    it("should return svg output kind", () => {
      const strategy = new LineGraphStrategy();
      const output = strategy.render(singleSeries(samplePoints), size);
      expect(output.kind).toBe("svg");
    });

    it("should produce an SVGSVGElement for svg output", () => {
      const strategy = new LineGraphStrategy();
      const output = strategy.render(singleSeries(samplePoints), size);
      if (output.kind === "svg") {
        expect(output.element.tagName.toLowerCase()).toBe("svg");
      }
    });

    it("should contain a path element for the line", () => {
      const strategy = new LineGraphStrategy();
      const output = strategy.render(singleSeries(samplePoints), size);
      if (output.kind === "svg") {
        const paths = output.element.querySelectorAll("path");
        expect(paths.length).toBeGreaterThanOrEqual(1);
      }
    });

    it("should contain circle markers for each data point", () => {
      const strategy = new LineGraphStrategy();
      const output = strategy.render(singleSeries(samplePoints), size);
      if (output.kind === "svg") {
        const circles = output.element.querySelectorAll("circle");
        expect(circles.length).toBe(samplePoints.length);
      }
    });

    it("should handle empty data without error", () => {
      const strategy = new LineGraphStrategy();
      const output = strategy.render(singleSeries([]), size);
      expect(output.kind).toBe("svg");
    });

    it("should handle a single data point", () => {
      const strategy = new LineGraphStrategy();
      const output = strategy.render(singleSeries([samplePoints[0]]), size);
      expect(output.kind).toBe("svg");
      if (output.kind === "svg") {
        expect(output.element.querySelectorAll("circle").length).toBe(1);
      }
    });

    it("should accept custom stroke width and marker radius", () => {
      const strategy = new LineGraphStrategy({
        strokeWidth: 4,
        markerRadius: 8,
      });
      const output = strategy.render(singleSeries(samplePoints), size);
      expect(output.kind).toBe("svg");
    });

    it("should render one line path per series in multi-series mode", () => {
      const strategy = new LineGraphStrategy();
      const output = strategy.render(multiSeries(), size);
      if (output.kind === "svg") {
        const paths = output.element.querySelectorAll("path");
        expect(paths.length).toBe(2);
      }
    });

    it("should render circles for all data points across series", () => {
      const strategy = new LineGraphStrategy();
      const output = strategy.render(multiSeries(), size);
      if (output.kind === "svg") {
        const circles = output.element.querySelectorAll("circle");
        expect(circles.length).toBe(6);
      }
    });
  });

  // ── BarGraphStrategy ────────────────────────────────────────────

  describe("BarGraphStrategy", () => {
    it("should have name 'Bar'", () => {
      const strategy = new BarGraphStrategy();
      expect(strategy.name).toBe("Bar");
    });

    it("should return svg output kind", () => {
      const strategy = new BarGraphStrategy();
      const output = strategy.render(singleSeries(samplePoints), size);
      expect(output.kind).toBe("svg");
    });

    it("should produce a rect element for each data point", () => {
      const strategy = new BarGraphStrategy();
      const output = strategy.render(singleSeries(samplePoints), size);
      if (output.kind === "svg") {
        const rects = output.element.querySelectorAll("rect");
        expect(rects.length).toBe(samplePoints.length);
      }
    });

    it("should handle empty data without error", () => {
      const strategy = new BarGraphStrategy();
      const output = strategy.render(singleSeries([]), size);
      expect(output.kind).toBe("svg");
    });

    it("should accept custom bar width ratio and border radius", () => {
      const strategy = new BarGraphStrategy({
        barWidthRatio: 0.8,
        borderRadius: 6,
      });
      const output = strategy.render(singleSeries(samplePoints), size);
      if (output.kind === "svg") {
        const rects = output.element.querySelectorAll("rect");
        expect(rects.length).toBe(samplePoints.length);
      }
    });

    it("should render grouped bars in multi-series mode", () => {
      const strategy = new BarGraphStrategy();
      const output = strategy.render(multiSeries(), size);
      if (output.kind === "svg") {
        const rects = output.element.querySelectorAll("rect");
        expect(rects.length).toBe(6);
      }
    });
  });

  // ── PieChartStrategy ────────────────────────────────────────────

  describe("PieChartStrategy", () => {
    it("should have name 'Pie'", () => {
      const strategy = new PieChartStrategy();
      expect(strategy.name).toBe("Pie");
    });

    it("should return svg output kind", () => {
      const strategy = new PieChartStrategy();
      const output = strategy.render(singleSeries(samplePoints), size);
      expect(output.kind).toBe("svg");
    });

    it("should produce a path element for each data point (slice)", () => {
      const strategy = new PieChartStrategy();
      const output = strategy.render(singleSeries(samplePoints), size);
      if (output.kind === "svg") {
        const paths = output.element.querySelectorAll("path");
        expect(paths.length).toBe(samplePoints.length);
      }
    });

    it("should handle empty data without error", () => {
      const strategy = new PieChartStrategy();
      const output = strategy.render(singleSeries([]), size);
      expect(output.kind).toBe("svg");
    });

    it("should support donut style with inner radius", () => {
      const strategy = new PieChartStrategy({ innerRadiusRatio: 0.5 });
      const output = strategy.render(singleSeries(samplePoints), size);
      if (output.kind === "svg") {
        const paths = output.element.querySelectorAll("path");
        expect(paths.length).toBe(samplePoints.length);
      }
    });

    it("should handle all-zero values", () => {
      const zeros: ChartDataPoint[] = [
        { label: "A", value: 0, color: "#f00" },
        { label: "B", value: 0, color: "#0f0" },
      ];
      const strategy = new PieChartStrategy();
      const output = strategy.render(singleSeries(zeros), size);
      expect(output.kind).toBe("svg");
    });

    it("should only use the first series in multi-series mode", () => {
      const strategy = new PieChartStrategy();
      const output = strategy.render(multiSeries(), size);
      if (output.kind === "svg") {
        const paths = output.element.querySelectorAll("path");
        expect(paths.length).toBe(3);
      }
    });
  });

  // ── ScatterPlotStrategy ─────────────────────────────────────────

  describe("ScatterPlotStrategy", () => {
    it("should have name 'Scatter'", () => {
      const strategy = new ScatterPlotStrategy();
      expect(strategy.name).toBe("Scatter");
    });

    it("should return svg output kind", () => {
      const strategy = new ScatterPlotStrategy();
      const output = strategy.render(singleSeries(samplePoints), size);
      expect(output.kind).toBe("svg");
    });

    it("should produce a circle for each data point", () => {
      const strategy = new ScatterPlotStrategy();
      const output = strategy.render(singleSeries(samplePoints), size);
      if (output.kind === "svg") {
        const circles = output.element.querySelectorAll("circle");
        expect(circles.length).toBe(samplePoints.length);
      }
    });

    it("should handle empty data without error", () => {
      const strategy = new ScatterPlotStrategy();
      const output = strategy.render(singleSeries([]), size);
      expect(output.kind).toBe("svg");
    });

    it("should handle a single data point", () => {
      const strategy = new ScatterPlotStrategy();
      const output = strategy.render(singleSeries([samplePoints[0]]), size);
      expect(output.kind).toBe("svg");
      if (output.kind === "svg") {
        expect(output.element.querySelectorAll("circle").length).toBe(1);
      }
    });

    it("should accept custom marker radius and opacity", () => {
      const strategy = new ScatterPlotStrategy({
        markerRadius: 8,
        markerOpacity: 0.5,
      });
      const output = strategy.render(singleSeries(samplePoints), size);
      expect(output.kind).toBe("svg");
      if (output.kind === "svg") {
        const circle = output.element.querySelector("circle");
        expect(circle?.getAttribute("r")).toBe("8");
        expect(circle?.getAttribute("opacity")).toBe("0.5");
      }
    });

    it("should render circles for all series in multi-series mode", () => {
      const strategy = new ScatterPlotStrategy();
      const output = strategy.render(multiSeries(), size);
      if (output.kind === "svg") {
        const circles = output.element.querySelectorAll("circle");
        expect(circles.length).toBe(6);
      }
    });
  });
});
