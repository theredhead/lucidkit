import type { ChartSeriesData } from "../chart.types";

/** Applies a palette or semantic color treatment before chart rendering. */
export interface ChartColoringStrategy {
    /** Human-readable strategy name. */
    readonly name: string;

    /** Return series with colors assigned for the active chart treatment. */
    color(series: readonly ChartSeriesData[]): readonly ChartSeriesData[];
}

/** Preserves the palette colors assigned during normal chart extraction. */
export class ClassicChartColoringStrategy implements ChartColoringStrategy {
    public readonly name = "classic";

    public color(series: readonly ChartSeriesData[]): readonly ChartSeriesData[] {
        return series;
    }
}

/** Applies a caller-provided palette across points or named series. */
export class PaletteChartColoringStrategy implements ChartColoringStrategy {
    public readonly name = "custom";

    public constructor(private readonly palette: readonly string[]) { }

    public color(series: readonly ChartSeriesData[]): readonly ChartSeriesData[] {
        if (this.palette.length === 0) return series;

        let pointOffset = 0;
        return series.map((entry, seriesIndex) => {
            const color = this.palette[seriesIndex % this.palette.length];
            const points = entry.points.map((point, pointIndex) => ({
                ...point,
                color:
                    series.length === 1
                        ? this.palette[(pointOffset + pointIndex) % this.palette.length]
                        : color,
            }));
            pointOffset += entry.points.length;
            return { ...entry, color, points };
        });
    }
}

/**
 * A warmer, more editorial palette for charts: ember, teal, cobalt, violet,
 * leaf, and gold. It preserves the chart's data shape while making adjacent
 * series and point colors easier to distinguish.
 */
export class ModernChartColoringStrategy implements ChartColoringStrategy {
    public readonly name = "modern";
    private readonly palette = [
        "#e85d3f",
        "#168c8c",
        "#356ae6",
        "#8b5cf6",
        "#2e9d63",
        "#c58b24",
    ] as const;

    public color(series: readonly ChartSeriesData[]): readonly ChartSeriesData[] {
        let pointOffset = 0;
        return series.map((entry, seriesIndex) => {
            const color = this.palette[seriesIndex % this.palette.length];
            const points = entry.points.map((point, pointIndex) => ({
                ...point,
                color:
                    series.length === 1
                        ? this.palette[(pointOffset + pointIndex) % this.palette.length]
                        : color,
            }));
            pointOffset += entry.points.length;
            return { ...entry, color, points };
        });
    }
}

/** Default coloring strategy, preserving the existing chart appearance. */
export const CLASSIC_CHART_COLORING = new ClassicChartColoringStrategy();
