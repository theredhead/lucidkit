import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";

import { UIInput } from "./input.component";

describe("UIInput", () => {
  let component: UIInput;
  let fixture: ComponentFixture<UIInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIInput],
    }).compileComponents();

    fixture = TestBed.createComponent(UIInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it('should default type to "text"', () => {
      expect(component.type()).toBe("text");
    });

    it('should default value to ""', () => {
      expect(component.value()).toBe("");
    });

    it('should default placeholder to ""', () => {
      expect(component.placeholder()).toBe("");
    });

    it("should default disabled to false", () => {
      expect(component.disabled()).toBe(false);
    });
  });

  describe("type variants", () => {
    it("should set native input type to number", () => {
      fixture.componentRef.setInput("type", "number");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.type).toBe("number");
    });

    it("should set native input type to date", () => {
      fixture.componentRef.setInput("type", "date");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.type).toBe("date");
    });
  });

  describe("input event", () => {
    it("should update value on input event", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      input.value = "hello";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.value()).toBe("hello");
    });
  });

  describe("placeholder", () => {
    it("should set the native placeholder attribute", () => {
      fixture.componentRef.setInput("placeholder", "Enter value");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.placeholder).toBe("Enter value");
    });
  });

  describe("disabled state", () => {
    it("should disable the native input", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.disabled).toBe(true);
    });
  });

  describe("host class", () => {
    it("should have the ui-input class on the host", () => {
      const host: HTMLElement = fixture.nativeElement;
      expect(host.classList.contains("ui-input")).toBe(true);
    });
  });

  describe("two-way binding", () => {
    @Component({
      standalone: true,
      imports: [UIInput],
      template: `<ui-input [(value)]="text" />`,
    })
    class TestHost {
      text = "initial";
    }

    it("should propagate value changes to the host", () => {
      const hostFixture = TestBed.createComponent(TestHost);
      hostFixture.detectChanges();

      const input: HTMLInputElement =
        hostFixture.nativeElement.querySelector("input");
      input.value = "updated";
      input.dispatchEvent(new Event("input"));
      hostFixture.detectChanges();

      expect(hostFixture.componentInstance.text).toBe("updated");
    });
  });

  describe("accessibility", () => {
    it("should not set aria-label by default", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.getAttribute("aria-label")).toBeNull();
    });

    it("should forward ariaLabel to the native input", () => {
      fixture.componentRef.setInput("ariaLabel", "Search term");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.getAttribute("aria-label")).toBe("Search term");
    });
  });

  describe("multiline mode", () => {
    it("should default multiline to false", () => {
      expect(component.multiline()).toBe(false);
    });

    it("should render a textarea when multiline is true", () => {
      fixture.componentRef.setInput("multiline", true);
      fixture.detectChanges();

      const textarea = fixture.nativeElement.querySelector("textarea");
      const input = fixture.nativeElement.querySelector("input");
      expect(textarea).toBeTruthy();
      expect(input).toBeNull();
    });

    it("should render an input when multiline is false", () => {
      const input = fixture.nativeElement.querySelector("input");
      const textarea = fixture.nativeElement.querySelector("textarea");
      expect(input).toBeTruthy();
      expect(textarea).toBeNull();
    });

    it("should apply rows to the textarea", () => {
      fixture.componentRef.setInput("multiline", true);
      fixture.componentRef.setInput("rows", 6);
      fixture.detectChanges();

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector("textarea");
      expect(textarea.rows).toBe(6);
    });

    it("should default rows to 3", () => {
      expect(component.rows()).toBe(3);
    });

    it("should update value on textarea input event", () => {
      fixture.componentRef.setInput("multiline", true);
      fixture.detectChanges();

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector("textarea");
      textarea.value = "multiline text";
      textarea.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.value()).toBe("multiline text");
    });

    it("should add ui-input--multiline host class", () => {
      fixture.componentRef.setInput("multiline", true);
      fixture.detectChanges();

      expect(
        fixture.nativeElement.classList.contains("ui-input--multiline"),
      ).toBe(true);
    });

    it("should forward placeholder to the textarea", () => {
      fixture.componentRef.setInput("multiline", true);
      fixture.componentRef.setInput("placeholder", "Enter description");
      fixture.detectChanges();

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector("textarea");
      expect(textarea.placeholder).toBe("Enter description");
    });

    it("should forward disabled to the textarea", () => {
      fixture.componentRef.setInput("multiline", true);
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector("textarea");
      expect(textarea.disabled).toBe(true);
    });

    it("should forward ariaLabel to the textarea", () => {
      fixture.componentRef.setInput("multiline", true);
      fixture.componentRef.setInput("ariaLabel", "Description");
      fixture.detectChanges();

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector("textarea");
      expect(textarea.getAttribute("aria-label")).toBe("Description");
    });
  });
});
