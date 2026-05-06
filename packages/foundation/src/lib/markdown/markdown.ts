/**
 * A pluggable Markdown-to-HTML converter.
 *
 * The library ships a lightweight built-in converter (via
 * {@link DefaultMarkdownParser}) that covers headings, bold, italic,
 * strikethrough, inline code, links, images, lists, blockquotes,
 * fenced code blocks, and GFM tables with column alignment.
 *
 * For full CommonMark / GFM support, consumers can supply their own
 * implementation backed by a third-party parser such as `marked` or
 * `markdown-it`.
 *
 * This module has **no Angular dependency** — it is plain TypeScript
 * and can be used in any context (Angular DI, server-side, tests, etc.).
 *
 * @example
 * ```ts
 * import { DefaultMarkdownParser } from '@theredhead/lucid-foundation';
 *
 * const parser = new DefaultMarkdownParser();
 * const html = parser.toHtml('# Hello\n\n**world**');
 * ```
 */
export interface MarkdownParser {

    /**
     * Converts a Markdown string to an HTML string.
     *
     * @param markdown - The raw Markdown source text.
     * @returns An HTML string.
     */
    toHtml(markdown: string): string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Inline pattern replacements applied during Markdown → HTML conversion.
 * Order matters — more specific patterns first.
 * @internal
 */
const INLINE_RULES: readonly [RegExp, string][] = [
    // Images (before links so `![alt](src)` isn't matched as link)
    [/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />'],
    // Links
    [
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    ],
    // Bold + italic (***text***)
    [/\*\*\*(.+?)\*\*\*/g, "<b><i>$1</i></b>"],
    // Bold (**text**)
    [/\*\*(.+?)\*\*/g, "<b>$1</b>"],
    // Italic (*text*)
    [/\*(.+?)\*/g, "<i>$1</i>"],
    // Strikethrough (~~text~~)
    [/~~(.+?)~~/g, "<s>$1</s>"],
    // Inline code (`text`)
    [/`([^`]+)`/g, "<code>$1</code>"],
    // Underline (++text++) — non-standard but useful
    [/\+\+(.+?)\+\+/g, "<u>$1</u>"],
];

/** @internal */
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/** @internal */
function applyInline(text: string): string {
    let result = text;
    for (const [pattern, replacement] of INLINE_RULES) {
        result = result.replace(pattern, replacement);
    }
    return result;
}

/** @internal */
function buildTableHtml(lines: string[]): string | null {
    if (lines.length < 2) return null;

    const sepLine = lines[1].trim();
    if (!/--/.test(sepLine)) return null;

    const parseRow = (line: string): string[] =>
        line
            .trim()
            .replace(/^\||\|$/g, "")
            .split("|")
            .map((c) => c.trim());

    const parseAlignments = (line: string): ("left" | "center" | "right")[] =>
        parseRow(line).map((cell) => {
            const c = cell.trim();
            if (c.startsWith(":") && c.endsWith(":")) return "center";
            if (c.endsWith(":")) return "right";
            return "left";
        });

    const headers = parseRow(lines[0]);
    const alignments = parseAlignments(lines[1]);
    const dataRows = lines.slice(2).map(parseRow);

    const alignStyle = (i: number): string => {
        const a = alignments[i] ?? "left";
        return a !== "left" ? ` style="text-align:${a}"` : "";
    };

    let html = "<table><thead><tr>";
    for (let i = 0; i < headers.length; i++) {
        html += `<th${alignStyle(i)}>${applyInline(headers[i])}</th>`;
    }
    html += "</tr></thead><tbody>";
    for (const row of dataRows) {
        html += "<tr>";
        for (let i = 0; i < row.length; i++) {
            html += `<td${alignStyle(i)}>${applyInline(row[i])}</td>`;
        }
        html += "</tr>";
    }
    html += "</tbody></table>";
    return html;
}

/**
 * Converts a Markdown string to an HTML string using the built-in
 * GFM-capable converter.
 *
 * Supports: headings (h1–h3), bold, italic, bold+italic, strikethrough,
 * underline, inline code, links, images, unordered lists, ordered lists,
 * blockquotes, fenced code blocks, horizontal rules, and GFM tables with
 * left/center/right column alignment.
 *
 * This function is used by {@link DefaultMarkdownParser} and is also
 * exported for callers that prefer a plain function over a class.
 */
export function markdownToHtml(md: string): string {
    const lines = md.split("\n");
    const htmlParts: string[] = [];
    let inList: "ul" | "ol" | null = null;
    let inCodeBlock = false;
    let codeBlockLines: string[] = [];
    let inBlockquote = false;
    let blockquoteLines: string[] = [];
    let tableBuffer: string[] = [];

    const flushTable = (): void => {
        if (tableBuffer.length === 0) return;
        const result = buildTableHtml(tableBuffer);
        if (result !== null) {
            htmlParts.push(result);
        } else {
            for (const tLine of tableBuffer) {
                htmlParts.push(`<p>${applyInline(tLine)}</p>`);
            }
        }
        tableBuffer = [];
    };

    const flushBlockquote = (): void => {
        if (inBlockquote && blockquoteLines.length) {
            htmlParts.push(
                `<blockquote>${blockquoteLines.map((l) => `<p>${applyInline(l)}</p>`).join("")}</blockquote>`,
            );
            blockquoteLines = [];
            inBlockquote = false;
        }
    };

    const flushList = (): void => {
        if (inList) {
            htmlParts.push(`</${inList}>`);
            inList = null;
        }
    };

    for (const line of lines) {
        if (line.trimStart().startsWith("```")) {
            if (inCodeBlock) {
                htmlParts.push(`<pre>${escapeHtml(codeBlockLines.join("\n"))}</pre>`);
                codeBlockLines = [];
                inCodeBlock = false;
            } else {
                flushBlockquote();
                flushList();
                flushTable();
                inCodeBlock = true;
            }
            continue;
        }
        if (inCodeBlock) {
            codeBlockLines.push(line);
            continue;
        }

