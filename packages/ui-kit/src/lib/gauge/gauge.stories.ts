import {
  ChangeDetectionStrategy,
  Component,
  signal,
  type WritableSignal,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIGauge } from "./gauge.component";
import type { GaugeDetailLevel, GaugeZone } from "./gauge.types";
import type { GaugePresentationStrategy } from "./strategies/gauge-presentation-strategy";
import { AnalogGaugeStrategy } from "./strategies/analog-gauge.strategy";
import { VuMeterStrategy } from "./strategies/vu-meter.strategy";
import { DigitalGaugeStrategy } from "./strategies/digital-gauge.strategy";
import { LcdGaugeStrategy } from "./strategies/lcd-gauge.strategy";
import { BarGaugeStrategy } from "./strategies/bar-gauge.strategy";

// ── Shared data ────────────────────────────────────────────────────

const speedZones: GaugeZone[] = [
  { from: 0, to: 60, color: "#34a853", label: "Safe" },
  { from: 60, to: 80, color: "#fbbc04", label: "Warning" },
  { from: 80, to: 100, color: "#ea4335", label: "Danger" },
];

const detailLevels: GaugeDetailLevel[] = ["high", "medium", "low"];

const strategies: Record<string, GaugePresentationStrategy> = {
  Analog: new AnalogGaugeStrategy(),
  "VU Meter": new VuMeterStrategy(),
  Digital: new DigitalGaugeStrategy(),
  LCD: new LcdGaugeStrategy(),
  Bar: new BarGaugeStrategy(),
};

// ── Interactive demo ───────────────────────────────────────────────

@Component({
  selector: "ui-gauge-interactive-demo",
  standalone: true,
  imports: [UIGauge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-grid">
      <ui-gauge
        [value]="value()"
        [min]="0"
        [max]="220"
        unit="km/h"
        [strategy]="analogStrategy"
        [zones]="speedZones"
        [width]="240"
        [height]="240"
        [animated]="true"
        ariaLabel="Speedometer"
      />
      <ui-gauge
        [value]="value()"
        [min]="0"
        [max]="220"
        unit="km/h"
        [strategy]="vuStrategy"
        [zones]="speedZones"
        [width]="100"
        [height]="240"
        [animated]="true"
        ariaLabel="VU speed meter"
      />
      <ui-gauge
        [value]="value()"
        [min]="0"
        [max]="220"
        unit="km/h"
        [strategy]="digitalStrategy"
        [width]="200"
        [height]="120"
        [animated]="true"
        ariaLabel="Digital speed readout"
      />
      <ui-gauge
        [value]="value()"
        [min]="0"
        [max]="220"
        unit="km/h"
        [strategy]="lcdStrategy"
        [width]="260"
        [height]="120"
        [animated]="true"
        ariaLabel="LCD speed readout"
      />
      <ui-gauge
        [value]="value()"
        [min]="0"
        [max]="220"
        unit="km/h"
        [strategy]="barStrategy"
        [zones]="speedZones"
        [width]="300"
        [height]="80"
        [animated]="true"
        ariaLabel="Bar speed meter"
      />
    </div>
    <div class="demo-controls">
      <label>
        Value: {{ value() }}
        <input
          type="range"
          [min]="0"
          [max]="220"
          [value]="value()"
          (input)="onSlider($event)"
        />
      </label>
    </div>
  `,
  styles: `
    .demo-grid {
      display: flex;
      gap: 24px;
      align-items: center;
      flex-wrap: wrap;
    }
    .demo-controls {
      margin-top: 16px;
    }
    .demo-controls label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
    .demo-controls input[type="range"] {
      flex: 1;
      max-width: 300px;
    }
  `,
})
class GaugeInteractiveDemo {
  protected readonly value: WritableSignal<number> = signal(80);
  protected readonly analogStrategy = new AnalogGaugeStrategy();
  protected readonly vuStrategy = new VuMeterStrategy();
  protected readonly digitalStrategy = new DigitalGaugeStrategy();
  protected readonly lcdStrategy = new LcdGaugeStrategy({
    decimals: 0,
    digitCount: 4,
  });
  protected readonly barStrategy = new BarGaugeStrategy({ ticks: 10 });
  protected readonly speedZones: GaugeZone[] = [
    { from: 0, to: 100, color: "#34a853" },
    { from: 100, to: 160, color: "#fbbc04" },
    { from: 160, to: 220, color: "#ea4335" },
  ];

  protected onSlider(event: Event): void {
    this.value.set(+(event.target as HTMLInputElement).value);
  }
}

// ── Meta ───────────────────────────────────────────────────────────

const meta: Meta<UIGauge> = {
  title: "@Theredhead/UI Kit/Gauge",
  component: UIGauge,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [GaugeInteractiveDemo] })],
  argTypes: {
    strategy: {
      control: "select",
      options: Object.keys(strategies),
      mapping: strategies,
    },
    detailLevel: {
      control: "select",
      options: detailLevels,
    },
  },
};
export default meta;
type Story = StoryObj<UIGauge>;

// ── Stories ─────────────────────────────────────────────────────────

export const Analog: Story = {
  render: (args) => ({
    props: { ...args, zones: speedZones },
    template: `
      <ui-gauge
        [value]="value"
        [min]="min"
        [max]="max"
        [unit]="unit"
        [strategy]="strategy"
        [zones]="zones"
        [width]="width"
        [height]="height"
        [detailLevel]="detailLevel"
      />
    `,
  }),
  args: {
    value: 72,
    min: 0,
    max: 100,
    unit: "km/h",
    strategy: new AnalogGaugeStrategy(),
    width: 260,
    height: 260,
    detailLevel: "high" as GaugeDetailLevel,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-gauge
  [value]="speed"
  [min]="0"
  [max]="220"
  unit="km/h"
  [strategy]="analogStrategy"
  [zones]="speedZones"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UIGauge,
  AnalogGaugeStrategy,
  type GaugeZone,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-speedometer',
  standalone: true,
  imports: [UIGauge],
  template: \\\`
    <ui-gauge
      [value]="speed"
      [min]="0" [max]="220"
      unit="km/h"
      [strategy]="strategy"
      [zones]="zones"
    />
  \\\`,
})
export class SpeedometerComponent {
  readonly speed = 72;
  readonly strategy = new AnalogGaugeStrategy();
  readonly zones: GaugeZone[] = [
    { from: 0, to: 100, color: '#34a853' },
    { from: 100, to: 160, color: '#fbbc04' },
    { from: 160, to: 220, color: '#ea4335' },
  ];
}

// ── SCSS ──
/* No custom styles needed — gauge tokens handle theming. */
`,
      },
    },
  },
};

