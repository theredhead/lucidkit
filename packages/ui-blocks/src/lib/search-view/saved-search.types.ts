import type { FilterDescriptor } from "@theredhead/lucid-kit";

/**
 * A named, serialisable saved search — stores the filter state so it
 * can be recalled later.
 *
 * @typeParam T - The row object type (carried through for
 *   {@link FilterDescriptor} typing).
 */
export interface SavedSearch<T = unknown> {
  /** Unique identifier (UUID). */
  readonly id: string;

  /** Human-readable display name chosen by the user. */
  readonly name: string;

  /** The persisted filter descriptor (junction + rules). */
  readonly descriptor: FilterDescriptor<T>;

  /** ISO-8601 timestamp of when the search was saved. */
  readonly savedAt: string;
}
