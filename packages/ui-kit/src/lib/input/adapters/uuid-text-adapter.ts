import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/** @internal Standard UUID v1–v5 + NIL pattern */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Adapter for UUID strings.
 *
 * Strips whitespace and lowercases the result. Validates that the input
 * matches the standard UUID format
 * (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
 *
 * Shows a fingerprint prefix icon.
 *
 * @example
 * ```ts
 * readonly adapter = new UuidTextAdapter();
 * // "550E8400-E29B-41D4-A716-446655440000"
 * //   → value "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export class UuidTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Security.FingerprintPattern;

  public toValue(text: string): string {
    return text.trim().toLowerCase();
  }

  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }
    if (!UUID_PATTERN.test(trimmed)) {
      return {
        valid: false,
        errors: [
          "Value must be a valid UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)",
        ],
      };
    }
    return { valid: true, errors: [] };
  }
}
