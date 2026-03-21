import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  model,
  untracked,
  viewChild,
} from "@angular/core";

import { UIIcon } from "../icon/icon.component";
import type {
  TextAdapter,
  TextAdapterValidationResult,
} from "./adapters/text-adapter";

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
  host: {
    class: "ui-input",
    "[class.ui-input--multiline]": "multiline()",
    "[class.ui-input--has-prefix]": "prefixIcon() !== undefined",
    "[class.ui-input--has-suffix]": "suffixIcon() !== undefined",
    "[class.ui-input--invalid]": "!valid()",
  },
})
export class UIInput {
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

  /**
   * DOM sync: push {@link text} to the native element only when the
   * DOM value actually differs. This replaces the `[value]` template
   * binding to avoid resetting the cursor position on every keystroke.
   * @internal
   */
  private readonly _syncDomValue = effect(() => {
    const t = this.text();
    const el = this.nativeInput()?.nativeElement;
    if (el && el.value !== t) {
      el.value = t;
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
    const raw = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.text.set(raw);
    const a = this.adapter();
    this.value.set(a ? a.toValue(raw) : raw);
  }

  /** @internal */
  protected onPrefixClick(): void {
    this.adapter()?.onPrefixClick?.(this.text());
  }

  /** @internal */
  protected onSuffixClick(): void {
    this.adapter()?.onSuffixClick?.(this.text());
  }
}
