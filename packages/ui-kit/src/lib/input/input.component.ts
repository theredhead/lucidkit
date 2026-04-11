import {
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  ElementRef,
  Injector,
  type OnDestroy,
  ViewContainerRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
  viewChild,
} from "@angular/core";

import { UIIcon } from "../icon/icon.component";
import type {
  TextAdapter,
  TextAdapterValidationResult,
} from "./adapters/text-adapter";
import {
  type InputPopupPanel,
  type PopupTextAdapter,
  isPopupAdapter,
} from "./adapters/popup-text-adapter";
import {
  LoggerFactory,
  UISurface,
  UI_DEFAULT_SURFACE_TYPE,
} from "@theredhead/lucid-foundation";

/**
 * Thin wrapper around a native `<input>` or `<textarea>` element.
 *
 * Supports two-way binding via both {@link text} (`[(text)]`) and
 * {@link value} (`[(value)]`).
 *
 * - `text` is the **authoritative** model — it holds the literal string
 *   displayed in the native element.
 * - `value` is a **derived** model — it holds whatever the {@link adapter}
 *   makes of the text (or a plain copy when no adapter is set).
 *
 * Consumers that only use `[(value)]` (the pre-adapter API) continue to
 * work without changes: when no adapter is set, `text` and `value` are
 * kept in sync bidirectionally.
 *
 * Set {@link multiline} to `true` to render a `<textarea>` instead.
 *
 * @example
 * ```html
 * <!-- backward-compatible: [(value)] still works as before -->
 * <ui-input [(value)]="amount" placeholder="Enter amount" />
 *
 * <!-- with adapter: [(text)] for raw, [(value)] for processed -->
 * <ui-input [adapter]="emailAdapter" [(text)]="email" [(value)]="normalized" />
 *
 * <!-- with popup adapter: suffix icon toggles a popup panel -->
 * <ui-input [adapter]="dateAdapter" [(text)]="date" placeholder="yyyy-MM-dd" />
 *
 * <ui-input multiline [rows]="4" [(text)]="description" />
 * ```
 */
@Component({
  selector: "ui-input",
  standalone: true,
  imports: [UIIcon],
  templateUrl: "./input.component.html",
  styleUrl: "./input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "input" }],
  host: {
    class: "ui-input",
    "[class.multiline]": "multiline()",
    "[class.height-adjustable]": "multiline() && heightAdjustable()",
    "[class.has-prefix]": "prefixIcon() !== undefined",
    "[class.has-suffix]": "suffixIcon() !== undefined",
    "[class.invalid]": "!valid()",
  },
})
export class UIInput implements OnDestroy {
  /** Native input type (ignored when {@link multiline} is `true`). */
  public readonly type = input<
    "text" | "number" | "date" | "email" | "password" | "tel" | "url"
  >("text");

  /**
   * Raw text displayed in the native element (two-way bindable).
   *
   * This is the authoritative model — it always holds the literal string
   * shown in the control.
   */
  public readonly text = model("");

  /**
   * Processed value derived from {@link text} through the {@link adapter}.
   *
   * When no adapter is set this mirrors `text` exactly, preserving full
   * backward compatibility with consumers that use `[(value)]`.
   *
   * Two-way bindable via `[(value)]`.
   */
  public readonly value = model("");

  /** Optional adapter that transforms text → value and provides icons. */
  public readonly adapter = input<TextAdapter | undefined>(undefined);

  /** Placeholder text. */
  public readonly placeholder = input("");

  /** Whether the control is disabled. */
  public readonly disabled = input(false);

  /**
   * When `true`, renders a `<textarea>` instead of an `<input>`.
   */
  public readonly multiline = input(false);

  /**
   * Number of visible text rows (only applies when {@link multiline}
   * is `true`). Defaults to `3`.
   */
  public readonly rows = input(3);

  /**
   * Whether the multiline textarea can be vertically resized by the
   * user via a drag handle. Only applies when {@link multiline} is
   * `true`. Defaults to `true`.
   */
  public readonly heightAdjustable = input(true);

  /**
   * Accessible label forwarded to the native element as `aria-label`.
   *
   * Required when no visible `<label>` is associated with the control.
   */
  public readonly ariaLabel = input<string | undefined>(undefined);

  /** @internal Reference to the native `<input>` or `<textarea>` element. */
  private readonly nativeInput =
    viewChild<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(
      "nativeInput",
    );

  /** @internal ViewContainerRef for dynamic popup component creation. */
  private readonly popupVcr = viewChild("popupContainer", {
    read: ViewContainerRef,
  });

