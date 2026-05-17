import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from "@angular/core";

/** @internal */
type JsonNodeType =
  | "object"
  | "array"
  | "string"
  | "number"
  | "boolean"
  | "null";

/** @internal */
function jsonType(value: unknown): JsonNodeType {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value as JsonNodeType;
}

/** @internal */
export interface JsonEntry {
  key: string;
  value: unknown;
}

/**
 * Internal recursive node renderer for {@link UIJsonView}.
 *
 * @internal — not part of the public API.
 */
@Component({
  selector: "ui-json-node",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
   
  imports: [forwardRef(() => UIJsonNode)],
  templateUrl: "./json-node.component.html",
  styleUrl: "./json-node.component.scss",
  host: { class: "ui-json-node" },
})
export class UIJsonNode {
  /** The key label displayed before this value (object entries only). */
  public readonly key = input<string | undefined>(undefined);

  /** The value to render. */
  public readonly value = input.required<unknown>();

  /** When `true`, a trailing comma is rendered after this node's closing token. */
  public readonly trailingComma = input<boolean>(false);

  /** @internal — computed node type. */
  protected readonly type = computed(() => jsonType(this.value()));

  /** @internal */
  protected readonly isObject = computed(() => this.type() === "object");

  /** @internal */
  protected readonly isArray = computed(() => this.type() === "array");

  /** @internal */
  protected readonly isExpandable = computed(
    () => this.isObject() || this.isArray(),
  );

  /** @internal — child entries for objects and arrays. */
  protected readonly entries = computed<JsonEntry[]>(() => {
    const v = this.value();
    if (Array.isArray(v)) {
      return v.map((item, i) => ({ key: String(i), value: item }));
    }
    if (v !== null && typeof v === "object") {
      return Object.entries(v as Record<string, unknown>).map(([k, val]) => ({
        key: k,
        value: val,
      }));
    }
    return [];
  });

  /** @internal — summary shown when collapsed. */
  protected readonly collapsedPreview = computed(() => {
    const v = this.value();
    if (Array.isArray(v)) {
      return v.length === 0 ? "[]" : `[… ${v.length}]`;
    }
    if (v !== null && typeof v === "object") {
      const keys = Object.keys(v as object);
      return keys.length === 0 ? "{}" : `{… ${keys.length}}`;
    }
    return "";
  });

  /** @internal */
  protected readonly expanded = signal(true);

  /** @internal */
  protected toggleExpand(): void {
    this.expanded.update((v) => !v);
  }
}
