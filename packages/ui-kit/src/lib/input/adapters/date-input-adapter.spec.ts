import { DateInputAdapter } from "./date-input-adapter";
import { UICalendarPanel } from "../../calendar-panel/calendar-panel.component";
import { isPopupAdapter } from "./popup-text-adapter";

describe("DateInputAdapter", () => {
  it("should create with default options", () => {
    const adapter = new DateInputAdapter();
    expect(adapter).toBeTruthy();
    expect(adapter.prefixIcon).toBeTruthy();
  });

  it("should be detected as a popup adapter", () => {
    const adapter = new DateInputAdapter();
    expect(isPopupAdapter(adapter)).toBe(true);
  });

  it("should reference UICalendarPanel as the popup panel", () => {
    const adapter = new DateInputAdapter();
    expect(adapter.popupPanel).toBe(UICalendarPanel);
  });

  describe("toValue", () => {
    it("should trim whitespace", () => {
      const adapter = new DateInputAdapter();
      expect(adapter.toValue("  2026-03-15  ")).toBe("2026-03-15");
    });

    it("should return empty string for empty input", () => {
      const adapter = new DateInputAdapter();
      expect(adapter.toValue("")).toBe("");
    });
  });

  describe("validate", () => {
    it("should accept empty input", () => {
      const adapter = new DateInputAdapter({ format: "yyyy-MM-dd" });
      expect(adapter.validate("").valid).toBe(true);
    });

    it("should accept valid ISO date", () => {
      const adapter = new DateInputAdapter({ format: "yyyy-MM-dd" });
      expect(adapter.validate("2026-03-15").valid).toBe(true);
    });

    it("should reject invalid date text", () => {
      const adapter = new DateInputAdapter({ format: "yyyy-MM-dd" });
      const result = adapter.validate("not-a-date");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should reject date before min", () => {
      const adapter = new DateInputAdapter({
        format: "yyyy-MM-dd",
        min: new Date(2026, 2, 10),
      });
      const result = adapter.validate("2026-03-05");
      expect(result.valid).toBe(false);
    });

    it("should reject date after max", () => {
      const adapter = new DateInputAdapter({
        format: "yyyy-MM-dd",
        max: new Date(2026, 2, 20),
      });
      const result = adapter.validate("2026-03-25");
      expect(result.valid).toBe(false);
    });

    it("should accept date within range", () => {
      const adapter = new DateInputAdapter({
        format: "yyyy-MM-dd",
        min: new Date(2026, 2, 1),
        max: new Date(2026, 2, 31),
      });
      expect(adapter.validate("2026-03-15").valid).toBe(true);
    });

    it("should validate with dd/MM/yyyy format", () => {
      const adapter = new DateInputAdapter({ format: "dd/MM/yyyy" });
      expect(adapter.validate("15/03/2026").valid).toBe(true);
      expect(adapter.validate("2026-03-15").valid).toBe(false);
    });
  });

  describe("popupInputs", () => {
    it("should return configured format, min, max, and firstDayOfWeek", () => {
      const min = new Date(2026, 0, 1);
      const max = new Date(2026, 11, 31);
      const adapter = new DateInputAdapter({
        format: "dd/MM/yyyy",
        min,
        max,
        firstDayOfWeek: 0,
      });

      const inputs = adapter.popupInputs!("15/03/2026");
      expect(inputs["currentValue"]).toBe("15/03/2026");
      expect(inputs["format"]).toBe("dd/MM/yyyy");
      expect(inputs["min"]).toBe(min);
      expect(inputs["max"]).toBe(max);
      expect(inputs["firstDayOfWeek"]).toBe(0);
    });
  });

  describe("fromPopupValue", () => {
    it("should format a Date as ISO string", () => {
      const adapter = new DateInputAdapter({ format: "yyyy-MM-dd" });
      const result = adapter.fromPopupValue(new Date(2026, 2, 15));
      expect(result).toBe("2026-03-15");
    });

    it("should format a Date using configured format", () => {
      const adapter = new DateInputAdapter({ format: "dd/MM/yyyy" });
      const result = adapter.fromPopupValue(new Date(2026, 2, 15));
      expect(result).toBe("15/03/2026");
    });
  });
});
