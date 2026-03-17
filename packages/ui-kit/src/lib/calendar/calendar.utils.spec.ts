import { describe, expect, it } from "vitest";
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  toIsoDate,
  isSameDay,
  addMonths,
  isoWeekday,
  isoWeekNumber,
  WEEKDAY_LABELS,
} from "./calendar.utils";

describe("calendar.utils", () => {
  describe("startOfDay", () => {
    it("should set time to 00:00:00.000", () => {
      const d = startOfDay(new Date(2025, 2, 15, 14, 30, 45, 123));
      expect(d.getHours()).toBe(0);
      expect(d.getMinutes()).toBe(0);
      expect(d.getSeconds()).toBe(0);
      expect(d.getMilliseconds()).toBe(0);
    });

    it("should not mutate the original date", () => {
      const original = new Date(2025, 2, 15, 10, 0);
      startOfDay(original);
      expect(original.getHours()).toBe(10);
    });
  });

  describe("endOfDay", () => {
    it("should set time to 23:59:59.999", () => {
      const d = endOfDay(new Date(2025, 2, 15, 0, 0));
      expect(d.getHours()).toBe(23);
      expect(d.getMinutes()).toBe(59);
      expect(d.getSeconds()).toBe(59);
      expect(d.getMilliseconds()).toBe(999);
    });
  });

  describe("startOfMonth", () => {
    it("should return the 1st of the month", () => {
      const d = startOfMonth(new Date(2025, 2, 15));
      expect(d.getDate()).toBe(1);
      expect(d.getMonth()).toBe(2);
      expect(d.getFullYear()).toBe(2025);
    });
  });

  describe("endOfMonth", () => {
    it("should return the last day of the month", () => {
      const d = endOfMonth(new Date(2025, 1, 10)); // February 2025
      expect(d.getDate()).toBe(28);
      expect(d.getMonth()).toBe(1);
    });

    it("should handle leap years", () => {
      const d = endOfMonth(new Date(2024, 1, 10)); // February 2024 (leap)
      expect(d.getDate()).toBe(29);
    });

    it("should handle months with 31 days", () => {
      const d = endOfMonth(new Date(2025, 0, 1)); // January
      expect(d.getDate()).toBe(31);
    });
  });

  describe("toIsoDate", () => {
    it("should format as YYYY-MM-DD", () => {
      expect(toIsoDate(new Date(2025, 0, 5))).toBe("2025-01-05");
    });

    it("should pad single-digit months and days", () => {
      expect(toIsoDate(new Date(2025, 2, 3))).toBe("2025-03-03");
    });

    it("should handle December", () => {
      expect(toIsoDate(new Date(2025, 11, 25))).toBe("2025-12-25");
    });
  });

  describe("isSameDay", () => {
    it("should return true for the same day", () => {
      expect(
        isSameDay(new Date(2025, 2, 15, 10, 0), new Date(2025, 2, 15, 22, 0)),
      ).toBe(true);
    });

    it("should return false for different days", () => {
      expect(isSameDay(new Date(2025, 2, 15), new Date(2025, 2, 16))).toBe(
        false,
      );
    });

    it("should return false for different months", () => {
      expect(isSameDay(new Date(2025, 2, 15), new Date(2025, 3, 15))).toBe(
        false,
      );
    });

    it("should return false for different years", () => {
      expect(isSameDay(new Date(2025, 2, 15), new Date(2026, 2, 15))).toBe(
        false,
      );
    });
  });

  describe("addMonths", () => {
    it("should add one month", () => {
      const d = addMonths(new Date(2025, 0, 15), 1);
      expect(d.getMonth()).toBe(1);
    });

    it("should subtract months with a negative value", () => {
      const d = addMonths(new Date(2025, 2, 15), -2);
      expect(d.getMonth()).toBe(0);
      expect(d.getFullYear()).toBe(2025);
    });

    it("should wrap around year boundary", () => {
      const d = addMonths(new Date(2025, 11, 15), 2);
      expect(d.getMonth()).toBe(1);
      expect(d.getFullYear()).toBe(2026);
    });

    it("should handle Jan 31 + 1 month without overflow", () => {
      const d = addMonths(new Date(2025, 0, 31), 1);
      expect(d.getMonth()).toBe(1); // February
    });
  });

  describe("isoWeekday", () => {
    it("should return 0 for Monday", () => {
      // 2025-03-17 is a Monday
      expect(isoWeekday(new Date(2025, 2, 17))).toBe(0);
    });

    it("should return 6 for Sunday", () => {
      // 2025-03-16 is a Sunday
      expect(isoWeekday(new Date(2025, 2, 16))).toBe(6);
    });

    it("should return 4 for Friday", () => {
      // 2025-03-14 is a Friday
      expect(isoWeekday(new Date(2025, 2, 14))).toBe(4);
    });
  });

  describe("isoWeekNumber", () => {
    it("should return 1 for January 1, 2025 (Wednesday)", () => {
      // 2025-01-01 is a Wednesday — week 1
      expect(isoWeekNumber(new Date(2025, 0, 1))).toBe(1);
    });

    it("should return 1 for December 29, 2025 (Monday)", () => {
      // 2025-12-29 is a Monday — ISO week 1 of 2026
      expect(isoWeekNumber(new Date(2025, 11, 29))).toBe(1);
    });

    it("should return 52 for December 28, 2025 (Sunday)", () => {
      expect(isoWeekNumber(new Date(2025, 11, 28))).toBe(52);
    });

    it("should return 10 for March 3, 2025 (Monday)", () => {
      expect(isoWeekNumber(new Date(2025, 2, 3))).toBe(10);
    });

    it("should return 12 for March 18, 2026 (Wednesday)", () => {
      expect(isoWeekNumber(new Date(2026, 2, 18))).toBe(12);
    });

    it("should handle Jan 1 that falls on a Friday (belongs to prev year week 53)", () => {
      // 2010-01-01 is a Friday — ISO week 53 of 2009
      expect(isoWeekNumber(new Date(2010, 0, 1))).toBe(53);
    });
  });

  describe("WEEKDAY_LABELS", () => {
    it("should have 7 entries", () => {
      expect(WEEKDAY_LABELS.length).toBe(7);
    });

    it("should start with Mon and end with Sun", () => {
      expect(WEEKDAY_LABELS[0]).toBe("Mon");
      expect(WEEKDAY_LABELS[6]).toBe("Sun");
    });
  });
});
