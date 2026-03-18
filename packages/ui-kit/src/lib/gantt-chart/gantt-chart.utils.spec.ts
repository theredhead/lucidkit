import {
  addDays,
  buildTimeline,
  computeBarPosition,
  computeDateRange,
  computeTodayPosition,
  daysBetween,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "./gantt-chart.utils";
import type { GanttTask } from "./gantt-chart.types";

describe("gantt-chart.utils", () => {
  // ── startOfDay ─────────────────────────────────────────────────────

  describe("startOfDay", () => {
    it("should strip time to midnight UTC", () => {
      const d = new Date("2026-03-15T14:30:00Z");
      const result = startOfDay(d);
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);
      expect(result.getUTCDate()).toBe(15);
    });
  });

  // ── daysBetween ────────────────────────────────────────────────────

  describe("daysBetween", () => {
    it("should return 0 for the same date", () => {
      const d = new Date("2026-03-15");
      expect(daysBetween(d, d)).toBe(0);
    });

    it("should return positive for later date", () => {
      const a = new Date("2026-03-01");
      const b = new Date("2026-03-10");
      expect(daysBetween(a, b)).toBe(9);
    });

    it("should return negative for earlier date", () => {
      const a = new Date("2026-03-10");
      const b = new Date("2026-03-01");
      expect(daysBetween(a, b)).toBe(-9);
    });
  });

  // ── addDays ────────────────────────────────────────────────────────

  describe("addDays", () => {
    it("should add positive days", () => {
      const d = new Date("2026-03-01");
      const result = addDays(d, 5);
      expect(result.getDate()).toBe(6);
    });

    it("should subtract with negative days", () => {
      const d = new Date("2026-03-10");
      const result = addDays(d, -3);
      expect(result.getDate()).toBe(7);
    });

    it("should not mutate the original", () => {
      const d = new Date("2026-03-01");
      addDays(d, 5);
      expect(d.getDate()).toBe(1);
    });
  });

  // ── startOfWeek ────────────────────────────────────────────────────

  describe("startOfWeek", () => {
    it("should return Monday for a Wednesday", () => {
      // 2026-03-18 is a Wednesday
      const d = new Date("2026-03-18");
      const result = startOfWeek(d);
      expect(result.getUTCDay()).toBe(1); // Monday
      expect(result.getUTCDate()).toBe(16);
    });

    it("should return the same day for a Monday", () => {
      const d = new Date("2026-03-16"); // Monday
      const result = startOfWeek(d);
      expect(result.getUTCDate()).toBe(16);
    });

    it("should return previous Monday for a Sunday", () => {
      const d = new Date("2026-03-22"); // Sunday
      const result = startOfWeek(d);
      expect(result.getUTCDay()).toBe(1);
      expect(result.getUTCDate()).toBe(16);
    });
  });

  // ── startOfMonth ───────────────────────────────────────────────────

  describe("startOfMonth", () => {
    it("should return the 1st of the month", () => {
      const d = new Date("2026-03-18");
      const result = startOfMonth(d);
      expect(result.getUTCDate()).toBe(1);
      expect(result.getUTCMonth()).toBe(2); // March
    });
  });

  // ── computeDateRange ──────────────────────────────────────────────

  describe("computeDateRange", () => {
    it("should return a 30-day range for empty tasks", () => {
      const range = computeDateRange([]);
      const days = daysBetween(range.start, range.end);
      expect(days).toBe(30);
    });

    it("should pad around the task range", () => {
      const tasks: GanttTask[] = [
        {
          id: "1",
          title: "A",
          start: new Date("2026-03-10"),
          end: new Date("2026-03-20"),
        },
      ];
      const range = computeDateRange(tasks, 3);
      // Start should be 3 days before March 10
      expect(range.start.getDate()).toBe(7);
      // End should be 3 days after March 20
      expect(range.end.getDate()).toBe(23);
    });

    it("should handle multiple tasks", () => {
      const tasks: GanttTask[] = [
        {
          id: "1",
          title: "A",
          start: new Date("2026-03-01"),
          end: new Date("2026-03-10"),
        },
        {
          id: "2",
          title: "B",
          start: new Date("2026-03-15"),
          end: new Date("2026-03-25"),
        },
      ];
      const range = computeDateRange(tasks, 2);
      // Min start is March 1, max end is March 25
      expect(daysBetween(range.start, new Date("2026-03-01"))).toBe(2);
      expect(daysBetween(new Date("2026-03-25"), range.end)).toBe(2);
    });
  });

  // ── buildTimeline ─────────────────────────────────────────────────

  describe("buildTimeline", () => {
    it("should build day-level columns", () => {
      const start = new Date("2026-03-01");
      const end = new Date("2026-03-05");
      const tl = buildTimeline(start, end, "day");

      expect(tl.totalDays).toBe(5);
      expect(tl.columns.length).toBe(5);
      expect(tl.columns[0].label).toBe("1");
      expect(tl.columns[4].label).toBe("5");
      expect(tl.groups.length).toBe(1);
    });

    it("should split day columns across months", () => {
      const start = new Date("2026-02-27");
      const end = new Date("2026-03-03");
      const tl = buildTimeline(start, end, "day");

      expect(tl.groups.length).toBe(2);
      // Feb: 27, 28 = 2 days; Mar: 1, 2, 3 = 3 days
      expect(tl.groups[0].span).toBe(2);
      expect(tl.groups[1].span).toBe(3);
    });

    it("should build week-level columns", () => {
      const start = new Date("2026-03-01");
      const end = new Date("2026-03-31");
      const tl = buildTimeline(start, end, "week");

      expect(tl.columns.length).toBeGreaterThan(0);
      // Each column spans 7 days
      for (const col of tl.columns) {
        expect(col.span).toBe(7);
      }
    });

    it("should build month-level columns", () => {
      const start = new Date("2026-01-01");
      const end = new Date("2026-06-30");
      const tl = buildTimeline(start, end, "month");

      expect(tl.columns.length).toBe(6);
      expect(tl.groups.length).toBe(1); // all in 2026
      expect(tl.groups[0].label).toBe("2026");
    });

    it("should split month columns across years", () => {
      const start = new Date("2025-11-01");
      const end = new Date("2026-02-28");
      const tl = buildTimeline(start, end, "month");

      expect(tl.groups.length).toBe(2); // 2025 and 2026
    });
  });

  // ── computeBarPosition ─────────────────────────────────────────────

  describe("computeBarPosition", () => {
    it("should compute left and width as percentages", () => {
      const rangeStart = new Date("2026-03-01");
      const totalDays = 31;
      const task: GanttTask = {
        id: "1",
        title: "A",
        start: new Date("2026-03-06"),
        end: new Date("2026-03-10"),
      };
      const pos = computeBarPosition(task, rangeStart, totalDays);

      // 5 days offset / 31 total ≈ 16.1%
      expect(pos.left).toBeCloseTo(16.13, 1);
      // 5 days duration / 31 total ≈ 16.1%
      expect(pos.width).toBeCloseTo(16.13, 1);
    });

    it("should clamp left to 0", () => {
      const rangeStart = new Date("2026-03-10");
      const task: GanttTask = {
        id: "1",
        title: "A",
        start: new Date("2026-03-05"),
        end: new Date("2026-03-15"),
      };
      const pos = computeBarPosition(task, rangeStart, 30);
      expect(pos.left).toBe(0);
    });

    it("should enforce minimum width of 0.5%", () => {
      const rangeStart = new Date("2026-03-01");
      const task: GanttTask = {
        id: "1",
        title: "A",
        start: new Date("2026-03-01"),
        end: new Date("2026-03-01"),
      };
      // 1 day out of 365 total = 0.27%, should be clamped to 0.5
      const pos = computeBarPosition(task, rangeStart, 365);
      expect(pos.width).toBeGreaterThanOrEqual(0.5);
    });
  });

  // ── computeTodayPosition ───────────────────────────────────────────

  describe("computeTodayPosition", () => {
    it("should return null if today is before range", () => {
      const futureStart = new Date("2099-01-01");
      const result = computeTodayPosition(futureStart, 30);
      expect(result).toBeNull();
    });

    it("should return null if today is after range", () => {
      const pastStart = new Date("2000-01-01");
      const result = computeTodayPosition(pastStart, 30);
      expect(result).toBeNull();
    });

    it("should return a percentage when today is in range", () => {
      const today = startOfDay(new Date());
      const rangeStart = addDays(today, -5);
      const result = computeTodayPosition(rangeStart, 30);
      expect(result).not.toBeNull();
      expect(result!).toBeGreaterThanOrEqual(0);
      expect(result!).toBeLessThanOrEqual(100);
    });
  });
});
