import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/** @internal */
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Adapter for email addresses.
 *
 * Strips whitespace and lowercases the input. Shows an at-sign prefix icon
 * that opens a `mailto:` link when clicked.
 */
export class EmailTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Text.AtSign;

  public toValue(text: string): string {
    return text.trim().toLowerCase();
  }

  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      return { valid: false, errors: ["Value must be a valid email address"] };
    }
    return { valid: true, errors: [] };
  }

  public onPrefixClick(text: string): void {
    const email = this.toValue(text);
    if (email) {
      window.open(`mailto:${encodeURIComponent(email)}`, "_self");
    }
  }
}
