import { UppercaseTextAdapter } from "./uppercase-text-adapter";

describe("UppercaseTextAdapter", () => {
  let adapter: UppercaseTextAdapter;

  beforeEach(() => {
    adapter = new UppercaseTextAdapter();
  });

  describe("toValue", () => {
    it("should uppercase all characters", () => {
      expect(adapter.toValue("hello")).toBe("HELLO");
    });

    it("should handle mixed case", () => {
      expect(adapter.toValue("HeLLo WoRLd")).toBe("HELLO WORLD");
    });

    it("should leave already-uppercase text unchanged", () => {
      expect(adapter.toValue("ABC")).toBe("ABC");
    });

    it("should handle empty string", () => {
      expect(adapter.toValue("")).toBe("");
    });

    it("should handle numbers and symbols unchanged", () => {
      expect(adapter.toValue("abc-123!")).toBe("ABC-123!");
    });
  });

  describe("validate", () => {
    it("should always return valid", () => {
      expect(adapter.validate("anything").valid).toBe(true);
    });

    it("should return no errors", () => {
      expect(adapter.validate("test").errors).toEqual([]);
    });
  });
});
