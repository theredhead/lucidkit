import {
  computed,
  Directive,
  inject,
  InjectionToken,
  input,
} from "@angular/core";

/**
 * Optional injection token that components can provide to set a default
 * surface type. The directive uses this when no explicit `surfaceType`
 * input is supplied by the consumer.
 *
 * ```ts
 * providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: 'panel' }]
 * ```
 */
export const UI_DEFAULT_SURFACE_TYPE = new InjectionToken<
  SurfaceType | SurfaceType[]
>("UI_DEFAULT_SURFACE_TYPE");

/**
 * Built-in surface types shipped with the library.
 *
 * Consumers can extend this by defining additional CSS classes with the
 * `ui-surface-type-` prefix and passing the suffix as the `surfaceType` input.
 */
export type SurfaceType =
  | "transparent"
  | "raised"
  | "sunken"
  | "panel"
  | (string & {});

/**
 * Host directive that maps a `surfaceType` input to a CSS class on the
 * host element: `ui-surface-type-<value>`.
 *
 * Applied automatically to every `ui-*` component via `hostDirectives`.
 * The actual visual treatment is defined in the theme stylesheet — the
 * directive only manages the class binding.
 *
 * ### Built-in types
 *
 * | Type          | Intended use                                     |
 * |---------------|--------------------------------------------------|
 * | `transparent` | Fully transparent background                     |
 * | `raised`      | Elevated surface with shadow                     |
 * | `sunken`      | Inset / recessed surface                         |
 * | `panel`       | Generic panel / card surface                     |
 *
 * ### Custom types
 *
 * Define a CSS class with the `ui-surface-type-` prefix in your stylesheet:
 *
 * ```css
 * .ui-surface-type-glass {
 *   background: rgba(255, 255, 255, 0.1);
 *   backdrop-filter: blur(12px);
 * }
 * ```
 *
 * Then use it on any component:
 *
 * ```html
 * <ui-card surfaceType="glass">…</ui-card>
 * ```
 *
 * ### Multiple types
 *
 * Pass a space-separated string or an array to combine surface types:
 *
 * ```html
 * <ui-card surfaceType="raised glass">…</ui-card>
 * <ui-card [surfaceType]="['raised', 'glass']">…</ui-card>
 * ```
 */
@Directive({
  standalone: true,
  selector: "[uiSurface]",
  host: {
    "[class]": "hostClass()",
  },
})
export class UISurface {
  private readonly defaultSurface = inject(UI_DEFAULT_SURFACE_TYPE, {
    optional: true,
  });

  /**
   * One or more surface types to apply.
   * Accepts a single type, a space-separated string, or an array.
   * When unset, falls back to the component's `UI_DEFAULT_SURFACE_TYPE` provider (if any).
   */
  public readonly surfaceType = input<SurfaceType | SurfaceType[]>("");

  /** @internal */
  protected readonly hostClass = computed(() => {
    let raw = this.surfaceType();
    if (raw === "" && this.defaultSurface) raw = this.defaultSurface;
    const types = Array.isArray(raw)
      ? raw
      : String(raw).split(/\s+/).filter(Boolean);
    return types.map((t) => `ui-surface-type-${t}`).join(" ");
  });
}
