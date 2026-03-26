import { Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIWizard } from "./wizard.component";
import { UIWizardStep } from "./wizard-step.component";

@Component({
  selector: "ui-test-wizard-host",
  standalone: true,
  imports: [UIWizard, UIWizardStep],
  template: `
    <ui-wizard
      [linear]="linear()"
      [showStepIndicator]="showStepIndicator()"
      [nextLabel]="nextLabel()"
      [backLabel]="backLabel()"
      [finishLabel]="finishLabel()"
      (stepChange)="onStepChange($event)"
      (complete)="onComplete()"
    >
      <ui-wizard-step label="Step One" [canAdvance]="step1Valid()">
        <p>Content for step one</p>
      </ui-wizard-step>
      <ui-wizard-step label="Step Two" [optional]="true">
        <p>Content for step two</p>
      </ui-wizard-step>
      <ui-wizard-step label="Step Three">
        <p>Content for step three</p>
      </ui-wizard-step>
    </ui-wizard>
  `,
})
class TestWizardHost {
  public readonly linear = signal(false);
  public readonly showStepIndicator = signal(true);
  public readonly nextLabel = signal("Next");
  public readonly backLabel = signal("Back");
  public readonly finishLabel = signal("Finish");
  public readonly step1Valid = signal(true);
  public stepChanges: unknown[] = [];
  public completed = false;

  public onStepChange(event: unknown): void {
    this.stepChanges.push(event);
  }

  public onComplete(): void {
    this.completed = true;
  }
}

