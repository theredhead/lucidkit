/**
 * Read-only contract for an unordered collection of registered values.
 */
export interface IRegistry<T> {
  /**
   * Number of registered values.
   */
  readonly size: number;

  /**
   * Returns `true` when the value is registered.
   */
  has(value: T): boolean;

  /**
   * Returns all registered values.
   */
  values(): IterableIterator<T>;

  /**
   * Returns a stable snapshot of the registered values.
   */
  toArray(): readonly T[];
}

/**
 * Mutable set-like registry implementation.
 */
export class Registry<T> implements IRegistry<T> {
  protected readonly store: Set<T>;

  public constructor(values?: Iterable<T>) {
    this.store = new Set(values);
  }

  /**
   * Number of registered values.
   */
  public get size(): number {
    return this.store.size;
  }

  /**
   * Registers a value.
   */
  public register(value: T): void {
    this.store.add(value);
  }

  /**
   * Removes a registered value.
   */
  public unregister(value: T): void {
    this.store.delete(value);
  }

  /**
   * Removes all registered values.
   */
  public clear(): void {
    this.store.clear();
  }

  /** @inheritdoc */
  public has(value: T): boolean {
    return this.store.has(value);
  }

  /** @inheritdoc */
  public values(): IterableIterator<T> {
    return this.store.values();
  }

  /** @inheritdoc */
  public toArray(): readonly T[] {
    return Array.from(this.store.values());
  }
}

/**
 * Read-only contract for a registry whose values are addressed by key.
 */
export interface IKeyedRegistry<T> {
  /**
   * Number of registered entries.
   */
  readonly size: number;

  /**
   * Returns `true` when an entry exists for the key.
   */
  has(key: string): boolean;

  /**
   * Looks up a registered entry by key.
   */
  get(key: string): T | undefined;

  /**
   * Returns all registered keys.
   */
  keys(): IterableIterator<string>;

  /**
   * Returns all registered values.
   */
  values(): IterableIterator<T>;

  /**
   * Returns all registered key-value pairs.
   */
  entries(): IterableIterator<[string, T]>;

  /**
   * Returns a stable snapshot of the registered entries.
   */
  toMap(): ReadonlyMap<string, T>;

  /**
   * Returns a stable snapshot of the registered values.
   */
  toArray(): readonly T[];
}

/**
 * Mutable map-like registry implementation.
 */
export class KeyedRegistry<T> implements IKeyedRegistry<T> {
  protected readonly store: Map<string, T>;

  public constructor(entries?: Iterable<readonly [string, T]>) {
    this.store = new Map(entries);
  }

  /**
   * Number of registered entries.
   */
  public get size(): number {
    return this.store.size;
  }

  /**
   * Registers or replaces an entry.
   */
  public register(key: string, value: T): void {
    this.store.set(key, value);
  }

  /**
   * Removes a registered entry.
   */
  public unregister(key: string): void {
    this.store.delete(key);
  }

  /**
   * Removes all registered entries.
   */
  public clear(): void {
    this.store.clear();
  }

  /** @inheritdoc */
  public has(key: string): boolean {
    return this.store.has(key);
  }

  /** @inheritdoc */
  public get(key: string): T | undefined {
    return this.store.get(key);
  }

  /** @inheritdoc */
  public keys(): IterableIterator<string> {
    return this.store.keys();
  }

  /** @inheritdoc */
  public values(): IterableIterator<T> {
    return this.store.values();
  }

  /** @inheritdoc */
  public entries(): IterableIterator<[string, T]> {
    return this.store.entries();
  }

  /** @inheritdoc */
  public toMap(): ReadonlyMap<string, T> {
    return new Map(this.store);
  }

  /** @inheritdoc */
  public toArray(): readonly T[] {
    return Array.from(this.store.values());
  }
}
