import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/** @internal */
const MAC_PATTERN = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;

/**
 * Adapter for MAC (Media Access Control) addresses.
 *
 * Strips non-hex characters, uppercases, and formats into colon-separated
 * pairs (e.g. `AA:BB:CC:DD:EE:FF`). Validates that the result is a valid
 * 48-bit MAC address.
 *
 * Shows a CPU prefix icon.
 *
 * @example
 * ```ts
 * readonly adapter = new MacAddressTextAdapter();
 * // "aabbccddeeff" → value "AABBCCDDEEFF", displayed "AA:BB:CC:DD:EE:FF"
 * ```
 */
export class MacAddressTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Devices.Cpu;

  public toValue(text: string): string {
    return text
      .replace(/[^A-Fa-f0-9]/g, "")
      .toUpperCase()
      .slice(0, 12);
  }

  public toDisplayValue(value: string): string {
    if (!value) return "";
    return value.replace(/(.{2})(?=.)/g, "$1:").slice(0, 17);
  }

  public validate(text: string): TextAdapterValidationResult {
    const cleaned = this.toValue(text);
    if (!cleaned) return { valid: true, errors: [] };

    if (cleaned.length !== 12) {
      return {
        valid: false,
        errors: ["MAC address must be exactly 12 hex digits"],
      };
    }

    const formatted = this.toDisplayValue(cleaned);
    if (!MAC_PATTERN.test(formatted)) {
      return {
        valid: false,
        errors: ["Value must be a valid MAC address (e.g. AA:BB:CC:DD:EE:FF)"],
      };
    }

    return { valid: true, errors: [] };
  }
}
