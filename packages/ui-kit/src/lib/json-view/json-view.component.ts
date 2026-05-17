import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from "@angular/core";
import { LoggerFactory } from "@theredhead/lucid-foundation";
import { UIIcon, UIIcons } from "../icon";
import { UIJsonNode } from "./json-node.component";

/** @internal */
interface ParseOk {
  readonly ok: true;
  readonly value: unknown;
}

/** @internal */
interface ParseError {
  readonly ok: false;
  readonly raw: string;
  readonly message: string;
  readonly line: number;
  readonly col: number;
}

/** @internal */
type ParseResult = ParseOk | ParseError;

/** @internal */
function lineColFromOffset(
  src: string,
  offset: number,
): { line: number; col: number } {
  const before = src.slice(0, Math.max(0, offset));
  const lines = before.split("\n");
  return { line: lines.length, col: (lines.at(-1)?.length ?? 0) + 1 };
}

/** @internal */
function parseJsonSafe(raw: string): ParseResult {
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch (err) {
    const msg = err instanceof SyntaxError ? err.message : String(err);
    // V8 embeds a character offset in the message: "… at position 42"
    const posMatch = /at position (\d+)/i.exec(msg);
    const offset = posMatch ? parseInt(posMatch[1], 10) : raw.length;
    const { line, col } = lineColFromOffset(raw, offset);
    return { ok: false, raw, message: msg, line, col };
  }
}

/**
 * Renders any JSON-serialisable value (or a JSON string) as an
 * interactive tree with collapsible objects and arrays, syntax
 * highlighting, and a one-click copy-to-clipboard button.
 *
 * Accepts a live object/array **or** a raw JSON string — both work:
 *
 * ```html
 * <ui-json-view [value]="myObject" />
 * <ui-json-view [value]="'{ \"key\": 42 }'" />
 * ```
 */
@Component({
  selector: "ui-json-view",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIJsonNode, UIIcon],
  templateUrl: "./json-view.component.html",
  styleUrl: "./json-view.component.scss",
  host: {
    class: "ui-json-view",
  },
})
export class UIJsonView {
  /** The value to display — any JSON-serialisable type or a JSON string. */
  public readonly value = input<unknown>(null);

  /** Accessible label for the viewer. */
  public readonly ariaLabel = input<string>("JSON viewer");

  /** @internal */
  protected readonly UIIcons = UIIcons;

  /** @internal — whether the copy confirmation tick is showing. */
  protected readonly copied = signal(false);

  private readonly log = inject(LoggerFactory).createLogger("UIJsonView");

  /** @internal — parse result (ok or error with location). */
  protected readonly parseResult = computed<ParseResult>(() => {
    const v = this.value();
    if (typeof v === "string") {
      return parseJsonSafe(v);
    }
    return { ok: true, value: v };
  });

  /** @internal — typed narrowing helpers for the template. */
  protected readonly parsedValue = computed(
    () => (this.parseResult() as ParseOk).value,
  );

  /** @internal */
  protected readonly parseError = computed(
    () => this.parseResult() as ParseError,
  );

  /** @internal */
  protected copyToClipboard(): void {
    const result = this.parseResult();
    const text = result.ok
      ? JSON.stringify(result.value, null, 2)
      : (result as ParseError).raw;
    navigator.clipboard.writeText(text).then(
      () => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 1500);
      },
      (err: unknown) => {
        this.log.error("Failed to copy JSON to clipboard", [err]);
      },
    );
  }
}
