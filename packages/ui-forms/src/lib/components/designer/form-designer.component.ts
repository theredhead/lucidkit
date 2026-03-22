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

import { UIIcon, UIIcons } from "@theredhead/ui-kit";

import type { FormSchema, FormValues } from "../../types/form-schema.types";
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
    UIIcon,
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

      <div
        class="fd-toolbar-actions"
        role="tablist"
        aria-label="Designer views"
      >
        <button
          type="button"
          role="tab"
          class="fd-toolbar-btn"
          [class.fd-toolbar-btn--active]="activeTab() === 'design'"
          [attr.aria-selected]="activeTab() === 'design'"
          aria-controls="fd-tabpanel"
          (click)="activeTab.set('design')"
        >
          Design
        </button>
        <button
          type="button"
          role="tab"
          class="fd-toolbar-btn"
          [class.fd-toolbar-btn--active]="activeTab() === 'preview'"
          [attr.aria-selected]="activeTab() === 'preview'"
          aria-controls="fd-tabpanel"
          (click)="activeTab.set('preview')"
        >
          Preview
        </button>
        <button
          type="button"
          role="tab"
          class="fd-toolbar-btn"
          [class.fd-toolbar-btn--active]="activeTab() === 'json'"
          [attr.aria-selected]="activeTab() === 'json'"
          aria-controls="fd-tabpanel"
          (click)="activeTab.set('json')"
        >
          JSON
        </button>
      </div>
    </header>

    <!-- Content area -->
    <div
      class="fd-body"
      id="fd-tabpanel"
      role="tabpanel"
      [attr.aria-label]="activeTab() + ' view'"
    >
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
                (formSubmit)="onPreviewSubmit($event)"
              />
              <div class="fd-preview-live">
                <h4 class="fd-preview-live-heading">
                  Live output
                  <span
                    class="fd-preview-live-badge"
                    [class.fd-preview-live-badge--valid]="
                      previewEngine()!.valid()
                    "
                  >
                    {{ previewEngine()!.valid() ? "✓ valid" : "✗ invalid" }}
                  </span>
                </h4>
                <pre class="fd-preview-live-json">{{
                  previewOutput() | json
                }}</pre>
              </div>
            } @else {
              <p class="fd-preview-empty">
                Add some fields to see the preview.
              </p>
            }
          </div>
        }

        @case ("json") {
          <div class="fd-json">
            <div class="fd-json-header">
              <button
                type="button"
                class="fd-copy-btn"
                aria-label="Copy JSON to clipboard"
                (click)="onCopyJson()"
              >
                <ui-icon [svg]="copyIcon" [size]="14" />
              </button>
            </div>
            <pre class="fd-json-pre">{{ designerEngine.schema() | json }}</pre>
          </div>
        }
      }
    </div>
  `,
  styles: `
    :host {
      --ui-surface-card: #f7f8fa;
      --ui-text-card: #1d232b;
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
      background: var(--ui-surface-card, #f7f8fa);
      color: var(--ui-text-card, #1d232b);
      border-radius: 12px;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
      border: 1.5px dashed var(--ui-border, #d7dce2);
    }

    .fd-preview-empty {
      text-align: center;
      font-size: 0.9375rem;
      padding: 48px 16px;
      color: var(--ui-text-card, #1d232b);
      font-weight: 500;
    }

    .fd-preview-live {
      margin-top: 20px;
      border-top: 1px dashed rgba(128, 128, 128, 0.3);
      padding-top: 12px;
    }

    .fd-preview-live-heading {
      margin: 0 0 4px;
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.6;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .fd-preview-live-badge {
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0;
      padding: 1px 8px;
      border-radius: 10px;
      background: rgba(186, 26, 26, 0.15);
      color: #ba1a1a;
    }

    .fd-preview-live-badge--valid {
      background: rgba(56, 142, 60, 0.15);
      color: #388e3c;
    }

    .fd-preview-live-json {
      margin: 0;
      padding: 12px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.06);
      color: var(--ui-text-card, #1d232b);
      font-size: 0.8125rem;
      overflow: auto;
      max-height: 300px;
    }

    /* JSON */

    .fd-json {
      flex: 1;
      padding: 16px;
      overflow: auto;
    }

    .fd-json-header {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
    }

    .fd-copy-btn {
      appearance: none;
      border: 1px solid var(--ui-border, #d7dce2);
      background: var(--ui-surface-alt, #ffffff);
      color: var(--ui-text, #1d232b);
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: background 0.12s ease;
    }

    .fd-copy-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .fd-json-pre {
      font-family: monospace;
      font-size: 0.8125rem;
      white-space: pre-wrap;
      word-break: break-word;
      margin: 0;
      color: var(--ui-text, #1d232b);
    }

    /* Dark mode — explicit class */
    :host-context(html.dark-theme) {
      --ui-surface-card: #1a1d23;
      --ui-text-card: #f2f6fb;
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
      .fd-toolbar-btn--active {
        background: var(--theredhead-primary-container, #004787);
        color: var(--theredhead-on-primary-container, #d6e3ff);
      }
      .fd-toolbar-btn--active:hover {
        opacity: 0.9;
      }
      .fd-copy-btn {
        background: var(--ui-surface-alt, #2a2e36);
        border-color: var(--ui-border, #3a3f47);
        color: var(--ui-text, #f2f6fb);
      }
      .fd-copy-btn:hover {
        background: rgba(255, 255, 255, 0.08);
      }
      .fd-json-pre {
        color: var(--ui-text, #f2f6fb);
      }
    }

    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        --ui-surface-card: #1a1d23;
        --ui-text-card: #f2f6fb;
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
        .fd-toolbar-btn--active {
          background: var(--theredhead-primary-container, #004787);
          color: var(--theredhead-on-primary-container, #d6e3ff);
        }
        .fd-toolbar-btn--active:hover {
          opacity: 0.9;
        }
        .fd-copy-btn {
          background: var(--ui-surface-alt, #2a2e36);
          border-color: var(--ui-border, #3a3f47);
          color: var(--ui-text, #f2f6fb);
        }
        .fd-copy-btn:hover {
          background: rgba(255, 255, 255, 0.08);
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

  /** @internal Icon SVG for the copy button. */
  protected readonly copyIcon = UIIcons.Lucide.Text.Copy;

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

  /** @internal Live output from the preview engine. */
  protected readonly previewOutput = computed(() => {
    const eng = this.previewEngine();
    return eng ? eng.output()() : null;
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
    let groups = this.designerEngine.groups();

    // If there are no groups, create one first
    if (groups.length === 0) {
      this.lastGroupUid = this.designerEngine.addGroup();
      groups = this.designerEngine.groups();
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

  /** @internal Copy the current JSON schema to the clipboard. */
  protected onCopyJson(): void {
    const json = JSON.stringify(this.designerEngine.schema(), null, 2);
    navigator.clipboard.writeText(json);
  }

  /** @internal Show submitted values in a native dialog. */
  protected onPreviewSubmit(values: FormValues): void {
    const dialog = document.createElement("dialog");
    dialog.style.cssText =
      "border:none;border-radius:12px;padding:24px;max-width:min(90vw,560px);" +
      "max-height:85vh;display:flex;flex-direction:column;background:var(--ui-surface,#fff);" +
      "color:var(--ui-text,#1d232b);box-shadow:0 8px 32px rgba(0,0,0,0.25);font-family:inherit;";

    const heading = document.createElement("h2");
    heading.textContent = "Submitted Values";
    heading.style.cssText =
      "margin:0 0 16px;font-size:1.125rem;font-weight:600;";

    const pre = document.createElement("pre");
    pre.textContent = JSON.stringify(values, null, 2);
    pre.style.cssText =
      "margin:0;padding:12px;border-radius:8px;background:rgba(0,0,0,0.06);" +
      "font-size:0.8125rem;overflow:auto;flex:1;min-height:200px;white-space:pre-wrap;word-break:break-word;";

    const footer = document.createElement("div");
    footer.style.cssText =
      "display:flex;justify-content:flex-end;margin-top:16px;";

    const btn = document.createElement("button");
    btn.textContent = "Close";
    btn.style.cssText =
      "appearance:none;border:none;border-radius:8px;padding:8px 20px;" +
      "font-size:0.875rem;font-weight:600;cursor:pointer;" +
      "background:var(--theredhead-primary,#3584e4);color:var(--theredhead-on-primary,#fff);";
    btn.addEventListener("click", () => {
      dialog.close();
      dialog.remove();
    });

    footer.appendChild(btn);
    dialog.append(heading, pre, footer);
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        dialog.close();
        dialog.remove();
      }
    });
    dialog.addEventListener("close", () => dialog.remove());
    document.body.appendChild(dialog);
    dialog.showModal();
  }
}
