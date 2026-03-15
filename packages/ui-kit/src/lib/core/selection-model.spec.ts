import { SelectionModel, TableSelectionModel } from "./selection-model";

describe("SelectionModel", () => {
  describe("constructor", () => {
    it("should create with default mode 'none'", () => {
      const model = new SelectionModel();
      expect(model.mode()).toBe("none");
    });

    it("should create with a specified mode", () => {
      const model = new SelectionModel("multiple");
      expect(model.mode()).toBe("multiple");
    });

    it("should start with an empty selection", () => {
      const model = new SelectionModel("multiple");
      expect(model.selected()).toEqual([]);
      expect(model.selectedCount()).toBe(0);
      expect(model.isEmpty()).toBe(true);
    });

    it("should accept an optional trackBy function", () => {
      const trackBy = (item: { id: number }) => item.id;
      const model = new SelectionModel<{ id: number }>("multiple", trackBy);
      expect(model.trackBy).toBe(trackBy);
    });
  });

  describe("select", () => {
    it("should select an item", () => {
      const model = new SelectionModel<string>("single");
      model.select("a");

      expect(model.selected()).toEqual(["a"]);
      expect(model.selectedCount()).toBe(1);
      expect(model.isEmpty()).toBe(false);
    });

    it("should replace the previous selection", () => {
      const model = new SelectionModel<string>("single");
      model.select("a");
      model.select("b");

      expect(model.selected()).toEqual(["b"]);
      expect(model.selectedCount()).toBe(1);
    });
  });

  describe("deselect", () => {
    it("should remove a selected item", () => {
      const model = new SelectionModel<string>("multiple");
      model.select("a");
      model.deselect("a");

      expect(model.selected()).toEqual([]);
      expect(model.isEmpty()).toBe(true);
    });

    it("should not throw when deselecting an unselected item", () => {
      const model = new SelectionModel<string>("multiple");
      expect(() => model.deselect("x")).not.toThrow();
      expect(model.selected()).toEqual([]);
    });

    it("should only remove the specified item in multiple mode", () => {
      const model = new SelectionModel<string>("multiple");
      model.toggle("a");
      model.toggle("b");
      model.toggle("c");
      model.deselect("b");

      expect(model.selected()).toEqual(["a", "c"]);
    });
  });

  describe("toggle", () => {
    describe("single mode", () => {
      it("should select an unselected item", () => {
        const model = new SelectionModel<string>("single");
        model.toggle("a");

        expect(model.selected()).toEqual(["a"]);
      });

      it("should deselect the item if already selected", () => {
        const model = new SelectionModel<string>("single");
        model.toggle("a");
        model.toggle("a");

        expect(model.selected()).toEqual([]);
      });

      it("should replace selection when toggling a new item", () => {
        const model = new SelectionModel<string>("single");
        model.toggle("a");
        model.toggle("b");

        expect(model.selected()).toEqual(["b"]);
      });
    });

    describe("multiple mode", () => {
      it("should add an unselected item", () => {
        const model = new SelectionModel<string>("multiple");
        model.toggle("a");
        model.toggle("b");

        expect(model.selected()).toEqual(["a", "b"]);
      });

      it("should remove a selected item", () => {
        const model = new SelectionModel<string>("multiple");
        model.toggle("a");
        model.toggle("b");
        model.toggle("a");

        expect(model.selected()).toEqual(["b"]);
      });
    });
  });

  describe("isSelected", () => {
    it("should return true for a selected item", () => {
      const model = new SelectionModel<string>("single");
      model.select("a");

      expect(model.isSelected("a")).toBe(true);
    });

    it("should return false for an unselected item", () => {
      const model = new SelectionModel<string>("single");

      expect(model.isSelected("a")).toBe(false);
    });

    it("should return false after deselection", () => {
      const model = new SelectionModel<string>("single");
      model.select("a");
      model.deselect("a");

      expect(model.isSelected("a")).toBe(false);
    });
  });

  describe("selectAll", () => {
    it("should select all items in multiple mode", () => {
      const model = new SelectionModel<string>("multiple");
      model.selectAll(["a", "b", "c"]);

      expect(model.selected()).toEqual(["a", "b", "c"]);
      expect(model.selectedCount()).toBe(3);
    });

    it("should replace the previous selection", () => {
      const model = new SelectionModel<string>("multiple");
      model.toggle("x");
      model.selectAll(["a", "b"]);

      expect(model.selected()).toEqual(["a", "b"]);
    });

    it("should be a no-op in single mode", () => {
      const model = new SelectionModel<string>("single");
      model.selectAll(["a", "b", "c"]);

      expect(model.selected()).toEqual([]);
    });

    it("should be a no-op in none mode", () => {
      const model = new SelectionModel<string>("none");
      model.selectAll(["a", "b"]);

      expect(model.selected()).toEqual([]);
    });
  });

  describe("clear", () => {
    it("should remove all selected items", () => {
      const model = new SelectionModel<string>("multiple");
      model.selectAll(["a", "b", "c"]);
      model.clear();

      expect(model.selected()).toEqual([]);
      expect(model.selectedCount()).toBe(0);
      expect(model.isEmpty()).toBe(true);
    });

    it("should be safe to call when already empty", () => {
      const model = new SelectionModel<string>("multiple");
      expect(() => model.clear()).not.toThrow();
      expect(model.isEmpty()).toBe(true);
    });
  });

  describe("isAllSelected", () => {
    it("should return true when every item is selected", () => {
      const model = new SelectionModel<string>("multiple");
      const items = ["a", "b", "c"];
      model.selectAll(items);

      expect(model.isAllSelected(items)).toBe(true);
    });

    it("should return false when not every item is selected", () => {
      const model = new SelectionModel<string>("multiple");
      model.toggle("a");

      expect(model.isAllSelected(["a", "b", "c"])).toBe(false);
    });

    it("should return false for an empty array", () => {
      const model = new SelectionModel<string>("multiple");

      expect(model.isAllSelected([])).toBe(false);
    });
  });

  describe("isPartiallySelected", () => {
    it("should return true when some but not all items are selected", () => {
      const model = new SelectionModel<string>("multiple");
      model.toggle("a");

      expect(model.isPartiallySelected(["a", "b", "c"])).toBe(true);
    });

    it("should return false when all items are selected", () => {
      const model = new SelectionModel<string>("multiple");
      model.selectAll(["a", "b", "c"]);

      expect(model.isPartiallySelected(["a", "b", "c"])).toBe(false);
    });

    it("should return false when no items are selected", () => {
      const model = new SelectionModel<string>("multiple");

      expect(model.isPartiallySelected(["a", "b", "c"])).toBe(false);
    });

    it("should return false for an empty array", () => {
      const model = new SelectionModel<string>("multiple");

      expect(model.isPartiallySelected([])).toBe(false);
    });
  });

  describe("trackBy", () => {
    interface Item {
      id: number;
      name: string;
    }

    const trackById = (item: Item) => item.id;

    it("should identify items by trackBy key instead of reference", () => {
      const model = new SelectionModel<Item>("multiple", trackById);
      const item1 = { id: 1, name: "Alice" };
      const item1Clone = { id: 1, name: "Alice (refreshed)" };

      model.select(item1);
      expect(model.isSelected(item1Clone)).toBe(true);
    });

    it("should deselect by trackBy key", () => {
      const model = new SelectionModel<Item>("multiple", trackById);
      const item1 = { id: 1, name: "Alice" };
      const item1Clone = { id: 1, name: "Alice (refreshed)" };

      model.select(item1);
      model.deselect(item1Clone);

      expect(model.selected()).toEqual([]);
    });

    it("should toggle by trackBy key", () => {
      const model = new SelectionModel<Item>("multiple", trackById);
      const item1 = { id: 1, name: "Alice" };
      const item1Clone = { id: 1, name: "Alice (refreshed)" };

      model.toggle(item1);
      expect(model.isSelected(item1Clone)).toBe(true);

      model.toggle(item1Clone);
      expect(model.isSelected(item1)).toBe(false);
    });

    it("should prevent duplicate selection via trackBy key in toggle", () => {
      const model = new SelectionModel<Item>("multiple", trackById);
      const item1 = { id: 1, name: "v1" };
      const item1Clone = { id: 1, name: "v2" };

      model.toggle(item1);
      model.toggle(item1Clone); // same key → deselect

      expect(model.selected()).toEqual([]);
    });

    it("should work with selectAll and isAllSelected", () => {
      const model = new SelectionModel<Item>("multiple", trackById);
      const items = [
        { id: 1, name: "A" },
        { id: 2, name: "B" },
      ];
      model.selectAll(items);

      const clones = [
        { id: 1, name: "A clone" },
        { id: 2, name: "B clone" },
      ];
      expect(model.isAllSelected(clones)).toBe(true);
    });
  });

  describe("mode changes", () => {
    it("should allow changing mode at runtime", () => {
      const model = new SelectionModel<string>("none");
      model.mode.set("multiple");

      expect(model.mode()).toBe("multiple");
    });
  });

  describe("backwards compatibility", () => {
    it("should export TableSelectionModel as an alias", () => {
      expect(TableSelectionModel).toBe(SelectionModel);
    });

    it("should be usable as TableSelectionModel type", () => {
      const model: TableSelectionModel<string> = new SelectionModel("single");
      model.select("test");
      expect(model.selected()).toEqual(["test"]);
    });
  });
});