  /**
   * Effective input type: adapter's {@link TextAdapter.inputType}
   * takes precedence over the {@link type} input.
   * @internal
   */
  protected readonly effectiveType = computed(
    () => this.adapter()?.inputType ?? this.type(),
  );

  /** @internal Prefix icon SVG from adapter. */
  protected readonly prefixIcon = computed(() => this.adapter()?.prefixIcon);

  /** @internal Suffix icon SVG from adapter. */
  protected readonly suffixIcon = computed(() => this.adapter()?.suffixIcon);

  /** Whether the current adapter supports a popup panel. */
  public readonly hasPopup = computed(() => {
    const a = this.adapter();
    return a ? isPopupAdapter(a) : false;
  });

  /** Whether the popup panel is currently open. */
  public readonly isPopupOpen = signal(false);

  /**
   * Unique id for ARIA linkage between the input and its popup.
   * @internal
   */
  protected readonly popupId: string;

  /** @internal Host element reference for document click detection. */
  private readonly elRef = inject(ElementRef<HTMLElement>);

  /** @internal */
  private readonly injector = inject(Injector);

  /** @internal */
  private readonly log = inject(LoggerFactory).createLogger("UIInput");

  /** @internal Active popup component reference. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private popupRef: ComponentRef<InputPopupPanel<any>> | null = null;

  /** @internal Subscription cleanup handles for popup outputs. */
  private popupSubs: { unsubscribe(): void }[] = [];

  private static _nextPopupId = 0;

  /**
   * Validation result from the adapter's `validate()` method.
   *
   * Returns `{ valid: true, errors: [] }` when no adapter is set or the
   * adapter does not implement `validate`.
   */
  public readonly validation = computed<TextAdapterValidationResult>(() => {
    const a = this.adapter();
    if (!a?.validate) {
      return { valid: true, errors: [] };
    }
    return a.validate(this.text());
  });

  /**
   * Whether the current text is valid according to the adapter.
   *
   * Always `true` when no adapter is set or the adapter does not
   * implement `validate`.
   */
  public readonly valid = computed(() => this.validation().valid);

  /**
   * Validation error messages from the adapter.
   *
   * Empty when valid or when no adapter is set.
   */
  public readonly errors = computed(() => this.validation().errors);

  /** @internal */
  public constructor() {
    this.popupId = `ui-input-popup-${UIInput._nextPopupId++}`;
  }

  /**
   * DOM sync: push the display value to the native element.
   *
   * When an adapter is present, shows the display-formatted value
   * (via {@link TextAdapter.toDisplayValue}) or falls back to the
   * adapted value. Without an adapter, shows the raw text.
   * @internal
   */
  private readonly _syncDomValue = effect(() => {
    const a = this.adapter();
    const val = a ? this.value() : this.text();
    const display = a?.toDisplayValue ? a.toDisplayValue(val) : val;
    const el = this.nativeInput()?.nativeElement;
    if (el && el.value !== display) {
      el.value = display;
    }
  });

  /**
   * Forward sync (adapter only): whenever {@link text} changes, push
   * the result through the adapter into {@link value}.
   *
   * Without an adapter, text→value sync is handled by {@link onInput}
   * and the backward sync handles the reverse direction. This avoids
   * overwriting a parent-bound `[value]` on initialisation.
   * @internal
   */
  private readonly _syncValueFromText = effect(() => {
    const raw = this.text();
    const a = this.adapter();
    if (!a) return;
    untracked(() => {
      const derived = a.toValue(raw);
      if (this.value() !== derived) {
        this.value.set(derived);
      }
    });
  });

  /**
   * Backward sync (no-adapter only): when the parent writes to
   * {@link value} externally (e.g. `[(value)]`), reflect it back to
   * {@link text} so the native element updates.
   * @internal
   */
  private readonly _syncTextFromValue = effect(() => {
    const val = this.value();
    if (!untracked(() => this.adapter())) {
      untracked(() => {
        if (this.text() !== val) {
          this.text.set(val);
        }
      });
    }
  });

  /** @internal */
  protected onInput(event: Event): void {
    const el = event.target as HTMLInputElement | HTMLTextAreaElement;
    const raw = el.value;
    const a = this.adapter();
    this.text.set(raw);
    const adapted = a ? a.toValue(raw) : raw;
    this.value.set(adapted);
    // Write the display value back immediately to avoid flicker
    if (a) {
      const display = a.toDisplayValue ? a.toDisplayValue(adapted) : adapted;
      if (el.value !== display) {
        const pos = el.selectionStart;
        el.value = display;
        if (pos !== null) {
          const newPos = Math.min(pos, display.length);
          el.setSelectionRange(newPos, newPos);
        }
      }
    }
  }

