// ── UIFormField ──────────────────────────────────────────────────────

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  ViewContainerRef,
  viewChild,
} from "@angular/core";

import { LoggerFactory, UISurface } from "@theredhead/foundation";

import type { FieldState } from "../../engine/form-engine";
import { FormFieldRegistry } from "../../registry/field-registry";
import { isFlairComponent } from "../../types/form-schema.types";
import { FORM_SETTINGS } from "../form-settings";

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
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: {
    class: "ui-form-field",
    "[class.invalid]": "showErrors()",
    "[class.disabled]": "!state().enabled()",
    "[class.hidden]": "!state().visible()",
  },
  templateUrl: "./form-field.component.html",
  styleUrl: "./form-field.component.scss",
})
export class UIFormField {
  /** The field state managed by the {@link FormEngine}. */
  public readonly state = input.required<FieldState>();

  private readonly settings = inject(FORM_SETTINGS, { optional: true });

  /** Minimum width (in pixels) for the field control, from the parent form. */
  protected readonly fieldMinWidth = computed(
    () => this.settings?.fieldMinWidth() ?? 450,
  );

  private readonly registry = inject(FormFieldRegistry);
  private readonly log = inject(LoggerFactory).createLogger("UIFormField");
  private readonly outlet = viewChild<unknown, ViewContainerRef>("outlet", {
    read: ViewContainerRef,
  });

  /** @internal Show errors only when the field has been touched. */
  protected readonly showErrors = computed(
    () => this.state().touched() && !this.state().validation().valid,
  );

  /** @internal Whether this field is a flair (non-data) component. */
  protected readonly isFlair = computed(() =>
    isFlairComponent(this.state().definition.component),
  );

  /** @internal Whether this field renders a text input. */
  protected readonly isTextInput = computed(
    () => this.state().definition.component === "text",
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