export const Semicircle: Story = {
  render: (args) => ({
    props: { ...args, zones: speedZones },
    template: `
      <ui-gauge
        [value]="value"
        [min]="min"
        [max]="max"
        [unit]="unit"
        [strategy]="strategy"
        [zones]="zones"
        [width]="width"
        [height]="height"
        [detailLevel]="detailLevel"
      />
    `,
  }),
  args: {
    value: 65,
    min: 0,
    max: 100,
    unit: "°C",
    strategy: new AnalogGaugeStrategy({ sweepDegrees: 180, majorTicks: 5 }),
    width: 280,
    height: 160,
    detailLevel: "high" as GaugeDetailLevel,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-gauge
  [value]="temperature"
  [min]="0"
  [max]="100"
  unit="°C"
  [strategy]="semicircleStrategy"
  [zones]="zones"
  [width]="280"
  [height]="160"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UIGauge,
  AnalogGaugeStrategy,
  type GaugeZone,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-temp-gauge',
  standalone: true,
  imports: [UIGauge],
  template: \\\`
    <ui-gauge
      [value]="temperature"
      [min]="0" [max]="100"
      unit="°C"
      [strategy]="strategy"
      [zones]="zones"
      [width]="280" [height]="160"
    />
  \\\`,
})
export class TempGaugeComponent {
  readonly temperature = 65;
  readonly strategy = new AnalogGaugeStrategy({
    sweepDegrees: 180,
    majorTicks: 5,
  });
  readonly zones: GaugeZone[] = [
    { from: 0, to: 60, color: '#34a853' },
    { from: 60, to: 80, color: '#fbbc04' },
    { from: 80, to: 100, color: '#ea4335' },
  ];
}

// ── SCSS ──
/* No custom styles needed — gauge tokens handle theming. */
`,
      },
    },
  },
};

