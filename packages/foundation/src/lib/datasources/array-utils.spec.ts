import {
  moveItemInArray,
  moveItemToArray,
  moveItemInArrayPure,
  moveItemToArrayPure,
} from "./array-utils";

describe("array-utils", () => {
  describe("moveItemInArray", () => {
    it("should move an item forward", () => {
      const arr = ["a", "b", "c", "d"];
      moveItemInArray(arr, 0, 2);
      expect(arr).toEqual(["b", "c", "a", "d"]);
    });

    it("should move an item backward", () => {
      const arr = ["a", "b", "c", "d"];
      moveItemInArray(arr, 3, 1);
      expect(arr).toEqual(["a", "d", "b", "c"]);
    });

    it("should be a no-op when from === to", () => {
      const arr = ["a", "b", "c"];
      moveItemInArray(arr, 1, 1);
      expect(arr).toEqual(["a", "b", "c"]);
    });

    it("should move to the end", () => {
      const arr = ["a", "b", "c"];
      moveItemInArray(arr, 0, 2);
      expect(arr).toEqual(["b", "c", "a"]);
    });

    it("should move to the start", () => {
      const arr = ["a", "b", "c"];
      moveItemInArray(arr, 2, 0);
      expect(arr).toEqual(["c", "a", "b"]);
    });

    it("should handle single-element array", () => {
      const arr = ["x"];
      moveItemInArray(arr, 0, 0);
      expect(arr).toEqual(["x"]);
    });

    it("should throw RangeError for negative fromIndex", () => {
      expect(() => moveItemInArray(["a", "b"], -1, 0)).toThrow(RangeError);
    });

    it("should throw RangeError for out-of-bounds fromIndex", () => {
      expect(() => moveItemInArray(["a", "b"], 2, 0)).toThrow(RangeError);
    });

    it("should throw RangeError for negative toIndex", () => {
      expect(() => moveItemInArray(["a", "b"], 0, -1)).toThrow(RangeError);
    });

    it("should throw RangeError for out-of-bounds toIndex", () => {
      expect(() => moveItemInArray(["a", "b"], 0, 2)).toThrow(RangeError);
    });
  });

  describe("moveItemToArray", () => {
    it("should transfer an item between arrays", () => {
      const src = ["a", "b", "c"];
      const tgt = ["x", "y"];
      moveItemToArray(src, 1, tgt, 1);
      expect(src).toEqual(["a", "c"]);
      expect(tgt).toEqual(["x", "b", "y"]);
    });

    it("should transfer from start to start", () => {
      const src = ["a", "b"];
      const tgt = ["x"];
      moveItemToArray(src, 0, tgt, 0);
      expect(src).toEqual(["b"]);
      expect(tgt).toEqual(["a", "x"]);
    });

    it("should transfer to empty array", () => {
      const src = ["a", "b"];
      const tgt: string[] = [];
      moveItemToArray(src, 0, tgt, 0);
      expect(src).toEqual(["b"]);
      expect(tgt).toEqual(["a"]);
    });

    it("should transfer to end of target", () => {
      const src = ["a"];
      const tgt = ["x", "y"];
      moveItemToArray(src, 0, tgt, 2);
      expect(src).toEqual([]);
      expect(tgt).toEqual(["x", "y", "a"]);
    });

    it("should throw RangeError for negative fromIndex", () => {
      expect(() => moveItemToArray(["a"], -1, ["x"], 0)).toThrow(RangeError);
    });

    it("should throw RangeError for out-of-bounds fromIndex", () => {
      expect(() => moveItemToArray(["a"], 1, ["x"], 0)).toThrow(RangeError);
    });

    it("should throw RangeError for negative toIndex", () => {
      expect(() => moveItemToArray(["a"], 0, ["x"], -1)).toThrow(RangeError);
    });

    it("should throw RangeError for out-of-bounds toIndex", () => {
      expect(() => moveItemToArray(["a"], 0, ["x"], 2)).toThrow(RangeError);
    });
  });

  describe("moveItemInArrayPure", () => {
    it("should return a new array with the item moved", () => {
      const original = ["a", "b", "c", "d"];
      const result = moveItemInArrayPure(original, 0, 2);
      expect(result).toEqual(["b", "c", "a", "d"]);
      expect(original).toEqual(["a", "b", "c", "d"]);
    });

    it("should not mutate the original array", () => {
      const original = Object.freeze(["a", "b", "c"]);
      const result = moveItemInArrayPure(original, 2, 0);
      expect(result).toEqual(["c", "a", "b"]);
    });

    it("should handle same index", () => {
      const result = moveItemInArrayPure(["a", "b"], 0, 0);
      expect(result).toEqual(["a", "b"]);
    });

    it("should throw RangeError for out-of-bounds fromIndex", () => {
      expect(() => moveItemInArrayPure(["a"], 1, 0)).toThrow(RangeError);
    });

    it("should throw RangeError for out-of-bounds toIndex", () => {
      expect(() => moveItemInArrayPure(["a"], 0, 1)).toThrow(RangeError);
    });
  });

  describe("moveItemToArrayPure", () => {
    it("should return new arrays with the item transferred", () => {
      const src = ["a", "b", "c"];
      const tgt = ["x", "y"];
      const [newSrc, newTgt] = moveItemToArrayPure(src, 1, tgt, 1);
      expect(newSrc).toEqual(["a", "c"]);
      expect(newTgt).toEqual(["x", "b", "y"]);
    });

    it("should not mutate the original arrays", () => {
      const src = Object.freeze(["a", "b"]);
      const tgt = Object.freeze(["x"]);
      const [newSrc, newTgt] = moveItemToArrayPure(src, 0, tgt, 0);
      expect(newSrc).toEqual(["b"]);
      expect(newTgt).toEqual(["a", "x"]);
    });

    it("should transfer to empty target", () => {
      const [newSrc, newTgt] = moveItemToArrayPure(["a"], 0, [], 0);
      expect(newSrc).toEqual([]);
      expect(newTgt).toEqual(["a"]);
    });

    it("should throw RangeError for out-of-bounds fromIndex", () => {
      expect(() => moveItemToArrayPure(["a"], 1, ["x"], 0)).toThrow(RangeError);
    });

    it("should throw RangeError for out-of-bounds toIndex", () => {
      expect(() => moveItemToArrayPure(["a"], 0, ["x"], 2)).toThrow(RangeError);
    });
  });
});
