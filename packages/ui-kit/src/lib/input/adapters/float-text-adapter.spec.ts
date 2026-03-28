import { FloatTextAdapter } from "./float-text-adapter";

describe("FloatTextAdapter", () => {
  let adapter: FloatTextAdapter;

  beforeEach(() => {
    adapter = new FloatTextAdapter("en-US");
  });

  it("should have a prefix icon", () => {
    expect(adapter.prefixIcon).toBeTruthy();
  });

  describe("toValue", () => {
    it("should pass through simple integers", () => {
      expect(adapter.toValue("42")).toBe("42");
    });

    it("should pass through decimal numbers", () => {
      expect(adapter.toValue("3.14")).toBe("3.14");
    });

    it("should strip thousands separators", () => {
      expect(adapter.toValue("1,234")).toBe("1234");
    });

    it("should strip non-numeric characters", () => {
      expect(adapter.toValue("$1,234.56")).toBe("1234.56");
    });

    it("should handle negative numbers", () => {
      expect(adapter.toValue("-5.5")).toBe("-5.5");
    });

    it("should return empty for empty string", () => {
      expect(adapter.toValue("")).toBe("");
    });

    it("should preserve lone minus sign", () => {
      expect(adapter.toValue("-")).toBe("-");
    });

    it("should preserve lone dot", () => {
      expect(adapter.toValue(".")).toBe(".");
    });

    it("should preserve minus-dot", () => {
      expect(adapter.toValue("-.")).toBe("-.");
    });

    it("should handle scientific notation", () => {
      expect(adapter.toValue("1e10")).toBe("10000000000");
    });

    it("should handle Infinity as raw string", () => {
      expect(adapter.toValue("Infinity")).toBe("");
    });
  });

  describe("toDisplayValue", () => {
    it("should return empty for empty string", () => {
      expect(adapter.toDisplayValue("")).toBe("");
    });

    it("should format integer with locale separators", () => {
      expect(adapter.toDisplayValue("1234")).toBe("1,234");
    });

    it("should format decimal number", () => {
      expect(adapter.toDisplayValue("3.14")).toBe("3.14");
    });

    it("should return non-finite values as-is", () => {
      expect(adapter.toDisplayValue("abc")).toBe("abc");
    });

    it("should preserve trailing-zero strings that differ from Number.toString", () => {
      // "1.10" parses to 1.1, so toString differs — return raw
      expect(adapter.toDisplayValue("1.10")).toBe("1.10");
    });
  });

  describe("validate", () => {
    it("should accept empty input", () => {
      expect(adapter.validate("").valid).toBe(true);
    });

    it("should accept whitespace-only input", () => {
      expect(adapter.validate("   ").valid).toBe(true);
    });

    it("should accept valid integer", () => {
      expect(adapter.validate("42").valid).toBe(true);
    });

    it("should accept valid decimal", () => {
      expect(adapter.validate("3.14").valid).toBe(true);
    });

    it("should accept negative numbers", () => {
      expect(adapter.validate("-7.5").valid).toBe(true);
    });

    it("should accept scientific notation", () => {
      expect(adapter.validate("1e5").valid).toBe(true);
    });

    it("should accept leading dot", () => {
      expect(adapter.validate(".5").valid).toBe(true);
    });

    it("should reject letters", () => {
      const result = adapter.validate("abc");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should reject mixed text", () => {
      expect(adapter.validate("12abc").valid).toBe(false);
    });

    it("should reject double dots", () => {
      expect(adapter.validate("1.2.3").valid).toBe(false);
    });
  });
});
