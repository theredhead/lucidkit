import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from "@angular/core";
import { LoggerFactory } from "@theredhead/foundation";
import type {
  ChartLayer,
  ChartLegendEntry,
  ChartSeriesData,
  ChartSize,
} from "./chart.types";
import { DEFAULT_CHART_PALETTE } from "./chart.types";
import {
  buildLegendEntries,
  buildSeriesLegendEntries,
  extractDataPoints,
  extractSeriesData,
} from "./chart.utils";
import type { GraphPresentationStrategy } from "./strategies/graph-presentation-strategy";

/**
 * Generic data-chart component that delegates rendering to a
 * {@link GraphPresentationStrategy}.
 *
 * Accepts either a single data array (`source`) or multiple layers
 * (`sources`) and extracts labels / values via the `labelProperty`
 * and `valueProperty` inputs. The chosen strategy renders the chart
 * as either an **SVG element** or raw **ImageData**; the component
 * inserts the result into the DOM automatically.
 *
 * A legend is rendered below the chart.
 *
 * @example Single-series (backward-compatible)
 * ```html
 * <ui-chart
 *   [source]="salesData"
 *   labelProperty="month"
 *   valueProperty="revenue"
 *   [strategy]="barStrategy"
 />
 * ```
 *
 * @example Multi-series — same data, different value columns
 * ```html
 * <ui-chart
 *   [source]="salesData"
 *   labelProperty="month"
 *   valueProperty="revenue"
 *   [sources]="[
 *     { name: 'Revenue', valueProperty: 'revenue' },
 *     { name: 'Cost',    valueProperty: 'cost' }
 *   ]"
 *   [strategy]="lineStrategy"
 * />
 * ```
 *
 * @example Multi-series — different data arrays
 * ```html
 * <ui-chart
 *   labelProperty="month"
 *   valueProperty="revenue"
 *   [sources]="[
 *     { name: '2024', data: sales2024 },
 *     { name: '2025', data: sales2025 }
 *   ]"
 *   [strategy]="barStrategy"
 * />
 * ```
 */
@Component({
  selector: "ui-chart",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./chart.component.html",
  styleUrl: "./chart.component.scss",
  host: {
    class: "ui-chart",
  },
})
export class UIChart<T> {
  // ── Inputs ──────────────────────────────────────────────────────────

  /** Array of data objects to chart (single-series convenience). */
  public readonly source = input<readonly T[]>([]);

  /** Property name on `T` whose value is used as the label string. */
  public readonly labelProperty = input.required<keyof T>();

  /** Property name on `T` whose value is used as the numeric value. */
  public readonly valueProperty = input.required<keyof T>();

  /** Presentation strategy (line, bar, pie, or custom). */
  public readonly strategy = input.required<GraphPresentationStrategy>();

  /** Width of the chart in CSS pixels. */
  public readonly width = input<number>(400);

  /** Height of the chart in CSS pixels. */
  public readonly height = input<number>(300);

  /** Custom colour palette. Falls back to the 12-colour default. */
  public readonly palette = input<readonly string[]>(DEFAULT_CHART_PALETTE);

  /** Whether to show the legend beneath the chart. */
  public readonly showLegend = input<boolean>(true);

  /** Accessible label for the chart region. */
  public readonly ariaLabel = input<string>("Data chart");

  /**
   * Multiple data layers for multi-series charts.
   *
   * When non-empty, each {@link ChartLayer} defines a named series.
   * Layers share `labelProperty` and fall back to the component-level
   * `source` and `valueProperty` unless overridden per-layer.
   */
  public readonly sources = input<readonly ChartLayer<T>[]>([]);

  // ── Queries ─────────────────────────────────────────────────────────

  private readonly containerRef =
    viewChild.required<ElementRef<HTMLDivElement>>("chartContainer");

  // ── Computed ─────────────────────────────────────────────────────────

  /** Whether we are rendering multiple named series. */
  protected readonly isMultiSeries = computed(() => this.sources().length > 0);

  /** Processed series data ready for strategy rendering. */
  protected readonly seriesData = computed<ChartSeriesData[]>(() => {
    const layerDefs = this.sources();
    const palette = this.palette();

    if (layerDefs.length === 0) {
      // Single-series mode — per-point palette colours (backward compat)
      const points = extractDataPoints(
        this.source(),
        this.labelProperty(),
        this.valueProperty(),
        palette,
      );
      return [{ name: "", color: palette[0], points }];
    }

    // Multi-series mode — each layer gets one colour
    return extractSeriesData(
      layerDefs,
      this.source(),
      this.labelProperty(),
      this.valueProperty(),
      palette,
    );
  });

  /** Legend entries — per-point for single-series, per-series for multi. */
  protected readonly legendEntries = computed<ChartLegendEntry[]>(() => {
    const sd = this.seriesData();
    if (this.isMultiSeries()) {
      return buildSeriesLegendEntries(sd);
    }
    return buildLegendEntries(sd[0]?.points ?? []);
  });

  /** Target render size. */
  protected readonly size = computed<ChartSize>(() => ({
    width: this.width(),
    height: this.height(),
  }));

  // ── Private fields ──────────────────────────────────────────────────

  private readonly log = inject(LoggerFactory).createLogger("UIChart");

  // ── Constructor ─────────────────────────────────────────────────────

  public constructor() {
    effect(() => {
      this.renderChart();
    });
  }

  // ── Private methods ─────────────────────────────────────────────────

  /** Run the strategy and insert the output into the container. */
  private renderChart(): void {
    const sd = this.seriesData();
    const size = this.size();
    const strategy = this.strategy();
    const container = this.containerRef().nativeElement;

    // Clear previous render
    container.innerHTML = "";

    const allPoints = sd.flatMap((s) => s.points);
    if (allPoints.length === 0) {
      this.log.debug("No data points to render");
      return;
    }

    const output = strategy.render(sd, size);

    switch (output.kind) {
      case "svg":
        container.appendChild(output.element);
        break;

      case "imagedata": {
        const canvas = document.createElement("canvas");
        canvas.width = output.data.width;
        canvas.height = output.data.height;
        canvas.style.width = `${size.width}px`;
        canvas.style.height = `${size.height}px`;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.putImageData(output.data, 0, 0);
        } else {
          this.log.error(
            "Failed to get 2d canvas context for ImageData render",
          );
        }
        container.appendChild(canvas);
        break;
      }
    }
  }
}
