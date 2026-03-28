import { TrimTextAdapter } from "./trim-text-adapter";

describe("TrimTextAdapter", () => {
  let adapter: TrimTextAdapter;

  beforeEach(() => {
    adapter = new TrimTextAdapter();
  });

  it("should have a prefix icon", () => {
    expect(adapter.prefixIcon).toBeTruthy();
  });

  describe("toValue", () => {
    it("should trim leading whitespace", () => {
      expect(adapter.toValue("  hello")).toBe("hello");
    });

    it("should trim trailing whitespace", () => {
      expect(adapter.toValue("hello  ")).toBe("hello");
    });

    it("should trim both ends", () => {
      expect(adapter.toValue("  hello  ")).toBe("hello");
    });

    it("should collapse multiple spaces to one", () => {
      expect(adapter.toValue("hello   world")).toBe("hello world");
    });

    it("should trim and collapse simultaneously", () => {
      expect(adapter.toValue("  hello   world  ")).toBe("hello world");
    });

    it("should handle empty string", () => {
      expect(adapter.toValue("")).toBe("");
    });

    it("should handle single word with no extra spaces", () => {
      expect(adapter.toValue("hello")).toBe("hello");
    });

    it("should collapse tabs and mixed whitespace", () => {
      expect(adapter.toValue("hello\t\tworld")).toBe("hello world");
    });
  });

  describe("validate", () => {
    it("should always return valid", () => {
      expect(adapter.validate("anything").valid).toBe(true);
    });

    it("should return no errors", () => {
      expect(adapter.validate("   ").errors).toEqual([]);
    });
  });
});
