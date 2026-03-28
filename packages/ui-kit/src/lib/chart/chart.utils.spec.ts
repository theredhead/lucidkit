import { describe, expect, it } from "vitest";
import type {
  ChartDataPoint,
  ChartLayer,
  ChartSeriesData,
} from "./chart.types";
import { DEFAULT_CHART_PALETTE } from "./chart.types";
import {
  buildLegendEntries,
  buildSeriesLegendEntries,
  computeChartArea,
  computeYScale,
  createSvgRoot,
  drawYAxis,
  extractDataPoints,
  extractSeriesData,
  formatTickLabel,
  svgEl,
  svgText,
} from "./chart.utils";

interface SampleRow {
  month: string;
  revenue: number;
  cost: number;
}

const sampleData: SampleRow[] = [
  { month: "Jan", revenue: 100, cost: 40 },
  { month: "Feb", revenue: 200, cost: 80 },
  { month: "Mar", revenue: 150, cost: 60 },
];

describe("chart utils", () => {
  // ── extractDataPoints ────────────────────────────────────────────

  describe("extractDataPoints", () => {
    it("should extract labels and values from typed data", () => {
      const points = extractDataPoints(sampleData, "month", "revenue");
      expect(points).toHaveLength(3);
      expect(points[0].label).toBe("Jan");
      expect(points[0].value).toBe(100);
      expect(points[1].label).toBe("Feb");
      expect(points[1].value).toBe(200);
    });

    it("should assign colours from the default palette", () => {
      const points = extractDataPoints(sampleData, "month", "revenue");
      expect(points[0].color).toBe(DEFAULT_CHART_PALETTE[0]);
      expect(points[1].color).toBe(DEFAULT_CHART_PALETTE[1]);
      expect(points[2].color).toBe(DEFAULT_CHART_PALETTE[2]);
    });

    it("should cycle palette colours when data exceeds palette length", () => {
      const palette = ["#aaa", "#bbb"];
      const points = extractDataPoints(sampleData, "month", "revenue", palette);
      expect(points[0].color).toBe("#aaa");
      expect(points[1].color).toBe("#bbb");
      expect(points[2].color).toBe("#aaa"); // wraps
    });

    it("should return empty array for empty data", () => {
      const points = extractDataPoints(
        [],
        "month" as never,
        "revenue" as never,
      );
      expect(points).toHaveLength(0);
    });

    it("should coerce non-string labels to string", () => {
      const data = [{ id: 42, val: 10 }];
      const points = extractDataPoints(data, "id", "val");
      expect(points[0].label).toBe("42");
    });
  });

  // ── buildLegendEntries ──────────────────────────────────────────

  describe("buildLegendEntries", () => {
    it("should build legend entries from data points", () => {
      const points: ChartDataPoint[] = [
        { label: "A", value: 10, color: "#f00" },
        { label: "B", value: 20, color: "#0f0" },
      ];
      const entries = buildLegendEntries(points);
      expect(entries).toHaveLength(2);
      expect(entries[0]).toEqual({
        label: "A",
        color: "#f00",
        value: 10,
      });
    });

    it("should return empty for empty points", () => {
      expect(buildLegendEntries([])).toHaveLength(0);
    });
  });

  // ── computeYScale ───────────────────────────────────────────────

  describe("computeYScale", () => {
    it("should return sensible defaults for empty data", () => {
      const scale = computeYScale([]);
      expect(scale.min).toBe(0);
      expect(scale.max).toBe(1);
      expect(scale.ticks.length).toBeGreaterThanOrEqual(2);
    });

    it("should include 0 in the range when all values are positive", () => {
      const points: ChartDataPoint[] = [
        { label: "A", value: 100, color: "#f00" },
        { label: "B", value: 200, color: "#0f0" },
      ];
      const scale = computeYScale(points);
      expect(scale.min).toBeLessThanOrEqual(0);
      expect(scale.max).toBeGreaterThanOrEqual(200);
    });

    it("should produce ticks that span the data range", () => {
      const points: ChartDataPoint[] = [
        { label: "A", value: 10, color: "#f00" },
        { label: "B", value: 50, color: "#0f0" },
        { label: "C", value: 30, color: "#00f" },
      ];
      const scale = computeYScale(points);
      expect(scale.ticks[0]).toBeLessThanOrEqual(0);
      expect(scale.ticks[scale.ticks.length - 1]).toBeGreaterThanOrEqual(50);
    });

    it("should handle a single data point", () => {
      const points: ChartDataPoint[] = [
        { label: "X", value: 42, color: "#f00" },
      ];
      const scale = computeYScale(points);
      expect(scale.max).toBeGreaterThan(scale.min);
      expect(scale.ticks.length).toBeGreaterThanOrEqual(2);
    });

    it("should handle all-zero values", () => {
      const points: ChartDataPoint[] = [
        { label: "A", value: 0, color: "#f00" },
        { label: "B", value: 0, color: "#0f0" },
      ];
      const scale = computeYScale(points);
      expect(scale.max).toBeGreaterThan(scale.min);
    });
  });

  // ── computeChartArea ────────────────────────────────────────────

  describe("computeChartArea", () => {
    it("should subtract padding from size", () => {
      const area = computeChartArea({ width: 400, height: 300 });
      expect(area.x).toBe(50); // default left padding
      expect(area.y).toBe(20); // default top padding
      expect(area.width).toBe(330); // 400 - 50 - 20
      expect(area.height).toBe(240); // 300 - 20 - 40
    });

    it("should accept custom padding", () => {
      const area = computeChartArea(
        { width: 200, height: 200 },
        { top: 10, right: 10, bottom: 10, left: 10 },
      );
      expect(area.width).toBe(180);
      expect(area.height).toBe(180);
    });

    it("should not produce negative dimensions", () => {
      const area = computeChartArea(
        { width: 10, height: 10 },
        { top: 100, right: 100, bottom: 100, left: 100 },
      );
      expect(area.width).toBe(0);
      expect(area.height).toBe(0);
    });
  });

  // ── formatTickLabel ─────────────────────────────────────────────

  describe("formatTickLabel", () => {
    it("should format integers without decimals", () => {
      expect(formatTickLabel(100)).toBe("100");
      expect(formatTickLabel(0)).toBe("0");
    });

    it("should format floats to one decimal", () => {
      expect(formatTickLabel(3.14159)).toBe("3.1");
      expect(formatTickLabel(0.5)).toBe("0.5");
    });
  });

  // ── extractSeriesData ──────────────────────────────────────────

  describe("extractSeriesData", () => {
    it("should build series data from layers", () => {
      const layers: ChartLayer<SampleRow>[] = [
        { name: "Revenue" },
        { name: "Cost", valueProperty: "cost" },
      ];
      const series = extractSeriesData(layers, sampleData, "month", "revenue");
      expect(series).toHaveLength(2);
      expect(series[0].name).toBe("Revenue");
      expect(series[1].name).toBe("Cost");
    });

    it("should use component-level data when layer has no data", () => {
      const layers: ChartLayer<SampleRow>[] = [{ name: "Revenue" }];
      const series = extractSeriesData(layers, sampleData, "month", "revenue");
      expect(series[0].points).toHaveLength(3);
      expect(series[0].points[0].label).toBe("Jan");
    });

    it("should use layer-specific data when provided", () => {
      const altData: SampleRow[] = [{ month: "Jul", revenue: 500, cost: 200 }];
      const layers: ChartLayer<SampleRow>[] = [{ name: "Alt", data: altData }];
      const series = extractSeriesData(layers, sampleData, "month", "revenue");
      expect(series[0].points).toHaveLength(1);
      expect(series[0].points[0].label).toBe("Jul");
    });

    it("should override valueProperty per layer", () => {
      const layers: ChartLayer<SampleRow>[] = [
        { name: "Cost", valueProperty: "cost" },
      ];
      const series = extractSeriesData(layers, sampleData, "month", "revenue");
      expect(series[0].points[0].value).toBe(40);
      expect(series[0].points[1].value).toBe(80);
    });

    it("should assign a unique colour per series from the palette", () => {
      const layers: ChartLayer<SampleRow>[] = [{ name: "A" }, { name: "B" }];
      const palette = ["#red", "#blue"];
      const series = extractSeriesData(
        layers,
        sampleData,
        "month",
        "revenue",
        palette,
      );
      expect(series[0].color).toBe("#red");
      expect(series[1].color).toBe("#blue");
    });

    it("should give all points within a series the same colour", () => {
      const layers: ChartLayer<SampleRow>[] = [{ name: "A" }];
      const series = extractSeriesData(layers, sampleData, "month", "revenue", [
        "#abc",
      ]);
      for (const p of series[0].points) {
        expect(p.color).toBe("#abc");
      }
    });

    it("should return empty for empty layers", () => {
      const series = extractSeriesData([], sampleData, "month", "revenue");
      expect(series).toHaveLength(0);
    });
  });

  // ── buildSeriesLegendEntries ────────────────────────────────────

  describe("buildSeriesLegendEntries", () => {
    it("should build one legend entry per series", () => {
      const series: ChartSeriesData[] = [
        {
          name: "Revenue",
          color: "#f00",
          points: [
            { label: "Jan", value: 100, color: "#f00" },
            { label: "Feb", value: 200, color: "#f00" },
          ],
        },
        {
          name: "Cost",
          color: "#0f0",
          points: [
            { label: "Jan", value: 40, color: "#0f0" },
            { label: "Feb", value: 80, color: "#0f0" },
          ],
        },
      ];
      const entries = buildSeriesLegendEntries(series);
      expect(entries).toHaveLength(2);
      expect(entries[0].label).toBe("Revenue");
      expect(entries[0].color).toBe("#f00");
      expect(entries[0].value).toBe(300); // sum
      expect(entries[1].label).toBe("Cost");
      expect(entries[1].value).toBe(120); // sum
    });

    it("should return empty for empty series", () => {
      expect(buildSeriesLegendEntries([])).toHaveLength(0);
    });
  });

  describe("svgEl", () => {
    it("should create an SVG element with the given tag", () => {
      const rect = svgEl("rect", { x: 10, y: 20, width: 100, height: 50 });
      expect(rect.tagName).toBe("rect");
      expect(rect.getAttribute("x")).toBe("10");
      expect(rect.getAttribute("width")).toBe("100");
    });

    it("should create element with no attributes when omitted", () => {
      const g = svgEl("g");
      expect(g.tagName).toBe("g");
    });
  });

  describe("createSvgRoot", () => {
    it("should create an SVG root with viewBox matching size", () => {
      const svg = createSvgRoot({ width: 400, height: 300 });
      expect(svg.tagName).toBe("svg");
      expect(svg.getAttribute("width")).toBe("400");
      expect(svg.getAttribute("height")).toBe("300");
      expect(svg.getAttribute("viewBox")).toBe("0 0 400 300");
    });
  });

  describe("svgText", () => {
    it("should create a text element with content", () => {
      const el = svgText("hello", 10, 20, { fill: "red" });
      expect(el.tagName).toBe("text");
      expect(el.textContent).toBe("hello");
      expect(el.getAttribute("x")).toBe("10");
      expect(el.getAttribute("y")).toBe("20");
      expect(el.getAttribute("fill")).toBe("red");
    });
  });

  describe("drawYAxis", () => {
    it("should draw grid lines and labels", () => {
      const svg = createSvgRoot({ width: 400, height: 300 });
      const area = { x: 50, y: 20, width: 330, height: 260 };
      drawYAxis(svg, [0, 50, 100], area, 100, 0, "#333", "#ccc");
      const lines = svg.querySelectorAll("line");
      const texts = svg.querySelectorAll("text");
      expect(lines.length).toBe(3);
      expect(texts.length).toBe(3);
    });

    it("should handle zero range gracefully", () => {
      const svg = createSvgRoot({ width: 400, height: 300 });
      const area = { x: 50, y: 20, width: 330, height: 260 };
      drawYAxis(svg, [0], area, 0, 0, "#333", "#ccc");
      expect(svg.querySelectorAll("line").length).toBe(1);
    });
  });
});