export const VuMeter: Story = {
  render: (args) => ({
    props: { ...args, zones: speedZones },
    template: `
      <ui-gauge
        [value]="value"
        [min]="min"
        [max]="max"
        [unit]="unit"
        [strategy]="strategy"
        [zones]="zones"
        [width]="width"
        [height]="height"
        [detailLevel]="detailLevel"
      />
    `,
  }),
  args: {
    value: 65,
    min: 0,
    max: 100,
    unit: "dB",
    strategy: new VuMeterStrategy(),
    width: 120,
    height: 260,
    detailLevel: "high" as GaugeDetailLevel,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-gauge
  [value]="level"
  [min]="0"
  [max]="100"
  unit="dB"
  [strategy]="vuStrategy"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIGauge, VuMeterStrategy } from '@theredhead/ui-kit';

@Component({
  selector: 'app-vu-meter',
  standalone: true,
  imports: [UIGauge],
  template: \\\`
    <ui-gauge
      [value]="level"
      unit="dB"
      [strategy]="strategy"
      [width]="120" [height]="260"
    />
  \\\`,
})
export class VuMeterComponent {
  readonly level = 65;
  readonly strategy = new VuMeterStrategy({ segments: 20 });
}

// ── SCSS ──
/* No custom styles needed — gauge tokens handle theming. */
`,
      },
    },
  },
};

export const Digital: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-gauge
        [value]="value"
        [min]="min"
        [max]="max"
        [unit]="unit"
        [strategy]="strategy"
        [width]="width"
        [height]="height"
        [detailLevel]="detailLevel"
      />
    `,
  }),
  args: {
    value: 88.5,
    min: 0,
    max: 100,
    unit: "°C",
    strategy: new DigitalGaugeStrategy({ decimals: 1 }),
    width: 220,
    height: 140,
    detailLevel: "high" as GaugeDetailLevel,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-gauge
  [value]="temperature"
  [min]="0"
  [max]="100"
  unit="°C"
  [strategy]="digitalStrategy"
  [width]="220"
  [height]="140"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIGauge, DigitalGaugeStrategy } from '@theredhead/ui-kit';

@Component({
  selector: 'app-thermometer',
  standalone: true,
  imports: [UIGauge],
  template: \\\`
    <ui-gauge
      [value]="temperature"
      unit="°C"
      [strategy]="strategy"
      [width]="220" [height]="140"
    />
  \\\`,
})
export class ThermometerComponent {
  readonly temperature = 88.5;
  readonly strategy = new DigitalGaugeStrategy({ decimals: 1 });
}

// ── SCSS ──
/* No custom styles needed — gauge tokens handle theming. */
`,
      },
    },
  },
};

export const LCD: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-gauge
        [value]="value"
        [min]="min"
        [max]="max"
        [unit]="unit"
        [strategy]="strategy"
        [width]="width"
        [height]="height"
        [detailLevel]="detailLevel"
      />
    `,
  }),
  args: {
    value: 37.2,
    min: 0,
    max: 100,
    unit: "°C",
    strategy: new LcdGaugeStrategy({ decimals: 1, digitCount: 5 }),
    width: 260,
    height: 120,
    detailLevel: "high" as GaugeDetailLevel,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-gauge
  [value]="temperature"
  [min]="0"
  [max]="100"
  unit="°C"
  [strategy]="lcdStrategy"
  [width]="260"
  [height]="120"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIGauge, LcdGaugeStrategy } from '@theredhead/ui-kit';

@Component({
  selector: 'app-lcd-thermometer',
  standalone: true,
  imports: [UIGauge],
  template: \\\`
    <ui-gauge
      [value]="temperature"
      unit="°C"
      [strategy]="strategy"
      [width]="260" [height]="120"
    />
  \\\`,
})
export class LcdThermometerComponent {
  readonly temperature = 37.2;
  readonly strategy = new LcdGaugeStrategy({ decimals: 1, digitCount: 5 });
}

// ── SCSS ──
/* No custom styles needed — gauge tokens handle theming. */
`,
      },
    },
  },
};

