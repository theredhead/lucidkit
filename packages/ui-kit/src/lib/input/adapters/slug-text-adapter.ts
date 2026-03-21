import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/** @internal */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Adapter for URL slugs.
 *
 * Trims whitespace, lowercases, replaces whitespace and underscores with
 * hyphens, strips non-alphanumeric characters (except hyphens), and
 * collapses consecutive hyphens.
 *
 * Validates that the result matches the slug pattern (lowercase
 * alphanumeric segments joined by single hyphens).
 *
 * Shows a link prefix icon.
 *
 * @example
 * ```ts
 * readonly adapter = new SlugTextAdapter();
 * // "Hello World!" → value "hello-world"
 * ```
 */
export class SlugTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Account.Link;

  public toValue(text: string): string {
    return text
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-{2,}/g, "-")
      .replace(/^-|-$/g, "");
  }

  public validate(text: string): TextAdapterValidationResult {
    const slug = this.toValue(text);
    if (!slug && !text.trim()) {
      return { valid: true, errors: [] };
    }
    if (!slug || !SLUG_PATTERN.test(slug)) {
      return {
        valid: false,
        errors: [
          "Value must be a valid URL slug (lowercase letters, digits, hyphens)",
        ],
      };
    }
    return { valid: true, errors: [] };
  }
}
