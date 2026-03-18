import type {
  GanttDependencyLink,
  GanttTask,
  IGanttDatasource,
} from "./gantt-chart.types";

/**
 * In-memory {@link IGanttDatasource} backed by a plain array of
 * {@link GanttTask} objects.
 *
 * Dependency links are derived automatically from each task's
 * `dependencies` array on construction (and when `setTasks` is called).
 *
 * @typeParam T - Optional payload type on each task.
 *
 * @example
 * ```ts
 * const ds = new GanttArrayDatasource([
 *   { id: '1', title: 'Design', start: new Date('2026-01-01'), end: new Date('2026-01-10') },
 *   { id: '2', title: 'Build',  start: new Date('2026-01-11'), end: new Date('2026-01-25'), dependencies: ['1'] },
 * ]);
 * ```
 */
export class GanttArrayDatasource<T = unknown> implements IGanttDatasource<T> {
  private tasks: readonly GanttTask<T>[];
  private links: readonly GanttDependencyLink[];

  public constructor(tasks: readonly GanttTask<T>[]) {
    this.tasks = [...tasks];
    this.links = GanttArrayDatasource.buildLinks(this.tasks);
  }

  /** @inheritdoc */
  public getTasks(): readonly GanttTask<T>[] {
    return this.tasks;
  }

  /** @inheritdoc */
  public getDependencies(): readonly GanttDependencyLink[] {
    return this.links;
  }

  /**
   * Replace all tasks and rebuild dependency links.
   *
   * @param tasks - The new task array.
   */
  public setTasks(tasks: readonly GanttTask<T>[]): void {
    this.tasks = [...tasks];
    this.links = GanttArrayDatasource.buildLinks(this.tasks);
  }

  /**
   * Derive dependency links from task `dependencies` arrays.
   *
   * Only links where both the `fromId` and `toId` exist in the task
   * list are included — dangling references are silently dropped.
   */
  private static buildLinks<U>(
    tasks: readonly GanttTask<U>[],
  ): GanttDependencyLink[] {
    const idSet = new Set(tasks.map((t) => t.id));
    const links: GanttDependencyLink[] = [];

    for (const task of tasks) {
      if (!task.dependencies) continue;
      for (const depId of task.dependencies) {
        if (idSet.has(depId)) {
          links.push({ fromId: depId, toId: task.id });
        }
      }
    }

    return links;
  }
}
