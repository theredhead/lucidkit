import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ChangeDetectorRef, Component, signal } from "@angular/core";

import { UITabGroup } from "./tab-group.component";
import type { TabPosition, TabPanelStyle } from "./tab-group.component";
import { provideTabDefaults } from "./tab-group.component";
import { UITab } from "./tab.component";
import { UITabSeparator } from "./tab-separator.component";
import { UITabSpacer } from "./tab-spacer.component";
import type { TabAlignment } from "./tab-header-item";

@Component({
  standalone: true,
  imports: [UITabGroup, UITab],
  template: `
    <ui-tab-group
      [selectedIndex]="startIndex()"
      [tabPosition]="tabPosition()"
      [panelStyle]="panelStyle()"
    >
      <ui-tab label="One">Content one</ui-tab>
      <ui-tab label="Two">Content two</ui-tab>
      <ui-tab label="Three" [disabled]="true">Content three</ui-tab>
    </ui-tab-group>
  `,
})
class TestHost {
  public readonly startIndex = signal(0);
  public readonly tabPosition = signal<TabPosition | undefined>(undefined);
  public readonly panelStyle = signal<TabPanelStyle | undefined>(undefined);
}

describe("UITabGroup", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create with three tabs", () => {
    const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
    expect(tabs.length).toBe(3);
  });

  describe("tab headers", () => {
    it("should display tab labels", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      expect(tabs[0].textContent.trim()).toBe("One");
      expect(tabs[1].textContent.trim()).toBe("Two");
      expect(tabs[2].textContent.trim()).toBe("Three");
    });

    it("should mark first tab as active by default", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
      expect(tabs[0].classList).toContain("tab--active");
    });

    it("should mark disabled tab", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      expect(tabs[2].classList).toContain("tab--disabled");
    });
  });

  describe("panel", () => {
    it("should render active tab content", () => {
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content one");
    });

    it("should switch content on tab click", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      tabs[1].click();
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content two");
    });

    it("should not switch to disabled tab", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      tabs[2].click();
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content one");
    });
  });

  describe("selectedIndex", () => {
    it("should respect initial selectedIndex", () => {
      host.startIndex.set(1);
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content two");
    });
  });

  describe("keyboard navigation", () => {
    it("should navigate right with ArrowRight", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      tabs[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content two");
    });

    it("should navigate left with ArrowLeft", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      tabs[1].click();
      fixture.detectChanges();
      tabs[1].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
      );
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content one");
    });

    it("should skip disabled tabs", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      tabs[1].click();
      fixture.detectChanges();
      // ArrowRight from tab 1 should skip disabled tab 2
      tabs[1].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content two"); // stays on Two because Three is disabled and there's nothing after
    });

    it("should go to first tab on Home", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      tabs[1].click();
      fixture.detectChanges();
      tabs[1].dispatchEvent(
        new KeyboardEvent("keydown", { key: "Home", bubbles: true }),
      );
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content one");
    });

    it("should go to last enabled tab on End", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      tabs[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "End", bubbles: true }),
      );
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      // Should be "Two" since "Three" is disabled
      expect(panel.textContent).toContain("Content two");
    });
  });

  describe("accessibility", () => {
    it("should have tablist role on header", () => {
      const header = fixture.nativeElement.querySelector("[role='tablist']");
      expect(header).toBeTruthy();
    });

    it("should have tabpanel role on panel", () => {
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel).toBeTruthy();
    });

    it("should set aria-selected correctly", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
      expect(tabs[1].getAttribute("aria-selected")).toBe("false");
    });

    it("should set tabindex on active tab", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      expect(tabs[0].getAttribute("tabindex")).toBe("0");
      expect(tabs[1].getAttribute("tabindex")).toBe("-1");
    });

    it("should link tab to panel via aria-controls", () => {
      const tab = fixture.nativeElement.querySelector("[role='tab']");
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(tab.getAttribute("aria-controls")).toBe(panel.id);
    });
  });

  describe("tabPosition", () => {
    it("should default to top position", () => {
      const el = fixture.nativeElement.querySelector(".ui-tab-group");
      expect(el.classList).toContain("top");
    });

    for (const position of ["top", "bottom", "left", "right"] as const) {
      it(`should apply ${position} host class`, () => {
        host.tabPosition.set(position);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".ui-tab-group");
        expect(el.classList).toContain(`${position}`);
      });
    }

    it("should set vertical aria-orientation for left position", () => {
      host.tabPosition.set("left");
      fixture.detectChanges();
      const tablist = fixture.nativeElement.querySelector("[role='tablist']");
      expect(tablist.getAttribute("aria-orientation")).toBe("vertical");
    });

    it("should set vertical aria-orientation for right position", () => {
      host.tabPosition.set("right");
      fixture.detectChanges();
      const tablist = fixture.nativeElement.querySelector("[role='tablist']");
      expect(tablist.getAttribute("aria-orientation")).toBe("vertical");
    });

    it("should not set aria-orientation for top position", () => {
      host.tabPosition.set("top");
      fixture.detectChanges();
      const tablist = fixture.nativeElement.querySelector("[role='tablist']");
      expect(tablist.getAttribute("aria-orientation")).toBeNull();
    });
  });

  describe("panelStyle", () => {
    it("should default to raised", () => {
      const el = fixture.nativeElement.querySelector(".ui-tab-group");
      expect(el.classList).toContain("raised");
    });

    for (const style of ["flat", "outline", "raised"] as const) {
      it(`should apply ${style} host class`, () => {
        host.panelStyle.set(style);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".ui-tab-group");
        expect(el.classList).toContain(`${style}`);
      });
    }
  });
});

