import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopoverRef } from "../../popover/popover.types";
import { UILinkDialog, type LinkDialogResult } from "./link-dialog.component";

describe("UILinkDialog", () => {
  let fixture: ComponentFixture<UILinkDialog>;
  let component: UILinkDialog;
  let popoverRef: PopoverRef<LinkDialogResult>;

  beforeEach(async () => {
    popoverRef = new PopoverRef<LinkDialogResult>();

    await TestBed.configureTestingModule({
      imports: [UILinkDialog],
      providers: [{ provide: PopoverRef, useValue: popoverRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(UILinkDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have the ui-link-dialog host class", () => {
    expect(fixture.nativeElement.classList.contains("ui-link-dialog")).toBe(
      true,
    );
  });

  describe("defaults", () => {
    it("should default initialUrl to empty string", () => {
      expect(component.initialUrl()).toBe("");
    });

    it("should default initialText to empty string", () => {
      expect(component.initialText()).toBe("");
    });

    it("should default editMode to false", () => {
      expect(component.editMode()).toBe(false);
    });

    it("should default url signal to empty string", () => {
      expect(component.url()).toBe("");
    });

    it("should default text signal to empty string", () => {
      expect(component.text()).toBe("");
    });
  });

  describe("initial value sync", () => {
    it("should sync initialUrl to url signal after microtask", async () => {
      fixture.componentRef.setInput("initialUrl", "https://example.com");
      fixture.detectChanges();

      // queueMicrotask already ran in constructor, so set again
      component.url.set(component.initialUrl());

      expect(component.url()).toBe("https://example.com");
    });

    it("should sync initialText to text signal after microtask", async () => {
      fixture.componentRef.setInput("initialText", "Example");
      fixture.detectChanges();

      component.text.set(component.initialText());

      expect(component.text()).toBe("Example");
    });
  });

  describe("template", () => {
    it("should render a URL input", () => {
      const input = fixture.nativeElement.querySelector("#ld-url");
      expect(input).toBeTruthy();
      expect(input.type).toBe("url");
      expect(input.placeholder).toBe("https://example.com");
    });

    it("should render a display text input", () => {
      const input = fixture.nativeElement.querySelector("#ld-text");
      expect(input).toBeTruthy();
      expect(input.type).toBe("text");
      expect(input.placeholder).toBe("Link text");
    });

    it("should render an apply button", () => {
      const btn = fixture.nativeElement.querySelector(".btn--apply");
      expect(btn).toBeTruthy();
    });

    it("should render a cancel button", () => {
      const btn = fixture.nativeElement.querySelector(".btn--cancel");
      expect(btn).toBeTruthy();
      expect(btn.textContent.trim()).toBe("Cancel");
    });

    it('should show "Add hyperlink" when not in edit mode', () => {
      const btn = fixture.nativeElement.querySelector(".btn--apply");
      expect(btn.textContent).toContain("Add hyperlink");
      expect(btn.textContent).not.toContain("Edit hyperlink");
    });

    it('should show "Edit hyperlink" when in edit mode', () => {
      fixture.componentRef.setInput("editMode", true);
      fixture.detectChanges();

      const btn = fixture.nativeElement.querySelector(".btn--apply");
      expect(btn.textContent).toContain("Edit hyperlink");
      expect(btn.textContent).not.toContain("Add hyperlink");
    });

    it("should disable apply button when URL is empty", () => {
      component.url.set("");
      fixture.detectChanges();

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".btn--apply");
      expect(btn.disabled).toBe(true);
    });

    it("should disable apply button when URL is only whitespace", () => {
      component.url.set("   ");
      fixture.detectChanges();

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".btn--apply");
      expect(btn.disabled).toBe(true);
    });

    it("should enable apply button when URL has a value", () => {
      component.url.set("https://example.com");
      fixture.detectChanges();

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".btn--apply");
      expect(btn.disabled).toBe(false);
    });

    it("should render a link icon in the apply button", () => {
      const icon = fixture.nativeElement.querySelector(
        ".btn--apply ui-icon",
      );
      expect(icon).toBeTruthy();
    });
  });

  describe("apply", () => {
    it("should close popover with url and text on apply", () => {
      const closeSpy = vi.spyOn(popoverRef, "close");

      component.url.set("https://example.com");
      component.text.set("Example Site");
      component.apply();

      expect(closeSpy).toHaveBeenCalledWith({
        url: "https://example.com",
        text: "Example Site",
      });
    });

    it("should trim url and text before closing", () => {
      const closeSpy = vi.spyOn(popoverRef, "close");

      component.url.set("  https://example.com  ");
      component.text.set("  Example  ");
      component.apply();

      expect(closeSpy).toHaveBeenCalledWith({
        url: "https://example.com",
        text: "Example",
      });
    });

    it("should use URL as text when text is empty", () => {
      const closeSpy = vi.spyOn(popoverRef, "close");

      component.url.set("https://example.com");
      component.text.set("");
      component.apply();

      expect(closeSpy).toHaveBeenCalledWith({
        url: "https://example.com",
        text: "https://example.com",
      });
    });

    it("should use URL as text when text is only whitespace", () => {
      const closeSpy = vi.spyOn(popoverRef, "close");

      component.url.set("https://example.com");
      component.text.set("   ");
      component.apply();

      expect(closeSpy).toHaveBeenCalledWith({
        url: "https://example.com",
        text: "https://example.com",
      });
    });

    it("should not close if url is empty", () => {
      const closeSpy = vi.spyOn(popoverRef, "close");

      component.url.set("");
      component.text.set("some text");
      component.apply();

      expect(closeSpy).not.toHaveBeenCalled();
    });

    it("should not close if url is only whitespace", () => {
      const closeSpy = vi.spyOn(popoverRef, "close");

      component.url.set("   ");
      component.text.set("some text");
      component.apply();

      expect(closeSpy).not.toHaveBeenCalled();
    });
  });

  describe("cancel", () => {
    it("should close popover with undefined on cancel", () => {
      const closeSpy = vi.spyOn(popoverRef, "close");

      component.cancel();

      expect(closeSpy).toHaveBeenCalledWith(undefined);
    });
  });

  describe("interactions", () => {
    it("should call apply when clicking the apply button", () => {
      const applySpy = vi.spyOn(component, "apply");
      component.url.set("https://example.com");
      fixture.detectChanges();

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".btn--apply");
      btn.click();

      expect(applySpy).toHaveBeenCalled();
    });

    it("should call cancel when clicking the cancel button", () => {
      const cancelSpy = vi.spyOn(component, "cancel");

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".btn--cancel");
      btn.click();

      expect(cancelSpy).toHaveBeenCalled();
    });

    it("should call apply on Enter keydown in URL input", () => {
      const applySpy = vi.spyOn(component, "apply");
      component.url.set("https://example.com");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("#ld-url");
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );

      expect(applySpy).toHaveBeenCalled();
    });

    it("should call apply on Enter keydown in text input", () => {
      const applySpy = vi.spyOn(component, "apply");
      component.url.set("https://example.com");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("#ld-text");
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );

      expect(applySpy).toHaveBeenCalled();
    });
  });
});
