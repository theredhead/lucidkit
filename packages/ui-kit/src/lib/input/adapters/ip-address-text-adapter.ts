import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/** @internal */
const IPV4_PATTERN =
  /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

/**
 * Adapter for IP addresses (v4).
 *
 * Strips whitespace and validates IPv4 format. Shows a network prefix icon.
 */
export class IPAddressTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Development.Network;

  public toValue(text: string): string {
    return text.replace(/[^0-9.]/g, "");
  }

  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }
    if (!IPV4_PATTERN.test(trimmed)) {
      return {
        valid: false,
        errors: ["Value must be a valid IPv4 address (e.g. 192.168.1.1)"],
      };
    }
    return { valid: true, errors: [] };
  }
}
