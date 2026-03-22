import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UIRadioGroup } from "./radio-group.component";
import { UIRadioButton } from "./radio-button.component";

@Component({
  standalone: true,
  imports: [UIRadioGroup, UIRadioButton],
  template: `
    <ui-radio-group
      [name]="'color'"
      [(value)]="selected"
      [disabled]="groupDisabled()"
    >
      <ui-radio-button [value]="'red'">Red</ui-radio-button>
      <ui-radio-button [value]="'green'">Green</ui-radio-button>
      <ui-radio-button [value]="'blue'" [disabled]="true">Blue</ui-radio-button>
    </ui-radio-group>
  `,
})
class TestHost {
  public readonly selected = signal<string | undefined>(undefined);
  public readonly groupDisabled = signal(false);
}

describe("UIRadioGroup", () => {
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

  it("should create radio group with three buttons", () => {
    const buttons = fixture.nativeElement.querySelectorAll("ui-radio-button");
    expect(buttons.length).toBe(3);
  });

  it("should have radiogroup role", () => {
    const group = fixture.nativeElement.querySelector("ui-radio-group");
    expect(group.getAttribute("role")).toBe("radiogroup");
  });

  describe("selection", () => {
    it("should select a radio button on click", () => {
      const controls = fixture.nativeElement.querySelectorAll(".control");
      controls[0].click();
      fixture.detectChanges();
      expect(host.selected()).toBe("red");
    });

    it("should update checked state visually", () => {
      const controls = fixture.nativeElement.querySelectorAll(".control");
      controls[1].click();
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll("ui-radio-button");
      expect(buttons[1].classList).toContain("ui-radio-button--checked");
      expect(buttons[0].classList).not.toContain("ui-radio-button--checked");
    });

    it("should show dot on selected button", () => {
      const controls = fixture.nativeElement.querySelectorAll(".control");
      controls[0].click();
      fixture.detectChanges();
      const dot = fixture.nativeElement
        .querySelectorAll("ui-radio-button")[0]
        .querySelector(".dot");
      expect(dot).toBeTruthy();
    });

    it("should switch selection when clicking another button", () => {
      const controls = fixture.nativeElement.querySelectorAll(".control");
      controls[0].click();
      fixture.detectChanges();
      expect(host.selected()).toBe("red");

      controls[1].click();
      fixture.detectChanges();
      expect(host.selected()).toBe("green");
    });

    it("should reflect initial value", () => {
      host.selected.set("green");
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll("ui-radio-button");
      expect(buttons[1].classList).toContain("ui-radio-button--checked");
    });
  });

  describe("disabled", () => {
    it("should not allow selection on disabled button", () => {
      const controls = fixture.nativeElement.querySelectorAll(".control");
      controls[2].click(); // blue is disabled
      fixture.detectChanges();
      expect(host.selected()).toBeUndefined();
    });

    it("should apply disabled class to individual button", () => {
      const buttons = fixture.nativeElement.querySelectorAll("ui-radio-button");
      expect(buttons[2].classList).toContain("ui-radio-button--disabled");
    });

    it("should disable entire group when group disabled", () => {
      host.groupDisabled.set(true);
      fixture.detectChanges();
      const group = fixture.nativeElement.querySelector("ui-radio-group");
      expect(group.classList).toContain("ui-radio-group--disabled");
    });

    it("should not allow selection when group is disabled", () => {
      host.groupDisabled.set(true);
      fixture.detectChanges();
      const controls = fixture.nativeElement.querySelectorAll(".control");
      controls[0].click();
      fixture.detectChanges();
      expect(host.selected()).toBeUndefined();
    });
  });

  describe("keyboard interaction", () => {
    it("should select on Space key", () => {
      const controls = fixture.nativeElement.querySelectorAll(".control");
      controls[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: " ", bubbles: true }),
      );
      fixture.detectChanges();
      expect(host.selected()).toBe("red");
    });

    it("should select on Enter key", () => {
      const controls = fixture.nativeElement.querySelectorAll(".control");
      controls[1].dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      fixture.detectChanges();
      expect(host.selected()).toBe("green");
    });
  });

  describe("accessibility", () => {
    it("should set aria-checked on selected button", () => {
      const controls = fixture.nativeElement.querySelectorAll(".control");
      controls[0].click();
      fixture.detectChanges();
      expect(controls[0].getAttribute("aria-checked")).toBe("true");
      expect(controls[1].getAttribute("aria-checked")).toBe("false");
    });

    it("should set aria-disabled on disabled button", () => {
      const controls = fixture.nativeElement.querySelectorAll(".control");
      expect(controls[2].getAttribute("aria-disabled")).toBe("true");
    });

    it("should have role radio on each button", () => {
      const controls = fixture.nativeElement.querySelectorAll(".control");
      for (const control of controls) {
        expect(control.getAttribute("role")).toBe("radio");
      }
    });

    it("should set tabindex -1 on disabled button", () => {
      const controls = fixture.nativeElement.querySelectorAll(".control");
      expect(controls[2].getAttribute("tabindex")).toBe("-1");
    });
  });
});
