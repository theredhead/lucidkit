import { MacAddressTextAdapter } from "./mac-address-text-adapter";

describe("MacAddressTextAdapter", () => {
  let adapter: MacAddressTextAdapter;

  beforeEach(() => {
    adapter = new MacAddressTextAdapter();
  });

  it("should have a prefix icon", () => {
    expect(adapter.prefixIcon).toBeTruthy();
  });

  describe("toValue", () => {
    it("should strip non-hex characters and uppercase", () => {
      expect(adapter.toValue("aa:bb:cc:dd:ee:ff")).toBe("AABBCCDDEEFF");
    });

    it("should strip dashes", () => {
      expect(adapter.toValue("AA-BB-CC-DD-EE-FF")).toBe("AABBCCDDEEFF");
    });

    it("should limit to 12 characters", () => {
      expect(adapter.toValue("AABBCCDDEEFF00")).toBe("AABBCCDDEEFF");
    });

    it("should handle empty string", () => {
      expect(adapter.toValue("")).toBe("");
    });

    it("should strip non-hex letters", () => {
      expect(adapter.toValue("GG11HH22")).toBe("1122");
    });
  });

  describe("toDisplayValue", () => {
    it("should format as colon-separated pairs", () => {
      expect(adapter.toDisplayValue("AABBCCDDEEFF")).toBe("AA:BB:CC:DD:EE:FF");
    });

    it("should return empty for empty input", () => {
      expect(adapter.toDisplayValue("")).toBe("");
    });

    it("should handle partial input", () => {
      expect(adapter.toDisplayValue("AABB")).toBe("AA:BB");
    });
  });

  describe("validate", () => {
    it("should accept empty input", () => {
      expect(adapter.validate("").valid).toBe(true);
    });

    it("should accept valid MAC address", () => {
      expect(adapter.validate("AABBCCDDEEFF").valid).toBe(true);
    });

    it("should accept MAC with colons", () => {
      expect(adapter.validate("AA:BB:CC:DD:EE:FF").valid).toBe(true);
    });

    it("should reject too-short MAC", () => {
      const result = adapter.validate("AABBCCDDEE");
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("12 hex digits");
    });

    it("should treat all-invalid hex chars as empty (valid)", () => {
      // toValue strips non-hex chars, so "GGHHIIJJKKLL" becomes ""
      const result = adapter.validate("GGHHIIJJKKLL");
      expect(result.valid).toBe(true);
    });

    it("should reject partial hex (less than 12 after stripping)", () => {
      // "AABB" + non-hex chars → cleaned to "AABB" (4 chars, not 12)
      const result = adapter.validate("AABBXXYYZZ");
      expect(result.valid).toBe(false);
    });
  });
});
