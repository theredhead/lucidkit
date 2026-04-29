import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { UISignature } from "./signature.component";
import type { SignatureImageValue, SignatureValue } from "./signature.types";

// ── Demo wrappers ─────────────────────────────────────────────────────────────

const STORY_HOST_STYLES = [
  `
  :host {
    display: block;
    max-width: 480px;
  }
  ui-signature {
    min-height: 160px;
  }
  .value-log {
    margin-top: 0.75rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    font-family: monospace;
    background: #f0f2f5;
    border: 1px solid #d7dce2;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-all;
    color: #1d232b;
    max-height: 80px;
    overflow-y: auto;
  }
`,
];

@Component({
  selector: "ui-signature-default-demo",
  standalone: true,
  imports: [UISignature],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-signature [(value)]="sig" />
    @if (sig()) {
      <pre class="value-log">
kind: {{ sig()?.kind }} &bull; strokes: {{ strokeCount() }}</pre
      >
    }
  `,
  styles: STORY_HOST_STYLES,
})
class DefaultDemo {
  protected readonly sig = signal<SignatureValue>(null);

  protected strokeCount(): number {
    const v = this.sig();
    return v?.kind === "strokes" ? v.strokes.length : 0;
  }
}

@Component({
  selector: "ui-signature-pressure-demo",
  standalone: true,
  imports: [UISignature],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-signature
      [pressureEnabled]="true"
      [minStrokeWidth]="1"
      [maxStrokeWidth]="6"
      [(value)]="sig"
    />
  `,
  styles: STORY_HOST_STYLES,
})
class PressureDemo {
  protected readonly sig = signal<SignatureValue>(null);
}

@Component({
  selector: "ui-signature-image-demo",
  standalone: true,
  imports: [UISignature],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-signature
      [allowDraw]="false"
      [allowPaste]="true"
      [allowDrop]="true"
      [allowBrowse]="true"
      [(value)]="sig"
    />
    @if (sig()?.kind === "image") {
      <pre class="value-log">
Image captured &bull; {{
          sig()?.kind === "image" ? sig()!.image!.mimeType : ""
        }}</pre
      >
    }
  `,
  styles: STORY_HOST_STYLES,
})
class ImageOnlyDemo {
  protected readonly sig = signal<SignatureValue>(null);
  protected get imgValue() {
    return this.sig()?.kind === "image"
      ? (this.sig() as SignatureImageValue)
      : null;
  }
}

@Component({
  selector: "ui-signature-all-modes-demo",
  standalone: true,
  imports: [UISignature],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-signature
      [allowDraw]="true"
      [allowPaste]="true"
      [allowDrop]="true"
      [allowBrowse]="true"
      [pressureEnabled]="true"
      [(value)]="sig"
    />
    @if (sig()) {
      <pre class="value-log">kind: {{ sig()?.kind }}</pre>
    }
  `,
  styles: STORY_HOST_STYLES,
})
class AllModesDemo {
  protected readonly sig = signal<SignatureValue>(null);
}

@Component({
  selector: "ui-signature-replay-demo",
  standalone: true,
  imports: [UISignature],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-signature #sig [(value)]="value" />
    <p style="font-size: 0.8rem; color: #505d6d; margin-top: 4px;">
      Draw a signature, then use the <strong>Replay</strong> button in the
      toolbar.
    </p>
  `,
  styles: STORY_HOST_STYLES,
})
class ReplayDemo {
  protected readonly sigRef = viewChild<UISignature>("sig");
  protected readonly value = signal<SignatureValue>(null);
}

@Component({
  selector: "ui-signature-export-demo",
  standalone: true,
  imports: [UISignature],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-signature #sig [(value)]="value" />
    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
      <button
        type="button"
        style="padding: 0.25rem 0.75rem; font-size: 0.8rem; background: #eff1f5; color: #1d232b; border: 1px solid #d7dce2; border-radius: 4px; cursor: pointer;"
        (click)="onExportSvg()"
      >
        Export SVG
      </button>
      <button
        type="button"
        style="padding: 0.25rem 0.75rem; font-size: 0.8rem; background: #eff1f5; color: #1d232b; border: 1px solid #d7dce2; border-radius: 4px; cursor: pointer;"
        (click)="onExportPng()"
      >
        Export PNG
      </button>
    </div>
    @if (exportResult()) {
      <pre class="value-log">{{ exportResult() }}</pre>
    }
  `,
  styles: STORY_HOST_STYLES,
})
class ExportDemo {
  protected readonly sigRef = viewChild<UISignature>("sig");
  protected readonly value = signal<SignatureValue>(null);
  protected readonly exportResult = signal<string | null>(null);

  protected onExportSvg(): void {
    const svg = this.sigRef()?.exportSvg();
    this.exportResult.set(
      svg
        ? `SVG (${svg.length} chars):\n${svg.slice(0, 120)}…`
        : "No stroke value to export",
    );
  }

  protected onExportPng(): void {
    const png = this.sigRef()?.exportPng();
    this.exportResult.set(
      png
        ? `PNG data URL (${png.length} chars):\n${png.slice(0, 80)}…`
        : "Nothing to export",
    );
  }
}

@Component({
  selector: "ui-signature-disabled-demo",
  standalone: true,
  imports: [UISignature],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ui-signature [disabled]="true" />`,
  styles: STORY_HOST_STYLES,
})
class DisabledDemo {}

@Component({
  selector: "ui-signature-readonly-demo",
  standalone: true,
  imports: [UISignature],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ui-signature [readOnly]="true" [value]="frozenValue" />`,
  styles: STORY_HOST_STYLES,
})
class ReadonlyDemo {
  protected readonly frozenValue: SignatureValue = {
    kind: "strokes",
    strokes: [
      {
        points: [
          { x: 30, y: 100, time: 0 },
          { x: 80, y: 60, time: 50 },
          { x: 130, y: 100, time: 100 },
          { x: 180, y: 60, time: 150 },
          { x: 230, y: 100, time: 200 },
        ],
      },
    ],
    bounds: { width: 400, height: 160 },
  };
}

