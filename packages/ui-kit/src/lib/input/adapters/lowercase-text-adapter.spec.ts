import { LowercaseTextAdapter } from "./lowercase-text-adapter";

describe("LowercaseTextAdapter", () => {
  let adapter: LowercaseTextAdapter;

  beforeEach(() => {
    adapter = new LowercaseTextAdapter();
  });

  it("should have a prefix icon", () => {
    expect(adapter.prefixIcon).toBeTruthy();
  });

  describe("toValue", () => {
    it("should lowercase all characters", () => {
      expect(adapter.toValue("HELLO")).toBe("hello");
    });

    it("should handle mixed case", () => {
      expect(adapter.toValue("HeLLo WoRLd")).toBe("hello world");
    });

    it("should leave already-lowercase text unchanged", () => {
      expect(adapter.toValue("abc")).toBe("abc");
    });

    it("should handle empty string", () => {
      expect(adapter.toValue("")).toBe("");
    });

    it("should handle numbers and symbols unchanged", () => {
      expect(adapter.toValue("ABC-123!")).toBe("abc-123!");
    });
  });

  describe("validate", () => {
    it("should always return valid", () => {
      expect(adapter.validate("anything").valid).toBe(true);
    });

    it("should return no errors", () => {
      expect(adapter.validate("TEST").errors).toEqual([]);
    });
  });
});
