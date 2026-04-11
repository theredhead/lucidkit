// ── UIForm ───────────────────────────────────────────────────────────

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
} from "@angular/core";

import { FormEngine } from "../engine/form-engine";
import type { FormValues } from "../types/form-schema.types";
import { FORM_SETTINGS } from "./form-settings";
import { UIFormGroup } from "./form-group.component";
import { UISurface } from '@theredhead/lucid-foundation';

/**
 * Top-level form component that renders all groups sequentially.
 *
 * Takes a {@link FormEngine} instance and displays every group's
 * fields in order, with validation and conditional visibility.
 *
 * @example
 * ```html
 * <ui-form [engine]="engine" (formSubmit)="onSubmit($event)" />
 * ```
 */
@Component({
  selector: "ui-form",
  standalone: true,
  imports: [UIFormGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: {
    class: "ui-form",
  },
  providers: [
    {
      provide: FORM_SETTINGS,
      useExisting: forwardRef(() => UIForm),
    },
  ],
  templateUrl: "./form.component.html",
  styleUrl: "./form.component.scss",
})
export class UIForm {
  /** The form engine instance that drives this form. */
  public readonly engine = input.required<FormEngine>();

  /** Label for the submit button. Defaults to `"Submit"`. */
  public readonly submitLabel = input<string>("Submit");

  /** Whether to show the built-in submit button. Defaults to `true`. */
  public readonly showSubmit = input<boolean>(true);

  /** Minimum width (in pixels) for form field controls. Defaults to `200`. */
  public readonly fieldMinWidth = input<number>(450);

  /** Emitted when the submit button is clicked and the form is valid. */
  public readonly formSubmit = output<FormValues>();

  /** @internal */
  protected readonly isValid = computed(() => this.engine().valid());

  /** @internal — collects all invalid visible fields for the summary. */
  protected readonly validationSummary = computed(() => {
    const summary: { fieldId: string; title: string; errors: string[] }[] = [];
    for (const group of this.engine().groups) {
      if (!group.visible()) continue;
      for (const field of group.fields) {
        if (!field.visible()) continue;
        const v = field.validation();
        if (!v.valid) {
          summary.push({
            fieldId: field.definition.id,
            title: field.definition.title || field.definition.id,
            errors: v.errors.map((e) => e.message),
          });
        }
      }
    }
    return summary;
  });

  /** @internal */
  protected onSubmit(): void {
    const eng = this.engine();
    eng.markAllTouched();
    if (eng.valid()) {
      this.formSubmit.emit(eng.output()());
    }
  }
}