export const Bar: Story = {
  render: (args) => ({
    props: { ...args, zones: speedZones },
    template: `
      <ui-gauge
        [value]="value"
        [min]="min"
        [max]="max"
        [unit]="unit"
        [strategy]="strategy"
        [zones]="zones"
        [width]="width"
        [height]="height"
        [detailLevel]="detailLevel"
      />
    `,
  }),
  args: {
    value: 65,
    min: 0,
    max: 100,
    unit: "%",
    strategy: new BarGaugeStrategy({ ticks: 10 }),
    width: 300,
    height: 80,
    detailLevel: "high" as GaugeDetailLevel,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-gauge
  [value]="cpuLoad"
  [min]="0"
  [max]="100"
  unit="%"
  [strategy]="barStrategy"
  [zones]="zones"
  [width]="300"
  [height]="80"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UIGauge,
  BarGaugeStrategy,
  type GaugeZone,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-cpu-meter',
  standalone: true,
  imports: [UIGauge],
  template: \\\`
    <ui-gauge
      [value]="cpuLoad"
      [min]="0" [max]="100"
      unit="%"
      [strategy]="strategy"
      [zones]="zones"
      [width]="300" [height]="80"
    />
  \\\`,
})
export class CpuMeterComponent {
  readonly cpuLoad = 65;
  readonly strategy = new BarGaugeStrategy({ ticks: 10 });
  readonly zones: GaugeZone[] = [
    { from: 0, to: 60, color: '#34a853' },
    { from: 60, to: 80, color: '#fbbc04' },
    { from: 80, to: 100, color: '#ea4335' },
  ];
}

// ── SCSS ──
/* No custom styles needed — gauge tokens handle theming. */
`,
      },
    },
  },
};

export const Thresholds: Story = {
  render: (args) => ({
    props: {
      ...args,
      zones: speedZones,
      thresholds: [40, 75],
      analogStrategy: new AnalogGaugeStrategy(),
      barStrategy: new BarGaugeStrategy({ ticks: 10 }),
    },
    template: `
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
        <ui-gauge
          [value]="value"
          [min]="min"
          [max]="max"
          [unit]="unit"
          [strategy]="analogStrategy"
          [zones]="zones"
          [thresholds]="thresholds"
          [width]="260"
          [height]="260"
        />
        <ui-gauge
          [value]="value"
          [min]="min"
          [max]="max"
          [unit]="unit"
          [strategy]="barStrategy"
          [zones]="zones"
          [thresholds]="thresholds"
          [width]="300"
          [height]="80"
        />
      </div>
    `,
  }),
  args: {
    value: 55,
    min: 0,
    max: 100,
    unit: "%",
    detailLevel: "high" as GaugeDetailLevel,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-gauge
  [value]="load"
  [min]="0"
  [max]="100"
  unit="%"
  [strategy]="strategy"
  [zones]="zones"
  [thresholds]="[40, 75]"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UIGauge,
  AnalogGaugeStrategy,
  type GaugeZone,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-threshold-demo',
  standalone: true,
  imports: [UIGauge],
  template: \\\`
    <ui-gauge
      [value]="load"
      [min]="0" [max]="100"
      unit="%"
      [strategy]="strategy"
      [zones]="zones"
      [thresholds]="thresholds"
    />
  \\\`,
})
export class ThresholdDemoComponent {
  readonly load = 55;
  readonly strategy = new AnalogGaugeStrategy();
  readonly zones: GaugeZone[] = [
    { from: 0, to: 60, color: '#34a853', label: 'Safe' },
    { from: 60, to: 80, color: '#fbbc04', label: 'Warning' },
    { from: 80, to: 100, color: '#ea4335', label: 'Danger' },
  ];
  readonly thresholds = [40, 75];
}

// ── SCSS ──
/* No custom styles needed — gauge tokens handle theming. */
`,
      },
    },
  },
};

