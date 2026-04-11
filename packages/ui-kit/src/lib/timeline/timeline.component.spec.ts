import { Component, signal, input as ngInput } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UITimeline } from "./timeline.component";
import { ArrayDatasource } from "../table-view/datasources/array-datasource";
import type { IDatasource } from "../table-view/datasources/datasource";
import type {
  TimelineAlignment,
  TimelineComponentResolver,
  TimelineOrientation,
} from "./timeline.types";

interface TestEvent {
  id: number;
  title: string;
  date: string;
}

const TEST_EVENTS: TestEvent[] = [
  { id: 1, title: "Project started", date: "2024-01-01" },
  { id: 2, title: "First release", date: "2024-03-15" },
  { id: 3, title: "Major milestone", date: "2024-06-01" },
  { id: 4, title: "V2 launch", date: "2024-09-01" },
];

@Component({
  standalone: true,
  imports: [UITimeline],
  template: `
    <ui-timeline
      [datasource]="ds()"
      [orientation]="orientation()"
      [alignment]="alignment()"
      [ariaLabel]="ariaLabel()"
    >
      <ng-template let-event let-i="index" let-first="first" let-last="last">
        <div
          class="test-event"
          [attr.data-index]="i"
          [attr.data-first]="first"
          [attr.data-last]="last"
        >
          {{ event.title }}
        </div>
      </ng-template>
    </ui-timeline>
  `,
})
class TestHost {
  public readonly ds = signal<IDatasource<TestEvent>>(
    new ArrayDatasource(TEST_EVENTS),
  );
  public readonly orientation = signal<TimelineOrientation>("vertical");
  public readonly alignment = signal<TimelineAlignment>("alternate");
  public readonly ariaLabel = signal("Test Timeline");
}

describe("UITimeline", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it("should create", () => {
    const timeline = fixture.nativeElement.querySelector("ui-timeline");
    expect(timeline).toBeTruthy();
  });

  it("should have the ui-timeline host class", () => {
    const timeline = fixture.nativeElement.querySelector("ui-timeline");
    expect(timeline.classList).toContain("ui-timeline");
  });

  it("should render all events from the datasource", () => {
    const events = fixture.nativeElement.querySelectorAll(".test-event");
    expect(events.length).toBe(4);
  });

  it("should render event content from the template", () => {
    const events = fixture.nativeElement.querySelectorAll(".test-event");
    expect(events[0].textContent.trim()).toBe("Project started");
    expect(events[1].textContent.trim()).toBe("First release");
    expect(events[3].textContent.trim()).toBe("V2 launch");
  });

  describe("template context", () => {
    it("should expose index", () => {
      const events = fixture.nativeElement.querySelectorAll(".test-event");
      expect(events[0].getAttribute("data-index")).toBe("0");
      expect(events[2].getAttribute("data-index")).toBe("2");
    });

    it("should expose first", () => {
      const events = fixture.nativeElement.querySelectorAll(".test-event");
      expect(events[0].getAttribute("data-first")).toBe("true");
      expect(events[1].getAttribute("data-first")).toBe("false");
    });

    it("should expose last", () => {
      const events = fixture.nativeElement.querySelectorAll(".test-event");
      expect(events[3].getAttribute("data-last")).toBe("true");
      expect(events[2].getAttribute("data-last")).toBe("false");
    });
  });

  describe("orientation", () => {
    it("should default to vertical", () => {
      const timeline = fixture.nativeElement.querySelector("ui-timeline");
      expect(timeline.classList).toContain("vertical");
    });

    it("should apply horizontal class", async () => {
      host.orientation.set("horizontal");
      fixture.detectChanges();
      const timeline = fixture.nativeElement.querySelector("ui-timeline");
      expect(timeline.classList).toContain("horizontal");
      expect(timeline.classList).not.toContain("vertical");
    });
  });

  describe("alignment", () => {
    it("should default to alternate", () => {
      const timeline = fixture.nativeElement.querySelector("ui-timeline");
      expect(timeline.classList).toContain("alternate");
    });

    for (const align of ["start", "end", "alternate"] as const) {
      it(`should apply ${align} alignment class`, () => {
        host.alignment.set(align);
        fixture.detectChanges();
        const timeline = fixture.nativeElement.querySelector("ui-timeline");
        expect(timeline.classList).toContain(`${align}`);
      });
    }
  });

  describe("accessibility", () => {
    it("should have role=list", () => {
      const timeline = fixture.nativeElement.querySelector("ui-timeline");
      expect(timeline.getAttribute("role")).toBe("list");
    });

    it("should apply ariaLabel", () => {
      const timeline = fixture.nativeElement.querySelector("ui-timeline");
      expect(timeline.getAttribute("aria-label")).toBe("Test Timeline");
    });

    it("should render entries with role=listitem", () => {
      const entries =
        fixture.nativeElement.querySelectorAll("[role='listitem']");
      expect(entries.length).toBe(4);
    });
  });

  describe("timeline structure", () => {
    it("should render timeline dots", () => {
      const dots = fixture.nativeElement.querySelectorAll(".timeline-dot");
      expect(dots.length).toBe(4);
    });

    it("should render connectors between events (not after the last)", () => {
      const connectors = fixture.nativeElement.querySelectorAll(
        ".timeline-connector",
      );
      expect(connectors.length).toBe(3);
    });
  });

  describe("datasource swap", () => {
    it("should re-render when datasource changes", async () => {
      const newEvents: TestEvent[] = [
        { id: 10, title: "New event", date: "2025-01-01" },
      ];
      host.ds.set(new ArrayDatasource(newEvents));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const events = fixture.nativeElement.querySelectorAll(".test-event");
      expect(events.length).toBe(1);
      expect(events[0].textContent.trim()).toBe("New event");
    });
  });

  describe("empty datasource", () => {
    it("should render nothing for empty datasource", async () => {
      host.ds.set(new ArrayDatasource([]));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const events = fixture.nativeElement.querySelectorAll(".test-event");
      expect(events.length).toBe(0);
    });
  });

  describe("eventClick", () => {
    it("should emit eventClick when an entry is clicked", async () => {
      const timeline = fixture.debugElement.children[0]
        .componentInstance as UITimeline<TestEvent>;
      const clicked: TestEvent[] = [];
      timeline.eventClick.subscribe((e: TestEvent) => clicked.push(e));

      const entry = fixture.nativeElement.querySelector(".timeline-entry");
      entry.click();

      expect(clicked.length).toBe(1);
      expect(clicked[0].title).toBe("Project started");
    });
  });
});

