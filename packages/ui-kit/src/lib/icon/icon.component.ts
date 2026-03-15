import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  SecurityContext,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

/**
 * Inline SVG icon component.
 *
 * Renders SVG inner content (paths, circles, etc.) from the icon registry
 * inside a properly configured `<svg>` wrapper. The icon inherits the
 * current text colour via `currentColor`.
 *
 * @example
 * ```html
 * <ui-icon [svg]="UIIcons.Lucide.Text.Bold" />
 * <ui-icon [svg]="UIIcons.Lucide.Arrows.ArrowUp" [size]="20" />
 * <ui-icon [svg]="UIIcons.Lucide.Arrows.ChevronDown" size="16" ariaLabel="Expand" />
 * ```
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
   * SVG inner content — the markup inside the `<svg>` element.
   * Use values from the `UIIcons` registry.
   */
  readonly svg = input.required<string>();

  /** Icon size in pixels (width & height). Defaults to 24. */
  readonly size = input<number>(24);

  /** Accessible label. When provided, `aria-hidden` is removed. */
  readonly ariaLabel = input<string>("");

  /** @internal */
  protected readonly safeSvg = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.svg()),
  );

  constructor(private readonly sanitizer: DomSanitizer) {}
}
