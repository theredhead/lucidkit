// ── FormDesignerEngine tests ────────────────────────────────────────

import { describe, it, expect, beforeEach } from "vitest";

import type { FormSchema } from "../../types/form-schema.types";
import { FormDesignerEngine, resetDesignerCounters } from "./designer-engine";

describe("FormDesignerEngine", () => {
  let engine: FormDesignerEngine;

  beforeEach(() => {
    resetDesignerCounters();
    engine = new FormDesignerEngine();
  });

  // ── Initial state ─────────────────────────────────────────────────

  describe("initial state", () => {
    it("should start with no groups", () => {
      expect(engine.groups()).toEqual([]);
    });

    it("should have default form properties", () => {
      expect(engine.formId()).toBe("form-1");
      expect(engine.formTitle()).toBe("");
      expect(engine.formDescription()).toBe("");
    });

    it("should have no selection", () => {
      expect(engine.selection()).toBeNull();
    });

    it("should produce a minimal schema", () => {
      const schema = engine.schema();
      expect(schema.id).toBe("form-1");
      expect(schema.groups).toEqual([]);
    });
  });

  // ── Group mutations ───────────────────────────────────────────────

  describe("addGroup", () => {
    it("should add a group and return its uid", () => {
      const uid = engine.addGroup();
      expect(uid).toBeTruthy();
      expect(engine.groups()).toHaveLength(1);
      expect(engine.groups()[0].uid).toBe(uid);
    });

    it("should select the new group", () => {
      const uid = engine.addGroup();
      expect(engine.selection()?.kind).toBe("group");
      expect(engine.selection()?.groupUid).toBe(uid);
    });

    it("should assign sequential group IDs", () => {
      engine.addGroup();
      engine.addGroup();
      expect(engine.groups()[0].id()).toBe("group-1");
      expect(engine.groups()[1].id()).toBe("group-2");
    });
  });

  describe("removeGroup", () => {
    it("should remove a group by uid", () => {
      const uid = engine.addGroup();
      engine.addGroup();
      engine.removeGroup(uid);
      expect(engine.groups()).toHaveLength(1);
    });

    it("should clear selection if the removed group was selected", () => {
      const uid = engine.addGroup();
      engine.selectGroup(uid);
      engine.removeGroup(uid);
      expect(engine.selection()).toBeNull();
    });
  });

  describe("moveGroup", () => {
    it("should reorder groups", () => {
      engine.addGroup();
      const uid2 = engine.addGroup();
      engine.moveGroup(uid2, 0);
      expect(engine.groups()[0].uid).toBe(uid2);
    });

    it("should no-op if uid not found", () => {
      engine.addGroup();
      engine.moveGroup("non-existent", 0);
      expect(engine.groups()).toHaveLength(1);
    });
  });

  // ── Field mutations ───────────────────────────────────────────────

  describe("addField", () => {
    it("should add a field to a group", () => {
      const gUid = engine.addGroup();
      const fUid = engine.addField(gUid, "text");
      expect(fUid).toBeTruthy();
      expect(engine.groups()[0].fields()).toHaveLength(1);
      expect(engine.groups()[0].fields()[0].component()).toBe("text");
    });

    it("should select the new field", () => {
      const gUid = engine.addGroup();
      const fUid = engine.addField(gUid, "text");
      expect(engine.selection()?.kind).toBe("field");
      expect(engine.selection()?.fieldUid).toBe(fUid);
    });

    it("should throw for unknown group", () => {
      expect(() => engine.addField("bad-uid", "text")).toThrow();
    });

    it("should insert at specified index", () => {
      const gUid = engine.addGroup();
      engine.addField(gUid, "text");
      engine.addField(gUid, "select", 0);
      expect(engine.groups()[0].fields()[0].component()).toBe("select");
      expect(engine.groups()[0].fields()[1].component()).toBe("text");
    });

    it("should assign a default title based on component", () => {
      const gUid = engine.addGroup();
      engine.addField(gUid, "checkbox");
      expect(engine.groups()[0].fields()[0].title()).toBe("Checkbox");
    });
  });

  describe("removeField", () => {
    it("should remove a field from its group", () => {
      const gUid = engine.addGroup();
      const fUid = engine.addField(gUid, "text");
      engine.addField(gUid, "select");
      engine.removeField(gUid, fUid);
      expect(engine.groups()[0].fields()).toHaveLength(1);
      expect(engine.groups()[0].fields()[0].component()).toBe("select");
    });

    it("should clear selection if the removed field was selected", () => {
      const gUid = engine.addGroup();
      const fUid = engine.addField(gUid, "text");
      engine.selectField(gUid, fUid);
      engine.removeField(gUid, fUid);
      expect(engine.selection()).toBeNull();
    });
  });

  describe("moveField", () => {
    it("should reorder within the same group", () => {
      const gUid = engine.addGroup();
      const f1 = engine.addField(gUid, "text");
      engine.addField(gUid, "select");
      engine.moveField(gUid, f1, gUid, 1);
      expect(engine.groups()[0].fields()[0].component()).toBe("select");
      expect(engine.groups()[0].fields()[1].component()).toBe("text");
    });

    it("should move between groups", () => {
      const g1 = engine.addGroup();
      const g2 = engine.addGroup();
      const fUid = engine.addField(g1, "text");
      engine.moveField(g1, fUid, g2, 0);
      expect(engine.groups()[0].fields()).toHaveLength(0);
      expect(engine.groups()[1].fields()).toHaveLength(1);
    });
  });

  describe("duplicateField", () => {
    it("should duplicate a field right after the original", () => {
      const gUid = engine.addGroup();
      const fUid = engine.addField(gUid, "text");
      engine.groups()[0].fields()[0].title.set("My Field");
      const copyUid = engine.duplicateField(gUid, fUid);
      expect(copyUid).toBeTruthy();
      expect(engine.groups()[0].fields()).toHaveLength(2);
      expect(engine.groups()[0].fields()[1].title()).toBe("My Field (copy)");
    });

    it("should return null for unknown group", () => {
      expect(engine.duplicateField("bad", "bad")).toBeNull();
    });
  });

  // ── Selection ─────────────────────────────────────────────────────

  describe("selection", () => {
    it("should select a group", () => {
      const uid = engine.addGroup();
      engine.clearSelection();
      engine.selectGroup(uid);
      expect(engine.selection()?.kind).toBe("group");
      expect(engine.selectedGroup()?.uid).toBe(uid);
      expect(engine.selectedField()).toBeNull();
    });

    it("should select a field", () => {
      const gUid = engine.addGroup();
      const fUid = engine.addField(gUid, "text");
      engine.clearSelection();
      engine.selectField(gUid, fUid);
      expect(engine.selection()?.kind).toBe("field");
      expect(engine.selectedField()?.uid).toBe(fUid);
    });

    it("should select form-level properties", () => {
      engine.selectForm();
      expect(engine.selection()?.kind).toBe("form");
    });

    it("should clear selection", () => {
      engine.addGroup();
      engine.clearSelection();
      expect(engine.selection()).toBeNull();
    });
  });

  // ── Schema output ─────────────────────────────────────────────────

  describe("schema output", () => {
    it("should produce valid FormSchema with fields", () => {
      engine.formTitle.set("My Form");
      engine.formDescription.set("A description");
      const gUid = engine.addGroup();
      engine.groups()[0].title.set("Section 1");
      engine.addField(gUid, "text");
      engine.addField(gUid, "select");

      const schema = engine.schema();
      expect(schema.id).toBe("form-1");
      expect(schema.title).toBe("My Form");
      expect(schema.description).toBe("A description");
      expect(schema.groups).toHaveLength(1);
      expect(schema.groups[0].title).toBe("Section 1");
      expect(schema.groups[0].fields).toHaveLength(2);
      expect(schema.groups[0].fields[0].component).toBe("text");
      expect(schema.groups[0].fields[1].component).toBe("select");
    });

    it("should omit empty optional properties", () => {
      const gUid = engine.addGroup();
      engine.addField(gUid, "text");

      const schema = engine.schema();
      const field = schema.groups[0].fields[0];
      expect(field.description).toBeUndefined();
      expect(field.config).toBeUndefined();
      expect(field.options).toBeUndefined();
      expect(field.validation).toBeUndefined();
      expect(field.visibleWhen).toBeUndefined();
      expect(field.enabledWhen).toBeUndefined();
      expect(field.defaultValue).toBeUndefined();
      expect(field.colSpan).toBeUndefined();
    });

    it("should include config when set", () => {
      const gUid = engine.addGroup();
      engine.addField(gUid, "text");
      engine.groups()[0].fields()[0].config.set({ type: "email" });

      const schema = engine.schema();
      expect(schema.groups[0].fields[0].config).toEqual({ type: "email" });
    });

    it("should include validation rules when set", () => {
      const gUid = engine.addGroup();
      engine.addField(gUid, "text");
      engine
        .groups()[0]
        .fields()[0]
        .validation.set([{ type: "required", message: "Required!" }]);

      const schema = engine.schema();
      expect(schema.groups[0].fields[0].validation).toHaveLength(1);
      expect(schema.groups[0].fields[0].validation![0].type).toBe("required");
    });
  });

  // ── Import / Export ───────────────────────────────────────────────

  describe("loadSchema", () => {
    const testSchema: FormSchema = {
      id: "loaded-form",
      title: "Loaded Form",
      description: "A pre-built form",
      groups: [
        {
          id: "g1",
          title: "Group 1",
          fields: [
            {
              id: "name",
              title: "Name",
              component: "text",
              validation: [{ type: "required", message: "Required" }],
              colSpan: 6,
            },
            {
              id: "agree",
              title: "I agree",
              component: "checkbox",
              defaultValue: false,
            },
          ],
        },
        {
          id: "g2",
          title: "Group 2",
          description: "Second group",
          fields: [
            {
              id: "color",
              title: "Color",
              component: "select",
              options: [
                { label: "Red", value: "red" },
                { label: "Blue", value: "blue" },
              ],
            },
          ],
        },
      ],
    };

    it("should import form-level properties", () => {
      engine.loadSchema(testSchema);
      expect(engine.formId()).toBe("loaded-form");
      expect(engine.formTitle()).toBe("Loaded Form");
      expect(engine.formDescription()).toBe("A pre-built form");
    });

    it("should import all groups", () => {
      engine.loadSchema(testSchema);
      expect(engine.groups()).toHaveLength(2);
      expect(engine.groups()[0].id()).toBe("g1");
      expect(engine.groups()[1].id()).toBe("g2");
    });

    it("should import all fields", () => {
      engine.loadSchema(testSchema);
      expect(engine.groups()[0].fields()).toHaveLength(2);
      expect(engine.groups()[0].fields()[0].id()).toBe("name");
      expect(engine.groups()[0].fields()[1].id()).toBe("agree");
    });

    it("should import field properties", () => {
      engine.loadSchema(testSchema);
      const nameField = engine.groups()[0].fields()[0];
      expect(nameField.component()).toBe("text");
      expect(nameField.validation()).toHaveLength(1);
      expect(nameField.colSpan()).toBe(6);
    });

    it("should import options", () => {
      engine.loadSchema(testSchema);
      const colorField = engine.groups()[1].fields()[0];
      expect(colorField.options()).toHaveLength(2);
      expect(colorField.options()[0].label).toBe("Red");
    });

    it("should clear selection", () => {
      engine.addGroup();
      engine.loadSchema(testSchema);
      expect(engine.selection()).toBeNull();
    });

    it("should round-trip through toJSON", () => {
      engine.loadSchema(testSchema);
      const json = engine.toJSON();
      const parsed = JSON.parse(json);
      expect(parsed.id).toBe("loaded-form");
      expect(parsed.groups).toHaveLength(2);
      expect(parsed.groups[0].fields).toHaveLength(2);
    });
  });

  // ── toJSON ────────────────────────────────────────────────────────

  describe("toJSON", () => {
    it("should produce valid JSON string", () => {
      engine.formTitle.set("Test");
      const gUid = engine.addGroup();
      engine.addField(gUid, "text");

      const json = engine.toJSON();
      const parsed = JSON.parse(json);
      expect(parsed.title).toBe("Test");
      expect(parsed.groups[0].fields[0].component).toBe("text");
    });
  });
});