export const CustomFormatter: Story = {
  render: (args) => ({
    props: {
      ...args,
      zones: speedZones,
      formatCurrency: (n: number): string =>
        "$" +
        n.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    template: `
      <ui-gauge
        [value]="value"
        [min]="min"
        [max]="max"
        unit="USD"
        [strategy]="strategy"
        [width]="width"
        [height]="height"
        [formatValue]="formatCurrency"
      />
    `,
  }),
  args: {
    value: 1234.5,
    min: 0,
    max: 5000,
    strategy: new AnalogGaugeStrategy(),
    width: 260,
    height: 260,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-gauge
  [value]="revenue"
  [min]="0"
  [max]="5000"
  unit="USD"
  [strategy]="analogStrategy"
  [formatValue]="formatCurrency"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIGauge, AnalogGaugeStrategy } from '@theredhead/ui-kit';

@Component({
  selector: 'app-revenue-gauge',
  standalone: true,
  imports: [UIGauge],
  template: \\\`
    <ui-gauge
      [value]="revenue"
      [min]="0" [max]="5000"
      unit="USD"
      [strategy]="strategy"
      [formatValue]="formatCurrency"
    />
  \\\`,
})
export class RevenueGaugeComponent {
  readonly revenue = 1234.50;
  readonly strategy = new AnalogGaugeStrategy();

  formatCurrency = (n: number): string =>
    '$' + n.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
}

// ── SCSS ──
/* No custom styles needed — gauge tokens handle theming. */
`,
      },
    },
  },
};

export const Animated: Story = {
  render: (args) => ({
    props: { ...args, zones: speedZones },
    template: `
      <ui-gauge
        [value]="value"
        [min]="min"
        [max]="max"
        [unit]="unit"
        [strategy]="strategy"
        [zones]="zones"
        [width]="width"
        [height]="height"
        [animated]="true"
        [animationDuration]="animationDuration"
      />
    `,
  }),
  args: {
    value: 72,
    min: 0,
    max: 100,
    unit: "km/h",
    strategy: new AnalogGaugeStrategy(),
    width: 260,
    height: 260,
    animationDuration: 300,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-gauge
  [value]="speed"
  [min]="0"
  [max]="220"
  unit="km/h"
  [strategy]="analogStrategy"
  [zones]="speedZones"
  [animated]="true"
  [animationDuration]="300"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UIGauge,
  AnalogGaugeStrategy,
  type GaugeZone,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-animated-gauge',
  standalone: true,
  imports: [UIGauge],
  template: \\\`
    <ui-gauge
      [value]="speed()"
      [min]="0" [max]="220"
      unit="km/h"
      [strategy]="strategy"
      [zones]="zones"
      [animated]="true"
      [animationDuration]="300"
    />
    <button (click)="randomize()">Randomize</button>
  \\\`,
})
export class AnimatedGaugeComponent {
  readonly speed = signal(72);
  readonly strategy = new AnalogGaugeStrategy();
  readonly zones: GaugeZone[] = [
    { from: 0, to: 100, color: '#34a853' },
    { from: 100, to: 160, color: '#fbbc04' },
    { from: 160, to: 220, color: '#ea4335' },
  ];

  randomize(): void {
    this.speed.set(Math.round(Math.random() * 220));
  }
}

// ── SCSS ──
/* No custom styles needed — animation is built into the gauge. */
`,
      },
    },
  },
};

export const Interactive: Story = {
  render: () => ({
    template: `<ui-gauge-interactive-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-gauge [value]="speed" [strategy]="analog" unit="km/h" [zones]="zones" />
<ui-gauge [value]="speed" [strategy]="vu" unit="km/h" [zones]="zones" [width]="100" [height]="240" />
<ui-gauge [value]="speed" [strategy]="digital" unit="km/h" [width]="200" [height]="120" />

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UIGauge,
  AnalogGaugeStrategy,
  VuMeterStrategy,
  DigitalGaugeStrategy,
  type GaugeZone,
} from '@theredhead/ui-kit';

@Component({
  standalone: true,
  imports: [UIGauge],
  template: \\\`
    <ui-gauge [value]="speed()" [strategy]="analog" unit="km/h" [zones]="zones" />
    <ui-gauge [value]="speed()" [strategy]="vu" unit="km/h" [zones]="zones" [width]="100" [height]="240" />
    <ui-gauge [value]="speed()" [strategy]="digital" unit="km/h" [width]="200" [height]="120" />
  \\\`,
})
export class DashboardComponent {
  readonly speed = signal(80);
  readonly analog = new AnalogGaugeStrategy();
  readonly vu = new VuMeterStrategy();
  readonly digital = new DigitalGaugeStrategy();
  readonly zones: GaugeZone[] = [
    { from: 0, to: 100, color: '#34a853' },
    { from: 100, to: 160, color: '#fbbc04' },
    { from: 160, to: 220, color: '#ea4335' },
  ];
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};
