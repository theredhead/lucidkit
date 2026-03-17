import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { PopoverRef } from "../popover/popover.types";
import type { CalendarEvent, CalendarMonthDay } from "./calendar.types";

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
  host: { class: "ui-calendar-day-popover" },
  styles: [
    `
      :host {
        display: block;
        padding: 0.5rem;
        font-family:
          system-ui,
          -apple-system,
          sans-serif;
        min-width: 180px;
      }

      .popover-header {
        margin-bottom: 0.375rem;
        padding-bottom: 0.375rem;
        border-bottom: 1px solid var(--theredhead-outline-variant, #e5e7eb);
      }

      .popover-title {
        font-size: 0.8rem;
        font-weight: 600;
      }

      .popover-events {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .popover-event {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.25rem 0.375rem;
        border-radius: 4px;
        border: none;
        background: none;
        color: inherit;
        cursor: pointer;
        font: inherit;
        font-size: 0.75rem;
        text-align: left;
        width: 100%;
        transition: background-color 0.15s;

        &:hover {
          background: color-mix(in srgb, currentColor 8%, transparent);
        }
      }

      .popover-dot {
        flex-shrink: 0;
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }

      .popover-event-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
      }

      .popover-event-time {
        flex-shrink: 0;
        font-size: 0.65rem;
        opacity: 0.6;
        margin-left: auto;
      }
    `,
  ],
  template: `
    <div class="popover-header">
      <span class="popover-title">{{ dateLabel() }}</span>
    </div>
    <div class="popover-events">
      @for (evt of day().events; track evt.id) {
        <button type="button" class="popover-event" (click)="onEventClick(evt)">
          <span class="popover-dot" [style.background-color]="evt.color"></span>
          <span class="popover-event-title">{{ evt.title }}</span>
          @if (!evt.allDay) {
            <span class="popover-event-time">{{ formatTime(evt.start) }}</span>
          }
        </button>
      }
    </div>
  `,
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
