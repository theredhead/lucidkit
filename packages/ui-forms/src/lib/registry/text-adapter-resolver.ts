// ── Text adapter resolver ────────────────────────────────────────────

import {
  type TextAdapter,
  EmailTextAdapter,
  UrlTextAdapter,
  IPAddressTextAdapter,
  PhoneTextAdapter,
  CreditCardTextAdapter,
  MoneyTextAdapter,
  IntegerTextAdapter,
  FloatTextAdapter,
  DecimalTextAdapter,
  HexadecimalTextAdapter,
  PercentageTextAdapter,
  DateTextAdapter,
  TimeTextAdapter,
  ColorTextAdapter,
  SlugTextAdapter,
  UuidTextAdapter,
  CronTextAdapter,
  UppercaseTextAdapter,
} from "@theredhead/lucid-kit";

/**
 * Factory map from adapter key strings (as stored in form schema
 * JSON) to {@link TextAdapter} constructors.
 *
 * @internal
 */
const ADAPTER_FACTORIES: Readonly<Record<string, () => TextAdapter>> = {
  email: () => new EmailTextAdapter(),
  url: () => new UrlTextAdapter(),
  ip: () => new IPAddressTextAdapter(),
  phone: () => new PhoneTextAdapter(),
  creditCard: () => new CreditCardTextAdapter(),
  money: () => new MoneyTextAdapter(),
  integer: () => new IntegerTextAdapter(),
  float: () => new FloatTextAdapter(),
  decimal: () => new DecimalTextAdapter(),
  hexadecimal: () => new HexadecimalTextAdapter(),
  percentage: () => new PercentageTextAdapter(),
  date: () => new DateTextAdapter(),
  time: () => new TimeTextAdapter(),
  color: () => new ColorTextAdapter(),
  slug: () => new SlugTextAdapter(),
  uuid: () => new UuidTextAdapter(),
  cron: () => new CronTextAdapter(),
  uppercase: () => new UppercaseTextAdapter(),
};

/**
 * All available text adapter keys, in display order.
 */
export const TEXT_ADAPTER_KEYS = Object.keys(
  ADAPTER_FACTORIES,
) as readonly string[];

/**
 * Resolve a text adapter key to a {@link TextAdapter} instance.
 *
 * Returns `undefined` for empty/unknown keys.
 *
 * @param key Adapter key (e.g. `"email"`, `"phone"`, `"money"`).
 */
export function resolveTextAdapter(key: unknown): TextAdapter | undefined {
  if (typeof key !== "string" || !key) {
    return undefined;
  }
  return ADAPTER_FACTORIES[key]?.();
}
