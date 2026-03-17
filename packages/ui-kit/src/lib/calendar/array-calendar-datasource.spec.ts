import { describe, expect, it, vi } from "vitest";
import { ArrayCalendarDatasource } from "./array-calendar-datasource";
import type { CalendarEvent } from "./calendar.types";

function makeEvent(
  id: string,
  title: string,
  start: Date,
  end?: Date,
  opts?: Partial<CalendarEvent>,
): CalendarEvent {
  return { id, title, start, end, ...opts };
}

describe("ArrayCalendarDatasource", () => {
  describe("construction", () => {
    it("should create with no initial events", () => {
      const ds = new ArrayCalendarDatasource();
      expect(ds.length).toBe(0);
    });

    it("should create with initial events", () => {
      const events = [
        makeEvent("1", "A", new Date(2025, 2, 1)),
        makeEvent("2", "B", new Date(2025, 2, 2)),
      ];
      const ds = new ArrayCalendarDatasource(events);
      expect(ds.length).toBe(2);
    });

    it("should defensively copy initial events", () => {
      const events = [makeEvent("1", "A", new Date(2025, 2, 1))];
      const ds = new ArrayCalendarDatasource(events);
      events.push(makeEvent("2", "B", new Date(2025, 2, 2)));
      expect(ds.length).toBe(1);
    });
  });

  describe("getEvents", () => {
    const events = [
      makeEvent("1", "Jan", new Date(2025, 0, 15)),
      makeEvent("2", "Feb", new Date(2025, 1, 10)),
      makeEvent("3", "Mar", new Date(2025, 2, 5)),
      makeEvent("4", "Mar end", new Date(2025, 2, 28)),
      makeEvent("5", "Apr", new Date(2025, 3, 1)),
    ];
    const ds = new ArrayCalendarDatasource(events);

    it("should return events within the range", () => {
      const result = ds.getEvents(new Date(2025, 2, 1), new Date(2025, 2, 31));
      expect(result.length).toBe(2);
      expect(result.map((e) => e.id)).toEqual(["3", "4"]);
    });

    it("should include events that start on the range boundary", () => {
      const result = ds.getEvents(new Date(2025, 2, 5), new Date(2025, 2, 5));
      expect(result.length).toBe(1);
      expect(result[0].id).toBe("3");
    });

    it("should return empty for a range with no events", () => {
      const result = ds.getEvents(new Date(2024, 0, 1), new Date(2024, 11, 31));
      expect(result.length).toBe(0);
    });

    it("should handle multi-day events spanning into the range", () => {
      const multiDs = new ArrayCalendarDatasource([
        makeEvent(
          "m1",
          "Conference",
          new Date(2025, 2, 3),
          new Date(2025, 2, 7),
        ),
      ]);
      // Query March 5–6, event spans 3–7 so should be included
      const result = multiDs.getEvents(
        new Date(2025, 2, 5),
        new Date(2025, 2, 6),
      );
      expect(result.length).toBe(1);
    });

    it("should handle multi-day events ending in the range", () => {
      const multiDs = new ArrayCalendarDatasource([
        makeEvent("m1", "Trip", new Date(2025, 1, 28), new Date(2025, 2, 2)),
      ]);
      const result = multiDs.getEvents(
        new Date(2025, 2, 1),
        new Date(2025, 2, 31),
      );
      expect(result.length).toBe(1);
    });
  });

  describe("addEvent", () => {
    it("should add an event and increase length", () => {
      const ds = new ArrayCalendarDatasource();
      ds.addEvent(makeEvent("1", "New", new Date(2025, 2, 1)));
      expect(ds.length).toBe(1);
    });

    it("should emit changed", () => {
      const ds = new ArrayCalendarDatasource();
      const spy = vi.fn();
      ds.changed.subscribe(spy);
      ds.addEvent(makeEvent("1", "New", new Date(2025, 2, 1)));
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe("addEvents", () => {
    it("should add multiple events at once", () => {
      const ds = new ArrayCalendarDatasource();
      ds.addEvents([
        makeEvent("1", "A", new Date(2025, 2, 1)),
        makeEvent("2", "B", new Date(2025, 2, 2)),
      ]);
      expect(ds.length).toBe(2);
    });

    it("should emit changed once", () => {
      const ds = new ArrayCalendarDatasource();
      const spy = vi.fn();
      ds.changed.subscribe(spy);
      ds.addEvents([
        makeEvent("1", "A", new Date(2025, 2, 1)),
        makeEvent("2", "B", new Date(2025, 2, 2)),
      ]);
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe("removeEvent", () => {
    it("should remove an event by id", () => {
      const ds = new ArrayCalendarDatasource([
        makeEvent("1", "A", new Date(2025, 2, 1)),
        makeEvent("2", "B", new Date(2025, 2, 2)),
      ]);
      const removed = ds.removeEvent("1");
      expect(removed).toBe(true);
      expect(ds.length).toBe(1);
    });

    it("should return false when id not found", () => {
      const ds = new ArrayCalendarDatasource([
        makeEvent("1", "A", new Date(2025, 2, 1)),
      ]);
      const removed = ds.removeEvent("999");
      expect(removed).toBe(false);
    });

    it("should emit changed only when an event was removed", () => {
      const ds = new ArrayCalendarDatasource([
        makeEvent("1", "A", new Date(2025, 2, 1)),
      ]);
      const spy = vi.fn();
      ds.changed.subscribe(spy);
      ds.removeEvent("999");
      expect(spy).not.toHaveBeenCalled();
      ds.removeEvent("1");
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe("updateEvent", () => {
    it("should replace an existing event by id", () => {
      const ds = new ArrayCalendarDatasource([
        makeEvent("1", "Old", new Date(2025, 2, 1)),
      ]);
      ds.updateEvent(makeEvent("1", "Updated", new Date(2025, 2, 1)));
      const all = ds.getAllEvents();
      expect(all[0].title).toBe("Updated");
    });

    it("should append if id not found", () => {
      const ds = new ArrayCalendarDatasource();
      ds.updateEvent(makeEvent("1", "New", new Date(2025, 2, 1)));
      expect(ds.length).toBe(1);
    });

    it("should emit changed", () => {
      const ds = new ArrayCalendarDatasource();
      const spy = vi.fn();
      ds.changed.subscribe(spy);
      ds.updateEvent(makeEvent("1", "A", new Date(2025, 2, 1)));
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe("setEvents", () => {
    it("should replace all events", () => {
      const ds = new ArrayCalendarDatasource([
        makeEvent("1", "A", new Date(2025, 2, 1)),
        makeEvent("2", "B", new Date(2025, 2, 2)),
      ]);
      ds.setEvents([makeEvent("3", "C", new Date(2025, 2, 3))]);
      expect(ds.length).toBe(1);
      expect(ds.getAllEvents()[0].id).toBe("3");
    });

    it("should emit changed", () => {
      const ds = new ArrayCalendarDatasource();
      const spy = vi.fn();
      ds.changed.subscribe(spy);
      ds.setEvents([]);
      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe("getAllEvents", () => {
    it("should return a snapshot copy", () => {
      const ds = new ArrayCalendarDatasource([
        makeEvent("1", "A", new Date(2025, 2, 1)),
      ]);
      const snapshot = ds.getAllEvents();
      // Mutating snapshot should not affect the datasource
      (snapshot as CalendarEvent[]).push(
        makeEvent("2", "B", new Date(2025, 2, 2)),
      );
      expect(ds.length).toBe(1);
    });
  });
});
