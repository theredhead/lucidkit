// ── FormSettings ─────────────────────────────────────────────────────

import { InjectionToken, type Signal } from "@angular/core";

/**
 * Shared settings provided by a parent form component (`UIForm` or
 * `UIFormWizard`) and consumed by child components such as
 * `UIFormField` via DI.
 */
export interface FormSettings {
  /** Minimum width (in pixels) for field controls. */
  readonly fieldMinWidth: Signal<number>;
}

/**
 * DI token for {@link FormSettings}.
 *
 * Provided by `UIForm` and `UIFormWizard` so that descendant
 * components can look up form-level settings without requiring
 * explicit input threading.
 */
export const FORM_SETTINGS = new InjectionToken<FormSettings>("FORM_SETTINGS");
