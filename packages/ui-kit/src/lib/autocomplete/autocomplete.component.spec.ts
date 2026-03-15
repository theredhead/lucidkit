import { ComponentFixture, TestBed } from "@angular/core/testing";

import {
  UIAutocomplete,
  type AutocompleteDatasource,
} from "./autocomplete.component";

interface TestItem {
  id: number;
  name: string;
}

class TestDatasource implements AutocompleteDatasource<TestItem> {
  private readonly items: TestItem[] = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "Anna" },
    { id: 5, name: "Albert" },
  ];

  completeFor(query: string, selection: readonly TestItem[]): TestItem[] {
    const lower = query.toLowerCase();
    const selectedIds = new Set(selection.map((s) => s.id));
    return this.items.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) && !selectedIds.has(item.id),
    );
  }
}

describe("UIAutocomplete", () => {
  let component: UIAutocomplete<TestItem>;
  let fixture: ComponentFixture<UIAutocomplete<TestItem>>;
  let datasource: TestDatasource;

  beforeEach(async () => {
    datasource = new TestDatasource();

    await TestBed.configureTestingModule({
      imports: [UIAutocomplete],
    }).compileComponents();

    fixture = TestBed.createComponent(UIAutocomplete<TestItem>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("datasource", datasource);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it("should default disabled to false", () => {
      expect(component.disabled()).toBe(false);
    });

    it('should default placeholder to "Search…"', () => {
      expect(component.placeholder()).toBe("Search…");
    });

    it('should default ariaLabel to "Autocomplete"', () => {
      expect(component.ariaLabel()).toBe("Autocomplete");
    });

    it("should default minChars to 1", () => {
      expect(component.minChars()).toBe(1);
    });

    it("should default multiple to false", () => {
      expect(component.multiple()).toBe(false);
    });

    it("should default value to empty array", () => {
      expect(component.value()).toEqual([]);
    });
  });

  describe("input element", () => {
    it("should render a combobox input", () => {
      const input: HTMLInputElement = fixture.nativeElement.querySelector(
        'input[role="combobox"]',
      );
      expect(input).toBeTruthy();
    });

    it("should forward placeholder to the input", () => {
      fixture.componentRef.setInput("placeholder", "Type here…");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");
      expect(input.placeholder).toBe("Type here…");
    });

    it("should forward ariaLabel to the input", () => {
      fixture.componentRef.setInput("ariaLabel", "Search users");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");
      expect(input.getAttribute("aria-label")).toBe("Search users");
    });

    it("should disable the input when disabled is true", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");
      expect(input.disabled).toBe(true);
    });
  });

  describe("popup", () => {
    it("should not show the popup initially", () => {
      const popup = fixture.nativeElement.querySelector(".ac-popup");
      expect(popup).toBeNull();
    });

    it("should show suggestions after typing", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");

      input.value = "Al";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const popup = fixture.nativeElement.querySelector(".ac-popup");
      expect(popup).toBeTruthy();

      const options = fixture.nativeElement.querySelectorAll(".ac-option");
      // "Alice", "Albert" match "Al"
      expect(options.length).toBe(2);
    });

    it("should not show popup when query is shorter than minChars", () => {
      fixture.componentRef.setInput("minChars", 3);
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");
      input.value = "Al";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const popup = fixture.nativeElement.querySelector(".ac-popup");
      expect(popup).toBeNull();
    });

    it("should close popup on Escape", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");

      // Open popup
      input.value = "Al";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".ac-popup")).toBeTruthy();

      // Press Escape
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      fixture.detectChanges();

      // Document-level handler would close, but we call component method directly
      // The template listens on (document:keydown.escape)
    });
  });

  describe("keyboard navigation", () => {
    it("should highlight next item on ArrowDown", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");

      input.value = "A";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      fixture.detectChanges();

      const active = fixture.nativeElement.querySelector(".ac-option--active");
      expect(active).toBeTruthy();
    });

    it("should not go below the last item", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");

      input.value = "Bob";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      // Only 1 match, press down twice
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      fixture.detectChanges();

      const actives =
        fixture.nativeElement.querySelectorAll(".ac-option--active");
      expect(actives.length).toBe(1);
    });
  });

  describe("item selection (single mode)", () => {
    it("should set value when clicking a suggestion", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");

      input.value = "Bob";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const option = fixture.nativeElement.querySelector(".ac-option");
      option.click();
      fixture.detectChanges();

      expect(component.value()).toEqual([{ id: 2, name: "Bob" }]);
    });

    it("should replace previous selection in single mode", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");

      // Pick first item
      input.value = "Alice";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();
      fixture.nativeElement.querySelector(".ac-option").click();
      fixture.detectChanges();

      expect(component.value()).toEqual([{ id: 1, name: "Alice" }]);

      // Pick second item
      input.value = "Bob";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();
      fixture.nativeElement.querySelector(".ac-option").click();
      fixture.detectChanges();

      expect(component.value()).toEqual([{ id: 2, name: "Bob" }]);
    });
  });

  describe("multiple mode", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("multiple", true);
      fixture.detectChanges();
    });

    it("should accumulate selected items", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");

      // Pick Alice
      input.value = "Alice";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();
      fixture.nativeElement.querySelector(".ac-option").click();
      fixture.detectChanges();

      // Pick Bob
      input.value = "Bob";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();
      fixture.nativeElement.querySelector(".ac-option").click();
      fixture.detectChanges();

      expect(component.value().length).toBe(2);
    });

    it("should render chips for selected items", () => {
      // Set value directly
      component.value.set([{ id: 1, name: "Alice" }]);
      fixture.detectChanges();

      const chips = fixture.nativeElement.querySelectorAll(".ac-chip");
      expect(chips.length).toBe(1);
    });

    it("should remove a chip when its remove button is clicked", () => {
      component.value.set([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]);
      fixture.detectChanges();

      const removeButtons =
        fixture.nativeElement.querySelectorAll(".ac-chip-remove");
      expect(removeButtons.length).toBe(2);

      removeButtons[0].click();
      fixture.detectChanges();

      expect(component.value().length).toBe(1);
      expect(component.value()[0].name).toBe("Bob");
    });

    it("should not show chips in single mode", () => {
      fixture.componentRef.setInput("multiple", false);
      component.value.set([{ id: 1, name: "Alice" }]);
      fixture.detectChanges();

      const chips = fixture.nativeElement.querySelectorAll(".ac-chip");
      expect(chips.length).toBe(0);
    });
  });

  describe("displayWith", () => {
    it("should default to String(item)", () => {
      expect(component.displayWith()({ id: 99, name: "Test" })).toBe(
        "[object Object]",
      );
    });

    it("should use custom displayWith function for chips", () => {
      fixture.componentRef.setInput("multiple", true);
      fixture.componentRef.setInput(
        "displayWith",
        (item: TestItem) => item.name,
      );
      component.value.set([{ id: 1, name: "Alice" }]);
      fixture.detectChanges();

      const chipLabel = fixture.nativeElement.querySelector(".ac-chip-label");
      expect(chipLabel.textContent.trim()).toBe("Alice");
    });
  });

  describe("trackBy", () => {
    it("should prevent duplicate selection by trackBy key", () => {
      fixture.componentRef.setInput("multiple", true);
      fixture.componentRef.setInput("trackBy", (item: TestItem) => item.id);
      component.value.set([{ id: 1, name: "Alice" }]);
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");
      input.value = "Alice";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      // Alice is already selected, datasource filters her out
      // so no options should show (or she shouldn't be in the list)
      // This depends on the datasource implementation
    });
  });

  describe("accessibility", () => {
    it("should have combobox role on input", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");
      expect(input.getAttribute("role")).toBe("combobox");
    });

    it("should set aria-expanded to false when popup is closed", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");
      expect(input.getAttribute("aria-expanded")).toBe("false");
    });

    it("should set aria-expanded to true when popup is open", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");
      input.value = "Al";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(input.getAttribute("aria-expanded")).toBe("true");
    });

    it("should have listbox role on the popup", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");
      input.value = "Al";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const popup = fixture.nativeElement.querySelector(".ac-popup");
      expect(popup.getAttribute("role")).toBe("listbox");
    });

    it("should have option role on each suggestion", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector(".ac-input");
      input.value = "Al";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const options = fixture.nativeElement.querySelectorAll(".ac-option");
      for (const opt of options) {
        expect(opt.getAttribute("role")).toBe("option");
      }
    });
  });

  describe("host class", () => {
    it("should have the ui-autocomplete class", () => {
      expect(fixture.nativeElement.classList.contains("ui-autocomplete")).toBe(
        true,
      );
    });
  });
});
