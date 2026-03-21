// ── UIFormField ──────────────────────────────────────────────────────

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  untracked,
  ViewContainerRef,
  viewChild,
} from "@angular/core";

import { LoggerFactory } from "@theredhead/foundation";

import type { FieldState } from "../../engine/form-engine";
import { FormFieldRegistry } from "../../registry/field-registry";

/**
 * Renders a single form field by dynamically creating the component
 * registered for the field's `component` key and wiring up two-way
 * value binding, config inputs, and validation display.
 *
 * This component is used internally by {@link UIFormGroup} and
 * {@link UIForm}. It can also be used standalone for custom layouts.
 *
 * @example
 * ```html
 * <ui-form-field [state]="fieldState" />
 * ```
 */
@Component({
  selector: "ui-form-field",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-form-field",
    "[class.ui-form-field--invalid]": "showErrors()",
    "[class.ui-form-field--disabled]": "!state().enabled()",
    "[class.ui-form-field--hidden]": "!state().visible()",
  },
  template: `
    @if (state().visible()) {
      <label class="ff-label" [attr.for]="state().definition.id">
        {{ state().definition.title }}
        @if (isRequired()) {
          <span class="ff-required" aria-hidden="true">*</span>
        }
      </label>

      @if (state().definition.description) {
        <p class="ff-description">{{ state().definition.description }}</p>
      }
    }

    <div class="ff-control" [class.ff-control--hidden]="!state().visible()">
      <ng-container #outlet />
    </div>

    @if (state().visible() && showErrors()) {
      <ul class="ff-errors" role="alert">
        @for (error of state().validation().errors; track error.type) {
          <li class="ff-error">{{ error.message }}</li>
        }
      </ul>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    :host(.ui-form-field--hidden) {
      display: none;
    }

    .ff-label {
      display: block;
      font-weight: 600;
      font-size: 0.875rem;
      margin-bottom: 4px;
      color: var(--ui-text, #1d232b);
    }

    .ff-required {
      color: var(--theredhead-error, #ba1a1a);
      margin-left: 2px;
    }

    .ff-description {
      font-size: 0.8125rem;
      opacity: 0.65;
      margin: 0 0 4px;
      line-height: 1.4;
    }

    .ff-control {
      margin-bottom: 2px;
    }

    .ff-control--hidden {
      display: none;
    }

    .ff-errors {
      list-style: none;
      margin: 2px 0 0;
      padding: 0;
    }

    .ff-error {
      font-size: 0.8125rem;
      color: var(--theredhead-error, #ba1a1a);
      line-height: 1.4;
    }

    :host-context(html.dark-theme) {
      .ff-label {
        color: var(--ui-text, #f2f6fb);
      }

      .ff-required,
      .ff-error {
        color: var(--theredhead-error, #ffb4ab);
      }
    }

    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        .ff-label {
          color: var(--ui-text, #f2f6fb);
        }

        .ff-required,
        .ff-error {
          color: var(--theredhead-error, #ffb4ab);
        }
      }
    }
  `,
})
export class UIFormField {
  /** The field state managed by the {@link FormEngine}. */
  public readonly state = input.required<FieldState>();

  private readonly registry = inject(FormFieldRegistry);
  private readonly log = inject(LoggerFactory).createLogger("UIFormField");
  private readonly outlet = viewChild<unknown, ViewContainerRef>("outlet", {
    read: ViewContainerRef,
  });

  /** @internal Show errors only when the field has been touched. */
  protected readonly showErrors = computed(
    () => this.state().touched() && !this.state().validation().valid,
  );

  /** @internal Whether the field has a `required` validation rule. */
  protected readonly isRequired = computed(() =>
    (this.state().definition.validation ?? []).some(
      (r) => r.type === "required",
    ),
  );

  public constructor() {
    // Create the component once the view is ready
    effect(() => {
      const fieldState = this.state();
      const vcr = this.outlet();
      if (!vcr) return;
      vcr.clear();

      const reg = this.registry.resolve(fieldState.definition.component);
      if (!reg) {
        this.log.warn(
          `No component registered for "${fieldState.definition.component}"`,
          [fieldState.definition.id],
        );
        return;
      }

      const ref = vcr.createComponent(reg.component);

      // Wire the model property (two-way).
      // Use untracked() so the effect does NOT track fieldState.value();
      // otherwise every keystroke would re-run the effect and recreate
      // the component, destroying focus.
      ref.setInput(
        reg.modelProperty,
        untracked(() => fieldState.value()),
      );

      // Subscribe to model changes.
      // Angular model() signals expose .subscribe() on the signal
      // itself (not on a separate *Change property).
      const modelProp = (ref.instance as Record<string, unknown>)[
        reg.modelProperty
      ];

      if (
        modelProp &&
        typeof (modelProp as Record<string, unknown>)["subscribe"] ===
          "function"
      ) {
        // model() signal — subscribe directly
        (
          modelProp as { subscribe: (fn: (v: unknown) => void) => void }
        ).subscribe((v: unknown) => {
          fieldState.value.set(v);
          fieldState.touched.set(true);
        });
      } else {
        // Fallback: EventEmitter / output() — look for <prop>Change
        const changeOutput = (ref.instance as Record<string, unknown>)[
          reg.modelProperty + "Change"
        ];
        if (
          changeOutput &&
          typeof (changeOutput as Record<string, unknown>)["subscribe"] ===
            "function"
        ) {
          (
            changeOutput as {
              subscribe: (fn: (v: unknown) => void) => void;
            }
          ).subscribe((v: unknown) => {
            fieldState.value.set(v);
            fieldState.touched.set(true);
          });
        }
      }

      // Apply config inputs (defaultConfig merged with field config)
      const config = {
        ...(reg.defaultConfig ?? {}),
        ...(fieldState.definition.config ?? {}),
      };

      for (const [key, val] of Object.entries(config)) {
        const transform = reg.configTransforms?.[key];
        if (transform) {
          try {
            ref.setInput(transform.inputKey, transform.transform(val));
          } catch {
            this.log.debug(
              `Input "${transform.inputKey}" not found on component`,
              [fieldState.definition.component],
            );
          }
        } else {
          try {
            ref.setInput(key, val);
          } catch {
            this.log.debug(`Input "${key}" not found on component`, [
              fieldState.definition.component,
            ]);
          }
        }
      }

      // Forward options for select/radio/autocomplete
      if (fieldState.definition.options) {
        try {
          ref.setInput("options", fieldState.definition.options);
        } catch {
          // Component may not have an options input
        }
      }

      // Disabled state (untracked — don't recreate on toggle)
      if (!untracked(() => fieldState.enabled())) {
        try {
          ref.setInput("disabled", true);
        } catch {
          // Not all components have a disabled input
        }
      }

      // Set aria label from title
      try {
        ref.setInput("ariaLabel", fieldState.definition.title);
      } catch {
        // Not all components have ariaLabel
      }
    });
  }
}
