import { describe, it, expect } from "vitest";

import {
  getLocaleFormat,
  getLocaleFirstDayOfWeek,
  getSeparator,
  formatDate,
  parseDate,
  buildCalendarGrid,
  normalizeDate,
  getWeekdayLabels,
  getPlaceholder,
  isSameMonth,
} from "./date-picker.utils";
import type { DateFormat } from "./date-picker.types";

describe("date-picker.utils", () => {
  // ── getLocaleFormat ─────────────────────────────────────────────

  describe("getLocaleFormat", () => {
    it("should return a valid DateFormat for en-US", () => {
      const fmt = getLocaleFormat("en-US");
      expect(fmt).toBe("MM/dd/yyyy");
    });

    it("should return a valid DateFormat for de-DE", () => {
      const fmt = getLocaleFormat("de-DE");
      expect(fmt).toBe("dd.MM.yyyy");
    });

    it("should return yyyy-MM-dd for ja-JP (year-first)", () => {
      const fmt = getLocaleFormat("ja-JP");
      expect(fmt).toBe("yyyy/MM/dd");
    });

    it("should return a DateFormat when no locale is specified", () => {
      const fmt = getLocaleFormat();
      const validFormats: DateFormat[] = [
        "yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy",
        "dd.MM.yyyy", "dd-MM-yyyy", "yyyy/MM/dd",
      ];
      expect(validFormats).toContain(fmt);
    });
  });

  // ── getLocaleFirstDayOfWeek ─────────────────────────────────────

  describe("getLocaleFirstDayOfWeek", () => {
    it("should return a number 0–6", () => {
      const day = getLocaleFirstDayOfWeek("en-US");
      expect(day).toBeGreaterThanOrEqual(0);
      expect(day).toBeLessThanOrEqual(6);
    });

    it("should return a value for the default locale", () => {
      const day = getLocaleFirstDayOfWeek();
      expect(typeof day).toBe("number");
    });
  });

  // ── getSeparator ────────────────────────────────────────────────

  describe("getSeparator", () => {
    it("should return / for slash formats", () => {
      expect(getSeparator("dd/MM/yyyy")).toBe("/");
      expect(getSeparator("MM/dd/yyyy")).toBe("/");
      expect(getSeparator("yyyy/MM/dd")).toBe("/");
    });

    it("should return . for dot format", () => {
      expect(getSeparator("dd.MM.yyyy")).toBe(".");
    });

    it("should return - for dash formats", () => {
      expect(getSeparator("yyyy-MM-dd")).toBe("-");
      expect(getSeparator("dd-MM-yyyy")).toBe("-");
    });
  });

  // ── formatDate ──────────────────────────────────────────────────

  describe("formatDate", () => {
    const date = new Date(2025, 2, 5); // March 5, 2025

    it("should format yyyy-MM-dd", () => {
      expect(formatDate(date, "yyyy-MM-dd")).toBe("2025-03-05");
    });

    it("should format dd/MM/yyyy", () => {
      expect(formatDate(date, "dd/MM/yyyy")).toBe("05/03/2025");
    });

    it("should format MM/dd/yyyy", () => {
      expect(formatDate(date, "MM/dd/yyyy")).toBe("03/05/2025");
    });

    it("should format dd.MM.yyyy", () => {
      expect(formatDate(date, "dd.MM.yyyy")).toBe("05.03.2025");
    });

    it("should format dd-MM-yyyy", () => {
      expect(formatDate(date, "dd-MM-yyyy")).toBe("05-03-2025");
    });

    it("should format yyyy/MM/dd", () => {
      expect(formatDate(date, "yyyy/MM/dd")).toBe("2025/03/05");
    });

    it("should return empty string for null date", () => {
      expect(formatDate(null, "yyyy-MM-dd")).toBe("");
    });

    it("should return empty string for invalid date", () => {
      expect(formatDate(new Date("invalid"), "yyyy-MM-dd")).toBe("");
    });
  });

  // ── parseDate ───────────────────────────────────────────────────

  describe("parseDate", () => {
    it("should parse yyyy-MM-dd", () => {
      const d = parseDate("2025-03-05", "yyyy-MM-dd")!;
      expect(d.getFullYear()).toBe(2025);
      expect(d.getMonth()).toBe(2);
      expect(d.getDate()).toBe(5);
    });

    it("should parse dd/MM/yyyy", () => {
      const d = parseDate("05/03/2025", "dd/MM/yyyy")!;
      expect(d.getFullYear()).toBe(2025);
      expect(d.getMonth()).toBe(2);
      expect(d.getDate()).toBe(5);
    });

    it("should parse MM/dd/yyyy", () => {
      const d = parseDate("03/05/2025", "MM/dd/yyyy")!;
      expect(d.getFullYear()).toBe(2025);
      expect(d.getMonth()).toBe(2);
      expect(d.getDate()).toBe(5);
    });

    it("should parse dd.MM.yyyy", () => {
      const d = parseDate("05.03.2025", "dd.MM.yyyy")!;
      expect(d.getDate()).toBe(5);
    });

    it("should parse dd-MM-yyyy", () => {
      const d = parseDate("05-03-2025", "dd-MM-yyyy")!;
      expect(d.getDate()).toBe(5);
    });

    it("should parse yyyy/MM/dd", () => {
      const d = parseDate("2025/03/05", "yyyy/MM/dd")!;
      expect(d.getFullYear()).toBe(2025);
    });

    it("should return null for wrong number of parts", () => {
      expect(parseDate("2025-03", "yyyy-MM-dd")).toBeNull();
    });

    it("should return null for non-numeric parts", () => {
      expect(parseDate("abcd-ef-gh", "yyyy-MM-dd")).toBeNull();
    });

    it("should return null for out-of-range month", () => {
      expect(parseDate("2025-13-01", "yyyy-MM-dd")).toBeNull();
      expect(parseDate("2025-00-01", "yyyy-MM-dd")).toBeNull();
    });

    it("should return null for out-of-range day", () => {
      expect(parseDate("2025-01-32", "yyyy-MM-dd")).toBeNull();
      expect(parseDate("2025-01-00", "yyyy-MM-dd")).toBeNull();
    });

    it("should return null for invalid dates like Feb 30", () => {
      expect(parseDate("2025-02-30", "yyyy-MM-dd")).toBeNull();
    });

    it("should return null for year < 1", () => {
      expect(parseDate("0000-01-01", "yyyy-MM-dd")).toBeNull();
    });
  });

  // ── buildCalendarGrid ───────────────────────────────────────────

  describe("buildCalendarGrid", () => {
    it("should return 42 days (6 weeks)", () => {
      const grid = buildCalendarGrid(
        new Date(2025, 0, 1), null, null, null, 0,
      );
      expect(grid).toHaveLength(42);
    });

    it("should mark current-month days", () => {
      const grid = buildCalendarGrid(
        new Date(2025, 0, 15), null, null, null, 0,
      );
      const janDays = grid.filter((d) => d.isCurrentMonth);
      expect(janDays.length).toBe(31); // January has 31 days
    });

    it("should mark the selected date", () => {
      const sel = new Date(2025, 0, 10);
      const grid = buildCalendarGrid(
        new Date(2025, 0, 1), sel, null, null, 0,
      );
      const selected = grid.filter((d) => d.isSelected);
      expect(selected).toHaveLength(1);
      expect(selected[0].day).toBe(10);
    });

    it("should disable dates before min", () => {
      const min = new Date(2025, 0, 10);
      const grid = buildCalendarGrid(
        new Date(2025, 0, 1), null, min, null, 0,
      );
      const disabled = grid.filter((d) => d.isDisabled && d.isCurrentMonth);
      // Days 1-9 of January should be disabled
      expect(disabled.length).toBe(9);
    });

    it("should disable dates after max", () => {
      const max = new Date(2025, 0, 20);
      const grid = buildCalendarGrid(
        new Date(2025, 0, 1), null, null, max, 0,
      );
      const disabled = grid.filter((d) => d.isDisabled && d.isCurrentMonth);
      // Days 21-31 of January should be disabled
      expect(disabled.length).toBe(11);
    });

    it("should respect firstDayOfWeek = 1 (Monday)", () => {
      const grid = buildCalendarGrid(
        new Date(2025, 0, 1), null, null, null, 1,
      );
      // First day in the grid should be a Monday (or earlier month day)
      expect(grid[0].date.getDay()).toBe(1); // Monday
    });

    it("should handle startDay < 0 adjustment", () => {
      // When firstDayOfWeek > the first day's weekday
      // e.g. first of month is Sunday (0) and firstDayOfWeek = 6 (Saturday)
      const grid = buildCalendarGrid(
        new Date(2025, 5, 1), null, null, null, 6, // June 1, 2025 is Sunday
      );
      expect(grid).toHaveLength(42);
    });
  });

  // ── normalizeDate ───────────────────────────────────────────────

  describe("normalizeDate", () => {
    it("should strip time information", () => {
      const d = normalizeDate(new Date(2025, 5, 15, 14, 30, 45));
      expect(d.getHours()).toBe(0);
      expect(d.getMinutes()).toBe(0);
      expect(d.getSeconds()).toBe(0);
      expect(d.getMilliseconds()).toBe(0);
    });

    it("should preserve date", () => {
      const d = normalizeDate(new Date(2025, 5, 15, 14, 30));
      expect(d.getFullYear()).toBe(2025);
      expect(d.getMonth()).toBe(5);
      expect(d.getDate()).toBe(15);
    });
  });

  // ── getWeekdayLabels ────────────────────────────────────────────

  describe("getWeekdayLabels", () => {
    it("should return 7 labels", () => {
      const labels = getWeekdayLabels(0);
      expect(labels).toHaveLength(7);
    });

    it("should start with Sunday when firstDayOfWeek is 0", () => {
      const labels = getWeekdayLabels(0);
      expect(labels[0].short).toBe("S");
      expect(labels[0].long).toBe("Sunday");
    });

    it("should start with Monday when firstDayOfWeek is 1", () => {
      const labels = getWeekdayLabels(1);
      expect(labels[0].short).toBe("M");
      expect(labels[0].long).toBe("Monday");
    });
  });

  // ── getPlaceholder ──────────────────────────────────────────────

  describe("getPlaceholder", () => {
    it("should return the format string as placeholder", () => {
      expect(getPlaceholder("yyyy-MM-dd")).toBe("yyyy-MM-dd");
    });
  });

  // ── isSameMonth ─────────────────────────────────────────────────

  describe("isSameMonth", () => {
    it("should return true for same month and year", () => {
      expect(isSameMonth(new Date(2025, 5, 1), new Date(2025, 5, 28))).toBe(true);
    });

    it("should return false for different months", () => {
      expect(isSameMonth(new Date(2025, 5, 1), new Date(2025, 6, 1))).toBe(false);
    });

    it("should return false for different years", () => {
      expect(isSameMonth(new Date(2025, 5, 1), new Date(2026, 5, 1))).toBe(false);
    });
  });
});
