import {
  type EnvironmentProviders,
  inject,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
  type Provider,
} from "@angular/core";

import type { TextAdapter } from "./text-adapter";

/**
 * Describes an adapter available in the registry.
 */
export interface TextAdapterRegistration {

  /** Human-readable label shown in UI pickers (e.g. "Email"). */
  readonly label: string;

  /** Factory that creates a new adapter instance. */
  readonly create: () => TextAdapter;
}

/**
 * Multi-provider token that collects adapter registrations.
 *
 * Use {@link provideTextAdapters} to supply entries.
 */
export const TEXT_ADAPTER_REGISTRATIONS = new InjectionToken<
  ReadonlyMap<string, TextAdapterRegistration>
>("TEXT_ADAPTER_REGISTRATIONS", {
  factory: () => new Map(),
});

/**
 * Register text adapters for use with `UIInput`.
 *
 * Call this in your application config or a feature module's providers
 * to make adapters available via the {@link TextAdapterRegistry}.
 *
 * @example
 * ```ts
 * // app.config.ts
 * import { provideTextAdapters, EmailTextAdapter, UrlTextAdapter } from '@theredhead/lucid-kit';
 *
 * export const appConfig = {
 *   providers: [
 *     provideTextAdapters({
 *       email: { label: 'Email',   create: () => new EmailTextAdapter() },
 *       url:   { label: 'URL',     create: () => new UrlTextAdapter() },
 *     }),
 *   ],
 * };
 * ```
 */
export function provideTextAdapters(
  adapters: Readonly<Record<string, TextAdapterRegistration>>,
): EnvironmentProviders {
  const map = new Map(Object.entries(adapters));
  return makeEnvironmentProviders([
    {
      provide: TEXT_ADAPTER_REGISTRATIONS,
      useValue: map,
    } satisfies Provider,
  ]);
}

/**
 * Injectable service that resolves adapter keys to {@link TextAdapter} instances.
 *
 * Consumers can look up registered adapters by key or list all available
 * registrations for building dynamic UIs (e.g. a dropdown of adapter choices).
 *
 * @example
 * ```ts
 * const registry = inject(TextAdapterRegistry);
 * const adapter = registry.create('email'); // TextAdapter | undefined
 * const all = registry.entries();           // Map<string, TextAdapterRegistration>
 * ```
 */
@Injectable({ providedIn: "root" })
export class TextAdapterRegistry {
  private readonly registrations = inject(TEXT_ADAPTER_REGISTRATIONS, {
    optional: true,
  }) as ReadonlyMap<string, TextAdapterRegistration> | null;

  /**
   * Create an adapter instance by key.
   *
   * @returns A new adapter, or `undefined` if the key is not registered.
   */
  public create(key: string): TextAdapter | undefined {
    return this.registrations?.get(key)?.create();
  }

  /**
   * Returns all registered adapter entries.
   */
  public entries(): ReadonlyMap<string, TextAdapterRegistration> {
    return this.registrations ?? new Map();
  }

  /**
   * Returns true if an adapter with the given key is registered.
   */
  public has(key: string): boolean {
    return this.registrations?.has(key) ?? false;
  }

  /**
   * Returns all registered keys.
   */
  public keys(): IterableIterator<string> {
    return (this.registrations ?? new Map()).keys();
  }
}
