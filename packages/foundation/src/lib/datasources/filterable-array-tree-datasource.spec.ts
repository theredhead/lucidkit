import { describe, it, expect, beforeEach } from "vitest";

import { FilterableArrayTreeDatasource } from "./filterable-array-tree-datasource";
import type { TreeNode } from "./datasource";

describe("FilterableArrayTreeDatasource", () => {
  interface TestNode extends TreeNode<{ id: string; name: string }> {
    children?: TestNode[];
  }

  let ds: FilterableArrayTreeDatasource<{ id: string; name: string }>;

  describe("creation and defaults", () => {
    beforeEach(() => {
      ds = new FilterableArrayTreeDatasource<{ id: string; name: string }>(
        [
          {
            data: { id: "1", name: "Root A" },
            children: [
              { data: { id: "1-1", name: "Child A1" } },
              { data: { id: "1-2", name: "Child A2" } },
            ],
          },
          {
            data: { id: "2", name: "Root B" },
            children: [{ data: { id: "2-1", name: "Child B1" } }],
          },
        ] as TestNode[],
        "children",
      );
    });

    it("should create instance", () => {
      expect(ds).toBeTruthy();
    });

    it("should expose allRoots with full tree", () => {
      const allRoots = ds.allRoots;
      expect(allRoots).toHaveLength(2);
      expect(allRoots[0].children).toHaveLength(2);
      expect(allRoots[1].children).toHaveLength(1);
    });

    it("should expose getRootNodes matching allRoots initially", () => {
      const roots = ds.getRootNodes();
      expect(roots).toHaveLength(2);
      expect(roots[0].children).toHaveLength(2);
    });
  });

  describe("filtering", () => {
    beforeEach(() => {
      ds = new FilterableArrayTreeDatasource<{ id: string; name: string }>(
        [
          {
            data: { id: "1", name: "Root A" },
            children: [
              { data: { id: "1-1", name: "Child A1" } },
              { data: { id: "1-2", name: "Child A2" } },
            ],
          },
          {
            data: { id: "2", name: "Root B" },
            children: [
              { data: { id: "2-1", name: "Child B1" } },
              { data: { id: "2-2", name: "Child B2" } },
            ],
          },
        ] as TestNode[],
        "children",
      );
    });

    it("should filter by root node match", () => {
      ds.filterBy((node) => node.id === "1");
      const roots = ds.getRootNodes();
      expect(roots).toHaveLength(1);
      expect(roots[0].data.id).toBe("1");
      // Root matches but children don't → should not be included
      expect(roots[0].children).toHaveLength(0);
    });

    it("should include parent if child matches", () => {
      ds.filterBy((node) => node.id === "1-1");
      const roots = ds.getRootNodes();
      expect(roots).toHaveLength(1);
      expect(roots[0].data.id).toBe("1");
      expect(roots[0].children).toHaveLength(1);
      expect(roots[0].children![0].data.id).toBe("1-1");
    });

    it("should include multiple matching children", () => {
      ds.filterBy((node) => node.id.startsWith("1-"));
      const roots = ds.getRootNodes();
      expect(roots).toHaveLength(1);
      expect(roots[0].data.id).toBe("1");
      expect(roots[0].children).toHaveLength(2);
      expect(roots[0].children![0].data.id).toBe("1-1");
      expect(roots[0].children![1].data.id).toBe("1-2");
    });

    it("should handle mixed root and child matches", () => {
      ds.filterBy((node) => node.id === "1" || node.id === "2-1");
      const roots = ds.getRootNodes();
      expect(roots).toHaveLength(2);
      expect(roots[0].data.id).toBe("1");
      expect(roots[0].children).toHaveLength(0); // Root matches but no children match
      expect(roots[1].data.id).toBe("2");
      expect(roots[1].children).toHaveLength(1);
      expect(roots[1].children![0].data.id).toBe("2-1");
    });

    it("should exclude all nodes when predicate matches none", () => {
      ds.filterBy((node) => node.id === "nonexistent");
      const roots = ds.getRootNodes();
      expect(roots).toHaveLength(0);
    });

    it("should clear filter with null", () => {
      ds.filterBy((node) => node.id === "1-1");
      ds.filterBy(null);
      const roots = ds.getRootNodes();
      expect(roots).toHaveLength(2);
      expect(roots[0].children).toHaveLength(2);
    });

    it("should clear filter with undefined", () => {
      ds.filterBy((node) => node.id === "1-1");
      ds.filterBy(undefined);
      const roots = ds.getRootNodes();
      expect(roots).toHaveLength(2);
      expect(roots[0].children).toHaveLength(2);
    });
  });

  describe("immutability", () => {
    beforeEach(() => {
      ds = new FilterableArrayTreeDatasource<{ id: string; name: string }>(
        [
          {
            data: { id: "1", name: "Root" },
            children: [{ data: { id: "1-1", name: "Child" } }],
          },
        ] as TestNode[],
        "children",
      );
    });

    it("should not mutate original data when applying predicate", () => {
      const allRoots = ds.allRoots;
      const originalChildCount = allRoots[0].children!.length;

      ds.filterBy((node) => node.id === "1");
      const allRootsAfter = ds.allRoots;
      expect(allRootsAfter[0].children).toHaveLength(originalChildCount);
    });

    it("should return same array instance for consistent filtering", () => {
      const roots1 = ds.getRootNodes();
      const roots2 = ds.getRootNodes();
      expect(roots1).toBe(roots2); // Same array instance (like base class)
    });
  });

  describe("deep trees", () => {
    beforeEach(() => {
      ds = new FilterableArrayTreeDatasource<{ id: string; name: string }>(
        [
          {
            data: { id: "1", name: "L1" },
            children: [
              {
                data: { id: "1-1", name: "L2" },
                children: [
                  { data: { id: "1-1-1", name: "L3" } },
                  { data: { id: "1-1-2", name: "L3" } },
                ],
              },
              { data: { id: "1-2", name: "L2" } },
            ],
          },
        ] as TestNode[],
        "children",
      );
    });

    it("should filter deep leaf nodes", () => {
      ds.filterBy((node) => node.id === "1-1-1");
      const roots = ds.getRootNodes();
      expect(roots).toHaveLength(1);
      expect(roots[0].children).toHaveLength(1);
      expect(roots[0].children![0].children).toHaveLength(1);
      expect(roots[0].children![0].children![0].data.id).toBe("1-1-1");
    });

    it("should preserve all levels when filter matches middle level", () => {
      ds.filterBy((node) => node.id === "1-1");
      const roots = ds.getRootNodes();
      expect(roots).toHaveLength(1);
      expect(roots[0].children).toHaveLength(1);
      expect(roots[0].children![0].data.id).toBe("1-1");
      expect(roots[0].children![0].children).toHaveLength(0); // Children don't match
    });
  });
});
