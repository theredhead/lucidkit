import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { PopoverRef } from "../popover/popover.types";
import type { CalendarEvent, CalendarMonthDay } from "./calendar.types";
import { UISurface } from '@theredhead/lucid-foundation';

/**
 * Popover content component that displays all events for a given
 * calendar day. Rendered inside a {@link PopoverService} popover
 * when the user clicks a day cell that contains events.
 *
 * @internal
 */
@Component({
  selector: "ui-calendar-day-popover",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: { class: "ui-calendar-day-popover" },
  styleUrl: "./calendar-day-popover.component.scss",
  templateUrl: "./calendar-day-popover.component.html",
})
export class UICalendarDayPopover {
  // ── Injected ────────────────────────────────────────────────────

  /** @internal */
  public readonly popoverRef = inject(PopoverRef<CalendarEvent | undefined>);

  // ── Inputs ──────────────────────────────────────────────────────

  /** The day whose events to display. */
  public readonly day = input.required<CalendarMonthDay>();

  // ── Computed ────────────────────────────────────────────────────

  /** Formatted date label for the popover header. */
  protected readonly dateLabel = computed(() => {
    const d = this.day().date;
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  });

  // ── Protected methods ───────────────────────────────────────────

  /** Select an event and close the popover, returning it. */
  protected onEventClick(evt: CalendarEvent): void {
    this.popoverRef.close(evt);
  }

  /** Format time for display (e.g. "9:00 AM"). */
  protected formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
}
