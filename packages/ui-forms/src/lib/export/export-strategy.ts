// ── Export strategy types ────────────────────────────────────────────

import type { FormSchema } from "../types/form-schema.types";

/**
 * The result of an export operation.
 *
 * Contains the generated content as a string together with metadata
 * about the suggested file name and MIME type.
 */
export interface ExportResult {

  /** MIME type for the exported content (e.g. `"application/json"`, `"text/typescript"`). */
  readonly mimeType: string;

  /** Suggested file name for the exported artefact. */
  readonly fileName: string;

  /** The exported content as a string. */
  readonly content: string;
}

/**
 * Strategy interface for exporting a {@link FormSchema} into a
 * specific format.
 *
 * Implementations must be plain classes — no Angular DI required.
 *
 * @example
 * ```ts
 * class MyExportStrategy implements ExportStrategy {
 *   readonly label = 'My Format';
 *   readonly description = 'Export as My Format.';
 *
 *   export(schema: FormSchema): ExportResult {
 *     return {
 *       mimeType: 'text/plain',
 *       fileName: 'form.txt',
 *       content: JSON.stringify(schema),
 *     };
 *   }
 * }
 * ```
 */
export interface ExportStrategy {

  /** Human-readable label displayed in the export format selector. */
  readonly label: string;

  /** Short description of the export format. */
  readonly description: string;

  /** Generate an {@link ExportResult} from the given schema. */
  export(schema: FormSchema): ExportResult;
}

// ── String utilities ────────────────────────────────────────────────

/**
 * Convert a human-readable title to kebab-case.
 *
 * Falls back to `"generated-form"` when the input is empty or
 * contains no usable characters.
 *
 * @internal
 */
export function toKebabCase(text: string): string {
  return (
    text
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/gi, "")
      .toLowerCase()
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "generated-form"
  );
}

/**
 * Convert a human-readable title to PascalCase.
 *
 * Falls back to `"GeneratedForm"` when the input is empty.
 *
 * @internal
 */
export function toPascalCase(text: string): string {
  return toKebabCase(text)
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}
