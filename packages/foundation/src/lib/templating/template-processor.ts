/**
 * A handler for a named block directive.
 *
 * @param arg       - The argument after the directive name (trimmed).
 * @param body      - The raw template content between the open/close tags.
 * @param context   - The current expansion context.
 * @param processor - The processor instance, allowing recursive `expand` calls.
 *
 * @internal
 */
type BlockDirectiveHandler = (
  arg: string,
  body: string,
  context: Record<string, unknown>,
  processor: ITextTemplateProcessor,
) => string;

/**
 * Controls how a {@link TextTemplateProcessor} reacts when a template
 * references a key that does not exist in the expansion context.
 *
 * - `'keep'`   — leave the original `{{key}}` token in place *(default)*
 * - `'empty'`  — replace with `""`
 * - `'error'`  — throw a `RangeError`
 * - `(key) => string` — call the function and use its return value
 */
export type MissingKeyBehavior =
  | "keep"
  | "empty"
  | "error"
  | ((key: string) => string);

/**
 * Options for {@link TextTemplateProcessor}.
 */
export interface TextTemplateOptions {

  /**
   * How to handle a missing key during identifier expansion.
   * Defaults to `'keep'`.
   */
  readonly missingKey?: MissingKeyBehavior;
}

/**
 * Contract for text template processors.
 */
export interface ITextTemplateProcessor {

  /**
   * Fully expands a template string against the given context, resolving
   * all block directives and identifier substitutions in one pass.
   */
  expand(template: string, context: Record<string, unknown>): string;

  /**
   * Resolves a single identifier against the context.
   * Called for every `{{ key }}` token encountered outside a block.
   */
  processIdentifier(key: string, context: Record<string, unknown>): string;

  /**
   * Processes a block directive and returns the fully expanded result.
   *
   * @param func - The directive name (e.g. `"if"`, `"loop"`).
   * @param arg  - The argument after the directive name (e.g. `"condition"`).
   * @param body - The raw template content between the open and close tags.
   * @param context - The current expansion context.
   */
  processBlock(
    func: string,
    arg: string,
    body: string,
    context: Record<string, unknown>,
  ): string;
}

/**
 * Contract for a single named template directive.
 *
 * Implement this interface to create a custom directive and register it
 * with {@link registerTextTemplateDirective}.
 *
 * @example
 * ```ts
 * registerTextTemplateDirective('upper', {
 *   isSelfClosing: () => false,
 *   handle: (arg, body, ctx, processor) => processor.expand(body, ctx).toUpperCase(),
 * });
 * ```
 */
export interface ITextTemplateDirective {

  /**
   * Returns `true` if this directive is standalone (no close tag required).
   * Returns `false` if it is a block directive that wraps a body and requires
   * a matching `{{ @endname }}` close tag.
   */
  isSelfClosing(): boolean;

  /**
   * Processes the directive and returns the expanded string.
   *
   * @param arg       - The argument after the directive name (trimmed).
   * @param body      - Raw template content between the open and close tags
   *                    (empty string for self-closing directives).
   * @param context   - The current expansion context.
   * @param processor - The active processor; call `processor.expand(body, ctx)`
   *                    to recursively expand the body.
   */
  handle(
    arg: string,
    body: string,
    context: Record<string, unknown>,
    processor: ITextTemplateProcessor,
  ): string;
}

// ── module-level directive registry ─────────────────────────────────────────

/** @internal */
const _registry = new Map<string, ITextTemplateDirective>();

/**
 * Registers a named directive so it is available to all
 * {@link TextTemplateProcessor} instances.
 *
 * Calling this again with the same key replaces the existing directive.
 */
export function registerTextTemplateDirective(
  key: string,
  directive: ITextTemplateDirective,
): void {
  _registry.set(key, directive);
}

/**
 * Removes a previously registered directive by key.
 * Has no effect if the key is not registered.
 */
export function unregisterTextTemplateDirective(key: string): void {
  _registry.delete(key);
}

/**
 * Returns `true` if a directive with the given key is currently registered.
 */
