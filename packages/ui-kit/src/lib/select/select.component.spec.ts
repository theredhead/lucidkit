import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";

import { type SelectOption, UISelect } from "./select.component";

describe("UISelect", () => {
  let component: UISelect;
  let fixture: ComponentFixture<UISelect>;

  const sampleOptions: SelectOption[] = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Bravo" },
    { value: "c", label: "Charlie" },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UISelect],
    }).compileComponents();

    fixture = TestBed.createComponent(UISelect);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("options", sampleOptions);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it('should default value to ""', () => {
      expect(component.value()).toBe("");
    });

    it("should default disabled to false", () => {
      expect(component.disabled()).toBe(false);
    });
  });

  describe("option rendering", () => {
    it("should render all options", () => {
      const options = fixture.nativeElement.querySelectorAll("option");
      expect(options.length).toBe(3);
    });

    it("should render option labels", () => {
      const options = fixture.nativeElement.querySelectorAll("option");
      expect(options[0].textContent.trim()).toBe("Alpha");
      expect(options[1].textContent.trim()).toBe("Bravo");
      expect(options[2].textContent.trim()).toBe("Charlie");
    });

    it("should set option values", () => {
      const options = fixture.nativeElement.querySelectorAll("option");
      expect(options[0].value).toBe("a");
      expect(options[1].value).toBe("b");
      expect(options[2].value).toBe("c");
    });
  });

  describe("selection change", () => {
    it("should update value on change event", () => {
      const select: HTMLSelectElement =
        fixture.nativeElement.querySelector("select");
      select.value = "b";
      select.dispatchEvent(new Event("change"));
      fixture.detectChanges();

      expect(component.value()).toBe("b");
    });
  });

  describe("disabled state", () => {
    it("should disable the native select", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const select: HTMLSelectElement =
        fixture.nativeElement.querySelector("select");
      expect(select.disabled).toBe(true);
    });
  });

  describe("selected attribute", () => {
    it("should mark the matching option as selected", () => {
      fixture.componentRef.setInput("options", sampleOptions);
      component.value.set("c");
      fixture.detectChanges();

      const options: NodeListOf<HTMLOptionElement> =
        fixture.nativeElement.querySelectorAll("option");
      expect(options[2].selected).toBe(true);
    });
  });

  describe("host class", () => {
    it("should have the ui-select class on the host", () => {
      const host: HTMLElement = fixture.nativeElement;
      expect(host.classList.contains("ui-select")).toBe(true);
    });
  });

  describe("two-way binding", () => {
    @Component({
      standalone: true,
      imports: [UISelect],
      template: `<ui-select [options]="options" [(value)]="selected" />`,
    })
    class TestHost {
      options = sampleOptions;
      selected = "b";
    }

    it("should propagate value changes to the host", async () => {
      const hostFixture = TestBed.createComponent(TestHost);
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const select: HTMLSelectElement =
        hostFixture.nativeElement.querySelector("select");
      select.value = "c";
      select.dispatchEvent(new Event("change"));
      hostFixture.detectChanges();

      expect(hostFixture.componentInstance.selected).toBe("c");
    });
  });

  describe("accessibility", () => {
    it("should not set aria-label by default", () => {
      const select: HTMLSelectElement =
        fixture.nativeElement.querySelector("select");
      expect(select.getAttribute("aria-label")).toBeNull();
    });

    it("should forward ariaLabel to the native select", () => {
      fixture.componentRef.setInput("ariaLabel", "Choose country");
      fixture.detectChanges();

      const select: HTMLSelectElement =
        fixture.nativeElement.querySelector("select");
      expect(select.getAttribute("aria-label")).toBe("Choose country");
    });
  });
});
