import {
  type EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
  type Provider,
} from "@angular/core";

import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/**
 * Map of ISO 4217 currency codes to Lucide icon SVG content.
 * Falls back to the generic `Currency` icon for unknown codes.
 * @internal
 */
const CURRENCY_ICONS: Readonly<Record<string, string>> = {
  USD: UIIcons.Lucide.Finance.CircleDollarSign,
  AUD: UIIcons.Lucide.Finance.CircleDollarSign,
  CAD: UIIcons.Lucide.Finance.CircleDollarSign,
  NZD: UIIcons.Lucide.Finance.CircleDollarSign,
  HKD: UIIcons.Lucide.Finance.CircleDollarSign,
  SGD: UIIcons.Lucide.Finance.CircleDollarSign,
  EUR: UIIcons.Lucide.Finance.Euro,
  GBP: UIIcons.Lucide.Finance.PoundSterling,
  JPY: UIIcons.Lucide.Finance.JapaneseYen,
  INR: UIIcons.Lucide.Finance.IndianRupee,
  CHF: UIIcons.Lucide.Finance.SwissFranc,
  RUB: UIIcons.Lucide.Finance.RussianRuble,
  PHP: UIIcons.Lucide.Finance.PhilippinePeso,
};

/**
 * Currencies that use zero decimal places.
 * @internal
 */
const ZERO_DECIMAL_CURRENCIES: ReadonlySet<string> = new Set([
  "JPY",
  "KRW",
  "VND",
  "CLP",
  "ISK",
]);

/**
 * Injection token for the default ISO 4217 currency code used by
 * {@link MoneyTextAdapter} when no explicit currency is passed to the
 * constructor.
 *
 * Defaults to `'EUR'`. Override with {@link provideDefaultCurrency}:
 *
 * ```ts
 * providers: [provideDefaultCurrency('USD')]
 * ```
 */
export const DEFAULT_CURRENCY = new InjectionToken<string>("DEFAULT_CURRENCY", {
  factory: () => "EUR",
});

/**
 * Provide a default currency code for {@link MoneyTextAdapter}.
 *
 * @param currency ISO 4217 currency code (e.g. `'EUR'`, `'GBP'`).
 *
 * @example
 * ```ts
 * // app.config.ts
 * import { provideDefaultCurrency } from '@theredhead/ui-kit';
 *
 * export const appConfig = {
 *   providers: [provideDefaultCurrency('USD')],
 * };
 * ```
 */
export function provideDefaultCurrency(currency: string): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: DEFAULT_CURRENCY, useValue: currency } satisfies Provider,
  ]);
}

/**
 * Adapter for monetary values.
 *
 * Strips whitespace, removes grouping separators (commas), and validates
 * that the input is a valid monetary amount with the correct number of
 * decimal places for its {@link currency}.
 *
 * The prefix icon is chosen automatically based on the currency code.
 *
 * @param currency ISO 4217 currency code. When omitted, defaults to
 *   `'EUR'` (overridable via {@link DEFAULT_CURRENCY} / {@link provideDefaultCurrency}).
 *
 * @example
 * ```ts
 * readonly adapter = new MoneyTextAdapter();       // EUR
 * readonly adapter = new MoneyTextAdapter('USD');   // explicit
 * ```
 */
export class MoneyTextAdapter implements TextAdapter {
  /** ISO 4217 currency code this adapter is configured for. */
  public readonly currency: string;

  /** Maximum allowed decimal places (0 for JPY/KRW etc., 2 otherwise). */
  public readonly decimals: number;

  public readonly prefixIcon: string;

  public constructor(currency = "EUR") {
    this.currency = currency.toUpperCase();
    this.decimals = ZERO_DECIMAL_CURRENCIES.has(this.currency) ? 0 : 2;
    this.prefixIcon =
      CURRENCY_ICONS[this.currency] ?? UIIcons.Lucide.Finance.Currency;
  }

  public toValue(text: string): string {
    const stripped = text.trim().replace(/,/g, "");
    return stripped;
  }

  public validate(text: string): TextAdapterValidationResult {
    const stripped = text.trim().replace(/,/g, "");
    if (!stripped) {
      return { valid: true, errors: [] };
    }
    const pattern =
      this.decimals === 0
        ? /^[+-]?\d+$/
        : new RegExp(`^[+-]?\\d+(\\.\\d{0,${this.decimals}})?$`);
    if (!pattern.test(stripped)) {
      const errors: string[] = [];
      if (!/^[+-]?[\d,]+(\.\d+)?$/.test(text.trim())) {
        errors.push("Value must be a valid monetary amount");
      } else if (this.decimals === 0) {
        errors.push(`${this.currency} amounts do not allow decimal places`);
      } else {
        errors.push(
          `Monetary values allow at most ${this.decimals} decimal places`,
        );
      }
      return { valid: false, errors };
    }
    return { valid: true, errors: [] };
  }
}
