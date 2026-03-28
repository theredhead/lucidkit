import { Component, signal, viewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { UIChart } from "./chart.component";
import type { ChartLayer } from "./chart.types";
import type { GraphPresentationStrategy } from "./strategies/graph-presentation-strategy";
import { BarGraphStrategy } from "./strategies/bar-graph.strategy";
import { LineGraphStrategy } from "./strategies/line-graph.strategy";
import { PieChartStrategy } from "./strategies/pie-chart.strategy";
import { ScatterPlotStrategy } from "./strategies/scatter-plot.strategy";

interface TestRow {
  name: string;
  count: number;
  cost: number;
}

const testData: TestRow[] = [
  { name: "Alpha", count: 10, cost: 5 },
  { name: "Beta", count: 25, cost: 12 },
  { name: "Gamma", count: 15, cost: 8 },
];

/**
 * Wrapper component to host UIChart with required inputs.
 * Uses signals so mutations are picked up by zoneless change detection.
 */
@Component({
  selector: "ui-test-chart-host",
  standalone: true,
  imports: [UIChart],
  template: `
    <ui-chart
      [source]="source()"
      [labelProperty]="labelProp()"
      [valueProperty]="valueProp()"
      [strategy]="strategy()"
      [width]="width()"
      [height]="height()"
      [showLegend]="showLegend()"
      [sources]="sources()"
    />
  `,
})
class TestChartHost {
  public readonly chart = viewChild.required(UIChart);
  public readonly source = signal<TestRow[]>(testData);
  public readonly labelProp = signal<keyof TestRow>("name");
  public readonly valueProp = signal<keyof TestRow>("count");
  public readonly strategy = signal<GraphPresentationStrategy>(
    new BarGraphStrategy(),
  );
  public readonly width = signal(400);
  public readonly height = signal(300);
  public readonly showLegend = signal(true);
  public readonly sources = signal<ChartLayer<TestRow>[]>([]);
}

describe("UIChart", () => {
  let fixture: ComponentFixture<TestChartHost>;
  let host: TestChartHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestChartHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestChartHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(host.chart()).toBeTruthy();
  });

  describe("defaults", () => {
    it("should default width to 400", () => {
      expect(host.chart().width()).toBe(400);
    });

    it("should default height to 300", () => {
      expect(host.chart().height()).toBe(300);
    });

    it("should default showLegend to true", () => {
      expect(host.chart().showLegend()).toBe(true);
    });

    it("should default ariaLabel to 'Data chart'", () => {
      expect(host.chart().ariaLabel()).toBe("Data chart");
    });
  });

  describe("rendering", () => {
    it("should render an SVG into the chart container with bar strategy", () => {
      const svg = fixture.nativeElement.querySelector(".viewport svg");
      expect(svg).toBeTruthy();
    });

    it("should render bar rects matching data length", () => {
      const rects =
        fixture.nativeElement.querySelectorAll(".viewport svg rect");
      expect(rects.length).toBe(testData.length);
    });

    it("should render legend entries matching data length", () => {
      const items = fixture.nativeElement.querySelectorAll(".legend-item");
      expect(items.length).toBe(testData.length);
    });

    it("should hide legend when showLegend is false", () => {
      host.showLegend.set(false);
      fixture.detectChanges();
      const legend = fixture.nativeElement.querySelector(".legend");
      expect(legend).toBeNull();
    });
  });

  describe("strategy switching", () => {
    it("should re-render with line strategy", () => {
      host.strategy.set(new LineGraphStrategy());
      fixture.detectChanges();
      const paths =
        fixture.nativeElement.querySelectorAll(".viewport svg path");
      expect(paths.length).toBeGreaterThanOrEqual(1);
    });

    it("should re-render with pie strategy", () => {
      host.strategy.set(new PieChartStrategy());
      fixture.detectChanges();
      const paths =
        fixture.nativeElement.querySelectorAll(".viewport svg path");
      expect(paths.length).toBe(testData.length);
    });

    it("should re-render with scatter strategy", () => {
      host.strategy.set(new ScatterPlotStrategy());
      fixture.detectChanges();
      const circles = fixture.nativeElement.querySelectorAll(
        ".viewport svg circle",
      );
      expect(circles.length).toBe(testData.length);
    });
  });

  describe("data changes", () => {
    it("should update when data changes", () => {
      host.source.set([
        { name: "X", count: 5, cost: 3 },
        { name: "Y", count: 10, cost: 7 },
      ]);
      fixture.detectChanges();
      const rects =
        fixture.nativeElement.querySelectorAll(".viewport svg rect");
      expect(rects.length).toBe(2);
    });

    it("should handle empty data", () => {
      host.source.set([]);
      fixture.detectChanges();
      const container = fixture.nativeElement.querySelector(".viewport");
      // Container is cleared — no children when data is empty
      expect(container.children.length).toBe(0);
    });
  });

  describe("accessibility", () => {
    it("should have role=img on the chart viewport", () => {
      const viewport = fixture.nativeElement.querySelector(".viewport");
      expect(viewport.getAttribute("role")).toBe("img");
    });

    it("should apply aria-label to the chart viewport", () => {
      const viewport = fixture.nativeElement.querySelector(".viewport");
      expect(viewport.getAttribute("aria-label")).toBe("Data chart");
    });

    it("should have role=list on the legend", () => {
      const legend = fixture.nativeElement.querySelector(".legend");
      expect(legend.getAttribute("role")).toBe("list");
    });
  });

  describe("multi-layer support", () => {
    it("should render grouped bars when layers are provided", () => {
      host.sources.set([
        { name: "Count", valueProperty: "count" },
        { name: "Cost", valueProperty: "cost" },
      ]);
      fixture.detectChanges();
      const rects =
        fixture.nativeElement.querySelectorAll(".viewport svg rect");
      // 3 data points × 2 layers = 6 bars
      expect(rects.length).toBe(6);
    });

    it("should show series legend entries in multi-layer mode", () => {
      host.sources.set([
        { name: "Count", valueProperty: "count" },
        { name: "Cost", valueProperty: "cost" },
      ]);
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll(".legend-item");
      // One legend entry per series
      expect(items.length).toBe(2);
    });

    it("should use per-point legend when layers is empty", () => {
      host.sources.set([]);
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll(".legend-item");
      expect(items.length).toBe(testData.length);
    });

    it("should render multiple lines with line strategy", () => {
      host.strategy.set(new LineGraphStrategy());
      host.sources.set([
        { name: "Count", valueProperty: "count" },
        { name: "Cost", valueProperty: "cost" },
      ]);
      fixture.detectChanges();
      const paths =
        fixture.nativeElement.querySelectorAll(".viewport svg path");
      // 2 series = 2 line paths
      expect(paths.length).toBe(2);
    });

    it("should render scatter circles for all layers", () => {
      host.strategy.set(new ScatterPlotStrategy());
      host.sources.set([
        { name: "Count", valueProperty: "count" },
        { name: "Cost", valueProperty: "cost" },
      ]);
      fixture.detectChanges();
      const circles = fixture.nativeElement.querySelectorAll(
        ".viewport svg circle",
      );
      // 3 data points × 2 layers = 6 circles
      expect(circles.length).toBe(6);
    });

    it("should allow per-layer data override", () => {
      const altData: TestRow[] = [
        { name: "X", count: 99, cost: 50 },
        { name: "Y", count: 88, cost: 40 },
      ];
      host.sources.set([
        { name: "Original" },
        { name: "Alt Data", data: altData },
      ]);
      fixture.detectChanges();
      const rects =
        fixture.nativeElement.querySelectorAll(".viewport svg rect");
      // 3 bars (original) + 2 bars (altData) = 5
      expect(rects.length).toBe(5);
    });
  });
});
