import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { UISurface } from "@theredhead/lucid-foundation";
import { PopoverRef, type UIPopoverContent } from "@theredhead/lucid-kit";

import {
  UIPropertySheet,
  type PropertyFieldDefinition,
} from "../../property-sheet";
import type { RichTextTemplateBlockAttributeDefinition } from "../rich-text-editor.types";

/**
 * Result emitted by the template block editor popover.
 *
 * @internal
 */
export interface TemplateBlockDialogResult {

  /**
   * XML block name.
   */
  readonly name: string;

  /**
   * Edited block attributes.
   */
  readonly attributes: Readonly<Record<string, string>>;
}

/**
 * Property-sheet popover for inserting or editing XML template block
 * attributes.
 *
 * @internal
 */
@Component({
  selector: "ui-template-block-dialog",
  standalone: true,
  imports: [UIPropertySheet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: { class: "ui-template-block-dialog" },
  templateUrl: "./template-block-dialog.component.html",
  styleUrl: "./template-block-dialog.component.scss",
})
export class UITemplateBlockDialog
  implements UIPopoverContent<TemplateBlockDialogResult> {
  public readonly popoverRef = inject(PopoverRef<TemplateBlockDialogResult>);

  /**
   * XML block name.
   */
  public readonly blockName = input<string>("");

  /**
   * Human-readable block label.
   */
  public readonly blockLabel = input<string>("");

  /**
   * Initial attributes.
   */
  public readonly initialAttributes = input<Readonly<Record<string, string>>>(
    {},
  );

  /**
   * Editable attribute definitions for this block.
   */
  public readonly attributeDefinitions = input<
    readonly RichTextTemplateBlockAttributeDefinition[]
  >([]);

  /**
   * Whether this popover edits an existing block.
   */
  public readonly editMode = input<boolean>(false);

  /** @internal */
  protected readonly attributeValues = signal<Record<string, unknown>>({});

  /** @internal */
  protected readonly fields = computed<
    readonly PropertyFieldDefinition<Record<string, unknown>>[]
  >(() => {
    const definitions = this.attributeDefinitions();
    if (definitions.length > 0) {
      return definitions.map((field) => ({
        ...field,
        type: field.type ?? "string",
      }));
    }
    return Object.keys(this.initialAttributes()).map((key) =>
      this.createGenericField(key),
    );
  });

  /** @internal */
  protected readonly canApply = computed(() =>
    this.fields().every((field) => {
      if (!field.required) return true;
      return String(this.attributeValues()[field.key] ?? "").trim().length > 0;
    }),
  );

  /** @internal */
  private readonly initialAttributeSync = effect(() => {
    this.attributeDefinitions();
    this.attributeValues.set({ ...this.initialAttributes() });
  });

  /** @internal */
  protected apply(): void {
    if (!this.canApply()) return;
    const attributes: Record<string, string> = {};
    for (const field of this.fields()) {
      const value = this.attributeValues()[field.key];
      attributes[field.key] = this.formatAttributeValue(value, field.type);
    }
    this.popoverRef.close({
      name: this.blockName(),
      attributes,
    });
  }

  /** @internal */
  protected cancel(): void {
    this.popoverRef.close(undefined);
  }

  /** @internal */
  private createGenericField(
    key: string,
  ): PropertyFieldDefinition<Record<string, unknown>> {
    return {
      key,
      label: key
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
      type: "string",
    };
  }

  /** @internal */
  private formatAttributeValue(
    value: unknown,
    type: RichTextTemplateBlockAttributeDefinition["type"],
  ): string {
    if (type === "boolean") return value ? "true" : "false";
    if (value == null) return "";
    return String(value).trim();
  }
}
