import { MoneyTextAdapter } from "./money-text-adapter";

describe("MoneyTextAdapter", () => {
  describe("EUR (default)", () => {
    let adapter: MoneyTextAdapter;

    beforeEach(() => {
      adapter = new MoneyTextAdapter("EUR", "en-US");
    });

    it("should have a prefix icon", () => {
      expect(adapter.prefixIcon).toBeTruthy();
    });

    it("should default to EUR currency", () => {
      expect(adapter.currency).toBe("EUR");
    });

    it("should allow 2 decimal places", () => {
      expect(adapter.decimals).toBe(2);
    });

    describe("toValue", () => {
      it("should pass through integer", () => {
        expect(adapter.toValue("100")).toBe("100");
      });

      it("should pass through decimal", () => {
        expect(adapter.toValue("9.99")).toBe("9.99");
      });

      it("should preserve trailing-zero strings", () => {
        // "12.50" → Number("12.50").toString() is "12.5" which differs, so raw preserved
        expect(adapter.toValue("12.50")).toBe("12.50");
      });

      it("should strip thousands separators", () => {
        expect(adapter.toValue("1,234")).toBe("1234");
      });

      it("should strip currency symbols", () => {
        expect(adapter.toValue("€1,234.56")).toBe("1234.56");
      });

      it("should handle negative amount", () => {
        expect(adapter.toValue("-50")).toBe("-50");
      });

      it("should return empty for empty string", () => {
        expect(adapter.toValue("")).toBe("");
      });

      it("should preserve lone minus", () => {
        expect(adapter.toValue("-")).toBe("-");
      });
    });

    describe("toDisplayValue", () => {
      it("should return empty for empty string", () => {
        expect(adapter.toDisplayValue("")).toBe("");
      });

      it("should format with locale thousands separator", () => {
        expect(adapter.toDisplayValue("1234")).toBe("1,234");
      });

      it("should format decimals", () => {
        expect(adapter.toDisplayValue("9.99")).toBe("9.99");
      });

      it("should return non-finite values as-is", () => {
        expect(adapter.toDisplayValue("abc")).toBe("abc");
      });
    });

    describe("validate", () => {
      it("should accept empty input", () => {
        expect(adapter.validate("").valid).toBe(true);
      });

      it("should accept valid integer amount", () => {
        expect(adapter.validate("100").valid).toBe(true);
      });

      it("should accept valid decimal amount", () => {
        expect(adapter.validate("12.50").valid).toBe(true);
      });

      it("should accept single decimal place", () => {
        expect(adapter.validate("5.5").valid).toBe(true);
      });

      it("should reject more than 2 decimal places", () => {
        const result = adapter.validate("1.234");
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain("at most 2 decimal");
      });

      it("should reject letters", () => {
        const result = adapter.validate("abc");
        expect(result.valid).toBe(false);
      });

      it("should reject double dots", () => {
        expect(adapter.validate("1.2.3").valid).toBe(false);
      });
    });
  });

  describe("USD currency", () => {
    let adapter: MoneyTextAdapter;

    beforeEach(() => {
      adapter = new MoneyTextAdapter("USD", "en-US");
    });

    it("should use dollar icon", () => {
      expect(adapter.prefixIcon).toBeTruthy();
    });

    it("should have USD currency", () => {
      expect(adapter.currency).toBe("USD");
    });

    it("should allow 2 decimal places", () => {
      expect(adapter.decimals).toBe(2);
    });
  });

  describe("JPY (zero-decimal currency)", () => {
    let adapter: MoneyTextAdapter;

    beforeEach(() => {
      adapter = new MoneyTextAdapter("JPY", "en-US");
    });

    it("should have 0 decimal places", () => {
      expect(adapter.decimals).toBe(0);
    });

    it("should accept integer amount", () => {
      expect(adapter.validate("1000").valid).toBe(true);
    });

    it("should reject decimal amount", () => {
      const result = adapter.validate("100.50");
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("do not allow decimal");
    });
  });

  describe("unknown currency", () => {
    it("should use generic currency icon", () => {
      const adapter = new MoneyTextAdapter("XYZ", "en-US");
      expect(adapter.prefixIcon).toBeTruthy();
    });
  });

  describe("lowercase currency input", () => {
    it("should uppercase the currency code", () => {
      const adapter = new MoneyTextAdapter("eur", "en-US");
      expect(adapter.currency).toBe("EUR");
    });
  });
});