  /** @internal */
  protected onPrefixClick(): void {
    const a = this.adapter();
    this.log.debug("prefix click", [a?.constructor.name ?? "no adapter"]);
    if (a && isPopupAdapter(a)) {
      this.togglePopup();
      return;
    }
    a?.onPrefixClick?.(this.text());
  }

  /** @internal */
  protected onSuffixClick(): void {
    const a = this.adapter();
    this.log.debug("suffix click", [a?.constructor.name ?? "no adapter"]);
    if (a && isPopupAdapter(a)) {
      this.togglePopup();
      return;
    }
    a?.onSuffixClick?.(this.text());
  }

  /** @internal Handle keyboard events on the input element. */
  protected onInputKeydown(event: KeyboardEvent): void {
    if (!this.hasPopup()) return;
    if (event.key === "ArrowDown" && !this.isPopupOpen()) {
      event.preventDefault();
      this.openPopup();
    }
  }

  // ── Popup lifecycle ──────────────────────────────────────────

  /** Toggle the popup open/closed. */
  public togglePopup(): void {
    if (this.isPopupOpen()) {
      this.closePopup();
    } else {
      this.openPopup();
    }
  }

  /** Open the popup panel. */
  public openPopup(): void {
    const a = this.adapter();
    if (!a || !isPopupAdapter(a) || this.disabled()) return;
    this.isPopupOpen.set(true);

    // Wait for the @if block to render the popup container
    afterNextRender(() => this.createPopupComponent(a), {
      injector: this.injector,
    });
  }

  /** Close the popup panel and destroy the component. */
  public closePopup(): void {
    this.destroyPopupComponent();
    this.isPopupOpen.set(false);
    this.removeDocumentListeners();
  }

  /** @internal */
  public ngOnDestroy(): void {
    this.closePopup();
  }

  /** @internal */
  private createPopupComponent(adapter: PopupTextAdapter): void {
    const vcr = this.popupVcr();
    if (!vcr) return;

    vcr.clear();
    const ref = vcr.createComponent(adapter.popupPanel);

    // Set adapter-specific inputs
    const inputs = adapter.popupInputs?.(this.text()) ?? {};
    for (const [key, val] of Object.entries(inputs)) {
      ref.setInput(key, val);
    }

    // Subscribe to popup outputs
    this.popupSubs.push(
      ref.instance.valueSelected.subscribe((val: unknown) => {
        const newText = adapter.fromPopupValue(val);
        this.text.set(newText);
        this.value.set(adapter.toValue(newText));
        this.closePopup();
      }),
    );
    this.popupSubs.push(
      ref.instance.closeRequested.subscribe(() => {
        this.closePopup();
      }),
    );

    this.popupRef = ref;
    this.addDocumentListeners();
  }

  /** @internal */
  private destroyPopupComponent(): void {
    for (const sub of this.popupSubs) {
      sub.unsubscribe();
    }
    this.popupSubs = [];
    this.popupRef?.destroy();
    this.popupRef = null;
  }

  // ── Document listeners (only when popup is open) ─────────────

  private readonly onDocumentClick = (event: Event): void => {
    if (!this.elRef.nativeElement.contains(event.target as Node)) {
      this.closePopup();
    }
  };

  private readonly onEscapeKey = (event: Event): void => {
    if ((event as KeyboardEvent).key === "Escape") {
      this.closePopup();
    }
  };

  /** @internal */
  private addDocumentListeners(): void {
    document.addEventListener("click", this.onDocumentClick);
    document.addEventListener("keydown", this.onEscapeKey);
  }

  /** @internal */
  private removeDocumentListeners(): void {
    document.removeEventListener("click", this.onDocumentClick);
    document.removeEventListener("keydown", this.onEscapeKey);
  }

  /** @internal Handle pointer-driven vertical resize of the textarea. */
  protected onResizePointerDown(event: PointerEvent): void {
    event.preventDefault();
    const handle = event.target as HTMLElement;
    const textarea = this.nativeInput()?.nativeElement;
    if (!textarea) return;

    const startY = event.clientY;
    const startHeight = textarea.offsetHeight;

    const onMove = (e: PointerEvent): void => {
      const delta = e.clientY - startY;
      textarea.style.height = `${Math.max(32, startHeight + delta)}px`;
    };

    const onUp = (): void => {
      handle.releasePointerCapture(event.pointerId);
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
    };

    handle.setPointerCapture(event.pointerId);
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
  }
}
