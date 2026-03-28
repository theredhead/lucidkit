import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, viewChild } from "@angular/core";

import { type ToggleSize, UIToggle } from "./toggle.component";

describe("UIToggle", () => {
  let component: UIToggle;
  let fixture: ComponentFixture<UIToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(UIToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // ── Defaults ────────────────────────────────────────────────────────

  describe("defaults", () => {
    it("should default value to false", () => {
      expect(component.value()).toBe(false);
    });

    it("should default disabled to false", () => {
      expect(component.disabled()).toBe(false);
    });

    it('should default size to "medium"', () => {
      expect(component.size()).toBe("medium");
    });

    it("should default onLabel to empty string", () => {
      expect(component.onLabel()).toBe("");
    });

    it("should default offLabel to empty string", () => {
      expect(component.offLabel()).toBe("");
    });

    it("should default ariaLabel to empty string", () => {
      expect(component.ariaLabel()).toBe("");
    });
  });

  // ── Host classes ──────────────────────────────────────────────────

  describe("host classes", () => {
    it("should have ui-toggle base class", () => {
      expect(fixture.nativeElement.classList).toContain("ui-toggle");
    });

    it("should apply ui-toggle--on when value is true", () => {
      fixture.componentRef.setInput("value", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain("ui-toggle--on");
    });

    it("should not have ui-toggle--on when value is false", () => {
      expect(fixture.nativeElement.classList).not.toContain("ui-toggle--on");
    });

    it("should apply ui-toggle--disabled when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain("ui-toggle--disabled");
    });

    describe("sizes", () => {
      const sizes: ToggleSize[] = ["small", "medium", "large"];

      for (const size of sizes) {
        it(`should apply ui-toggle--${size} host class`, () => {
          fixture.componentRef.setInput("size", size);
          fixture.detectChanges();
          expect(fixture.nativeElement.classList).toContain(
            `ui-toggle--${size}`,
          );
        });
      }
    });

    it("should apply ui-toggle--labelled when onLabel is set", () => {
      fixture.componentRef.setInput("onLabel", "Yes");
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain("ui-toggle--labelled");
    });

    it("should apply ui-toggle--labelled when offLabel is set", () => {
      fixture.componentRef.setInput("offLabel", "No");
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain("ui-toggle--labelled");
    });

    it("should not have ui-toggle--labelled when no labels set", () => {
      expect(fixture.nativeElement.classList).not.toContain(
        "ui-toggle--labelled",
      );
    });
  });

  // ── Toggle behaviour ──────────────────────────────────────────────

  describe("toggle()", () => {
    it("should toggle value from false to true", () => {
      component.toggle();
      expect(component.value()).toBe(true);
    });

    it("should toggle value from true to false", () => {
      fixture.componentRef.setInput("value", true);
      fixture.detectChanges();
      component.toggle();
      expect(component.value()).toBe(false);
    });

    it("should emit valueChange on toggle", () => {
      const spy = vi.fn();
      component.valueChange.subscribe(spy);
      component.toggle();
      expect(spy).toHaveBeenCalledWith(true);
    });

    it("should not toggle when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      component.toggle();
      expect(component.value()).toBe(false);
    });

    it("should not emit valueChange when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      const spy = vi.fn();
      component.valueChange.subscribe(spy);
      component.toggle();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  // ── Click interaction ─────────────────────────────────────────────

  describe("click interaction", () => {
    it("should toggle when track is clicked", () => {
      const track = fixture.nativeElement.querySelector(
        ".track",
      ) as HTMLElement;
      track.click();
      fixture.detectChanges();
      expect(component.value()).toBe(true);
    });
  });

  // ── Keyboard interaction ──────────────────────────────────────────

  describe("keyboard interaction", () => {
    it("should toggle on Space key", () => {
      const track = fixture.nativeElement.querySelector(
        ".track",
      ) as HTMLElement;
      const event = new KeyboardEvent("keydown", {
        key: " ",
        cancelable: true,
      });
      track.dispatchEvent(event);
      fixture.detectChanges();
      expect(component.value()).toBe(true);
      expect(event.defaultPrevented).toBe(true);
    });

    it("should toggle on Enter key", () => {
      const track = fixture.nativeElement.querySelector(
        ".track",
      ) as HTMLElement;
      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        cancelable: true,
      });
      track.dispatchEvent(event);
      fixture.detectChanges();
      expect(component.value()).toBe(true);
    });

    it("should not toggle on other keys", () => {
      const track = fixture.nativeElement.querySelector(
        ".track",
      ) as HTMLElement;
      track.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
      fixture.detectChanges();
      expect(component.value()).toBe(false);
    });
  });

  // ── Labels ────────────────────────────────────────────────────────

  describe("labels", () => {
    it("should not render track labels by default", () => {
      const labels = fixture.nativeElement.querySelectorAll(".label");
      expect(labels.length).toBe(0);
    });

    it("should render on/off labels when configured", () => {
      fixture.componentRef.setInput("onLabel", "Yes");
      fixture.componentRef.setInput("offLabel", "No");
      fixture.detectChanges();

      const onLabel = fixture.nativeElement.querySelector(
        ".label--on",
      ) as HTMLElement;
      const offLabel = fixture.nativeElement.querySelector(
        ".label--off",
      ) as HTMLElement;

      expect(onLabel.textContent!.trim()).toBe("Yes");
      expect(offLabel.textContent!.trim()).toBe("No");
    });
  });

  // ── Accessibility ─────────────────────────────────────────────────

  describe("accessibility", () => {
    it('should have role="switch" on the track', () => {
      const track = fixture.nativeElement.querySelector(".track");
      expect(track.getAttribute("role")).toBe("switch");
    });

    it("should have aria-checked matching value", () => {
      const track = fixture.nativeElement.querySelector(".track");
      expect(track.getAttribute("aria-checked")).toBe("false");

      fixture.componentRef.setInput("value", true);
      fixture.detectChanges();
      expect(track.getAttribute("aria-checked")).toBe("true");
    });

    it("should have tabindex 0 on the track", () => {
      const track = fixture.nativeElement.querySelector(".track");
      expect(track.getAttribute("tabindex")).toBe("0");
    });

    it("should forward ariaLabel to aria-label", () => {
      fixture.componentRef.setInput("ariaLabel", "Dark mode");
      fixture.detectChanges();
      const track = fixture.nativeElement.querySelector(".track");
      expect(track.getAttribute("aria-label")).toBe("Dark mode");
    });

    it("should have aria-disabled when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      const track = fixture.nativeElement.querySelector(".track");
      expect(track.getAttribute("aria-disabled")).toBe("true");
    });

    it("should mark track labels as aria-hidden", () => {
      fixture.componentRef.setInput("onLabel", "ON");
      fixture.componentRef.setInput("offLabel", "OFF");
      fixture.detectChanges();

      const labels = fixture.nativeElement.querySelectorAll(".label");
      for (const label of labels) {
        expect(label.getAttribute("aria-hidden")).toBe("true");
      }
    });
  });

  // ── Integration: two-way binding ──────────────────────────────────

  describe("integration", () => {
    @Component({
      standalone: true,
      imports: [UIToggle],
      template: `<ui-toggle [(value)]="enabled" onLabel="On" offLabel="Off">
        Toggle feature
      </ui-toggle>`,
    })
    class TestHost {
      public enabled = false;
      public readonly toggle = viewChild.required(UIToggle);
    }

    let hostFixture: ComponentFixture<TestHost>;
    let host: TestHost;

    beforeEach(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestHost],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHost);
      host = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });

    it("should bind value two-way", () => {
      expect(host.toggle().value()).toBe(false);
      host.toggle().toggle();
      hostFixture.detectChanges();
      expect(host.enabled).toBe(true);
    });

    it("should project text content", () => {
      const text = hostFixture.nativeElement.querySelector(
        ".text",
      ) as HTMLElement;
      expect(text.textContent!.trim()).toContain("Toggle feature");
    });

    it("should display on/off labels", () => {
      const onLabel = hostFixture.nativeElement.querySelector(
        ".label--on",
      ) as HTMLElement;
      const offLabel = hostFixture.nativeElement.querySelector(
        ".label--off",
      ) as HTMLElement;
      expect(onLabel.textContent!.trim()).toBe("On");
      expect(offLabel.textContent!.trim()).toBe("Off");
    });
  });
});