describe("UITabGroup with provideTabDefaults", () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [
        provideTabDefaults({ tabPosition: "left", panelStyle: "flat" }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it("should use injected tabPosition default", () => {
    const el = fixture.nativeElement.querySelector(".ui-tab-group");
    expect(el.classList).toContain("left");
  });

  it("should use injected panelStyle default", () => {
    const el = fixture.nativeElement.querySelector(".ui-tab-group");
    expect(el.classList).toContain("flat");
  });

  it("should allow input to override injected default", () => {
    fixture.componentInstance.tabPosition.set("bottom");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(".ui-tab-group");
    expect(el.classList).toContain("bottom");
    expect(el.classList).not.toContain("left");
  });
});

describe("UITabGroup with icons", () => {
  @Component({
    standalone: true,
    imports: [UITabGroup, UITab],
    template: `
      <ui-tab-group>
        <ui-tab label="Home" [icon]="homeIcon">Home content</ui-tab>
        <ui-tab label="Plain">Plain content</ui-tab>
      </ui-tab-group>
    `,
  })
  class IconTestHost {
    public readonly homeIcon =
      '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />';
  }

  let fixture: ComponentFixture<IconTestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconTestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(IconTestHost);
    fixture.detectChanges();
  });

  it("should render an icon in the tab with an icon input", () => {
    const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
    const icon = tabs[0].querySelector("ui-icon");
    expect(icon).toBeTruthy();
  });

  it("should not render an icon when no icon input is set", () => {
    const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
    const icon = tabs[1].querySelector("ui-icon");
    expect(icon).toBeNull();
  });
});

describe("UITabGroup with icon-only tabs", () => {
  @Component({
    standalone: true,
    imports: [UITabGroup, UITab],
    template: `
      <ui-tab-group>
        <ui-tab [icon]="settingsIcon" ariaLabel="Settings"
          >Settings content</ui-tab
        >
        <ui-tab label="Details" [icon]="detailsIcon">Details content</ui-tab>
        <ui-tab label="Plain">Plain content</ui-tab>
      </ui-tab-group>
    `,
  })
  class IconOnlyTestHost {
    public readonly settingsIcon =
      '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25" />';
    public readonly detailsIcon =
      '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />';
  }

  let fixture: ComponentFixture<IconOnlyTestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconOnlyTestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(IconOnlyTestHost);
    fixture.detectChanges();
  });

  it("should render icon-only tab without label text", () => {
    const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
    const icon = tabs[0].querySelector("ui-icon");
    expect(icon).toBeTruthy();
    // Should only contain the icon, no label text
    const textContent = tabs[0].textContent.trim();
    expect(textContent).toBe("");
  });

  it("should set aria-label on icon-only tab", () => {
    const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
    expect(tabs[0].getAttribute("aria-label")).toBe("Settings");
  });

  it("should use label as aria-label when ariaLabel is not explicit", () => {
    const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
    expect(tabs[1].getAttribute("aria-label")).toBe("Details");
  });

  it("should render both icon and label when both are set", () => {
    const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
    const icon = tabs[1].querySelector("ui-icon");
    expect(icon).toBeTruthy();
    expect(tabs[1].textContent.trim()).toBe("Details");
  });

  it("should switch to icon-only tab on click", () => {
    const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
    tabs[0].click();
    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
    expect(panel.textContent).toContain("Settings content");
  });
});

