import { PercentageTextAdapter } from "./percentage-text-adapter";

describe("PercentageTextAdapter", () => {
  let adapter: PercentageTextAdapter;

  beforeEach(() => {
    adapter = new PercentageTextAdapter("en-US");
  });

  it("should have a prefix icon", () => {
    expect(adapter.prefixIcon).toBeTruthy();
  });

  describe("toValue", () => {
    it("should pass through simple numbers", () => {
      expect(adapter.toValue("75")).toBe("75");
    });

    it("should strip % sign", () => {
      expect(adapter.toValue("75%")).toBe("75");
    });

    it("should handle decimal percentages", () => {
      expect(adapter.toValue("12.5%")).toBe("12.5");
    });

    it("should strip thousands separators", () => {
      expect(adapter.toValue("1,000%")).toBe("1000");
    });

    it("should handle negative values", () => {
      expect(adapter.toValue("-3.5")).toBe("-3.5");
    });

    it("should return empty for empty string", () => {
      expect(adapter.toValue("")).toBe("");
    });

    it("should preserve lone minus", () => {
      expect(adapter.toValue("-")).toBe("-");
    });

    it("should preserve lone dot", () => {
      expect(adapter.toValue(".")).toBe(".");
    });

    it("should handle Infinity as empty", () => {
      // "Infinity" → strip non-numeric → "" after cleaning
      expect(adapter.toValue("Infinity")).toBe("");
    });
  });

  describe("toDisplayValue", () => {
    it("should return empty for empty string", () => {
      expect(adapter.toDisplayValue("")).toBe("");
    });

    it("should format number with locale separators", () => {
      expect(adapter.toDisplayValue("1234")).toBe("1,234");
    });

    it("should format decimal value", () => {
      expect(adapter.toDisplayValue("75.5")).toBe("75.5");
    });

    it("should return non-finite values as-is", () => {
      expect(adapter.toDisplayValue("abc")).toBe("abc");
    });
  });

  describe("validate", () => {
    it("should accept empty input", () => {
      expect(adapter.validate("").valid).toBe(true);
    });

    it("should accept valid percentage", () => {
      expect(adapter.validate("75").valid).toBe(true);
    });

    it("should accept percentage with % sign", () => {
      expect(adapter.validate("75%").valid).toBe(true);
    });

    it("should accept decimal percentage", () => {
      expect(adapter.validate("12.5").valid).toBe(true);
    });

    it("should accept negative percentage", () => {
      expect(adapter.validate("-3.5").valid).toBe(true);
    });

    it("should reject letters", () => {
      const result = adapter.validate("abc");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should reject double dots", () => {
      expect(adapter.validate("1.2.3").valid).toBe(false);
    });
  });
});
