import { GanttArrayDatasource } from "./gantt-array-datasource";
import type { GanttTask } from "./gantt-chart.types";

describe("GanttArrayDatasource", () => {
  const sampleTasks: GanttTask[] = [
    {
      id: "1",
      title: "Design",
      start: new Date("2026-03-01"),
      end: new Date("2026-03-05"),
    },
    {
      id: "2",
      title: "Build",
      start: new Date("2026-03-06"),
      end: new Date("2026-03-15"),
      dependencies: ["1"],
    },
    {
      id: "3",
      title: "Test",
      start: new Date("2026-03-16"),
      end: new Date("2026-03-20"),
      dependencies: ["2"],
    },
  ];

  describe("constructor", () => {
    it("should create an instance", () => {
      const ds = new GanttArrayDatasource(sampleTasks);
      expect(ds).toBeTruthy();
    });

    it("should make a defensive copy", () => {
      const mutable = [...sampleTasks];
      const ds = new GanttArrayDatasource(mutable);
      mutable.push({
        id: "4",
        title: "Extra",
        start: new Date("2026-04-01"),
        end: new Date("2026-04-10"),
      });
      expect(ds.getTasks().length).toBe(3);
    });
  });

  describe("getTasks", () => {
    it("should return all tasks", () => {
      const ds = new GanttArrayDatasource(sampleTasks);
      expect(ds.getTasks().length).toBe(3);
      expect(ds.getTasks()[0].title).toBe("Design");
    });
  });

  describe("getDependencies", () => {
    it("should derive dependency links from task dependencies arrays", () => {
      const ds = new GanttArrayDatasource(sampleTasks);
      const deps = ds.getDependencies();

      expect(deps.length).toBe(2);
      expect(deps[0]).toEqual({ fromId: "1", toId: "2" });
      expect(deps[1]).toEqual({ fromId: "2", toId: "3" });
    });

    it("should silently drop dangling dependency references", () => {
      const tasks: GanttTask[] = [
        {
          id: "a",
          title: "A",
          start: new Date("2026-03-01"),
          end: new Date("2026-03-05"),
          dependencies: ["nonexistent"],
        },
      ];
      const ds = new GanttArrayDatasource(tasks);
      expect(ds.getDependencies().length).toBe(0);
    });

    it("should return empty for tasks with no dependencies", () => {
      const tasks: GanttTask[] = [
        {
          id: "a",
          title: "A",
          start: new Date("2026-03-01"),
          end: new Date("2026-03-05"),
        },
      ];
      const ds = new GanttArrayDatasource(tasks);
      expect(ds.getDependencies().length).toBe(0);
    });
  });

  describe("setTasks", () => {
    it("should replace tasks and rebuild dependencies", () => {
      const ds = new GanttArrayDatasource(sampleTasks);
      expect(ds.getTasks().length).toBe(3);

      const newTasks: GanttTask[] = [
        {
          id: "x",
          title: "X",
          start: new Date("2026-04-01"),
          end: new Date("2026-04-10"),
        },
        {
          id: "y",
          title: "Y",
          start: new Date("2026-04-11"),
          end: new Date("2026-04-20"),
          dependencies: ["x"],
        },
      ];

      ds.setTasks(newTasks);
      expect(ds.getTasks().length).toBe(2);
      expect(ds.getDependencies().length).toBe(1);
      expect(ds.getDependencies()[0]).toEqual({ fromId: "x", toId: "y" });
    });

    it("should make a defensive copy of new tasks", () => {
      const ds = new GanttArrayDatasource([]);
      const newTasks: GanttTask[] = [
        {
          id: "a",
          title: "A",
          start: new Date("2026-03-01"),
          end: new Date("2026-03-05"),
        },
      ];
      ds.setTasks(newTasks);
      newTasks.push({
        id: "b",
        title: "B",
        start: new Date("2026-03-06"),
        end: new Date("2026-03-10"),
      });
      expect(ds.getTasks().length).toBe(1);
    });
  });
});