export function haveRegisteredTextTemplateDirective(key: string): boolean {
  return _registry.has(key);
}

/**
 * Returns all currently registered directives (in insertion order).
 */
export function getRegisteredTextTemplateDirectives(): ITextTemplateDirective[] {
  return Array.from(_registry.values());
}

/**
 * Escapes a string for literal use inside a `RegExp` constructor.
 *
 * @internal
 */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Matches every `{{ @name ... }}` opening tag (not close tags).
 * Used as the outer scanner in {@link TextTemplateProcessor.expand}.
 *
 * @internal
 */
const OPEN_TAG_RE = /\{\{\s*@(?!end\w)(\w+)(?:\s+([^}]*?))?\s*\}\}/g;

/**
 * Scans forward from `startPos` to find the close tag that matches the given
 * `funcName`, correctly accounting for nesting.
 *
 * Returns the `{ start, end }` of the matching `{{ @endfuncName }}` token, or
 * `null` if no matching close tag exists.
 *
 * @internal
 */
function findMatchingCloseTag(
  template: string,
  funcName: string,
  startPos: number,
): { start: number; end: number } | null {
  const tagRe = new RegExp(
    `\\{\\{\\s*@(end)?(${escapeRegex(funcName)})(?:\\s[^}]*)?\\s*\\}\\}`,
    "g",
  );
  tagRe.lastIndex = startPos;
  let depth = 1;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(template)) !== null) {
    if (m[1]) {
      // close tag
      depth--;
      if (depth === 0) return { start: m.index, end: m.index + m[0].length };
    } else {
      // open tag of same type — increase nesting depth
      depth++;
    }
  }
  return null;
}

/**
 * Matches a simple identifier token: `{{ key }}` or `{{key}}`.
 *
 * @internal
 */
const IDENTIFIER_RE = /\{\{\s*(\w+)\s*\}\}/g;

/**
 * Default implementation of {@link ITextTemplateProcessor}.
 *
 * Supports three template constructs:
 *
 * **Simple substitution**
 * ```
 * Hello, {{ username }}!
 * ```
 *
 * **Conditional block** (`@if` / `@endif`)
 * ```
 * {{ @if isAdmin }}Admin panel{{ @endif }}
 * ```
 * The argument is looked up in the context and tested with JavaScript
 * truthiness. A non-empty array is truthy; an empty array is falsy.
 *
 * **Loop block** (`@loop` / `@endloop`)
 * ```
 * {{ @loop items }}- {{ name }}
 * {{ @endloop }}
 * ```
 * The argument must resolve to an array. Each element is used as the
 * local context for one iteration. Scalar elements are wrapped as
 * `{ value: element }` so `{{ value }}` can reference them.
 *
 * Block bodies are fully expanded (identifiers resolved) before being
 * returned, so a single call to `expand()` resolves everything.
 *
 * @example
 * ```ts
 * const proc = new TextTemplateProcessor({ missingKey: 'empty' });
 * const result = proc.expand("Hi {{ name }}!", { name: "World" });
 * // → "Hi World!"
 * ```
 *
 * Custom directives are registered with {@link registerTextTemplateDirective}:
 * ```ts
 * registerTextTemplateDirective('upper', {
 *   isSelfClosing: () => false,
 *   handle: (arg, body, ctx, p) => p.expand(body, ctx).toUpperCase(),
 * });
 * ```
 */
export class TextTemplateProcessor implements ITextTemplateProcessor {
  private readonly missingKeyBehavior: MissingKeyBehavior;

  public constructor(options: TextTemplateOptions = {}) {
    this.missingKeyBehavior = options.missingKey ?? "keep";
  }

