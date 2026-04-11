import { Emitter } from "@theredhead/lucid-foundation";
import type { CalendarDatasource, CalendarEvent } from "./calendar.types";

/**
 * In-memory {@link CalendarDatasource} backed by a plain array of events.
 *
 * Supports add, remove, update, and bulk-replace operations, each of
 * which triggers the `changed` emitter so the connected view refreshes.
 *
 * @typeParam T - Optional payload type attached to each event.
 *
 * @example
 * ```ts
 * const ds = new ArrayCalendarDatasource<MyPayload>([
 *   { id: '1', title: 'Standup', start: new Date(2025, 2, 17, 9, 0) },
 *   { id: '2', title: 'Lunch',   start: new Date(2025, 2, 17, 12, 0), allDay: true },
 * ]);
 *
 * // Query a date range
 * const march = ds.getEvents(new Date(2025, 2, 1), new Date(2025, 2, 31));
 *
 * // Mutate
 * ds.addEvent({ id: '3', title: 'Review', start: new Date(2025, 2, 18, 14, 0) });
 * ds.removeEvent('1');
 * ```
 */
export class ArrayCalendarDatasource<
  T = unknown,
> implements CalendarDatasource<T> {
  public readonly changed = new Emitter<void>();

  private events: CalendarEvent<T>[];

  /**
   * Creates an in-memory calendar datasource.
   *
   * @param initialEvents - Seed events (defensively copied).
   */
  public constructor(initialEvents: readonly CalendarEvent<T>[] = []) {
    this.events = [...initialEvents];
  }

  // ── Query ─────────────────────────────────────────────────────

  /** @inheritdoc */
  public getEvents(
    rangeStart: Date,
    rangeEnd: Date,
  ): readonly CalendarEvent<T>[] {
    const start = startOfDay(rangeStart);
    const end = endOfDay(rangeEnd);

    return this.events.filter((evt) => {
      const evtStart = evt.start;
      const evtEnd = evt.end ?? evt.start;
      return evtStart <= end && evtEnd >= start;
    });
  }

  // ── Mutation ──────────────────────────────────────────────────

  /**
   * Appends an event to the datasource.
   *
   * @param event - The event to add.
   */
  public addEvent(event: CalendarEvent<T>): void {
    this.events.push(event);
    this.changed.emit();
  }

  /**
   * Appends multiple events at once.
   *
   * @param events - Events to add.
   */
  public addEvents(events: readonly CalendarEvent<T>[]): void {
    this.events.push(...events);
    this.changed.emit();
  }

  /**
   * Removes an event by its `id`.
   *
   * @param id - The event ID to remove.
   * @returns `true` if an event was removed, `false` if not found.
   */
  public removeEvent(id: string): boolean {
    const before = this.events.length;
    this.events = this.events.filter((e) => e.id !== id);
    if (this.events.length !== before) {
      this.changed.emit();
      return true;
    }
    return false;
  }

  /**
   * Replaces an event with a matching `id`. If no match is found the
   * new event is appended instead.
   *
   * @param event - The updated event.
   */
  public updateEvent(event: CalendarEvent<T>): void {
    const idx = this.events.findIndex((e) => e.id === event.id);
    if (idx >= 0) {
      this.events[idx] = event;
    } else {
      this.events.push(event);
    }
    this.changed.emit();
  }

  /**
   * Replaces the entire event set.
   *
   * @param events - New events (defensively copied).
   */
  public setEvents(events: readonly CalendarEvent<T>[]): void {
    this.events = [...events];
    this.changed.emit();
  }

  /** Returns the total number of events currently held. */
  public get length(): number {
    return this.events.length;
  }

  /** Returns all events (snapshot copy). */
  public getAllEvents(): readonly CalendarEvent<T>[] {
    return [...this.events];
  }
}

// ── Date helpers ──────────────────────────────────────────────────

/** @internal */
function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

/** @internal */
function endOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(23, 59, 59, 999);
  return r;
}
