import {
  isFilterableDatasource,
  isSortableDatasource,
  isFilterableTreeDatasource,
  isTreeDatasource,
  isSortableTreeDatasource,
  isReorderableDatasource,
  isInsertableDatasource,
  isRemovableDatasource,
} from "./type-guards";

describe("datasource type-guards", () => {
  describe("isFilterableDatasource", () => {
    it("should return true when filterBy is a function", () => {
      expect(isFilterableDatasource({ filterBy: () => {} })).toBe(true);
    });

    it("should return false when filterBy is missing", () => {
      expect(isFilterableDatasource({})).toBe(false);
    });

    it("should return false when filterBy is not a function", () => {
      expect(isFilterableDatasource({ filterBy: "not a fn" })).toBe(false);
    });

    it("should return false for null", () => {
      expect(isFilterableDatasource(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isFilterableDatasource(undefined)).toBe(false);
    });
  });

  describe("isSortableDatasource", () => {
    it("should return true when sortBy is a function", () => {
      expect(isSortableDatasource({ sortBy: () => {} })).toBe(true);
    });

    it("should return false when sortBy is missing", () => {
      expect(isSortableDatasource({})).toBe(false);
    });

    it("should return false for null", () => {
      expect(isSortableDatasource(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isSortableDatasource(undefined)).toBe(false);
    });
  });

  describe("isFilterableTreeDatasource", () => {
    it("should return true when filterBy is a function", () => {
      expect(isFilterableTreeDatasource({ filterBy: () => {} })).toBe(true);
    });

    it("should return false when filterBy is missing", () => {
      expect(isFilterableTreeDatasource({})).toBe(false);
    });

    it("should return false for null", () => {
      expect(isFilterableTreeDatasource(null)).toBe(false);
    });
  });

  describe("isTreeDatasource", () => {
    it("should return true when all three methods are present", () => {
      const ds = {
        getRootNodes: () => {},
        getChildren: () => {},
        hasChildren: () => {},
      };
      expect(isTreeDatasource(ds)).toBe(true);
    });

    it("should return false when getRootNodes is missing", () => {
      expect(
        isTreeDatasource({ getChildren: () => {}, hasChildren: () => {} }),
      ).toBe(false);
    });

    it("should return false when getChildren is missing", () => {
      expect(
        isTreeDatasource({ getRootNodes: () => {}, hasChildren: () => {} }),
      ).toBe(false);
    });

    it("should return false when hasChildren is missing", () => {
      expect(
        isTreeDatasource({ getRootNodes: () => {}, getChildren: () => {} }),
      ).toBe(false);
    });

    it("should return false for null", () => {
      expect(isTreeDatasource(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isTreeDatasource(undefined)).toBe(false);
    });
  });

  describe("isSortableTreeDatasource", () => {
    it("should return true when applyComparator is a function", () => {
      expect(
        isSortableTreeDatasource({ applyComparator: () => {} }),
      ).toBe(true);
    });

    it("should return false when applyComparator is missing", () => {
      expect(isSortableTreeDatasource({})).toBe(false);
    });

    it("should return false for null", () => {
      expect(isSortableTreeDatasource(null)).toBe(false);
    });
  });

  describe("isReorderableDatasource", () => {
    it("should return true when moveItem is a function", () => {
      expect(isReorderableDatasource({ moveItem: () => {} })).toBe(true);
    });

    it("should return false when moveItem is missing", () => {
      expect(isReorderableDatasource({})).toBe(false);
    });

    it("should return false for null", () => {
      expect(isReorderableDatasource(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isReorderableDatasource(undefined)).toBe(false);
    });
  });

  describe("isInsertableDatasource", () => {
    it("should return true when insertItem is a function", () => {
      expect(isInsertableDatasource({ insertItem: () => {} })).toBe(true);
    });

    it("should return false when insertItem is missing", () => {
      expect(isInsertableDatasource({})).toBe(false);
    });

    it("should return false for null", () => {
      expect(isInsertableDatasource(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isInsertableDatasource(undefined)).toBe(false);
    });
  });

  describe("isRemovableDatasource", () => {
    it("should return true when removeItem is a function", () => {
      expect(isRemovableDatasource({ removeItem: () => {} })).toBe(true);
    });

    it("should return false when removeItem is missing", () => {
      expect(isRemovableDatasource({})).toBe(false);
    });

    it("should return false for null", () => {
      expect(isRemovableDatasource(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isRemovableDatasource(undefined)).toBe(false);
    });
  });
});
