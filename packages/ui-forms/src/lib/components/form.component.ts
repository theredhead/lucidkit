// ── UIForm ───────────────────────────────────────────────────────────

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import { FormEngine } from "../engine/form-engine";
import type { FormValues } from "../types/form-schema.types";
import { UIFormGroup } from "./form-group.component";

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
  host: {
    class: "ui-form",
  },
  template: `
    @if (engine().schema.title) {
      <h2 class="f-title">{{ engine().schema.title }}</h2>
    }
    @if (engine().schema.description) {
      <p class="f-description">{{ engine().schema.description }}</p>
    }

    @for (group of engine().groups; track group.definition.id) {
      <ui-form-group [state]="group" />
    }

    @if (showSubmit()) {
      <div class="f-actions">
        <button
          type="button"
          class="f-submit"
          [disabled]="!engine().valid()"
          (click)="onSubmit()"
        >
          {{ submitLabel() }}
        </button>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .f-title {
      font-size: 1.375rem;
      font-weight: 700;
      margin: 0 0 4px;
      color: var(--ui-text, #1d232b);
    }

    .f-description {
      font-size: 0.9375rem;
      opacity: 0.65;
      margin: 0 0 20px;
      line-height: 1.4;
    }

    ui-form-group {
      margin-bottom: 24px;
    }

    .f-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 16px;
      border-top: 1px solid var(--ui-border, #d7dce2);
    }

    .f-submit {
      appearance: none;
      border: none;
      border-radius: 8px;
      padding: 10px 24px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      background: var(--theredhead-primary, #3584e4);
      color: var(--theredhead-on-primary, #ffffff);
      transition: opacity 0.15s ease;
    }

    .f-submit:hover:not(:disabled) {
      opacity: 0.88;
    }

    .f-submit:disabled {
      opacity: 0.45;
      cursor: default;
    }

    .f-submit:focus-visible {
      outline: 2px solid var(--theredhead-primary, #3584e4);
      outline-offset: 2px;
    }

    :host-context(html.dark-theme) {
      .f-title {
        color: var(--ui-text, #f2f6fb);
      }

      .f-actions {
        border-top-color: var(--ui-border, #3a3f47);
      }
    }

    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        .f-title {
          color: var(--ui-text, #f2f6fb);
        }

        .f-actions {
          border-top-color: var(--ui-border, #3a3f47);
        }
      }
    }
  `,
})
export class UIForm {
  /** The form engine instance that drives this form. */
  public readonly engine = input.required<FormEngine>();

  /** Label for the submit button. Defaults to `"Submit"`. */
  public readonly submitLabel = input<string>("Submit");

  /** Whether to show the built-in submit button. Defaults to `true`. */
  public readonly showSubmit = input<boolean>(true);

  /** Emitted when the submit button is clicked and the form is valid. */
  public readonly formSubmit = output<FormValues>();

  /** @internal */
  protected readonly isValid = computed(() => this.engine().valid());

  /** @internal */
  protected onSubmit(): void {
    const eng = this.engine();
    eng.markAllTouched();
    if (eng.valid()) {
      this.formSubmit.emit(eng.output()());
    }
  }
}
