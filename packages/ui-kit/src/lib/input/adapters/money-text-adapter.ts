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

  private readonly locale: string;
  private readonly thousands: string;
  private readonly decimal: string;

  public constructor(currency = "EUR", locale?: string) {
    this.currency = currency.toUpperCase();
    this.decimals = ZERO_DECIMAL_CURRENCIES.has(this.currency) ? 0 : 2;
    this.prefixIcon =
      CURRENCY_ICONS[this.currency] ?? UIIcons.Lucide.Finance.Currency;
    this.locale = locale ?? navigator?.language ?? "en";
    const parts = new Intl.NumberFormat(this.locale).formatToParts(1234.5);
    this.thousands = parts.find((p) => p.type === "group")?.value ?? "";
    this.decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
  }

  public toValue(text: string): string {
    let s = text;
    if (this.thousands) s = s.split(this.thousands).join("");
    if (this.decimal !== ".") s = s.replace(this.decimal, ".");
  const cleaned = s.replace(/[^0-9.+-]/g, "");
    if (!cleaned || cleaned === "-" || cleaned === "." || cleaned === "-.")
      return cleaned;
    const n = Number(cleaned);
    if (!Number.isFinite(n)) return cleaned;
    if (cleaned.includes(".") && n.toString() !== cleaned) return cleaned;
    return n.toString();
  }

  public toDisplayValue(value: string): string {
    if (!value) return "";
    const n = Number(value);
    if (!Number.isFinite(n)) return value;
    if (value.includes(".") && n.toString() !== value) return value;
    return n.toLocaleString(this.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: this.decimals,
    });
  }

  public validate(text: string): TextAdapterValidationResult {
    const raw = text.trim();
    if (!raw) return { valid: true, errors: [] };
    let normalized = this.thousands ? raw.split(this.thousands).join("") : raw;
    if (this.decimal !== ".")
      normalized = normalized.replace(this.decimal, ".");
    const cleaned = normalized.replace(/[^0-9.+-]/g, "");
    if (cleaned !== normalized) {
      return {
        valid: false,
        errors: ["Value must be a valid monetary amount"],
      };
    }
    const pattern =
      this.decimals === 0
        ? /^[+-]?\d+$/
        : new RegExp(`^[+-]?\\d+(\\.\\d{0,${this.decimals}})?$`);
    if (!pattern.test(cleaned)) {
      const errors: string[] = [];
      if (!/^[+-]?\d+(\.\d+)?$/.test(cleaned)) {
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
