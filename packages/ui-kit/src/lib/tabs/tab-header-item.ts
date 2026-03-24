import { InjectionToken } from "@angular/core";

/** Alignment of the tab headers within their container. */
export type TabAlignment = "start" | "center" | "end";

/** Discriminated union tag for items that appear in the tab header. */
export type TabHeaderItemKind = "tab" | "separator" | "spacer";

/**
 * DI token for items that appear in the tab header strip.
 *
 * `UITab`, `UITabSeparator`, and `UITabSpacer` all provide themselves
 * under this token so the tab group can iterate them in DOM order.
 *
 * @internal
 */
export const TAB_HEADER_ITEM = new InjectionToken<{
  readonly kind: TabHeaderItemKind;
}>("TAB_HEADER_ITEM");
