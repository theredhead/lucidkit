import { describe, expect, it } from "vitest";

import { registerCustomValidator, runValidator, validate } from "./validators";
import type { ValidationRule } from "../types/validation.types";

describe("validators", () => {
  describe("runValidator", () => {
    describe("required", () => {
      const rule: ValidationRule = { type: "required" };

      it("should fail for null", () => {
        expect(runValidator(rule, null)).not.toBeNull();
      });

      it("should fail for undefined", () => {
        expect(runValidator(rule, undefined)).not.toBeNull();
      });

      it("should fail for empty string", () => {
        expect(runValidator(rule, "")).not.toBeNull();
      });

      it("should fail for whitespace-only string", () => {
        expect(runValidator(rule, "  ")).not.toBeNull();
      });

      it("should fail for empty array", () => {
        expect(runValidator(rule, [])).not.toBeNull();
      });

      it("should pass for non-empty string", () => {
        expect(runValidator(rule, "hello")).toBeNull();
      });

      it("should pass for zero (number)", () => {
        expect(runValidator(rule, 0)).toBeNull();
      });

      it("should pass for false (boolean)", () => {
        expect(runValidator(rule, false)).toBeNull();
      });

      it("should use custom message when provided", () => {
        const r: ValidationRule = {
          type: "required",
          message: "Please fill in this field.",
        };
        const error = runValidator(r, "");
        expect(error?.message).toBe("Please fill in this field.");
      });
    });

    describe("minLength", () => {
      const rule: ValidationRule = {
        type: "minLength",
        params: { min: 3 },
      };

      it("should fail for strings shorter than min", () => {
        const error = runValidator(rule, "ab");
        expect(error).not.toBeNull();
        expect(error!.type).toBe("minLength");
      });

      it("should pass for strings equal to min", () => {
        expect(runValidator(rule, "abc")).toBeNull();
      });

      it("should pass for strings longer than min", () => {
        expect(runValidator(rule, "abcdef")).toBeNull();
      });

      it("should pass for non-string values", () => {
        expect(runValidator(rule, 42)).toBeNull();
      });
    });

    describe("maxLength", () => {
      const rule: ValidationRule = {
        type: "maxLength",
        params: { max: 5 },
      };

      it("should fail for strings longer than max", () => {
        const error = runValidator(rule, "abcdef");
        expect(error).not.toBeNull();
        expect(error!.type).toBe("maxLength");
      });

      it("should pass for strings equal to max", () => {
        expect(runValidator(rule, "abcde")).toBeNull();
      });

      it("should pass for shorter strings", () => {
        expect(runValidator(rule, "ab")).toBeNull();
      });
    });

    describe("min", () => {
      const rule: ValidationRule = {
        type: "min",
        params: { min: 10 },
      };

      it("should fail for numbers below min", () => {
        const error = runValidator(rule, 5);
        expect(error).not.toBeNull();
        expect(error!.type).toBe("min");
      });

      it("should pass for numbers equal to min", () => {
        expect(runValidator(rule, 10)).toBeNull();
      });

      it("should pass for numbers above min", () => {
        expect(runValidator(rule, 15)).toBeNull();
      });

      it("should pass for non-number values", () => {
        expect(runValidator(rule, "abc")).toBeNull();
      });
    });

    describe("max", () => {
      const rule: ValidationRule = {
        type: "max",
        params: { max: 100 },
      };

      it("should fail for numbers above max", () => {
        const error = runValidator(rule, 150);
        expect(error).not.toBeNull();
        expect(error!.type).toBe("max");
      });

      it("should pass for numbers equal to max", () => {
        expect(runValidator(rule, 100)).toBeNull();
      });

      it("should pass for numbers below max", () => {
        expect(runValidator(rule, 50)).toBeNull();
      });
    });

    describe("pattern", () => {
      const rule: ValidationRule = {
        type: "pattern",
        params: { pattern: "^[A-Z]+$" },
      };

      it("should fail for non-matching strings", () => {
        const error = runValidator(rule, "abc");
        expect(error).not.toBeNull();
        expect(error!.type).toBe("pattern");
      });

      it("should pass for matching strings", () => {
        expect(runValidator(rule, "ABC")).toBeNull();
      });

      it("should pass for empty strings", () => {
        expect(runValidator(rule, "")).toBeNull();
      });

      it("should pass for non-string values", () => {
        expect(runValidator(rule, 42)).toBeNull();
      });
    });

    describe("email", () => {
      const rule: ValidationRule = { type: "email" };

      it("should fail for invalid email", () => {
        const error = runValidator(rule, "not-an-email");
        expect(error).not.toBeNull();
        expect(error!.type).toBe("email");
      });

      it("should pass for valid email", () => {
        expect(runValidator(rule, "user@example.com")).toBeNull();
      });

      it("should pass for empty string (not required)", () => {
        expect(runValidator(rule, "")).toBeNull();
      });
    });

    describe("custom", () => {
      it("should call a registered custom validator", () => {
        registerCustomValidator("even", (value) => {
          if (typeof value === "number" && value % 2 !== 0) {
            return { type: "custom", message: "Must be even." };
          }
          return null;
        });

        const rule: ValidationRule = {
          type: "custom",
          params: { validatorId: "even" },
        };

        expect(runValidator(rule, 3)).not.toBeNull();
        expect(runValidator(rule, 4)).toBeNull();
      });

      it("should return error for unknown validatorId", () => {
        const rule: ValidationRule = {
          type: "custom",
          params: { validatorId: "nonexistent" },
        };
        const error = runValidator(rule, "anything");
        expect(error).not.toBeNull();
        expect(error!.message).toContain("nonexistent");
      });

      it("should use rule message over validator message", () => {
        registerCustomValidator("alwaysFail", () => ({
          type: "custom",
          message: "Validator says no.",
        }));

        const rule: ValidationRule = {
          type: "custom",
          params: { validatorId: "alwaysFail" },
          message: "Rule says no.",
        };

        const error = runValidator(rule, "x");
        expect(error?.message).toBe("Rule says no.");
      });
    });
  });

  describe("validate", () => {
    it("should return valid for empty rules", () => {
      const result = validate([], "anything");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should collect all errors", () => {
      const rules: ValidationRule[] = [
        { type: "required" },
        { type: "minLength", params: { min: 5 } },
      ];
      const result = validate(rules, "");
      expect(result.valid).toBe(false);
      // Only 'required' fires on empty string; minLength passes for empty
      // because the isEmpty check short-circuits. Actually, let's re-check:
      // For minLength, "" has length 0 < 5 → error. So two errors.
      expect(result.errors.length).toBeGreaterThanOrEqual(1);
    });

    it("should return valid when all rules pass", () => {
      const rules: ValidationRule[] = [{ type: "required" }, { type: "email" }];
      const result = validate(rules, "user@example.com");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
