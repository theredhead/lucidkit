import { IbanTextAdapter } from "./iban-text-adapter";

describe("IbanTextAdapter", () => {
  let adapter: IbanTextAdapter;

  beforeEach(() => {
    adapter = new IbanTextAdapter();
  });

  it("should have a prefix icon", () => {
    expect(adapter.prefixIcon).toBeTruthy();
  });

  describe("toValue", () => {
    it("should strip spaces", () => {
      expect(adapter.toValue("DE89 3704 0044 0532 0130 00")).toBe(
        "DE89370400440532013000",
      );
    });

    it("should uppercase letters", () => {
      expect(adapter.toValue("de89370400440532013000")).toBe(
        "DE89370400440532013000",
      );
    });

    it("should strip non-alphanumeric characters", () => {
      expect(adapter.toValue("DE-89.3704/0044")).toBe("DE8937040044");
    });

    it("should handle empty string", () => {
      expect(adapter.toValue("")).toBe("");
    });
  });

  describe("toDisplayValue", () => {
    it("should format in groups of 4", () => {
      expect(adapter.toDisplayValue("DE89370400440532013000")).toBe(
        "DE89 3704 0044 0532 0130 00",
      );
    });

    it("should return empty for empty input", () => {
      expect(adapter.toDisplayValue("")).toBe("");
    });

    it("should handle short values", () => {
      expect(adapter.toDisplayValue("DE89")).toBe("DE89");
    });
  });

  describe("validate", () => {
    it("should accept empty input", () => {
      expect(adapter.validate("").valid).toBe(true);
    });

    it("should accept valid German IBAN", () => {
      expect(adapter.validate("DE89370400440532013000").valid).toBe(true);
    });

    it("should accept valid British IBAN", () => {
      expect(adapter.validate("GB29NWBK60161331926819").valid).toBe(true);
    });

    it("should accept IBAN with spaces", () => {
      expect(adapter.validate("DE89 3704 0044 0532 0130 00").valid).toBe(true);
    });

    it("should reject too-short IBAN", () => {
      const result = adapter.validate("DE8937040044");
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("between 15 and 34");
    });

    it("should reject too-long IBAN", () => {
      const result = adapter.validate("DE89370400440532013000123456789012345");
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("between 15 and 34");
    });

    it("should reject IBAN not starting with country code", () => {
      const result = adapter.validate("1289370400440532013000");
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("country code");
    });

    it("should reject IBAN with invalid checksum", () => {
      const result = adapter.validate("DE00370400440532013000");
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("checksum");
    });
  });
});
