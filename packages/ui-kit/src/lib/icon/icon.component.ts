import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

/**
 * Inline SVG icon component.
 *
 * Renders SVG inner content (paths, circles, etc.) inside a properly
 * configured `<svg>` wrapper. The icon inherits the current text colour
 * via `currentColor`.
 *
 * The library ships a categorised registry of
 * {@link https://lucide.dev | Lucide} icons (`UIIcons.Lucide.*`),
 * but you can also supply **your own custom SVG content** — any valid
 * SVG inner markup will work.
 *
 * The Lucide icon set is created by the Lucide Contributors, originally
 * forked from Feather Icons by Cole Bemis, and is licensed under the
 * {@link https://github.com/lucide-icons/lucide/blob/main/LICENSE | ISC Licence}.
 *
 * @see {@link https://lucide.dev} — Lucide Icons
 * @see {@link https://github.com/lucide-icons/lucide} — GitHub repository
 *
 * ## Using built-in icons
 *
 * ```html
 * <ui-icon [svg]="UIIcons.Lucide.Text.Bold" />
 * <ui-icon [svg]="UIIcons.Lucide.Arrows.ArrowUp" [size]="20" />
 * <ui-icon [svg]="UIIcons.Lucide.Arrows.ChevronDown" size="16" ariaLabel="Expand" />
 * ```
 *
 * ## Extending with custom icons
 *
 * The `svg` input accepts **any string of SVG inner markup** — the
 * component wraps it in an `<svg>` element with `viewBox="0 0 24 24"`,
 * `stroke="currentColor"`, `fill="none"`, `stroke-width="2"`,
 * `stroke-linecap="round"`, and `stroke-linejoin="round"`. Design your
 * icons on a **24 × 24 grid** using stroked paths to match the built-in
 * set.
 *
 * ### 1. Define a custom icon registry
 *
 * ```ts
 * // app-icons.ts
 * export const AppIcons = {
 *   Diamond: `<path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41
 *     2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41
 *     2.41 0 0 0-3.41 0Z" />`,
 *   Spark: `<path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5
 *     10l5.5-1.5Z" />`,
 * } as const;
 * ```
 *
 * ### 2. Use in a template
 *
 * ```ts
 * import { UIIcon } from '@theredhead/ui-kit';
 * import { AppIcons } from './app-icons';
 *
 * @Component({
 *   imports: [UIIcon],
 *   template: `<ui-icon [svg]="diamond" [size]="24" ariaLabel="Diamond" />`,
 * })
 * export class MyComponent {
 *   readonly diamond = AppIcons.Diamond;
 * }
 * ```
 *
 * ### Tips for custom icons
 *
 * - **Grid:** Use a 24 × 24 coordinate space (matching the `viewBox`).
 * - **Stroke-based:** The wrapper sets `fill="none"` and
 *   `stroke="currentColor"`. For filled icons, add `fill="currentColor"`
 *   and `stroke="none"` directly on your `<path>` or `<circle>`.
 * - **Colour:** Icons inherit the parent element's CSS `color` via
 *   `currentColor`. Override with a CSS rule on `ui-icon` if needed.
 * - **Organisation:** Group related custom icons in a `const` object
 *   (like `UIIcons.Lucide`) for discoverability and tree-shaking.
 */
@Component({
  selector: "ui-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-icon",
    "[style.width.px]": "size()",
    "[style.height.px]": "size()",
    "[style.display]": "'inline-flex'",
    role: "img",
    "[attr.aria-label]": "ariaLabel() || null",
    "[attr.aria-hidden]": "!ariaLabel()",
  },
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [innerHTML]="safeSvg()"
    ></svg>
  `,
  styles: `
    :host {
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      line-height: 0;
    }

    svg {
      display: block;
    }
  `,
})
export class UIIcon {
  /**
   * SVG inner content — the markup inside the `<svg>` element
   * (paths, circles, lines, etc.).
   *
   * Use values from the built-in `UIIcons` registry or supply your own
   * custom SVG markup. The content is rendered inside an `<svg>` wrapper
   * with `viewBox="0 0 24 24"`, so design custom icons on a 24 × 24 grid.
   *
   * @example
   * ```ts
   * // Built-in icon
   * readonly icon = UIIcons.Lucide.Text.Bold;
   *
   * // Custom icon — raw SVG path string
   * readonly customIcon = '<circle cx="12" cy="12" r="10" /><path d="M12 8v8" />';
   * ```
   */
  readonly svg = input.required<string>();

  /** Icon size in pixels (width & height). Defaults to 24. */
  readonly size = input<number>(24);

  /** Accessible label. When provided, `aria-hidden` is removed. */
  readonly ariaLabel = input<string>("");

  private readonly sanitizer = inject(DomSanitizer);

  /** @internal */
  protected readonly safeSvg = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.svg()),
  );
}