// ── Component-based rendering ──────────────────────────────

@Component({
  standalone: true,
  selector: "ui-test-event-card",
  template: `<span class="card-title">{{ event().title }}</span>`,
})
class TestEventCard {
  public readonly event = ngInput.required<TestEvent>();
  public readonly index = ngInput<number>(0);
  public readonly first = ngInput<boolean>(false);
  public readonly last = ngInput<boolean>(false);
}

@Component({
  standalone: true,
  imports: [UITimeline],
  template: ` <ui-timeline [datasource]="ds()" [withComponent]="resolver" /> `,
})
class ComponentHost {
  public readonly ds = signal<IDatasource<TestEvent>>(
    new ArrayDatasource(TEST_EVENTS),
  );
  public readonly resolver: TimelineComponentResolver<TestEvent> = () =>
    TestEventCard;
}

describe("UITimeline — component rendering", () => {
  let fixture: ComponentFixture<ComponentHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentHost, TestEventCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it("should render events using the component resolver", () => {
    const cards = fixture.nativeElement.querySelectorAll("ui-test-event-card");
    expect(cards.length).toBe(4);
  });

  it("should pass event data to the rendered component", () => {
    const card = fixture.nativeElement.querySelector(".card-title");
    expect(card?.textContent.trim()).toBe("Project started");
  });

  it("should use resolveComponent to get the component class", () => {
    const timeline = fixture.debugElement.children[0]
      .componentInstance as UITimeline<TestEvent>;
    const comp = (timeline as any)["resolveComponent"](TEST_EVENTS[0]);
    expect(comp).toBe(TestEventCard);
  });

  it("should build component inputs with index and first/last flags", () => {
    const timeline = fixture.debugElement.children[0]
      .componentInstance as UITimeline<TestEvent>;
    const inputs = (timeline as any)["buildComponentInputs"](
      TEST_EVENTS[0],
      0,
    ) as Record<string, unknown>;
    expect(inputs["event"]).toBe(TEST_EVENTS[0]);
    expect(inputs["index"]).toBe(0);
    expect(inputs["first"]).toBe(true);
    expect(inputs["last"]).toBe(false);
  });
});