        const bqMatch = line.match(/^>\s?(.*)/);
        if (bqMatch) {
            flushList();
            flushTable();
            inBlockquote = true;
            blockquoteLines.push(bqMatch[1]);
            continue;
        } else {
            flushBlockquote();
        }

        if (line.trimStart().startsWith("|")) {
            flushList();
            tableBuffer.push(line);
            continue;
        }

        flushTable();

        if (line.trim() === "") {
            flushList();
            continue;
        }

        const headingMatch = line.match(/^(#{1,3})\s+(.*)/);
        if (headingMatch) {
            flushList();
            const level = headingMatch[1].length;
            htmlParts.push(`<h${level}>${applyInline(headingMatch[2])}</h${level}>`);
            continue;
        }

        if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
            flushList();
            htmlParts.push("<hr>");
            continue;
        }

        const ulMatch = line.match(/^[-*+]\s+(.*)/);
        if (ulMatch) {
            if (inList !== "ul") {
                flushList();
                inList = "ul";
                htmlParts.push("<ul>");
            }
            htmlParts.push(`<li>${applyInline(ulMatch[1])}</li>`);
            continue;
        }

        const olMatch = line.match(/^\d+\.\s+(.*)/);
        if (olMatch) {
            if (inList !== "ol") {
                flushList();
                inList = "ol";
                htmlParts.push("<ol>");
            }
            htmlParts.push(`<li>${applyInline(olMatch[1])}</li>`);
            continue;
        }

        flushList();
        htmlParts.push(`<p>${applyInline(line)}</p>`);
    }

    if (inCodeBlock) {
        htmlParts.push(`<pre>${escapeHtml(codeBlockLines.join("\n"))}</pre>`);
    }
    flushBlockquote();
    flushList();
    flushTable();

    return htmlParts.join("");
}

/**
 * The built-in GFM-capable {@link MarkdownParser} implementation.
 *
 * Delegates to {@link markdownToHtml}. No configuration required —
 * construct and call `toHtml()`.
 *
 * @example
 * ```ts
 * import { DefaultMarkdownParser } from '@theredhead/lucid-foundation';
 *
 * const parser = new DefaultMarkdownParser();
 * console.log(parser.toHtml('**hello**')); // <b>hello</b>
 * ```
 */
export class DefaultMarkdownParser implements MarkdownParser {

    /**
     * Converts a Markdown string to HTML using the built-in GFM converter.
     * @param markdown - Raw Markdown source.
     * @returns HTML string.
     */
    public toHtml(markdown: string): string {
        return markdownToHtml(markdown);
    }
}
