import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/** @internal */
const URL_PATTERN =
  /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/\S*)?$/;

/**
 * Adapter for URLs.
 *
 * Strips whitespace and prepends `https://` when no protocol is present.
 * Shows a globe prefix icon and an external-link suffix icon that opens
 * the URL in a new tab.
 */
export class UrlTextAdapter implements TextAdapter {
  public readonly inputType = "url";
  public readonly prefixIcon = UIIcons.Lucide.Navigation.Globe;
  public readonly suffixIcon = UIIcons.Lucide.Arrows.ExternalLink;

  public toValue(text: string): string {
    const trimmed = text.trim();
    if (!trimmed) {
      return "";
    }
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }

  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }
    if (!URL_PATTERN.test(trimmed)) {
      return { valid: false, errors: ["Value must be a valid URL"] };
    }
    return { valid: true, errors: [] };
  }

  public onSuffixClick(text: string): void {
    const url = this.toValue(text);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }
}
