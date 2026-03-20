// ── JSON export strategy ────────────────────────────────────────────

import type { FormSchema } from "../types/form-schema.types";
import { toKebabCase } from "./export-strategy";
import type { ExportResult, ExportStrategy } from "./export-strategy";

/**
 * Exports a {@link FormSchema} as a formatted JSON file.
 *
 * The output is a standard JSON document — identical to
 * `JSON.stringify(schema, null, 2)`.
 */
export class JsonExportStrategy implements ExportStrategy {
  public readonly label = "JSON Schema";
  public readonly description = "Export the form schema as a JSON file.";

  public export(schema: FormSchema): ExportResult {
    const title = schema.title?.trim() || "form";
    const fileName = toKebabCase(title) + ".schema.json";

    return {
      mimeType: "application/json",
      fileName,
      content: JSON.stringify(schema, null, 2) + "\n",
    };
  }
}