describe("UIWizard", () => {
  let fixture: ComponentFixture<TestWizardHost>;
  let host: TestWizardHost;
  let wizardEl: HTMLElement;

  function getWizard(): UIWizard {
    return fixture.debugElement.children[0].componentInstance;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestWizardHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWizardHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    wizardEl = fixture.nativeElement.querySelector("ui-wizard");
  });

  it("should create", () => {
    expect(getWizard()).toBeTruthy();
  });

  describe("defaults", () => {
    it("should start at step 0", () => {
      expect(getWizard().activeIndex()).toBe(0);
    });

    it("should discover all three steps", () => {
      expect(getWizard().steps().length).toBe(3);
    });

    it("should default linear to false", () => {
      expect(getWizard().linear()).toBe(false);
    });

    it("should default showStepIndicator to true", () => {
      expect(getWizard().showStepIndicator()).toBe(true);
    });
  });

  describe("step indicator", () => {
    it("should render step indicators", () => {
      const indicators = wizardEl.querySelectorAll(".wizard-step-indicator");
      expect(indicators.length).toBe(3);
    });

    it("should show step labels", () => {
      const labels = wizardEl.querySelectorAll(".wizard-step-label");
      expect(labels[0].textContent).toContain("Step One");
      expect(labels[1].textContent).toContain("Step Two");
      expect(labels[2].textContent).toContain("Step Three");
    });

    it("should mark the active step", () => {
      const indicators = wizardEl.querySelectorAll(".wizard-step-indicator");
      expect(
        indicators[0].classList.contains("wizard-step-indicator--active"),
      ).toBe(true);
      expect(
        indicators[1].classList.contains("wizard-step-indicator--active"),
      ).toBe(false);
    });

    it('should show "Optional" for optional steps', () => {
      const optionalHints = wizardEl.querySelectorAll(".wizard-step-optional");
      expect(optionalHints.length).toBe(1);
      expect(optionalHints[0].textContent).toContain("Optional");
    });

    it("should show connectors between steps", () => {
      const connectors = wizardEl.querySelectorAll(".wizard-connector");
      expect(connectors.length).toBe(2);
    });

    it("should hide indicator when showStepIndicator is false", () => {
      host.showStepIndicator.set(false);
      fixture.detectChanges();
      expect(wizardEl.querySelector(".wizard-indicator")).toBeNull();
    });
  });

  describe("content rendering", () => {
    it("should render the active step content", () => {
      expect(wizardEl.textContent).toContain("Content for step one");
    });

    it("should not render inactive step content", () => {
      expect(wizardEl.textContent).not.toContain("Content for step two");
      expect(wizardEl.textContent).not.toContain("Content for step three");
    });

    it("should render step two content when navigated", () => {
      getWizard().next();
      fixture.detectChanges();
      expect(wizardEl.textContent).toContain("Content for step two");
      expect(wizardEl.textContent).not.toContain("Content for step one");
    });
  });

  describe("navigation", () => {
    it("should show Next button on first step", () => {
      const nextBtn = wizardEl.querySelector(
        ".wizard-nav-button--next",
      ) as HTMLButtonElement;
      expect(nextBtn).toBeTruthy();
      expect(nextBtn.textContent).toContain("Next");
    });

    it("should not show Back button on first step", () => {
      const backBtn = wizardEl.querySelector(".wizard-nav-button--back");
      expect(backBtn).toBeNull();
    });

    it("should advance on Next click", () => {
      const nextBtn = wizardEl.querySelector(
        ".wizard-nav-button--next",
      ) as HTMLButtonElement;
      nextBtn.click();
      fixture.detectChanges();

      expect(getWizard().activeIndex()).toBe(1);
      expect(wizardEl.textContent).toContain("Content for step two");
    });

    it("should show Back button on second step", () => {
      getWizard().next();
      fixture.detectChanges();

      const backBtn = wizardEl.querySelector(".wizard-nav-button--back");
      expect(backBtn).toBeTruthy();
    });

    it("should go back on Back click", () => {
      getWizard().next();
      fixture.detectChanges();

      const backBtn = wizardEl.querySelector(
        ".wizard-nav-button--back",
      ) as HTMLButtonElement;
      backBtn.click();
      fixture.detectChanges();

      expect(getWizard().activeIndex()).toBe(0);
    });

    it("should show Finish button on last step", () => {
      getWizard().goToStep(2);
      fixture.detectChanges();

      const finishBtn = wizardEl.querySelector(".wizard-nav-button--finish");
      expect(finishBtn).toBeTruthy();
      expect(finishBtn!.textContent).toContain("Finish");
    });

    it("should emit stepChange on navigation", () => {
      getWizard().next();
      fixture.detectChanges();

      expect(host.stepChanges.length).toBe(1);
      expect(host.stepChanges[0]).toEqual({
        previousIndex: 0,
        currentIndex: 1,
      });
    });

    it("should emit complete on finish", () => {
      getWizard().goToStep(2);
      fixture.detectChanges();

      getWizard().finish();
      fixture.detectChanges();

      expect(host.completed).toBe(true);
    });
  });

  describe("validation gates", () => {
    it("should disable Next when canAdvance is false", () => {
      host.step1Valid.set(false);
      fixture.detectChanges();

      const nextBtn = wizardEl.querySelector(
        ".wizard-nav-button--next",
      ) as HTMLButtonElement;
      expect(nextBtn.disabled).toBe(true);
    });

    it("should prevent programmatic next when canAdvance is false", () => {
      host.step1Valid.set(false);
      fixture.detectChanges();

      getWizard().next();
      fixture.detectChanges();

      expect(getWizard().activeIndex()).toBe(0);
    });

    it("should enable Next when canAdvance becomes true", () => {
      host.step1Valid.set(false);
      fixture.detectChanges();

      host.step1Valid.set(true);
      fixture.detectChanges();

      const nextBtn = wizardEl.querySelector(
        ".wizard-nav-button--next",
      ) as HTMLButtonElement;
      expect(nextBtn.disabled).toBe(false);
    });
  });

  describe("linear mode", () => {
    beforeEach(() => {
      host.linear.set(true);
      fixture.detectChanges();
    });

    it("should prevent clicking ahead in linear mode", () => {
      const indicators = wizardEl.querySelectorAll(
        ".wizard-step-indicator",
      ) as NodeListOf<HTMLButtonElement>;
      expect(indicators[2].disabled).toBe(true);
    });

    it("should allow clicking the current step", () => {
      const indicators = wizardEl.querySelectorAll(
        ".wizard-step-indicator",
      ) as NodeListOf<HTMLButtonElement>;
      expect(indicators[0].disabled).toBe(false);
    });

    it("should allow clicking completed steps", () => {
      getWizard().next();
      fixture.detectChanges();

      const indicators = wizardEl.querySelectorAll(
        ".wizard-step-indicator",
      ) as NodeListOf<HTMLButtonElement>;
      expect(indicators[0].disabled).toBe(false);
    });

    it("should prevent goToStep beyond validated steps", () => {
      host.step1Valid.set(false);
      fixture.detectChanges();

      getWizard().goToStep(2);
      fixture.detectChanges();

      expect(getWizard().activeIndex()).toBe(0);
    });
  });

  describe("step indicator state", () => {
    it("should mark completed steps with check icon", () => {
      getWizard().next();
      fixture.detectChanges();

      const firstNum = wizardEl.querySelectorAll(".wizard-step-number")[0];
      expect(firstNum.querySelector("ui-icon")).toBeTruthy();
    });

    it("should mark completed steps with --completed class", () => {
      getWizard().next();
      fixture.detectChanges();

      const indicators = wizardEl.querySelectorAll(".wizard-step-indicator");
      expect(
        indicators[0].classList.contains("wizard-step-indicator--completed"),
      ).toBe(true);
    });

    it("should mark completed connectors", () => {
      getWizard().next();
      fixture.detectChanges();

      const connectors = wizardEl.querySelectorAll(".wizard-connector");
      expect(
        connectors[0].classList.contains("wizard-connector--completed"),
      ).toBe(true);
    });
  });

  describe("goToStep", () => {
    it("should navigate to a specific step", () => {
      getWizard().goToStep(2);
      fixture.detectChanges();

      expect(getWizard().activeIndex()).toBe(2);
      expect(wizardEl.textContent).toContain("Content for step three");
    });

    it("should ignore out-of-range indices", () => {
      getWizard().goToStep(10);
      fixture.detectChanges();
      expect(getWizard().activeIndex()).toBe(0);

      getWizard().goToStep(-1);
      fixture.detectChanges();
      expect(getWizard().activeIndex()).toBe(0);
    });

    it("should not emit stepChange for same index", () => {
      getWizard().goToStep(0);
      fixture.detectChanges();
      expect(host.stepChanges.length).toBe(0);
    });
  });

  describe("custom labels", () => {
    it("should support custom button labels", () => {
      host.nextLabel.set("Continue");
      host.backLabel.set("Previous");
      host.finishLabel.set("Done");
      fixture.detectChanges();

      const nextBtn = wizardEl.querySelector(".wizard-nav-button--next");
      expect(nextBtn!.textContent).toContain("Continue");

      getWizard().goToStep(1);
      fixture.detectChanges();

      const backBtn = wizardEl.querySelector(".wizard-nav-button--back");
      expect(backBtn!.textContent).toContain("Previous");

      getWizard().goToStep(2);
      fixture.detectChanges();

      const finishBtn = wizardEl.querySelector(".wizard-nav-button--finish");
      expect(finishBtn!.textContent).toContain("Done");
    });
  });

  describe("accessibility", () => {
    it("should have role tablist on the indicator", () => {
      const indicator = wizardEl.querySelector(".wizard-indicator");
      expect(indicator!.getAttribute("role")).toBe("tablist");
    });

    it("should have role tab on step indicators", () => {
      const tabs = wizardEl.querySelectorAll(".wizard-step-indicator");
      tabs.forEach((tab) => {
        expect(tab.getAttribute("role")).toBe("tab");
      });
    });

    it("should have role tabpanel on content area", () => {
      const content = wizardEl.querySelector(".wizard-content");
      expect(content!.getAttribute("role")).toBe("tabpanel");
    });

    it("should mark active tab with aria-selected", () => {
      const tabs = wizardEl.querySelectorAll(".wizard-step-indicator");
      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
      expect(tabs[1].getAttribute("aria-selected")).toBe("false");
    });
  });
});
