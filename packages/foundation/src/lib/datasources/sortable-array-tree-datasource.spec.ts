import { describe, it, expect } from "vitest";
import { SortableArrayTreeDatasource } from "./sortable-array-tree-datasource";
import { isSortableTreeDatasource } from "./type-guards";
import type { TreeNode } from "./datasource";
import { SortDirection } from "../types/sort";

interface TestData {
  id: string;
  name: string;
}

function createTestNode(
  id: string,
  name: string,
  children?: TreeNode<TestData>[],
): TreeNode<TestData> {
  return {
    id,
    data: { id, name },
    children,
  };
}

describe("SortableArrayTreeDatasource", () => {
  it("should create a datasource with unsorted roots", () => {
    const roots: TreeNode<TestData>[] = [
      createTestNode("1", "Zebra"),
      createTestNode("2", "Apple"),
      createTestNode("3", "Mango"),
    ];

    const ds = new SortableArrayTreeDatasource(roots);
    const nodes = ds.getRootNodes();

    expect(nodes).toHaveLength(3);
    expect(nodes[0].data.name).toBe("Zebra");
    expect(nodes[1].data.name).toBe("Apple");
    expect(nodes[2].data.name).toBe("Mango");
  });

  it("should sort root nodes with a comparator", () => {
    const roots: TreeNode<TestData>[] = [
      createTestNode("1", "Zebra"),
      createTestNode("2", "Apple"),
      createTestNode("3", "Mango"),
    ];

    const ds = new SortableArrayTreeDatasource(roots);
    const comparator = (a: TreeNode<TestData>, b: TreeNode<TestData>) =>
      a.data.name.localeCompare(b.data.name);

    ds.applyComparator(comparator);
    const nodes = ds.getRootNodes();

    expect(nodes[0].data.name).toBe("Apple");
    expect(nodes[1].data.name).toBe("Mango");
    expect(nodes[2].data.name).toBe("Zebra");
  });

  it("should recursively sort children nodes", () => {
    const roots: TreeNode<TestData>[] = [
      createTestNode("1", "Zoo", [
        createTestNode("1.3", "Zebra"),
        createTestNode("1.1", "Apple"),
        createTestNode("1.2", "Mango"),
      ]),
      createTestNode("2", "Animals", [
        createTestNode("2.2", "Wolf"),
        createTestNode("2.1", "Bear"),
      ]),
    ];

    const ds = new SortableArrayTreeDatasource(roots);
    const comparator = (a: TreeNode<TestData>, b: TreeNode<TestData>) =>
      a.data.name.localeCompare(b.data.name);

    ds.applyComparator(comparator);
    const nodes = ds.getRootNodes();

    // Root nodes sorted
    expect(nodes[0].data.name).toBe("Animals");
    expect(nodes[1].data.name).toBe("Zoo");

    // Children of "Animals" sorted
    expect(nodes[0].children![0].data.name).toBe("Bear");
    expect(nodes[0].children![1].data.name).toBe("Wolf");

    // Children of "Zoo" sorted
    expect(nodes[1].children![0].data.name).toBe("Apple");
    expect(nodes[1].children![1].data.name).toBe("Mango");
    expect(nodes[1].children![2].data.name).toBe("Zebra");
  });

  it("should sort by numeric values", () => {
    const roots: TreeNode<{ id: string; value: number }>[] = [
      {
        id: "1",
        data: { id: "a", value: 30 },
        children: [
          { id: "1.2", data: { id: "x", value: 2 } },
          { id: "1.1", data: { id: "y", value: 15 } },
          { id: "1.3", data: { id: "z", value: 5 } },
        ],
      },
    ];

    const ds = new SortableArrayTreeDatasource(roots);
    const comparator = (
      a: TreeNode<{ id: string; value: number }>,
      b: TreeNode<{ id: string; value: number }>,
    ) => {
      return a.data.value - b.data.value;
    };

    ds.applyComparator(comparator);
    const nodes = ds.getRootNodes();
    const children = nodes[0].children!;

    expect(children[0].id).toBe("1.2");
    expect(children[1].id).toBe("1.3");
    expect(children[2].id).toBe("1.1");
  });

  it("should maintain allRoots unchanged after sorting", () => {
    const roots: TreeNode<TestData>[] = [
      createTestNode("1", "Zebra"),
      createTestNode("2", "Apple"),
    ];

    const ds = new SortableArrayTreeDatasource(roots);
    const originalOrder = ds.allRoots.map((n) => n.data.name);

    const comparator = (a: TreeNode<TestData>, b: TreeNode<TestData>) =>
      a.data.name.localeCompare(b.data.name);
    ds.applyComparator(comparator);

    // allRoots should remain in original order
    expect(ds.allRoots.map((n) => n.data.name)).toEqual(originalOrder);

    // getRootNodes should be sorted
    const sortedNodes = ds.getRootNodes();
    expect(sortedNodes[0].data.name).toBe("Apple");
    expect(sortedNodes[1].data.name).toBe("Zebra");
  });

  it("should clear sort with null comparator", () => {
    const roots: TreeNode<TestData>[] = [
      createTestNode("1", "Zebra"),
      createTestNode("2", "Apple"),
      createTestNode("3", "Mango"),
    ];

    const ds = new SortableArrayTreeDatasource(roots);
    const comparator = (a: TreeNode<TestData>, b: TreeNode<TestData>) =>
      a.data.name.localeCompare(b.data.name);

    // Apply sort
    ds.applyComparator(comparator);
    expect(ds.getRootNodes()[0].data.name).toBe("Apple");

    // Clear sort
    ds.applyComparator(null);
    expect(ds.getRootNodes()[0].data.name).toBe("Zebra");
  });

  it("should clear sort with undefined comparator", () => {
    const roots: TreeNode<TestData>[] = [
      createTestNode("1", "Zebra"),
      createTestNode("2", "Apple"),
    ];

    const ds = new SortableArrayTreeDatasource(roots);
    const comparator = (a: TreeNode<TestData>, b: TreeNode<TestData>) =>
      a.data.name.localeCompare(b.data.name);

    ds.applyComparator(comparator);
    ds.applyComparator(undefined);

    expect(ds.getRootNodes()[0].data.name).toBe("Zebra");
  });

  it("should handle empty tree", () => {
    const ds = new SortableArrayTreeDatasource([]);
    const comparator = (a: TreeNode<TestData>, b: TreeNode<TestData>) =>
      a.data.name.localeCompare(b.data.name);

    ds.applyComparator(comparator);

    expect(ds.getRootNodes()).toEqual([]);
  });

  it("should handle tree with no children", () => {
    const roots: TreeNode<TestData>[] = [
      createTestNode("1", "Zebra"),
      createTestNode("2", "Apple"),
    ];

    const ds = new SortableArrayTreeDatasource(roots);
    const comparator = (a: TreeNode<TestData>, b: TreeNode<TestData>) =>
      a.data.name.localeCompare(b.data.name);

    ds.applyComparator(comparator);
    const nodes = ds.getRootNodes();

    expect(nodes).toHaveLength(2);
    expect(nodes[0].children).toBeUndefined();
    expect(nodes[1].children).toBeUndefined();
  });

  it("should support multiple sorts sequentially", () => {
    const roots: TreeNode<TestData>[] = [
      createTestNode("1", "Zebra"),
      createTestNode("2", "Apple"),
      createTestNode("3", "Mango"),
    ];

    const ds = new SortableArrayTreeDatasource(roots);

    // First sort: alphabetical
    const alphabeticComparator = (
      a: TreeNode<TestData>,
      b: TreeNode<TestData>,
    ) => a.data.name.localeCompare(b.data.name);
    ds.applyComparator(alphabeticComparator);
    expect(ds.getRootNodes()[0].data.name).toBe("Apple");

    // Second sort: reverse alphabetical
    const reverseComparator = (a: TreeNode<TestData>, b: TreeNode<TestData>) =>
      b.data.name.localeCompare(a.data.name);
    ds.applyComparator(reverseComparator);
    expect(ds.getRootNodes()[0].data.name).toBe("Zebra");
  });

  it("should handle deep nested trees", () => {
    const roots: TreeNode<TestData>[] = [
      createTestNode("1", "Zebra", [
        createTestNode("1.1", "Beta", [
          createTestNode("1.1.3", "Zebra"),
          createTestNode("1.1.1", "Apple"),
          createTestNode("1.1.2", "Mango"),
        ]),
        createTestNode("1.2", "Alpha"),
      ]),
    ];

    const ds = new SortableArrayTreeDatasource(roots);
    const comparator = (a: TreeNode<TestData>, b: TreeNode<TestData>) =>
      a.data.name.localeCompare(b.data.name);

    ds.applyComparator(comparator);
    const nodes = ds.getRootNodes();

    // Root should stay same (only one)
    expect(nodes[0].data.name).toBe("Zebra");

    // First level children sorted
    expect(nodes[0].children![0].data.name).toBe("Alpha");
    expect(nodes[0].children![1].data.name).toBe("Beta");

    // Deep nested children sorted
    const betaChildren = nodes[0].children![1].children!;
    expect(betaChildren[0].data.name).toBe("Apple");
    expect(betaChildren[1].data.name).toBe("Mango");
    expect(betaChildren[2].data.name).toBe("Zebra");
  });

  it("should preserve node immutability", () => {
    const roots: TreeNode<TestData>[] = [
      createTestNode("1", "Zebra"),
      createTestNode("2", "Apple"),
    ];

    const ds = new SortableArrayTreeDatasource(roots);
    const originalFirst = roots[0];

    const comparator = (a: TreeNode<TestData>, b: TreeNode<TestData>) =>
      a.data.name.localeCompare(b.data.name);
    ds.applyComparator(comparator);

    // Original root should not be modified
    expect(roots[0]).toBe(originalFirst);
    expect(roots[0].data.name).toBe("Zebra");
  });

  describe("sortBy (ISortableTreeDatasource)", () => {
    it("should be recognised by isSortableTreeDatasource type guard", () => {
      const ds = new SortableArrayTreeDatasource([
        createTestNode("1", "Apple"),
      ]);
      expect(isSortableTreeDatasource(ds)).toBe(true);
    });

    it("should sort root nodes by data property ascending", () => {
      const roots: TreeNode<TestData>[] = [
        createTestNode("1", "Zebra"),
        createTestNode("2", "Apple"),
        createTestNode("3", "Mango"),
      ];
      const ds = new SortableArrayTreeDatasource(roots);

      ds.sortBy([{ columnKey: "name", direction: SortDirection.Ascending }]);
      const nodes = ds.getRootNodes();

      expect(nodes[0].data.name).toBe("Apple");
      expect(nodes[1].data.name).toBe("Mango");
      expect(nodes[2].data.name).toBe("Zebra");
    });

    it("should sort root nodes descending", () => {
      const roots: TreeNode<TestData>[] = [
        createTestNode("1", "Apple"),
        createTestNode("2", "Zebra"),
        createTestNode("3", "Mango"),
      ];
      const ds = new SortableArrayTreeDatasource(roots);

      ds.sortBy([{ columnKey: "name", direction: SortDirection.Descending }]);
      const nodes = ds.getRootNodes();

      expect(nodes[0].data.name).toBe("Zebra");
      expect(nodes[1].data.name).toBe("Mango");
      expect(nodes[2].data.name).toBe("Apple");
    });

    it("should recursively sort children", () => {
      const roots: TreeNode<TestData>[] = [
        createTestNode("1", "Zoo", [
          createTestNode("1.1", "Zebra"),
          createTestNode("1.2", "Apple"),
        ]),
      ];
      const ds = new SortableArrayTreeDatasource(roots);

      ds.sortBy([{ columnKey: "name", direction: SortDirection.Ascending }]);
      const children = ds.getRootNodes()[0].children!;

      expect(children[0].data.name).toBe("Apple");
      expect(children[1].data.name).toBe("Zebra");
    });

    it("should clear sort when given null", () => {
      const roots: TreeNode<TestData>[] = [
        createTestNode("1", "Zebra"),
        createTestNode("2", "Apple"),
      ];
      const ds = new SortableArrayTreeDatasource(roots);

      ds.sortBy([{ columnKey: "name", direction: SortDirection.Ascending }]);
      ds.sortBy(null);
      const nodes = ds.getRootNodes();

      expect(nodes[0].data.name).toBe("Zebra");
      expect(nodes[1].data.name).toBe("Apple");
    });

    it("should clear sort when given empty array", () => {
      const roots: TreeNode<TestData>[] = [
        createTestNode("1", "Zebra"),
        createTestNode("2", "Apple"),
      ];
      const ds = new SortableArrayTreeDatasource(roots);

      ds.sortBy([{ columnKey: "name", direction: SortDirection.Ascending }]);
      ds.sortBy([]);
      const nodes = ds.getRootNodes();

      expect(nodes[0].data.name).toBe("Zebra");
      expect(nodes[1].data.name).toBe("Apple");
    });
  });
});
