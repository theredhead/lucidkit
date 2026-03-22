import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  type WritableSignal,
} from "@angular/core";
import { UIGanttChart } from "./gantt-chart.component";
import { GanttArrayDatasource } from "./gantt-array-datasource";
import type { GanttTask, GanttViewMode } from "./gantt-chart.types";

// ── Test host ────────────────────────────────────────────────────────

const TEST_TASKS: GanttTask[] = [
  {
    id: "design",
    title: "Design Phase",
    start: new Date("2026-03-01"),
    end: new Date("2026-03-10"),
    progress: 100,
  },
  {
    id: "build",
    title: "Build Phase",
    start: new Date("2026-03-11"),
    end: new Date("2026-03-25"),
    progress: 60,
    dependencies: ["design"],
  },
  {
    id: "milestone",
    title: "Launch",
    start: new Date("2026-03-26"),
    end: new Date("2026-03-26"),
    milestone: true,
    dependencies: ["build"],
  },
  {
    id: "child",
    title: "Sub-task",
    start: new Date("2026-03-12"),
    end: new Date("2026-03-15"),
    parentId: "build",
  },
];

@Component({
  selector: "ui-gantt-test-host",
  standalone: true,
  imports: [UIGanttChart],
  template: `
    <ui-gantt-chart
      [datasource]="datasource()"
      [viewMode]="viewMode()"
      [rowHeight]="rowHeight()"
      [showToday]="showToday()"
      [showTaskList]="showTaskList()"
      [taskListWidth]="taskListWidth()"
      [ariaLabel]="ariaLabel()"
      (taskClicked)="lastClicked = $event"
    />
  `,
})
class TestGanttHost {
  public readonly datasource: WritableSignal<GanttArrayDatasource> = signal(
    new GanttArrayDatasource(TEST_TASKS),
  );
  public readonly viewMode = signal<GanttViewMode>("day");
  public readonly rowHeight = signal(36);
  public readonly showToday = signal(true);
  public readonly showTaskList = signal(true);
  public readonly taskListWidth = signal(200);
  public readonly ariaLabel = signal("Test Gantt");
  public lastClicked: GanttTask | null = null;
}

// ── Tests ────────────────────────────────────────────────────────────

