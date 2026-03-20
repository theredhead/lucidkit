// ── UIFormDesigner ──────────────────────────────────────────────────

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from "@angular/core";

import { JsonPipe } from "@angular/common";

import type { FormSchema } from "../../types/form-schema.types";
import type { ExportResult, ExportStrategy } from "../../export";
import {
  JsonExportStrategy,
  AngularComponentExportStrategy,
} from "../../export";
import { FormEngine } from "../../engine/form-engine";
import { UIForm } from "../form.component";
import { FormDesignerEngine } from "./designer-engine";
import { UIFieldPalette } from "./field-palette.component";
import { UIDesignerCanvas } from "./designer-canvas.component";
import { UIPropertyInspector } from "./property-inspector.component";

/**
 * Full-featured form designer that lets users visually build
 * a {@link FormSchema} via a palette + canvas + inspector layout.
 *
 * Includes a live preview panel that renders the designed form
 * using {@link UIForm} and {@link FormEngine}.
 *
 * @example
 * ```html
 * <ui-form-designer
 *   [schema]="existingSchema"
 *   (schemaChange)="onSave($event)"
 * />
 * ```
 */
@Component({
  selector: "ui-form-designer",
  standalone: true,
  imports: [
    JsonPipe,
    UIFieldPalette,
    UIDesignerCanvas,
    UIPropertyInspector,
    UIForm,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-form-designer" },
  template: `
    <!-- Toolbar -->
    <header class="fd-toolbar">
      <span class="fd-toolbar-title">Form Designer</span>

      <div class="fd-toolbar-actions">
        <button
          type="button"
          class="fd-toolbar-btn"
          [class.fd-toolbar-btn--active]="activeTab() === 'design'"
          (click)="activeTab.set('design')"
        >
          Design
        </button>
        <button
          type="button"
          class="fd-toolbar-btn"
          [class.fd-toolbar-btn--active]="activeTab() === 'preview'"
          (click)="activeTab.set('preview')"
        >
          Preview
        </button>
        <button
          type="button"
          class="fd-toolbar-btn"
          [class.fd-toolbar-btn--active]="activeTab() === 'json'"
          (click)="activeTab.set('json')"
        >
          JSON
        </button>
      </div>

      <div class="fd-toolbar-export-group">
        <select class="fd-export-select" (change)="onStrategyChange($event)">
          @for (
            strategy of allStrategies();
            track strategy.label;
            let i = $index
          ) {
            <option [value]="i">{{ strategy.label }}</option>
          }
        </select>
        <button type="button" class="fd-toolbar-export" (click)="onExport()">
          Export
        </button>
      </div>
    </header>

    <!-- Content area -->
    <div class="fd-body">
      @switch (activeTab()) {
        @case ("design") {
          <ui-field-palette
            class="fd-palette"
            (fieldRequested)="onFieldRequested($event)"
          />
          <ui-designer-canvas
            class="fd-canvas"
            [engine]="designerEngine"
            (addFieldRequest)="onAddFieldToGroup($event)"
          />
          <ui-property-inspector
            class="fd-inspector"
            [engine]="designerEngine"
          />
        }

        @case ("preview") {
          <div class="fd-preview">
            @if (previewEngine()) {
              <ui-form
                [engine]="previewEngine()!"
                submitLabel="Submit (Preview)"
              />
            } @else {
              <p class="fd-preview-empty">
                Add some fields to see the preview.
              </p>
            }
          </div>
        }

        @case ("json") {
          <div class="fd-json">
            <pre class="fd-json-pre">{{ designerEngine.schema() | json }}</pre>
          </div>
        }
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 500px;
      border: 1px solid var(--ui-border, #d7dce2);
      border-radius: 8px;
      overflow: hidden;
      background: var(--ui-surface-alt, #ffffff);
    }

    /* Toolbar */

    .fd-toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--ui-surface, #f0f2f5);
      border-bottom: 1px solid var(--ui-border, #d7dce2);
    }

    .fd-toolbar-title {
      font-weight: 700;
      font-size: 0.9375rem;
      margin-right: auto;
      color: var(--ui-text, #1d232b);
    }

    .fd-toolbar-actions {
      display: flex;
      gap: 2px;
      background: var(--ui-surface-alt, #ffffff);
      border-radius: 6px;
      padding: 2px;
      border: 1px solid var(--ui-border, #d7dce2);
    }

    .fd-toolbar-btn {
      appearance: none;
      border: none;
      background: transparent;
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      color: var(--ui-text, #1d232b);
      transition: background 0.12s ease;
    }

    .fd-toolbar-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .fd-toolbar-btn--active {
      background: var(--theredhead-primary, #3584e4);
      color: var(--theredhead-on-primary, #ffffff);
    }

    .fd-toolbar-btn--active:hover {
      opacity: 0.9;
    }

    .fd-toolbar-export {
      appearance: none;
      border: 1px solid var(--theredhead-primary, #3584e4);
      background: transparent;
      color: var(--theredhead-primary, #3584e4);
      padding: 5px 14px;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.12s ease;
    }

    .fd-toolbar-export:hover {
      background: var(--theredhead-primary, #3584e4);
      color: var(--theredhead-on-primary, #ffffff);
    }

    .fd-toolbar-export-group {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .fd-export-select {
      border: 1px solid var(--ui-border, #d7dce2);
      background: var(--ui-surface-alt, #ffffff);
      color: var(--ui-text, #1d232b);
      padding: 5px 8px;
      border-radius: 6px;
      font-size: 0.8125rem;
      cursor: pointer;
    }

    /* Body */

    .fd-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .fd-palette {
      flex: 0 0 auto;
    }

    .fd-canvas {
      flex: 1;
    }

    .fd-inspector {
      flex: 0 0 auto;
    }

    /* Preview */

    .fd-preview {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      max-width: 720px;
      margin: 0 auto;
      width: 100%;
    }

    .fd-preview-empty {
      text-align: center;
      font-size: 0.9375rem;
      opacity: 0.5;
      padding: 48px 16px;
    }

    /* JSON */

    .fd-json {
      flex: 1;
      padding: 16px;
      overflow: auto;
    }

    .fd-json-pre {
      font-family: monospace;
      font-size: 0.8125rem;
      white-space: pre-wrap;
      word-break: break-word;
      margin: 0;
      color: var(--ui-text, #1d232b);
    }

    /* Dark mode */

    :host-context(html.dark-theme) {
      background: var(--ui-surface-alt, #2a2e36);
      border-color: var(--ui-border, #3a3f47);

      .fd-toolbar {
        background: var(--ui-surface, #1e2128);
        border-bottom-color: var(--ui-border, #3a3f47);
      }
      .fd-toolbar-title {
        color: var(--ui-text, #f2f6fb);
      }
      .fd-toolbar-actions {
        background: var(--ui-surface-alt, #2a2e36);
        border-color: var(--ui-border, #3a3f47);
      }
      .fd-toolbar-btn {
        color: var(--ui-text, #f2f6fb);
      }
      .fd-toolbar-btn:hover {
        background: rgba(255, 255, 255, 0.08);
      }
      .fd-toolbar-export {
        border-color: var(--theredhead-primary, #a8c8ff);
        color: var(--theredhead-primary, #a8c8ff);
      }
      .fd-toolbar-export:hover {
        background: var(--theredhead-primary, #a8c8ff);
        color: var(--theredhead-on-primary, #003062);
      }
      .fd-export-select {
        background: var(--ui-surface-alt, #2a2e36);
        border-color: var(--ui-border, #3a3f47);
        color: var(--ui-text, #f2f6fb);
      }
      .fd-json-pre {
        color: var(--ui-text, #f2f6fb);
      }
    }

    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        background: var(--ui-surface-alt, #2a2e36);
        border-color: var(--ui-border, #3a3f47);

        .fd-toolbar {
          background: var(--ui-surface, #1e2128);
          border-bottom-color: var(--ui-border, #3a3f47);
        }
        .fd-toolbar-title {
          color: var(--ui-text, #f2f6fb);
        }
        .fd-toolbar-actions {
          background: var(--ui-surface-alt, #2a2e36);
          border-color: var(--ui-border, #3a3f47);
        }
        .fd-toolbar-btn {
          color: var(--ui-text, #f2f6fb);
        }
        .fd-toolbar-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .fd-toolbar-export {
          border-color: var(--theredhead-primary, #a8c8ff);
          color: var(--theredhead-primary, #a8c8ff);
        }
        .fd-toolbar-export:hover {
          background: var(--theredhead-primary, #a8c8ff);
          color: var(--theredhead-on-primary, #003062);
        }
        .fd-export-select {
          background: var(--ui-surface-alt, #2a2e36);
          border-color: var(--ui-border, #3a3f47);
          color: var(--ui-text, #f2f6fb);
        }
        .fd-json-pre {
          color: var(--ui-text, #f2f6fb);
        }
      }
    }
  `,
})
export class UIFormDesigner {
  /**
   * Optional initial schema to load into the designer.
   * When set, the designer engine imports it on init.
   */
  public readonly schema = input<FormSchema | null>(null);

  /** Emitted when the user clicks "Export" — always emits the raw schema. */
  public readonly schemaChange = output<FormSchema>();

  /**
   * Additional export strategies provided by the consumer.
   * Merged with the built-in JSON and Angular Component strategies.
   */
  public readonly exportStrategies = input<readonly ExportStrategy[]>([]);

  /** Emitted with the {@link ExportResult} produced by the selected strategy. */
  public readonly exported = output<ExportResult>();

  /**
   * @internal Built-in export strategies.
   * Consumers can add more via the `exportStrategies` input.
   */
  private readonly builtInStrategies: readonly ExportStrategy[] = [
    new JsonExportStrategy(),
    new AngularComponentExportStrategy(),
  ];

  /** @internal All available strategies (built-in + consumer-provided). */
  protected readonly allStrategies = computed(() => [
    ...this.builtInStrategies,
    ...this.exportStrategies(),
  ]);

  /** @internal Index of the currently selected export strategy. */
  protected readonly selectedStrategyIndex = signal(0);

  /** @internal Active tab: design, preview, or json. */
  protected readonly activeTab = signal<"design" | "preview" | "json">(
    "design",
  );

  /** @internal The designer engine instance. */
  protected readonly designerEngine = new FormDesignerEngine();

  /**
   * @internal Preview engine — rebuilt whenever the schema changes.
   * Returns null if the schema has no groups/fields.
   */
  protected readonly previewEngine = computed(() => {
    const schema = this.designerEngine.schema();
    const hasFields = schema.groups.some((g) => g.fields.length > 0);
    if (!hasFields) return null;
    return new FormEngine(schema);
  });

  /** @internal The group uid to add a field to when palette is clicked. */
  private lastGroupUid: string | null = null;

  public constructor() {
    // Load initial schema when the input is set
    effect(() => {
      const s = this.schema();
      if (s) {
        this.designerEngine.loadSchema(s);
      }
    });
  }

  /** @internal Handle palette field click — add to first or last-used group. */
  protected onFieldRequested(componentKey: string): void {
    const groups = this.designerEngine.groups();

    // If there are no groups, create one first
    if (groups.length === 0) {
      this.lastGroupUid = this.designerEngine.addGroup();
    }

    // Find the target group
    const targetUid =
      this.lastGroupUid && groups.find((g) => g.uid === this.lastGroupUid)
        ? this.lastGroupUid
        : (groups[groups.length - 1]?.uid ?? this.designerEngine.addGroup());

    this.designerEngine.addField(targetUid, componentKey);
    this.lastGroupUid = targetUid;
  }

  /** @internal Handle "Add field" click within a specific group. */
  protected onAddFieldToGroup(groupUid: string): void {
    // Default to text field — user can change in inspector
    this.designerEngine.addField(groupUid, "text");
    this.lastGroupUid = groupUid;
  }

  /** @internal Handle export format selection change. */
  protected onStrategyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedStrategyIndex.set(Number(select.value));
  }

  /**
   * @internal Export the current schema using the selected strategy.
   * Triggers a browser file download and emits both `schemaChange`
   * (raw schema) and `exported` (formatted result).
   */
  protected onExport(): void {
    const schema = this.designerEngine.schema();
    this.schemaChange.emit(schema);

    const strategy = this.allStrategies()[this.selectedStrategyIndex()];
    if (strategy) {
      const result = strategy.export(schema);
      this.exported.emit(result);
      this.downloadFile(result.content, result.fileName, result.mimeType);
    }
  }

  /**
   * @internal Trigger a browser download for the given content.
   */
  private downloadFile(
    content: string,
    fileName: string,
    mimeType: string,
  ): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