// ── Tab Alignment ──────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [UITabGroup, UITab],
  template: `
    <ui-tab-group [tabAlign]="align">
      <ui-tab label="A">A</ui-tab>
      <ui-tab label="B">B</ui-tab>
    </ui-tab-group>
  `,
})
class AlignmentTestHost {
  public align: TabAlignment = "start";
}

describe("UITabGroup alignment", () => {
  let fixture: ComponentFixture<AlignmentTestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlignmentTestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(AlignmentTestHost);
    fixture.detectChanges();
  });

  it("should default to start alignment", () => {
    const el = fixture.nativeElement.querySelector("ui-tab-group");
    expect(el.classList).toContain("align-start");
  });

  for (const alignment of ["start", "center", "end"] as TabAlignment[]) {
    it(`should apply align-${alignment} host class`, () => {
      fixture.componentInstance.align = alignment;
      fixture.componentRef.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector("ui-tab-group");
      expect(el.classList).toContain(`align-${alignment}`);
    });
  }
});

// ── Tab Separator ──────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [UITabGroup, UITab, UITabSeparator],
  template: `
    <ui-tab-group>
      <ui-tab label="A">A</ui-tab>
      <ui-tab-separator />
      <ui-tab label="B">B</ui-tab>
    </ui-tab-group>
  `,
})
class SeparatorTestHost {}

describe("UITabSeparator", () => {
  let fixture: ComponentFixture<SeparatorTestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeparatorTestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(SeparatorTestHost);
    fixture.detectChanges();
  });

  it("should render a separator in the header", () => {
    const sep = fixture.nativeElement.querySelector(".header-separator");
    expect(sep).toBeTruthy();
  });

  it("should have role=separator", () => {
    const sep = fixture.nativeElement.querySelector(".header-separator");
    expect(sep.getAttribute("role")).toBe("separator");
  });

  it("should still render both tabs", () => {
    const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
    expect(tabs.length).toBe(2);
  });

  it("should render two tab panels when tabs are clicked", () => {
    const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
    tabs[0].click();
    fixture.detectChanges();
    let panel = fixture.nativeElement.querySelector("[role='tabpanel']");
    expect(panel.textContent).toContain("A");

    tabs[1].click();
    fixture.detectChanges();
    panel = fixture.nativeElement.querySelector("[role='tabpanel']");
    expect(panel.textContent).toContain("B");
  });
});

// ── Tab Spacer ─────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [UITabGroup, UITab, UITabSpacer],
  template: `
    <ui-tab-group>
      <ui-tab label="Left">Left panel</ui-tab>
      <ui-tab-spacer />
      <ui-tab label="Right">Right panel</ui-tab>
    </ui-tab-group>
  `,
})
class SpacerTestHost {}

describe("UITabSpacer", () => {
  let fixture: ComponentFixture<SpacerTestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpacerTestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(SpacerTestHost);
    fixture.detectChanges();
  });

  it("should render a spacer in the header", () => {
    const spacer = fixture.nativeElement.querySelector(".header-spacer");
    expect(spacer).toBeTruthy();
  });

  it("should still render both tabs", () => {
    const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
    expect(tabs.length).toBe(2);
  });

  it("should navigate between tabs across the spacer", () => {
    const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
    tabs[1].click();
    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
    expect(panel.textContent).toContain("Right panel");
  });
});
