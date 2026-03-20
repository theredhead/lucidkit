import { describe, expect, it } from "vitest";

import { FormEngine } from "./form-engine";
import type { FormSchema } from "../types/form-schema.types";

function createTestSchema(): FormSchema {
  return {
    id: "test",
    title: "Test Form",
    groups: [
      {
        id: "personal",
        title: "Personal",
        fields: [
          {
            id: "name",
            title: "Name",
            component: "text",
            validation: [{ type: "required" }],
          },
          {
            id: "email",
            title: "Email",
            component: "text",
            validation: [{ type: "required" }, { type: "email" }],
          },
          {
            id: "age",
            title: "Age",
            component: "slider",
            defaultValue: 25,
            validation: [{ type: "min", params: { min: 18 } }],
          },
        ],
      },
      {
        id: "prefs",
        title: "Preferences",
        fields: [
          {
            id: "newsletter",
            title: "Subscribe",
            component: "checkbox",
          },
          {
            id: "frequency",
            title: "Frequency",
            component: "select",
            visibleWhen: {
              field: "newsletter",
              operator: "equals",
              value: true,
            },
          },
        ],
      },
    ],
  };
}

describe("FormEngine", () => {
  describe("initialization", () => {
    it("should create an engine from a schema", () => {
      const engine = new FormEngine(createTestSchema());
      expect(engine).toBeTruthy();
      expect(engine.groups).toHaveLength(2);
    });

    it("should seed default values", () => {
      const engine = new FormEngine(createTestSchema());
      expect(engine.values()["name"]).toBe("");
      expect(engine.values()["age"]).toBe(25);
      expect(engine.values()["newsletter"]).toBe(false);
    });

    it("should use component-type defaults when no defaultValue", () => {
      const engine = new FormEngine(createTestSchema());
      // "text" defaults to ""
      expect(engine.values()["name"]).toBe("");
      // "checkbox" defaults to false
      expect(engine.values()["newsletter"]).toBe(false);
    });
  });

  describe("setValue / getField", () => {
    it("should update a field value", () => {
      const engine = new FormEngine(createTestSchema());
      engine.setValue("name", "Alice");
      expect(engine.getField("name").value()).toBe("Alice");
    });

    it("should reflect value in values signal after sync", () => {
      const engine = new FormEngine(createTestSchema());
      engine.setValue("name", "Alice");
      expect(engine.values()["name"]).toBe("Alice");
    });

    it("should throw for unknown field ID", () => {
      const engine = new FormEngine(createTestSchema());
      expect(() => engine.getField("nonexistent")).toThrow();
    });
  });

  describe("validation", () => {
    it("should be invalid when required fields are empty", () => {
      const engine = new FormEngine(createTestSchema());
      expect(engine.valid()).toBe(false);
    });

    it("should be valid when all required fields are filled", () => {
      const engine = new FormEngine(createTestSchema());
      engine.setValue("name", "Alice");
      engine.setValue("email", "alice@example.com");
      expect(engine.valid()).toBe(true);
    });

    it("should report email validation error", () => {
      const engine = new FormEngine(createTestSchema());
      engine.setValue("name", "Alice");
      engine.setValue("email", "not-valid");
      const emailField = engine.getField("email");
      expect(emailField.validation().valid).toBe(false);
      expect(
        emailField.validation().errors.some((e) => e.type === "email"),
      ).toBe(true);
    });

    it("should validate min on age field", () => {
      const engine = new FormEngine(createTestSchema());
      engine.setValue("age", 10);
      const ageField = engine.getField("age");
      expect(ageField.validation().valid).toBe(false);
    });
  });

  describe("touched / dirty", () => {
    it("should not be touched initially", () => {
      const engine = new FormEngine(createTestSchema());
      expect(engine.touched()).toBe(false);
    });

    it("should be touched after markTouched", () => {
      const engine = new FormEngine(createTestSchema());
      engine.markTouched("name");
      expect(engine.touched()).toBe(true);
    });

    it("should mark all fields touched with markAllTouched", () => {
      const engine = new FormEngine(createTestSchema());
      engine.markAllTouched();
      expect(engine.getField("name").touched()).toBe(true);
      expect(engine.getField("email").touched()).toBe(true);
    });

    it("should not be dirty initially", () => {
      const engine = new FormEngine(createTestSchema());
      expect(engine.dirty()).toBe(false);
    });

    it("should be dirty after value change", () => {
      const engine = new FormEngine(createTestSchema());
      engine.setValue("name", "Changed");
      expect(engine.dirty()).toBe(true);
    });
  });

  describe("conditions (visibility)", () => {
    it("should hide field when condition is not met", () => {
      const engine = new FormEngine(createTestSchema());
      const frequency = engine.getField("frequency");
      // newsletter defaults to false, frequency should be hidden
      expect(frequency.visible()).toBe(false);
    });

    it("should show field when condition is met", () => {
      const engine = new FormEngine(createTestSchema());
      engine.setValue("newsletter", true);
      const frequency = engine.getField("frequency");
      expect(frequency.visible()).toBe(true);
    });
  });

  describe("output", () => {
    it("should exclude hidden fields from output", () => {
      const engine = new FormEngine(createTestSchema());
      engine.setValue("name", "Alice");
      engine.setValue("email", "alice@example.com");
      const result = engine.output()();
      // frequency is hidden (newsletter=false), should not appear
      expect(result["frequency"]).toBeUndefined();
      expect(result["name"]).toBe("Alice");
    });

    it("should include visible fields in output", () => {
      const engine = new FormEngine(createTestSchema());
      engine.setValue("name", "Alice");
      engine.setValue("email", "alice@example.com");
      engine.setValue("newsletter", true);
      const result = engine.output()();
      expect(result["frequency"]).toBeDefined();
    });
  });

  describe("reset", () => {
    it("should restore default values", () => {
      const engine = new FormEngine(createTestSchema());
      engine.setValue("name", "Changed");
      engine.markTouched("name");
      engine.reset();
      expect(engine.getField("name").value()).toBe("");
      expect(engine.getField("name").touched()).toBe(false);
      expect(engine.dirty()).toBe(false);
    });

    it("should restore explicit default values", () => {
      const engine = new FormEngine(createTestSchema());
      engine.setValue("age", 99);
      engine.reset();
      expect(engine.getField("age").value()).toBe(25);
    });
  });

  describe("group state", () => {
    it("should expose group visibility", () => {
      const schema: FormSchema = {
        ...createTestSchema(),
        groups: [
          createTestSchema().groups[0]!,
          {
            ...createTestSchema().groups[1]!,
            visibleWhen: {
              field: "name",
              operator: "notEmpty",
            },
          },
        ],
      };
      const engine = new FormEngine(schema);
      // name defaults to "" which is empty → group hidden
      expect(engine.groups[1]!.visible()).toBe(false);

      engine.setValue("name", "Alice");
      expect(engine.groups[1]!.visible()).toBe(true);
    });

    it("should report group validity", () => {
      const engine = new FormEngine(createTestSchema());
      // personal group has required fields empty → invalid
      expect(engine.groups[0]!.valid()).toBe(false);

      // prefs group has no required fields → valid
      expect(engine.groups[1]!.valid()).toBe(true);
    });
  });
});
