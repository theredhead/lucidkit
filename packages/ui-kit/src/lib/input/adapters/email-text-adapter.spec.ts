import { EmailTextAdapter } from "./email-text-adapter";

describe("EmailTextAdapter", () => {
  let adapter: EmailTextAdapter;

  beforeEach(() => {
    adapter = new EmailTextAdapter();
  });

  it("should have a prefix icon", () => {
    expect(adapter.prefixIcon).toBeTruthy();
  });

  it("should have inputType email", () => {
    expect(adapter.inputType).toBe("email");
  });

  describe("toValue", () => {
    it("should lowercase the input", () => {
      expect(adapter.toValue("User@Example.COM")).toBe("user@example.com");
    });

    it("should trim whitespace", () => {
      expect(adapter.toValue("  user@test.com  ")).toBe("user@test.com");
    });

    it("should handle empty string", () => {
      expect(adapter.toValue("")).toBe("");
    });
  });

  describe("validate", () => {
    it("should accept empty input", () => {
      expect(adapter.validate("").valid).toBe(true);
    });

    it("should accept whitespace-only (treated as empty)", () => {
      expect(adapter.validate("   ").valid).toBe(true);
    });

    it("should accept valid email", () => {
      expect(adapter.validate("user@example.com").valid).toBe(true);
    });

    it("should accept email with dots in local part", () => {
      expect(adapter.validate("first.last@example.com").valid).toBe(true);
    });

    it("should accept email with plus tag", () => {
      expect(adapter.validate("user+tag@example.com").valid).toBe(true);
    });

    it("should accept email with subdomain", () => {
      expect(adapter.validate("user@mail.example.co.uk").valid).toBe(true);
    });

    it("should reject missing @", () => {
      const result = adapter.validate("userexample.com");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Value must be a valid email address");
    });

    it("should reject missing local part", () => {
      expect(adapter.validate("@example.com").valid).toBe(false);
    });

    it("should reject missing domain", () => {
      expect(adapter.validate("user@").valid).toBe(false);
    });

    it("should reject spaces in address", () => {
      expect(adapter.validate("user @example.com").valid).toBe(false);
    });
  });

  describe("onPrefixClick", () => {
    it("should open mailto link for valid email", () => {
      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
      adapter.onPrefixClick("user@example.com");
      expect(openSpy).toHaveBeenCalledWith(
        "mailto:user%40example.com",
        "_self",
      );
      openSpy.mockRestore();
    });

    it("should not open link for empty input", () => {
      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
      adapter.onPrefixClick("");
      expect(openSpy).not.toHaveBeenCalled();
      openSpy.mockRestore();
    });

    it("should not open link for whitespace-only input", () => {
      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
      adapter.onPrefixClick("   ");
      expect(openSpy).not.toHaveBeenCalled();
      openSpy.mockRestore();
    });
  });
});
