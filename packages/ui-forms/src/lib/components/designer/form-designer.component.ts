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

import { UIIcon, UIIcons } from "@theredhead/lucid-kit";

import type { FormSchema, FormValues } from "../../types/form-schema.types";
import { FormEngine } from "../../engine/form-engine";
import { UIForm } from "../form.component";
import { FormDesignerEngine } from "./designer-engine";
import { UIFieldPalette } from "./field-palette.component";
import { UIDesignerCanvas } from "./designer-canvas.component";
import { UIPropertyInspector } from "./property-inspector.component";
import { UISurface } from '@theredhead/lucid-foundation';

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
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: { class: "ui-form-designer" },
  templateUrl: "./form-designer.component.html",
  styleUrl: "./form-designer.component.scss",
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
