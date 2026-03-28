import { DecimalTextAdapter } from "./decimal-text-adapter";

describe("DecimalTextAdapter", () => {
  describe("default (2 decimal places)", () => {
    let adapter: DecimalTextAdapter;

    beforeEach(() => {
      adapter = new DecimalTextAdapter(2, "en-US");
    });

    it("should have a prefix icon", () => {
      expect(adapter.prefixIcon).toBeTruthy();
    });

    it("should default to 2 maxDecimals", () => {
      expect(adapter.maxDecimals).toBe(2);
    });

    describe("toValue", () => {
      it("should pass through integers", () => {
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

      it("should preserve lone minus", () => {
        expect(adapter.toValue("-")).toBe("-");
      });

      it("should preserve lone dot", () => {
        expect(adapter.toValue(".")).toBe(".");
      });
    });

    describe("toDisplayValue", () => {
      it("should return empty for empty string", () => {
        expect(adapter.toDisplayValue("")).toBe("");
      });

      it("should format with locale separators", () => {
        expect(adapter.toDisplayValue("1234")).toBe("1,234");
      });

      it("should format decimal value", () => {
        expect(adapter.toDisplayValue("3.14")).toBe("3.14");
      });

      it("should return non-finite values as-is", () => {
        expect(adapter.toDisplayValue("abc")).toBe("abc");
      });

      it("should preserve trailing-zero strings that differ from toString", () => {
        expect(adapter.toDisplayValue("1.10")).toBe("1.10");
      });
    });

    describe("validate", () => {
      it("should accept empty input", () => {
        expect(adapter.validate("").valid).toBe(true);
      });

      it("should accept valid integer", () => {
        expect(adapter.validate("42").valid).toBe(true);
      });

      it("should accept valid decimal", () => {
        expect(adapter.validate("3.14").valid).toBe(true);
      });

      it("should accept single decimal place", () => {
        expect(adapter.validate("5.5").valid).toBe(true);
      });

      it("should reject more than 2 decimal places", () => {
        const result = adapter.validate("1.234");
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain("at most 2");
      });

      it("should reject letters", () => {
        const result = adapter.validate("abc");
        expect(result.valid).toBe(false);
      });

      it("should reject double dots", () => {
        expect(adapter.validate("1.2.3").valid).toBe(false);
      });

      it("should accept negative numbers", () => {
        expect(adapter.validate("-7").valid).toBe(true);
      });
    });
  });

  describe("custom precision (4 decimals)", () => {
    let adapter: DecimalTextAdapter;

    beforeEach(() => {
      adapter = new DecimalTextAdapter(4, "en-US");
    });

    it("should have maxDecimals of 4", () => {
      expect(adapter.maxDecimals).toBe(4);
    });

    it("should accept 4 decimal places", () => {
      expect(adapter.validate("1.2345").valid).toBe(true);
    });

    it("should reject 5 decimal places", () => {
      const result = adapter.validate("1.23456");
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("at most 4");
    });
  });

  describe("single decimal place", () => {
    it("should use singular 'place' in error message", () => {
      const adapter = new DecimalTextAdapter(1, "en-US");
      const result = adapter.validate("1.23");
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("at most 1 decimal place");
      expect(result.errors[0]).not.toContain("places");
    });
  });
});
