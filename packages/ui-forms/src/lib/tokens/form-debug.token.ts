import { inject, InjectionToken, isDevMode } from "@angular/core";

/**
 * Controls whether `UIFormField` renders detailed developer diagnostics
 * (component key, registration hints) for unresolved field registrations.
 *
 * - `true` (default in dev mode): shows the full missing-registration
 *   banner with the unresolved component key and remediation hint.
 * - `false` (default in production mode): shows only a generic
 *   "Configuration error" message that is safe to display to end users.
 *
 * Override at the application or component level:
 *
 * ```ts
 * // Force debug mode on in all environments (e.g. Storybook)
 * providers: [{ provide: FORM_FIELD_DEBUG, useValue: true }]
 *
 * // Force debug mode off (e.g. production build verification)
 * providers: [{ provide: FORM_FIELD_DEBUG, useValue: false }]
 * ```
 */
export const FORM_FIELD_DEBUG = new InjectionToken<boolean>(
  "FORM_FIELD_DEBUG",
  { providedIn: "root", factory: () => isDevMode() },
);

/**
 * Injects the {@link FORM_FIELD_DEBUG} token.
 * Returns `true` in development mode (or when explicitly overridden),
 * `false` in production mode.
 */
export function injectFormFieldDebug(): boolean {
  return inject(FORM_FIELD_DEBUG);
}