describe("UIGanttChart", () => {
  let fixture: ComponentFixture<TestGanttHost>;
  let host: TestGanttHost;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestGanttHost],
    })
      .overrideComponent(TestGanttHost, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TestGanttHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  // ── Creation ────────────────────────────────────────────────────

  describe("creation", () => {
    it("should create", () => {
      const gantt = el.querySelector("ui-gantt-chart");
      expect(gantt).toBeTruthy();
    });

    it("should have the host class", () => {
      const gantt = el.querySelector("ui-gantt-chart");
      expect(gantt!.classList.contains("ui-gantt-chart")).toBe(true);
    });
  });

  // ── Rendering ──────────────────────────────────────────────────

  describe("rendering", () => {
    it("should render the gantt container", () => {
      expect(el.querySelector(".container")).toBeTruthy();
    });

    it("should render task list sidebar", () => {
      expect(el.querySelector(".task-list")).toBeTruthy();
    });

    it("should render timeline header with groups", () => {
      const groups = el.querySelectorAll(".header__group-cell");
      expect(groups.length).toBeGreaterThan(0);
    });

    it("should render timeline header with columns", () => {
      const cols = el.querySelectorAll(".header__col-cell");
      expect(cols.length).toBeGreaterThan(0);
    });

    it("should render task rows", () => {
      const rows = el.querySelectorAll(".row");
      expect(rows.length).toBe(4); // 4 test tasks
    });

    it("should render task bars for non-milestone tasks", () => {
      const bars = el.querySelectorAll(".bar");
      expect(bars.length).toBe(3); // design, build, child
    });

    it("should render milestone diamonds", () => {
      const milestones = el.querySelectorAll(".milestone");
      expect(milestones.length).toBe(1);
    });

    it("should render progress overlays for tasks with progress", () => {
      const progress = el.querySelectorAll(".bar__progress");
      expect(progress.length).toBe(2); // design (100%) and build (60%)
    });
  });

  // ── Task list ──────────────────────────────────────────────────

  describe("task list", () => {
    it("should display task titles", () => {
      const labels = el.querySelectorAll(".task-list__label");
      const texts = Array.from(labels).map((l) => l.textContent?.trim());
      expect(texts).toContain("Design Phase");
      expect(texts).toContain("Build Phase");
      expect(texts).toContain("Launch");
    });

    it("should indent child tasks", () => {
      const rows = el.querySelectorAll(".task-list__row");
      // child task (index 3) should have more padding than top-level (index 0)
      const topLevelPadding =
        (rows[0] as HTMLElement).style.paddingLeft || "12px";
      const childPadding = (rows[3] as HTMLElement).style.paddingLeft;
      expect(parseInt(childPadding)).toBeGreaterThan(parseInt(topLevelPadding));
    });

    it("should hide when showTaskList is false", () => {
      host.showTaskList.set(false);
      fixture.detectChanges();
      expect(el.querySelector(".task-list")).toBeNull();
    });
  });

  // ── Accessibility ──────────────────────────────────────────────

  describe("accessibility", () => {
    it("should have role=region on the container", () => {
      const container = el.querySelector(".container");
      expect(container!.getAttribute("role")).toBe("region");
    });

    it("should set aria-label on the container", () => {
      const container = el.querySelector(".container");
      expect(container!.getAttribute("aria-label")).toBe("Test Gantt");
    });

    it("should set aria-label on task bars", () => {
      const bar = el.querySelector(".bar");
      expect(bar!.getAttribute("aria-label")).toBeTruthy();
    });

    it("should set aria-label on milestones", () => {
      const milestone = el.querySelector(".milestone");
      expect(milestone!.getAttribute("aria-label")).toContain("Milestone");
    });
  });

  // ── Interactions ───────────────────────────────────────────────

  describe("interactions", () => {
    it("should emit taskClicked when a bar is clicked", () => {
      const bar = el.querySelector(".bar") as HTMLElement;
      bar.click();
      expect(host.lastClicked).toBeTruthy();
      expect(host.lastClicked!.id).toBe("design");
    });

    it("should emit taskClicked when a milestone is clicked", () => {
      const milestone = el.querySelector(".milestone") as HTMLElement;
      milestone.click();
      expect(host.lastClicked).toBeTruthy();
      expect(host.lastClicked!.id).toBe("milestone");
    });
  });

  // ── View modes ─────────────────────────────────────────────────

  describe("view modes", () => {
    it("should update columns when viewMode changes to week", () => {
      const dayColCount = el.querySelectorAll(".header__col-cell").length;

      host.viewMode.set("week");
      fixture.detectChanges();

      const weekColCount = el.querySelectorAll(
        ".header__col-cell",
      ).length;
      // Week mode should have fewer columns than day mode
      expect(weekColCount).toBeLessThan(dayColCount);
    });

    it("should update columns when viewMode changes to month", () => {
      host.viewMode.set("month");
      fixture.detectChanges();

      const monthColCount = el.querySelectorAll(
        ".header__col-cell",
      ).length;
      // Month mode should have very few columns
      expect(monthColCount).toBeLessThanOrEqual(3);
    });
  });

  // ── Today marker ───────────────────────────────────────────────

  describe("today marker", () => {
    it("should hide when showToday is false", () => {
      host.showToday.set(false);
      fixture.detectChanges();
      expect(el.querySelector(".gantt-today-marker")).toBeNull();
    });
  });

  // ── Row height ─────────────────────────────────────────────────

  describe("row height", () => {
    it("should apply custom row height", () => {
      host.rowHeight.set(48);
      fixture.detectChanges();

      const row = el.querySelector(".row") as HTMLElement;
      expect(row.style.height).toBe("48px");
    });
  });
});
