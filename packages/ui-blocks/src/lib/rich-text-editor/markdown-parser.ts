import { InjectionToken } from "@angular/core";
import {
  type MarkdownParser,
  DefaultMarkdownParser,
  markdownToHtml,
} from "@theredhead/lucid-foundation";

export { type MarkdownParser, DefaultMarkdownParser, markdownToHtml };

/**
 * Optional DI token for a custom {@link MarkdownParser}.
 *
 * When provided, the `MarkdownEditingStrategy` will use it
 * instead of the built-in lightweight converter.  This lets
 * consumers plug in full-featured parsers like `marked` or
 * `markdown-it` without adding a dependency to the library itself.
 *
 * @example
 * ```ts
 * import { MARKDOWN_PARSER, createMarkedParser } from '@theredhead/lucid-blocks';
 * import { marked } from 'marked';
 *
 * @Component({
 *   providers: [
 *     {
 *       provide: MARKDOWN_PARSER,
 *       useValue: createMarkedParser(md => marked.parse(md) as string),
 *     },
 *   ],
 * })
 * export class MyEditorHost {}
 * ```
 */
export const MARKDOWN_PARSER = new InjectionToken<MarkdownParser>(
  "MARKDOWN_PARSER",
);

// ── Adapter factories ─────────────────────────────────────────

/**
 * Creates a {@link MarkdownParser} that delegates to the `marked`
 * library's `parse` function.
 *
 * The consumer must install `marked` themselves and pass in the
 * bound `parse` function — this library never imports `marked`
 * directly.
 *
 * @param parseFn - A function that takes a Markdown string and
 *   returns an HTML string.  Typically `(md) => marked.parse(md)`.
 * @returns A {@link MarkdownParser} instance.
 *
 * @example
 * ```ts
 * import { marked } from 'marked';
 * import { MARKDOWN_PARSER, createMarkedParser } from '@theredhead/lucid-blocks';
 *
 * providers: [
 *   {
 *     provide: MARKDOWN_PARSER,
 *     useValue: createMarkedParser(md => marked.parse(md) as string),
 *   },
 * ]
 * ```
 */
export function createMarkedParser(
  parseFn: (markdown: string) => string,
): MarkdownParser {
  return { toHtml: parseFn };
}

/**
 * Creates a {@link MarkdownParser} that delegates to a
 * `markdown-it` instance's `render` method.
 *
 * The consumer must install `markdown-it` themselves and pass in
 * the bound `render` function — this library never imports
 * `markdown-it` directly.
 *
 * @param renderFn - A function that takes a Markdown string and
 *   returns an HTML string.  Typically `(md) => md.render(md)`
 *   where `md` is a configured `MarkdownIt` instance.
 * @returns A {@link MarkdownParser} instance.
 *
 * @example
 * ```ts
 * import MarkdownIt from 'markdown-it';
 * import { MARKDOWN_PARSER, createMarkdownItParser } from '@theredhead/lucid-blocks';
 *
 * const mdit = new MarkdownIt();
 *
 * providers: [
 *   {
 *     provide: MARKDOWN_PARSER,
 *     useValue: createMarkdownItParser(md => mdit.render(md)),
 *   },
 * ]
 * ```
 */
export function createMarkdownItParser(
  renderFn: (markdown: string) => string,
): MarkdownParser {
  return { toHtml: renderFn };
}
