import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  type OnInit,
} from "@angular/core";
import { UISurface } from '@theredhead/foundation';

/**
 * Lazy-loading image component.
 *
 * The native `<img>` element's `src` is only set once the host element
 * enters the viewport, powered by `IntersectionObserver`. Until then an
 * optional placeholder (CSS shimmer) is shown.
 *
 * @example
 * ```html
 * <ui-image src="photo.jpg" alt="A scenic landscape" />
 * <ui-image src="hero.webp" alt="Hero banner" width="800" height="400" />
 * ```
 */
@Component({
  selector: "ui-image",
  standalone: true,
  templateUrl: "./image.component.html",
  styleUrl: "./image.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: {
    class: "ui-image",
    "[class.ui-image--loaded]": "loaded()",
    "[class.ui-image--error]": "errored()",
    "[style.width.px]": "width()",
    "[style.height.px]": "height()",
  },
})
export class UIImage implements OnInit {
  // ── Inputs ─────────────────────────────────────────────────────

  /** Image source URL. */
  public readonly src = input.required<string>();

  /** Alt text forwarded to the native `<img>` element. */
  public readonly alt = input("");

  /** Explicit width in pixels (sets host element width). */
  public readonly width = input<number | undefined>(undefined);

  /** Explicit height in pixels (sets host element height). */
  public readonly height = input<number | undefined>(undefined);

  /**
   * Accessible label forwarded to the native element as `aria-label`.
   *
   * Falls back to {@link alt} when not provided.
   */
  public readonly ariaLabel = input<string | undefined>(undefined);

  // ── Internal state ─────────────────────────────────────────────

  /** @internal Whether the image has entered the viewport. */
  protected readonly inView = signal(false);

  /** @internal Whether the image has finished loading. */
  protected readonly loaded = signal(false);

  /** @internal Whether the image failed to load. */
  protected readonly errored = signal(false);

  /** @internal The src to actually apply to the `<img>`, or `undefined` until in view. */
  protected readonly activeSrc = computed(() =>
    this.inView() ? this.src() : undefined,
  );

  /** @internal Effective aria-label. */
  protected readonly effectiveAriaLabel = computed(
    () => this.ariaLabel() ?? this.alt(),
  );

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  // ── Lifecycle ──────────────────────────────────────────────────

  public ngOnInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          this.inView.set(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(this.el.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  // ── Event handlers ─────────────────────────────────────────────

  /** @internal */
  protected onLoad(): void {
    this.loaded.set(true);
  }

  /** @internal */
  protected onError(): void {
    this.errored.set(true);
  }
}
