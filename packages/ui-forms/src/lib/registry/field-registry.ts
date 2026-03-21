// ── Field registry ───────────────────────────────────────────────────

import {
  type EnvironmentProviders,
  inject,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
  type Provider,
  type Type,
} from "@angular/core";

/**
 * Transforms a raw config value (typically a JSON-serializable string
 * or number) into the runtime value expected by the component input.
 *
 * Used by {@link FormFieldRegistration.configTransforms} to bridge
 * JSON-friendly config keys to complex runtime objects.
 */
export interface ConfigTransform {
  /** The actual component input name to set. */
  readonly inputKey: string;

  /** Convert the raw config value to the runtime input value. */
  readonly transform: (value: unknown) => unknown;
}

/**
 * Describes how a component is integrated into the form system.
 */
export interface FormFieldRegistration {
  /**
   * The Angular component class to instantiate.
   * Must be a standalone component.
   */
  readonly component: Type<unknown>;

  /**
   * Name of the model signal used for two-way value binding.
   *
   * Most ui-kit components use `"value"`. Exceptions:
   * - `UICheckbox` → `"checked"`
   * - `UIFileUpload` → `"files"`
   */
  readonly modelProperty: string;

  /**
   * Static inputs to apply by default (e.g. `{ type: "email" }`).
   * Merged with (overridden by) the field definition's `config`.
   */
  readonly defaultConfig?: Readonly<Record<string, unknown>>;

  /**
   * Optional map from config keys to {@link ConfigTransform} entries.
   *
   * When a config key appears in this map, the raw JSON value is
   * passed through the transform and set on the component input
   * specified by `inputKey` instead of the config key itself.
   *
   * @example
   * ```ts
   * configTransforms: {
   *   textAdapter: {
   *     inputKey: 'adapter',
   *     transform: (key) => resolveTextAdapter(key as string),
   *   },
   * }
   * ```
   */
  readonly configTransforms?: Readonly<Record<string, ConfigTransform>>;
}

/**
 * Multi-provider token that collects field registrations from
 * across the application.
 */
export const FORM_FIELD_REGISTRATIONS = new InjectionToken<
  ReadonlyMap<string, FormFieldRegistration>
>("FORM_FIELD_REGISTRATIONS", {
  factory: () => new Map(),
});

/**
 * Register one or more field types for use in form schemas.
 *
 * @example
 * ```ts
 * // app.config.ts
 * import { provideFormFields } from '@theredhead/ui-forms';
 * import { UIInput, UISelect, UICheckbox } from '@theredhead/ui-kit';
 *
 * export const appConfig = {
 *   providers: [
 *     provideFormFields({
 *       text:     { component: UIInput,    modelProperty: 'value' },
 *       select:   { component: UISelect,   modelProperty: 'value' },
 *       checkbox: { component: UICheckbox, modelProperty: 'checked' },
 *     }),
 *   ],
 * };
 * ```
 */
export function provideFormFields(
  fields: Readonly<Record<string, FormFieldRegistration>>,
): EnvironmentProviders {
  const map = new Map(Object.entries(fields));
  return makeEnvironmentProviders([
    {
      provide: FORM_FIELD_REGISTRATIONS,
      useValue: map,
    } satisfies Provider,
  ]);
}

/**
 * Injectable service that resolves a component key (e.g. `"text"`)
 * to a {@link FormFieldRegistration}.
 *
 * It merges all maps provided via `FORM_FIELD_REGISTRATIONS`.
 */
@Injectable({ providedIn: "root" })
export class FormFieldRegistry {
  private readonly maps = inject(FORM_FIELD_REGISTRATIONS, {
    optional: true,
  }) as ReadonlyMap<string, FormFieldRegistration> | null;

  private merged: Map<string, FormFieldRegistration> | null = null;

  private getMerged(): Map<string, FormFieldRegistration> {
    if (this.merged) return this.merged;
    this.merged = new Map();
    if (this.maps) {
      for (const [key, reg] of this.maps) {
        this.merged.set(key, reg);
      }
    }
    return this.merged;
  }

  /** Resolve a component key to its registration, or `null`. */
  public resolve(key: string): FormFieldRegistration | null {
    return this.getMerged().get(key) ?? null;
  }

  /** All registered keys. */
  public keys(): string[] {
    return [...this.getMerged().keys()];
  }
}
