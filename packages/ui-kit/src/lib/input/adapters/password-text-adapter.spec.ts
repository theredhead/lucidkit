import { PasswordTextAdapter } from "./password-text-adapter";

describe("PasswordTextAdapter", () => {
  let adapter: PasswordTextAdapter;

  beforeEach(() => {
    adapter = new PasswordTextAdapter();
  });

  it("should have a prefix icon", () => {
    expect(adapter.prefixIcon).toBeTruthy();
  });

  describe("toValue", () => {
    it("should return text unchanged", () => {
      expect(adapter.toValue("MyP@ss123")).toBe("MyP@ss123");
    });

    it("should handle empty string", () => {
      expect(adapter.toValue("")).toBe("");
    });
  });

  describe("inputType", () => {
    it("should default to password", () => {
      expect(adapter.inputType).toBe("password");
    });

    it("should switch to text after suffix click", () => {
      adapter.onSuffixClick("");
      expect(adapter.inputType).toBe("text");
    });

    it("should toggle back to password on second click", () => {
      adapter.onSuffixClick("");
      adapter.onSuffixClick("");
      expect(adapter.inputType).toBe("password");
    });
  });

  describe("suffixIcon", () => {
    it("should show eye icon when hidden", () => {
      expect(adapter.suffixIcon).toBeTruthy();
    });

    it("should change icon after toggling visibility", () => {
      const initial = adapter.suffixIcon;
      adapter.onSuffixClick("");
      expect(adapter.suffixIcon).not.toBe(initial);
    });
  });

  describe("validate", () => {
    it("should accept empty input", () => {
      expect(adapter.validate("").valid).toBe(true);
    });

    it("should accept a strong password", () => {
      expect(adapter.validate("MyStr0ng!").valid).toBe(true);
    });

    it("should reject password shorter than 8 characters", () => {
      const result = adapter.validate("Aa1");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Password must be at least 8 characters",
      );
    });

    it("should reject password without lowercase letter", () => {
      const result = adapter.validate("AAAAAAAA1");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain a lowercase letter",
      );
    });

    it("should reject password without uppercase letter", () => {
      const result = adapter.validate("aaaaaaaa1");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain an uppercase letter",
      );
    });

    it("should reject password without digit", () => {
      const result = adapter.validate("Aaaaaaaaa");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must contain a digit");
    });

    it("should collect all errors at once", () => {
      const result = adapter.validate("aaa");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });
  });
});