  /**
   * Fully expands the template against the context in a single pass.
   *
   * Resolution order:
   * 1. Directive tags (`{{ @name arg }}`) — scanned left-to-right.
   *    - If the directive's {@link ITextTemplateDirective.isSelfClosing} returns
   *      `true`, it is called with an empty body and no close tag is expected.
   *    - Otherwise the scanner looks for a matching `{{ @endname }}` (correctly
   *      handling same-type nesting). Throws a `SyntaxError` if the close tag
   *      is missing.
   *    - Unregistered directives throw a `RangeError`.
   * 2. Simple identifier tokens (`{{ key }}`).
   *
   * Substituted values are never re-scanned, so a value containing `{{`
   * will not trigger further expansion.
   */
  public expand(template: string, context: Record<string, unknown>): string {
    let result = "";
    let pos = 0;
    const openRe = new RegExp(OPEN_TAG_RE.source, "g");

    let m: RegExpExecArray | null;
    while ((m = openRe.exec(template)) !== null) {
      const matchStart = m.index;
      const matchEnd = m.index + m[0].length;
      const func = m[1];
      const arg = (m[2] ?? "").trim();

      result += template.slice(pos, matchStart);

      const directive = _registry.get(func);
      if (!directive) {
        throw new RangeError(
          `TextTemplateProcessor: unknown directive "@${func}"`,
        );
      }

      if (directive.isSelfClosing()) {
        // Standalone — no body, no close tag
        result += this.processBlock(func, arg, "", context);
        pos = matchEnd;
        openRe.lastIndex = matchEnd;
      } else {
        // Block directive — require a matching close tag
        const close = findMatchingCloseTag(template, func, matchEnd);
        if (!close) {
          throw new SyntaxError(
            `TextTemplateProcessor: missing closing tag "{{ @end${func} }}" for "{{ @${func} }}"`,
          );
        }
        result += this.processBlock(
          func,
          arg,
          template.slice(matchEnd, close.start),
          context,
        );
        pos = close.end;
        openRe.lastIndex = close.end;
      }
    }

    result += template.slice(pos);

    return result.replace(IDENTIFIER_RE, (_match, key: string) =>
      this.processIdentifier(key, context),
    );
  }

  /**
   * Resolves a single `{{ key }}` identifier.
   *
   * Returns `String(value)` for existing keys (null/undefined → `""`).
   * Missing keys are handled according to {@link TextTemplateOptions.missingKey}.
   */
  public processIdentifier(
    key: string,
    context: Record<string, unknown>,
  ): string {
    if (Object.prototype.hasOwnProperty.call(context, key)) {
      const val = context[key];
      return val == null ? "" : String(val);
    }
    return this.resolveMissing(key);
  }

  /**
   * Looks up the registered {@link ITextTemplateDirective} for `func` and
   * calls its `handle` method.
   *
   * Throws a `RangeError` for unregistered directives.
   */
  public processBlock(
    func: string,
    arg: string,
    body: string,
    context: Record<string, unknown>,
  ): string {
    const directive = _registry.get(func);
    if (!directive) {
      throw new RangeError(
        `TextTemplateProcessor: unknown directive "@${func}"`,
      );
    }
    return directive.handle(arg, body, context, this);
  }

  private resolveMissing(key: string): string {
    if (this.missingKeyBehavior === "keep") return `{{${key}}}`;
    if (this.missingKeyBehavior === "empty") return "";
    if (this.missingKeyBehavior === "error") {
      throw new RangeError(`TextTemplateProcessor: missing key "${key}"`);
    }
    return this.missingKeyBehavior(key);
  }
}

// ── built-in directives ───────────────────────────────────────────────────────

registerTextTemplateDirective("if", {
  isSelfClosing: () => false,
  handle: (arg, body, context, processor) => {
    const val = context[arg];
    const truthy = Array.isArray(val) ? val.length > 0 : Boolean(val);
    return truthy ? processor.expand(body, context) : "";
  },
});

registerTextTemplateDirective("loop", {
  isSelfClosing: () => false,
  handle: (arg, body, context, processor) => {
    const items = context[arg];
    if (items == null) return "";
    if (!Array.isArray(items)) {
      throw new TypeError(
        `TextTemplateProcessor @loop: "${arg}" is not an array (got ${typeof items})`,
      );
    }
    return items
      .map((item) => {
        const itemCtx: Record<string, unknown> =
          typeof item === "object" && item !== null
            ? (item as Record<string, unknown>)
            : { value: item };
        return processor.expand(body, itemCtx);
      })
      .join("");
  },
});
