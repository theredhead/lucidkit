import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/** @internal */
const PHONE_PATTERN = /^\+?[\d\s()./-]{7,20}$/;

/**
 * Adapter for phone numbers.
 *
 * Strips whitespace from the edges and validates that the input looks like
 * a phone number (digits, optional leading `+`, spaces, dashes, dots,
 * parentheses, slashes). The value produced strips everything except
 * digits and a leading `+`.
 *
 * Shows a phone prefix icon. Clicking the icon opens a `tel:` link.
 *
 * @example
 * ```ts
 * readonly adapter = new PhoneTextAdapter();
 * // "+1 (555) 123-4567" → value "+15551234567"
 * ```
 */
export class PhoneTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Communication.Phone;

  public toValue(text: string): string {
    const trimmed = text.trim();
    if (!trimmed) {
      return "";
    }
    // Keep leading + and digits only
    const hasPlus = trimmed.startsWith("+");
    const digits = trimmed.replace(/\D/g, "");
    return hasPlus ? `+${digits}` : digits;
  }

  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }
    if (!PHONE_PATTERN.test(trimmed)) {
      return { valid: false, errors: ["Value must be a valid phone number"] };
    }
    return { valid: true, errors: [] };
  }

  public onPrefixClick(text: string): void {
    const phone = this.toValue(text);
    if (phone) {
      window.open(`tel:${encodeURIComponent(phone)}`, "_self");
    }
  }
}