// ── Meta & Stories ────────────────────────────────────────────────────────────

const meta: Meta<UISignature> = {
  title: "@theredhead/UI Kit/Signature",
  component: UISignature,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UISignature` is a signature field supporting drawn strokes, optional pressure-sensitive capture, and image-based input (paste / drop / browse). Stroke values are replayable and exportable as SVG or PNG. The component integrates with Angular reactive / template-driven forms via `ControlValueAccessor` and supports two-way signal binding via `[(value)]`.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        UISignature,
        DefaultDemo,
        PressureDemo,
        ImageOnlyDemo,
        AllModesDemo,
        ReplayDemo,
        ExportDemo,
        DisabledDemo,
        ReadonlyDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<UISignature>;

/**
 * **Default** — Draw-only signature field with the standard toolbar.
 */
export const Default: Story = {
  render: () => ({ template: `<ui-signature-default-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-signature [(value)]="sig" />

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UISignature, type SignatureValue } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UISignature],
  template: \`<ui-signature [(value)]="sig" />\`,
})
export class ExampleComponent {
  readonly sig = signal<SignatureValue>(null);
}

// ── SCSS ──
/* No custom styles required. */
`,
      },
    },
  },
};

/**
 * **Pressure-sensitive** — Variable stroke width driven by stylus / pen
 * pressure data.  Falls back to fixed-width on devices without pressure
 * information.
 */
export const PressureSensitive: Story = {
  render: () => ({ template: `<ui-signature-pressure-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-signature
  [pressureEnabled]="true"
  [minStrokeWidth]="1"
  [maxStrokeWidth]="6"
  [(value)]="sig"
/>
`,
      },
    },
  },
};

/**
 * **Image only** — Drawing is disabled; the user may only provide a
 * signature by pasting, dropping, or browsing for an image.
 */
export const ImageOnly: Story = {
  render: () => ({ template: `<ui-signature-image-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-signature
  [allowDraw]="false"
  [allowPaste]="true"
  [allowDrop]="true"
  [allowBrowse]="true"
  [(value)]="sig"
/>
`,
      },
    },
  },
};

/**
 * **All modes** — All acquisition modes enabled simultaneously: draw,
 * paste, drop, browse, and pressure-sensitive capture.
 */
export const AllModes: Story = {
  render: () => ({ template: `<ui-signature-all-modes-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-signature
  [allowDraw]="true"
  [allowPaste]="true"
  [allowDrop]="true"
  [allowBrowse]="true"
  [pressureEnabled]="true"
  [(value)]="sig"
/>
`,
      },
    },
  },
};

/**
 * **Replay** — Draw a signature and click the **Replay** toolbar button
 * to watch your signature animate sequentially.
 */
export const Replay: Story = {
  render: () => ({ template: `<ui-signature-replay-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-signature #sig [(value)]="value" />

// ── TypeScript ──
// Programmatic replay API:
this.sigRef.replay();
// SVG export (strokes only):
const svg = this.sigRef.exportSvg();
// PNG export:
const png = this.sigRef.exportPng();
`,
      },
    },
  },
};

/**
 * **Export** — Draw a signature and click the export buttons to see the
 * resulting SVG markup or PNG data URL.
 */
export const Export: Story = {
  render: () => ({ template: `<ui-signature-export-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-signature #sig [(value)]="value" />

// ── TypeScript ──
const svg: string | null = this.sigRef.exportSvg();  // stroke value only
const png: string | null = this.sigRef.exportPng();  // any value
const canSvg: boolean = this.sigRef.canExport('svg');
const canPng: boolean = this.sigRef.canExport('png');
`,
      },
    },
  },
};

/**
 * **Disabled** — The field is fully non-interactive; no drawing, pasting,
 * or clearing is possible.
 */
export const Disabled: Story = {
  render: () => ({ template: `<ui-signature-disabled-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<ui-signature [disabled]="true" />`,
      },
    },
  },
};

/**
 * **Read-only** — Displays a pre-loaded stroke value without the toolbar.
 * The field cannot be modified.
 */
export const Readonly: Story = {
  render: () => ({ template: `<ui-signature-readonly-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<ui-signature [readOnly]="true" [value]="savedValue" />`,
      },
    },
  },
};

/**
 * Interactive playground — adjust every input via the Controls panel.
 */
export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-signature
        [ariaLabel]="ariaLabel"
        [allowDraw]="allowDraw"
        [allowPaste]="allowPaste"
        [allowDrop]="allowDrop"
        [allowBrowse]="allowBrowse"
        [pressureEnabled]="pressureEnabled"
        [minStrokeWidth]="minStrokeWidth"
        [maxStrokeWidth]="maxStrokeWidth"
        [strokeColor]="strokeColor"
        [disabled]="disabled"
        [readOnly]="readOnly"
      />
    `,
  }),
  args: {
    ariaLabel: "Sign here",
    allowDraw: true,
    allowPaste: false,
    allowDrop: false,
    allowBrowse: false,
    pressureEnabled: false,
    minStrokeWidth: 1.5,
    maxStrokeWidth: 3.5,
    strokeColor: "#1d232b",
    disabled: false,
    readOnly: false,
  },
};
