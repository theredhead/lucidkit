import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  InjectionToken,
  input,
  model,
  type Provider,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import {
  applyDataDetectors,
  getRegisteredDataDetectors,
  type IDataDetector,
  UISurface,
} from "@theredhead/lucid-foundation";

/**
 * The rendering strategy for {@link UIRichTextView}.
 *
 * - `'html'`     — Render content as raw HTML (default when content looks like HTML).
 * - `'markdown'` — Convert Markdown → HTML before rendering.
 * - `'auto'`     — Detect automatically: if the content starts with a recognised
 *                  HTML tag it is treated as HTML, otherwise as Markdown.
 */
export type RichTextViewStrategy = "html" | "markdown" | "auto";

/**
 * Optional Angular DI token for rich-text-view data detectors.
 */
export const RICH_TEXT_VIEW_DATA_DETECTORS = new InjectionToken<
  IDataDetector[]
>("RICH_TEXT_VIEW_DATA_DETECTORS");

/**
 * Registers one or more data detectors for {@link UIRichTextView} via Angular
 * DI.
 */
export function provideRichTextViewDataDetectors(
  ...detectors: IDataDetector[]
): Provider[] {
  return detectors.map((detector) => ({
    provide: RICH_TEXT_VIEW_DATA_DETECTORS,
    useValue: detector,
    multi: true,
  }));
}

/** @internal */
const DATA_DETECTOR_SKIPPED_TAGS = new Set([
  "a",
  "code",
  "pre",
  "script",
  "style",
  "textarea",
]);

/** @internal Heuristic: does the string look like HTML? */
function looksLikeHtml(content: string): boolean {
  return /^\s*<[a-zA-Z]/.test(content);
}

/** @internal */
function markdownToHtml(markdown: string): string {
  return markdown
    .split(/\n{2,}/)
    .map((block) => {
      const text = block.trim();
      if (!text) return "";
      if (text.startsWith("# "))
        return `<h1>${formatInline(text.slice(2))}</h1>`;
      if (text.startsWith("## "))
        return `<h2>${formatInline(text.slice(3))}</h2>`;
      if (text.startsWith("### "))
        return `<h3>${formatInline(text.slice(4))}</h3>`;
      return `<p>${formatInline(text).replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}

/** @internal */
function formatInline(value: string): string {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );
}

/** @internal */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** @internal */
function applyDataDetectorsToHtml(
  html: string,
  detectors: readonly IDataDetector[],
): string {
  if (!html || detectors.length === 0) {
    return html;
  }
  const document = new DOMParser().parseFromString(
    `<body>${html}</body>`,
    "text/html",
  );
  const body = document.body;
  const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let currentNode = walker.nextNode();
  while (currentNode) {
    textNodes.push(currentNode as Text);
    currentNode = walker.nextNode();
  }
  for (const textNode of textNodes) {
    const text = textNode.textContent ?? "";
    if (!text || shouldSkipDataDetectorTextNode(textNode)) {
      continue;
    }
    const transformed = applyDataDetectors(text, detectors);
    if (transformed === text) {
      continue;
    }
    const template = document.createElement("template");
    template.innerHTML = transformed;
    textNode.replaceWith(...Array.from(template.content.childNodes));
  }
  return body.innerHTML;
}

/** @internal */
function shouldSkipDataDetectorTextNode(node: Text): boolean {
  const parentTag = node.parentElement?.tagName.toLowerCase();
  return parentTag != null && DATA_DETECTOR_SKIPPED_TAGS.has(parentTag);
}

/**
 * A read-only rich text renderer.
 *
 * Displays HTML or Markdown content inline without any editing chrome.
 * Used by the form engine for `flair:richtext` elements and anywhere
 * rich content needs to be rendered.
 *
 * The `strategy` input controls how content is interpreted:
 * - `'auto'` (default) — detects HTML vs Markdown automatically.
 * - `'html'`           — always treats content as HTML.
 * - `'markdown'`       — always converts Markdown to HTML first.
 *
 * @example
 * ```html
 * <ui-rich-text-view [content]="'<p>Hello <strong>world</strong></p>'" />
 * <ui-rich-text-view strategy="markdown" [content]="'# Hello\n**world**'" />
 * ```
 */
@Component({
  selector: "ui-rich-text-view",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: {
    class: "ui-rich-text-view",
  },
  templateUrl: "./rich-text-view.component.html",
  styleUrl: "./rich-text-view.component.scss",
})
export class UIRichTextView {
  private readonly sanitizer = inject(DomSanitizer);

  private readonly injectedDataDetectors =
    inject(RICH_TEXT_VIEW_DATA_DETECTORS, { optional: true }) ?? null;

  /** The raw content to render (HTML or Markdown depending on `strategy`). */
  public readonly content = model<string>("");

  /**
   * Controls how `content` is interpreted.
   * - `'auto'`     — auto-detect HTML vs Markdown (default).
   * - `'html'`     — always render as HTML.
   * - `'markdown'` — always convert Markdown → HTML first.
   */
  public readonly strategy = input<RichTextViewStrategy>("auto");

  /** Accessible label for the container. */
  public readonly ariaLabel = input<string>("Rich text content");

  /**
   * Optional detector list to apply to rendered text nodes.
   *
   * When omitted, the component falls back to injected detectors and finally to
   * the foundation-level global detector registry.
   */
  public readonly dataDetectors = input<readonly IDataDetector[] | null>(null);

  /** The HTML to render, resolved from content + strategy. */
  public readonly trustedContent = computed(() => {
    const raw = this.content();
    const strat = this.strategy();
    const detectors =
      this.dataDetectors() ??
      this.injectedDataDetectors ??
      getRegisteredDataDetectors();
    let html: string;
    if (strat === "markdown" || (strat === "auto" && !looksLikeHtml(raw))) {
      html = markdownToHtml(raw);
    } else {
      html = raw;
    }
    html = applyDataDetectorsToHtml(html, detectors);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });
}
