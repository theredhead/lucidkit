import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgTemplateOutlet, KeyValuePipe } from "@angular/common";

import { LoggerFactory } from "@theredhead/lucid-foundation";
import {
  UIBadge,
  UIButton,
  UICard,
  UICardBody,
  UICardFooter,
  UICardHeader,
  UICheckbox,
  UIChip,
  UIDropdownList,
  UIIcon,
  UIIcons,
  UIInput,
  UIProgress,
  UISplitContainer,
  UISplitPanel,
  UIToggle,
  type SelectOption,
  type SplitOrientation,
} from "@theredhead/lucid-kit";

import { ThemeStudioService } from "./theme-studio.service";
import { UIThemeTokenRow } from "./token-row/theme-token-row.component";

/**
 * Full-height split-pane theme editor.
 *
 * Drop it into any layout that gives it height. The left panel contains the
 * token editor; the right panel renders a live component canvas that reflects
 * every token change in real time. A toolbar lets you switch between
 * horizontal and vertical orientations and swap the two panels.
 *
 * ### Usage
 * ```html
 * <ui-theme-studio style="height: 100%" />
 * ```
 */
@Component({
  selector: "ui-theme-studio",
  standalone: true,
  imports: [
    FormsModule,
    KeyValuePipe,
    NgTemplateOutlet,
    UIThemeTokenRow,
    UISplitContainer,
    UISplitPanel,
    UIButton,
    UIIcon,
    UIBadge,
    UICard,
    UICardBody,
    UICardFooter,
    UICardHeader,
    UIChip,
    UICheckbox,
    UIDropdownList,
    UIInput,
    UIProgress,
    UIToggle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./theme-studio.component.html",
  styleUrl: "./theme-studio.component.scss",
  host: {
    class: "ui-theme-studio",
    "[attr.aria-label]": "ariaLabel()",
  },
})
export class UIThemeStudio implements OnInit {
  // ── Inputs ─────────────────────────────────────────────────────────

  /**
   * URL of the token manifest JSON.
   * Defaults to `"assets/css-token-manifest.json"`.
   */
  public readonly manifestUrl = input("assets/css-token-manifest.json");

  /**
   * Accessible label for the component region.
   */
  public readonly ariaLabel = input("Theme Studio");

  // ── Layout state ───────────────────────────────────────────────────

  /**
   * Orientation of the split divider.
   * `"horizontal"` = side by side, `"vertical"` = stacked.
   */
  protected readonly splitOrientation = signal<SplitOrientation>("horizontal");

  /**
   * When `true`, the canvas is on the left / top and the token editor is on
   * the right / bottom.
   */
  protected readonly panelsSwapped = signal(false);

  // ── Services ───────────────────────────────────────────────────────

  /** @internal */
  protected readonly studio = inject(ThemeStudioService);

  private readonly log = inject(LoggerFactory).createLogger("UIThemeStudio");

  // ── Canvas data ────────────────────────────────────────────────────

  /** @internal */
  protected readonly icons = {
    horizontal: UIIcons.Lucide.Layout.LayoutPanelLeft,
    vertical: UIIcons.Lucide.Layout.LayoutPanelTop,
    swap: UIIcons.Lucide.Design.FlipHorizontal2,
  } as const;

  /** @internal */
  protected readonly sampleDropdownOptions: readonly SelectOption[] = [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
    { label: "Option C", value: "c" },
  ];

  // ── Lifecycle ──────────────────────────────────────────────────────

  /** @inheritdoc */
  public ngOnInit(): void {
    this.studio.open(this.manifestUrl());
  }

  // ── Toolbar actions ────────────────────────────────────────────────

  /**
   * Switch the split container orientation.
   */
  protected setOrientation(o: SplitOrientation): void {
    this.splitOrientation.set(o);
  }

  /**
   * Toggle which panel appears first (left/top).
   */
  protected toggleSwap(): void {
    this.panelsSwapped.update((s) => !s);
  }

  // ── Token editor handlers ──────────────────────────────────────────

  /** @internal */
  protected setFilterField<
    K extends keyof ReturnType<typeof this.studio.filter>,
  >(key: K, value: ReturnType<typeof this.studio.filter>[K]): void {
    this.studio.filter.update((f) => ({ ...f, [key]: value }));
  }

  /** @internal */
  protected onQueryChange(event: Event): void {
    this.setFilterField("query", (event.target as HTMLInputElement).value);
  }

  /** @internal */
  protected onTypeChange(event: Event): void {
    this.setFilterField("type", (event.target as HTMLSelectElement).value);
  }

  /** @internal */
  protected onScopeChange(event: Event): void {
    this.setFilterField("scope", (event.target as HTMLSelectElement).value);
  }

  /** @internal */
  protected onNamespaceChange(event: Event): void {
    this.setFilterField("namespace", (event.target as HTMLSelectElement).value);
  }

  /** @internal */
  protected onModifiedOnlyChange(event: Event): void {
    this.setFilterField(
      "modifiedOnly",
      (event.target as HTMLInputElement).checked,
    );
  }

  /** @internal */
  protected onTokenValueChange(tokenName: string, value: string): void {
    this.studio.setOverride(tokenName, value);
  }

  /** @internal */
  protected onTokenReset(tokenName: string): void {
    this.studio.setOverride(tokenName, null);
  }

  /** @internal */
  protected copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).catch((err: unknown) => {
      this.log.warn("Clipboard write failed", [err]);
    });
  }

  /** @internal */
  protected exportCss(): void {
    const css = this.studio.exportCss();
    if (css) this.copyToClipboard(css);
  }

  /** @internal */
  protected exportJson(): void {
    const json = JSON.stringify(this.studio.exportJson(), null, 2);
    if (json !== "{}") this.copyToClipboard(json);
  }
}
