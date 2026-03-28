import { ComponentFixture, TestBed } from "@angular/core/testing";

import type { FilterFieldDefinition, FilterRule } from "./filter.types";
import { UIFilterRow } from "./filter-row.component";

interface TestRow {
  name: string;
  age: number;
  joined: string;
}

const fields: FilterFieldDefinition<TestRow>[] = [
  { key: "name", label: "Name", type: "string" },
  { key: "age", label: "Age", type: "number" },
  { key: "joined", label: "Joined", type: "date" },
];

const defaultRule: FilterRule = {
  id: 1,
  field: "name",
  operator: "contains",
  value: "",
};

describe("UIFilterRow", () => {
  let component: UIFilterRow;
  let fixture: ComponentFixture<UIFilterRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIFilterRow],
    }).compileComponents();

    fixture = TestBed.createComponent(UIFilterRow);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("fields", fields);
    fixture.componentRef.setInput("rule", defaultRule);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("field change", () => {
    it("should emit ruleChange with new field and reset operator", () => {
      let emitted: FilterRule | undefined;
      component.ruleChange.subscribe((r) => (emitted = r));

      component["onFieldChange"]("age");

      expect(emitted).toBeDefined();
      expect(emitted!.field).toBe("age");
      // Number fields default to "equals"
      expect(emitted!.operator).toBe("equals");
      expect(emitted!.value).toBe("");
    });
  });

  describe("operator change", () => {
    it("should emit ruleChange with new operator", () => {
      let emitted: FilterRule | undefined;
      component.ruleChange.subscribe((r) => (emitted = r));

      component["onOperatorChange"]("equals");

      expect(emitted!.operator).toBe("equals");
    });

    it("should clear valueTo when switching away from between", () => {
      fixture.componentRef.setInput("rule", {
        ...defaultRule,
        field: "age",
        operator: "between",
        value: "10",
        valueTo: "20",
      });
      fixture.detectChanges();

      let emitted: FilterRule | undefined;
      component.ruleChange.subscribe((r) => (emitted = r));

      component["onOperatorChange"]("equals");

      expect(emitted!.valueTo).toBeUndefined();
    });

    it("should clear value and valueTo for no-value operators", () => {
      let emitted: FilterRule | undefined;
      component.ruleChange.subscribe((r) => (emitted = r));

      component["onOperatorChange"]("isEmpty");

      expect(emitted!.value).toBe("");
      expect(emitted!.valueTo).toBeUndefined();
    });
  });

  describe("value change", () => {
    it("should emit ruleChange with updated value", () => {
      let emitted: FilterRule | undefined;
      component.ruleChange.subscribe((r) => (emitted = r));

      component["onValueChange"]("test");

      expect(emitted!.value).toBe("test");
    });
  });

  describe("valueTo change", () => {
    it("should emit ruleChange with updated valueTo", () => {
      fixture.componentRef.setInput("rule", {
        ...defaultRule,
        field: "age",
        operator: "between",
        value: "10",
      });
      fixture.detectChanges();

      let emitted: FilterRule | undefined;
      component.ruleChange.subscribe((r) => (emitted = r));

      component["onValueToChange"]("50");

      expect(emitted!.valueTo).toBe("50");
    });
  });

  describe("unit change", () => {
    it("should emit ruleChange with updated unit", () => {
      fixture.componentRef.setInput("rule", {
        ...defaultRule,
        field: "joined",
        operator: "inTheLast",
        value: "7",
      });
      fixture.detectChanges();

      let emitted: FilterRule | undefined;
      component.ruleChange.subscribe((r) => (emitted = r));

      component["onUnitChange"]("weeks");

      expect(emitted!.unit).toBe("weeks");
    });
  });

  describe("remove", () => {
    it("should emit remove event", () => {
      let removed = false;
      component.remove.subscribe(() => (removed = true));

      const removeBtn = fixture.nativeElement.querySelector(
        ".controls > ui-button",
      );
      removeBtn?.click();

      expect(removed).toBe(true);
    });
  });

  describe("computed state", () => {
    it("should hide value input for isEmpty operator", () => {
      fixture.componentRef.setInput("rule", {
        ...defaultRule,
        operator: "isEmpty",
      });
      fixture.detectChanges();

      expect(component["hideValue"]()).toBe(true);
    });

    it("should show value input for contains operator", () => {
      expect(component["hideValue"]()).toBe(false);
    });

    it("should detect between operator", () => {
      fixture.componentRef.setInput("rule", {
        ...defaultRule,
        field: "age",
        operator: "between",
        value: "10",
      });
      fixture.detectChanges();

      expect(component["isBetween"]()).toBe(true);
    });

    it("should detect inTheLast operator", () => {
      fixture.componentRef.setInput("rule", {
        ...defaultRule,
        field: "joined",
        operator: "inTheLast",
        value: "7",
      });
      fixture.detectChanges();

      expect(component["isInTheLast"]()).toBe(true);
    });

    it("should resolve input type based on field type", () => {
      expect(component["inputType"]()).toBe("text");

      fixture.componentRef.setInput("rule", {
        ...defaultRule,
        field: "age",
      });
      fixture.detectChanges();
      expect(component["inputType"]()).toBe("number");

      fixture.componentRef.setInput("rule", {
        ...defaultRule,
        field: "joined",
      });
      fixture.detectChanges();
      expect(component["inputType"]()).toBe("date");
    });
  });

  describe("host class", () => {
    it("should have the ui-filter-row class on the host", () => {
      const host: HTMLElement = fixture.nativeElement;
      expect(host.classList.contains("ui-filter-row")).toBe(true);
    });
  });

  describe("accessibility", () => {
    it('should have role="group" on the controls container', () => {
      const controls = fixture.nativeElement.querySelector(".controls");
      expect(controls.getAttribute("role")).toBe("group");
    });

    it("should have aria-label on the controls group", () => {
      const controls = fixture.nativeElement.querySelector(".controls");
      expect(controls.getAttribute("aria-label")).toBe("Filter rule 1");
    });

    it("should have aria-label on the field select", () => {
      const btn = fixture.nativeElement.querySelector(
        'ui-dropdown-list[aria-label="Filter field"] button',
      );
      expect(btn.getAttribute("aria-label")).toBe("Filter field");
    });

    it("should have aria-label on the operator select", () => {
      const btn = fixture.nativeElement.querySelector(
        'ui-dropdown-list[aria-label="Operator"] button',
      );
      expect(btn.getAttribute("aria-label")).toBe("Operator");
    });

    it("should have aria-label on the value input", () => {
      const input = fixture.nativeElement.querySelector("input");
      expect(input.getAttribute("aria-label")).toBe("Filter value");
    });

    it("should have aria-label on the remove button", () => {
      const btn = fixture.nativeElement.querySelector(
        ".controls > ui-button button",
      );
      expect(btn.getAttribute("aria-label")).toBe("Remove filter rule");
    });

    it("should mark the between separator as aria-hidden", () => {
      fixture.componentRef.setInput("rule", {
        ...defaultRule,
        field: "age",
        operator: "between",
        value: "10",
      });
      fixture.detectChanges();

      const separator = fixture.nativeElement.querySelector(".separator");
      expect(separator.getAttribute("aria-hidden")).toBe("true");
    });
  });
});
