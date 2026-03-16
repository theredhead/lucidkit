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
  });

  describe("addRule", () => {
    it("should add a rule defaulting to Any field", () => {
      component.addRule();

      expect(component.value().rules.length).toBe(1);
      expect(component.value().rules[0].field).toBe("__any__");
    });

    it("should default to contains operator", () => {
      component.addRule();

      expect(component.value().rules[0].operator).toBe("contains");
    });

    it("should assign incremental ids", () => {
      component.addRule();
      component.addRule();
      component.addRule();

      const ids = component.value().rules.map((r) => r.id);
      expect(ids).toEqual([1, 2, 3]);
    });
  });

  describe("removeRule", () => {
    it("should remove the rule at the given index", () => {
      component.addRule();
      component.addRule();
      component.addRule();

      component.removeRule(1);

      const ids = component.value().rules.map((r) => r.id);
      expect(ids).toEqual([1, 3]);
    });
  });

  describe("updateRule", () => {
    it("should replace a rule at the given index", () => {
      component.addRule();

      const updated: FilterRule = {
        ...component.value().rules[0],
        value: "test",
      };
      component.updateRule(0, updated);

      expect(component.value().rules[0].value).toBe("test");
    });

    it("should not affect other rules", () => {
      component.addRule();
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
      component.addRule();
      component.addRule();

      component.setJunction("or");

      expect(component.value().rules.length).toBe(2);
    });
  });

  describe("predicateChange", () => {
    it("should emit undefined when there are no rules", () => {
      let emitted: unknown = "not-called";
      component.predicateChange.subscribe((p) => (emitted = p));

      // The effect runs eagerly in the constructor, but the output
      // subscription above was set up after construction.  Trigger
      // another change-detection cycle so the effect re-runs.
      component.value.set({ junction: "and", rules: [] });
      fixture.detectChanges();

      expect(emitted).toBeUndefined();
    });

    it("should emit a predicate when valid rules exist", () => {
      component.addRule();
      component.updateRule(0, {
        ...component.value().rules[0],
        field: "name",
        operator: "equals",
        value: "Alice",
      });

      let predicate: unknown;
      component.predicateChange.subscribe((p) => (predicate = p));

      fixture.detectChanges();

      expect(typeof predicate).toBe("function");
    });
  });

  describe("template rendering", () => {
    it("should render an add-rule button", () => {
      const btn = fixture.nativeElement.querySelector(
        ".ui-filter__actions ui-button",
      );
      expect(btn).toBeTruthy();
    });

    it("should render filter rows when rules are added", () => {
      component.addRule();
      component.addRule();
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll("ui-filter-row");
      expect(rows.length).toBe(2);
    });

    it("should not show junction selector when allowJunction is false", () => {
      const select = fixture.nativeElement.querySelector(
        ".ui-filter__header ui-select",
      );
      expect(select).toBeFalsy();
    });

    it("should show junction selector when allowJunction is true", () => {
      fixture.componentRef.setInput("allowJunction", true);
      fixture.detectChanges();

      const select = fixture.nativeElement.querySelector(
        ".ui-filter__header ui-select",
      );
      expect(select).toBeTruthy();
    });
  });

  describe("host class", () => {
    it("should have the ui-filter class on the host", () => {
      const host: HTMLElement = fixture.nativeElement;
      expect(host.classList.contains("ui-filter")).toBe(true);
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
      const rules = fixture.nativeElement.querySelector(".ui-filter__rules");
      expect(rules.getAttribute("aria-live")).toBe("polite");
    });

    it('should have role="list" on the rules container', () => {
      const rules = fixture.nativeElement.querySelector(".ui-filter__rules");
      expect(rules.getAttribute("role")).toBe("list");
    });

    it("should have aria-label on the add-rule button", () => {
      const btn = fixture.nativeElement.querySelector(
        ".ui-filter__actions ui-button button",
      );
      expect(btn.getAttribute("aria-label")).toBe("Add filter rule");
    });
  });
});
