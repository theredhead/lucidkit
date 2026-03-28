import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/** @internal Minimum password length for validation. */
const MIN_LENGTH = 8;

/**
 * Adapter for password fields.
 *
 * Sets the native input type to `"password"` and provides a suffix
 * eye icon that toggles visibility when clicked. Validates that the
 * password meets minimum strength requirements.
 *
 * @example
 * ```ts
 * readonly adapter = new PasswordTextAdapter();
 * ```
 */
export class PasswordTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Security.LockKeyhole;

  /** Current visibility state — `true` means the password is shown as plain text. */
  private visible = false;

  public get inputType(): string {
    return this.visible ? "text" : "password";
  }

  public get suffixIcon(): string {
    return this.visible
      ? UIIcons.Lucide.Security.EyeOff
      : UIIcons.Lucide.Security.Eye;
  }

  public toValue(text: string): string {
    return text;
  }

  public onSuffixClick(_text: string): void {
    this.visible = !this.visible;
  }

  public validate(text: string): TextAdapterValidationResult {
    if (!text) return { valid: true, errors: [] };

    const errors: string[] = [];

    if (text.length < MIN_LENGTH) {
      errors.push(`Password must be at least ${MIN_LENGTH} characters`);
    }
    if (!/[a-z]/.test(text)) {
      errors.push("Password must contain a lowercase letter");
    }
    if (!/[A-Z]/.test(text)) {
      errors.push("Password must contain an uppercase letter");
    }
    if (!/\d/.test(text)) {
      errors.push("Password must contain a digit");
    }

    return { valid: errors.length === 0, errors };
  }
}
