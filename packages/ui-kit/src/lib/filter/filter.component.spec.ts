import { ComponentFixture, TestBed } from "@angular/core/testing";

import type { FilterFieldDefinition, FilterRule } from "./filter.types";
import { UIFilter } from "./filter.component";

interface TestRow {
  name: string;
  age: number;
}

const fields: FilterFieldDefinition<TestRow>[] = [
  { key: "name", label: "Name", type: "string" },
  { key: "age", label: "Age", type: "number" },
];

describe("UIFilter", () => {
  let component: UIFilter<TestRow>;
  let fixture: ComponentFixture<UIFilter<TestRow>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(UIFilter<TestRow>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("fields", fields);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it('should default junction to "and"', () => {
      expect(component.value().junction).toBe("and");
    });

    it("should start with no rules", () => {
      expect(component.value().rules.length).toBe(0);
    });

    it("should default allowJunction to false", () => {
      expect(component.allowJunction()).toBe(false);
    });

    it("should default allowSimple to true", () => {
      expect(component.allowSimple()).toBe(true);
    });

    it("should default allowAdvanced to true", () => {
      expect(component.allowAdvanced()).toBe(true);
    });

    it('should default mode to "simple"', () => {
      expect(component.mode()).toBe("simple");
    });
  });

  describe("mode resolution", () => {
    it("should start in advanced mode when allowSimple is false", async () => {
      const f = TestBed.createComponent(UIFilter<TestRow>);
      f.componentRef.setInput("fields", fields);
      f.componentRef.setInput("allowSimple", false);
      f.detectChanges();

      expect(f.componentInstance.mode()).toBe("advanced");
    });

    it("should start in simple mode when allowAdvanced is false", async () => {
      const f = TestBed.createComponent(UIFilter<TestRow>);
      f.componentRef.setInput("fields", fields);
      f.componentRef.setInput("allowAdvanced", false);
      f.detectChanges();

      expect(f.componentInstance.mode()).toBe("simple");
    });
  });

  describe("simple mode", () => {
    it("should render a search input in simple mode", () => {
      const input = fixture.nativeElement.querySelector(
        ".filter__simple ui-input",
      );
      expect(input).toBeTruthy();
    });

    it("should not render filter rows in simple mode", () => {
      const rows = fixture.nativeElement.querySelectorAll("ui-filter-row");
      expect(rows.length).toBe(0);
    });

    it("should build an 'any field contains' rule from simple search", () => {
      component.onSimpleInput("hello");
      fixture.detectChanges();

      const rules = component.value().rules;
      expect(rules.length).toBe(1);
      expect(rules[0].field).toBe("__any__");
      expect(rules[0].operator).toBe("contains");
      expect(rules[0].value).toBe("hello");
    });

    it("should clear rules when simple search is cleared", () => {
      component.onSimpleInput("hello");
      fixture.detectChanges();

      component.onSimpleInput("");
      fixture.detectChanges();

      expect(component.value().rules.length).toBe(0);
    });

    it("should show mode toggle when both modes allowed", () => {
      const btn = fixture.nativeElement.querySelector(
        ".filter__simple ui-button",
      );
      expect(btn).toBeTruthy();
    });

    it("should hide mode toggle when only simple is allowed", () => {
      fixture.componentRef.setInput("allowAdvanced", false);
      fixture.detectChanges();

      const btn = fixture.nativeElement.querySelector(
        ".filter__simple ui-button",
      );
      expect(btn).toBeFalsy();
    });
  });

  describe("toggleMode", () => {
    it("should switch from simple to advanced", () => {
      expect(component.mode()).toBe("simple");
      component.toggleMode();
      fixture.detectChanges();

      expect(component.mode()).toBe("advanced");
    });

    it("should switch from advanced to simple", () => {
      component.toggleMode(); // → advanced
      component.toggleMode(); // → simple
      fixture.detectChanges();

      expect(component.mode()).toBe("simple");
    });

    it("should add an initial rule when switching to advanced with no rules", () => {
      component.toggleMode();
      fixture.detectChanges();

      expect(component.value().rules.length).toBe(1);
    });

    it("should carry over simple search term to advanced rule", () => {
      component.onSimpleInput("test");
      fixture.detectChanges();

      component.toggleMode();
      fixture.detectChanges();

      const rules = component.value().rules;
      expect(rules.length).toBe(1);
      expect(rules[0].field).toBe("__any__");
      expect(rules[0].operator).toBe("contains");
      expect(rules[0].value).toBe("test");
    });

    it("should extract simple search term when switching to simple", () => {
      component.toggleMode(); // → advanced
      component.updateRule(0, {
        id: 1,
        field: "__any__",
        operator: "contains",
        value: "extracted",
      });
      fixture.detectChanges();

      component.toggleMode(); // → simple
      fixture.detectChanges();

      expect(component.simpleQuery()).toBe("extracted");
    });
  });

  describe("addRule", () => {
    beforeEach(() => {
      // Switch to advanced mode for addRule tests
      component.toggleMode();
      fixture.detectChanges();
    });

    it("should add a rule defaulting to Any field", () => {
      const initialCount = component.value().rules.length;
      component.addRule();

      expect(component.value().rules.length).toBe(initialCount + 1);
      const lastRule =
        component.value().rules[component.value().rules.length - 1];
      expect(lastRule.field).toBe("__any__");
    });

    it("should default to contains operator", () => {
      component.addRule();

      const lastRule =
        component.value().rules[component.value().rules.length - 1];
      expect(lastRule.operator).toBe("contains");
    });

    it("should assign incremental ids", () => {
      component.addRule();
      component.addRule();

      const ids = component.value().rules.map((r) => r.id);
      // First rule is from toggleMode (id=1), then two added (id=2, id=3)
      expect(ids).toEqual([1, 2, 3]);
    });
  });

  describe("removeRule", () => {
    it("should remove the rule at the given index", () => {
      component.toggleMode(); // → advanced (creates rule id=1)
      fixture.detectChanges();

      component.addRule(); // id=2
      component.addRule(); // id=3

      component.removeRule(1);

      const ids = component.value().rules.map((r) => r.id);
      expect(ids).toEqual([1, 3]);
    });
  });

  describe("updateRule", () => {
    it("should replace a rule at the given index", () => {
      component.toggleMode(); // → advanced
      fixture.detectChanges();

      const updated: FilterRule = {
        ...component.value().rules[0],
        value: "test",
      };
      component.updateRule(0, updated);

      expect(component.value().rules[0].value).toBe("test");
    });

    it("should not affect other rules", () => {
      component.toggleMode(); // → advanced
      fixture.detectChanges();

      component.addRule();

      const updated: FilterRule = {
        ...component.value().rules[0],
        value: "changed",
      };
      component.updateRule(0, updated);

      expect(component.value().rules[1].value).toBe("");
    });
  });

  describe("setJunction", () => {
    it("should change the junction", () => {
      component.setJunction("or");
      expect(component.value().junction).toBe("or");
    });

    it("should preserve existing rules when changing junction", () => {
      component.toggleMode(); // → advanced
      fixture.detectChanges();

      component.addRule();

      component.setJunction("or");

      expect(component.value().rules.length).toBe(2);
    });
  });

  describe("expressionChange", () => {
    it("should emit an empty expression when there are no rules", () => {
      let emitted: unknown = "not-called";
      component.expressionChange.subscribe((p) => (emitted = p));

      // The effect runs eagerly in the constructor, but the output
      // subscription above was set up after construction.  Trigger
      // another change-detection cycle so the effect re-runs.
      component.value.set({ junction: "and", rules: [] });
      fixture.detectChanges();

      expect(emitted).toEqual([]);
    });

    it("should emit a filter expression when valid rules exist", () => {
      component.toggleMode(); // → advanced
      fixture.detectChanges();

      component.updateRule(0, {
        ...component.value().rules[0],
        field: "name",
        operator: "equals",
        value: "Alice",
      });

      let expression: unknown;
      component.expressionChange.subscribe((p) => (expression = p));

      fixture.detectChanges();

      expect(Array.isArray(expression)).toBe(true);
      expect((expression as unknown[]).length).toBeGreaterThan(0);
    });
  });

  describe("template rendering (advanced mode)", () => {
    beforeEach(() => {
      component.toggleMode(); // → advanced
      fixture.detectChanges();
    });

    it("should render an add-rule button", () => {
      const btn = fixture.nativeElement.querySelector(
        ".filter__actions ui-button",
      );
      expect(btn).toBeTruthy();
    });

    it("should render filter rows when rules are added", () => {
      component.addRule();
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll("ui-filter-row");
      expect(rows.length).toBe(2); // one from toggleMode, one from addRule
    });

    it("should not show junction selector when allowJunction is false", () => {
      const select = fixture.nativeElement.querySelector(
        ".filter__header ui-dropdown-list",
      );
      expect(select).toBeFalsy();
    });

    it("should show junction selector when allowJunction is true", () => {
      fixture.componentRef.setInput("allowJunction", true);
      fixture.detectChanges();

      const select = fixture.nativeElement.querySelector(
        ".filter__header ui-dropdown-list",
      );
      expect(select).toBeTruthy();
    });
  });

  describe("host class", () => {
    it("should have the ui-filter class on the host", () => {
      const host: HTMLElement = fixture.nativeElement;
      expect(host.classList.contains("ui-filter")).toBe(true);
    });

    it("should have the simple mode class when in simple mode", () => {
      const host: HTMLElement = fixture.nativeElement;
      expect(host.classList.contains("ui-filter--simple")).toBe(true);
    });

    it("should have the advanced mode class when in advanced mode", () => {
      component.toggleMode();
      fixture.detectChanges();

      const host: HTMLElement = fixture.nativeElement;
      expect(host.classList.contains("ui-filter--advanced")).toBe(true);
    });
  });

  describe("accessibility", () => {
    it('should have role="region" on the host', () => {
      const host: HTMLElement = fixture.nativeElement;
      expect(host.getAttribute("role")).toBe("region");
    });

    it('should have aria-label="Filter builder" on the host', () => {
      const host: HTMLElement = fixture.nativeElement;
      expect(host.getAttribute("aria-label")).toBe("Filter builder");
    });

    it('should have aria-live="polite" on the rules container', () => {
      component.toggleMode(); // → advanced
      fixture.detectChanges();

      const rules = fixture.nativeElement.querySelector(".filter__rules");
      expect(rules.getAttribute("aria-live")).toBe("polite");
    });

    it('should have role="list" on the rules container', () => {
      component.toggleMode(); // → advanced
      fixture.detectChanges();

      const rules = fixture.nativeElement.querySelector(".filter__rules");
      expect(rules.getAttribute("role")).toBe("list");
    });

    it("should have aria-label on the add-rule button", () => {
      component.toggleMode(); // → advanced
      fixture.detectChanges();

      const btn = fixture.nativeElement.querySelector(
        ".filter__actions ui-button button",
      );
      expect(btn.getAttribute("aria-label")).toBe("Add filter rule");
    });
  });
});
