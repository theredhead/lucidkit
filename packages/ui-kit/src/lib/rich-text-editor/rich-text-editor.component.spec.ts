import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIRichTextEditor } from "./rich-text-editor.component";
import {
  DEFAULT_TOOLBAR_ACTIONS,
  TOOLBAR_BUTTON_REGISTRY,
  type RichTextPlaceholder,
} from "./rich-text-editor.types";

describe("UIRichTextEditor", () => {
  let fixture: ComponentFixture<UIRichTextEditor>;
  let component: UIRichTextEditor;
  let execCommandSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // jsdom does not implement execCommand — provide a mock
    execCommandSpy = vi
      .fn<(cmd: string, showUI?: boolean, value?: string) => boolean>()
      .mockReturnValue(true);
    (document as any).execCommand = execCommandSpy;

    await TestBed.configureTestingModule({
      imports: [UIRichTextEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(UIRichTextEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    execCommandSpy.mockReset();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("host class", () => {
    it("should have the ui-rich-text-editor class", () => {
      expect(
        fixture.nativeElement.classList.contains("ui-rich-text-editor"),
      ).toBe(true);
    });

    it("should add disabled class when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.classList.contains(
          "ui-rich-text-editor--disabled",
        ),
      ).toBe(true);
    });

    it("should add readonly class when readonly", () => {
      fixture.componentRef.setInput("readonly", true);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.classList.contains(
          "ui-rich-text-editor--readonly",
        ),
      ).toBe(true);
    });
  });

  describe("defaults", () => {
    it("should default disabled to false", () => {
      expect(component.disabled()).toBe(false);
    });

    it("should default readonly to false", () => {
      expect(component.readonly()).toBe(false);
    });

    it('should default ariaLabel to "Rich text editor"', () => {
      expect(component.ariaLabel()).toBe("Rich text editor");
    });

    it('should default placeholder to "Type here…"', () => {
      expect(component.placeholder()).toBe("Type here…");
    });

    it("should default value to empty string", () => {
      expect(component.value()).toBe("");
    });

    it("should default toolbarActions to DEFAULT_TOOLBAR_ACTIONS", () => {
      expect(component.toolbarActions()).toBe(DEFAULT_TOOLBAR_ACTIONS);
    });

    it("should default placeholders to empty array", () => {
      expect(component.placeholders()).toEqual([]);
    });
  });

  describe("toolbar", () => {
    it("should render a toolbar", () => {
      const toolbar = fixture.nativeElement.querySelector(".rte-toolbar");
      expect(toolbar).toBeTruthy();
      expect(toolbar.getAttribute("role")).toBe("toolbar");
    });

    it("should render toolbar buttons for each action", () => {
      const buttons =
        fixture.nativeElement.querySelectorAll(".rte-toolbar-btn");
      expect(buttons.length).toBe(DEFAULT_TOOLBAR_ACTIONS.length);
    });

    it("should render correct labels on toolbar buttons", () => {
      const buttons: HTMLButtonElement[] = Array.from(
        fixture.nativeElement.querySelectorAll(".rte-toolbar-btn"),
      );
      for (const btn of buttons) {
        const label = btn.getAttribute("aria-label");
        expect(label).toBeTruthy();
      }
    });

    it("should render only specified actions when toolbarActions is set", () => {
      fixture.componentRef.setInput("toolbarActions", ["bold", "italic"]);
      fixture.detectChanges();

      const buttons =
        fixture.nativeElement.querySelectorAll(".rte-toolbar-btn");
      expect(buttons.length).toBe(2);
      expect(buttons[0].getAttribute("aria-label")).toBe("Bold");
      expect(buttons[1].getAttribute("aria-label")).toBe("Italic");
    });

    it("should disable toolbar buttons when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const buttons: HTMLButtonElement[] = Array.from(
        fixture.nativeElement.querySelectorAll(".rte-toolbar-btn"),
      );
      for (const btn of buttons) {
        expect(btn.disabled).toBe(true);
      }
    });

    it("should disable toolbar buttons when readonly", () => {
      fixture.componentRef.setInput("readonly", true);
      fixture.detectChanges();

      const buttons: HTMLButtonElement[] = Array.from(
        fixture.nativeElement.querySelectorAll(".rte-toolbar-btn"),
      );
      for (const btn of buttons) {
        expect(btn.disabled).toBe(true);
      }
    });

    it("should render group separators between different groups", () => {
      const separators = fixture.nativeElement.querySelectorAll(
        ".rte-toolbar-separator",
      );
      expect(separators.length).toBeGreaterThan(0);
    });
  });

  describe("editor area", () => {
    it("should render a contenteditable div", () => {
      const editor = fixture.nativeElement.querySelector(".rte-editor");
      expect(editor).toBeTruthy();
      expect(editor.getAttribute("contenteditable")).toBe("true");
    });

    it("should have textbox role", () => {
      const editor = fixture.nativeElement.querySelector(".rte-editor");
      expect(editor.getAttribute("role")).toBe("textbox");
    });

    it("should set aria-multiline to true", () => {
      const editor = fixture.nativeElement.querySelector(".rte-editor");
      expect(editor.getAttribute("aria-multiline")).toBe("true");
    });

    it("should forward ariaLabel to the editor", () => {
      fixture.componentRef.setInput("ariaLabel", "Email body");
      fixture.detectChanges();

      const editor = fixture.nativeElement.querySelector(".rte-editor");
      expect(editor.getAttribute("aria-label")).toBe("Email body");
    });

    it("should forward placeholder as data-placeholder attribute", () => {
      fixture.componentRef.setInput("placeholder", "Write something…");
      fixture.detectChanges();

      const editor = fixture.nativeElement.querySelector(".rte-editor");
      expect(editor.getAttribute("data-placeholder")).toBe("Write something…");
    });

    it("should set contenteditable to false when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const editor = fixture.nativeElement.querySelector(".rte-editor");
      expect(editor.getAttribute("contenteditable")).toBe("false");
    });

    it("should set contenteditable to false when readonly", () => {
      fixture.componentRef.setInput("readonly", true);
      fixture.detectChanges();

      const editor = fixture.nativeElement.querySelector(".rte-editor");
      expect(editor.getAttribute("contenteditable")).toBe("false");
    });
  });

  describe("value binding", () => {
    it("should render initial value into the editor", () => {
      fixture.componentRef.setInput("value", "<p>Hello world</p>");
      // Trigger ngAfterViewInit re-render
      (component as any).renderHtmlToEditor("<p>Hello world</p>");
      fixture.detectChanges();

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".rte-editor");
      expect(editor.innerHTML).toContain("Hello world");
    });

    it("should sync value when editor content changes", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".rte-editor");
      editor.innerHTML = "<p>Updated content</p>";
      editor.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.value()).toContain("Updated content");
    });
  });

  describe("formatting", () => {
    beforeEach(() => {
      execCommandSpy.mockClear();
    });

    it("should call execCommand for bold", () => {
      (component as any).execAction("bold");
      expect(execCommandSpy).toHaveBeenCalledWith("bold");
    });

    it("should call execCommand for italic", () => {
      (component as any).execAction("italic");
      expect(execCommandSpy).toHaveBeenCalledWith("italic");
    });

    it("should call execCommand for underline", () => {
      (component as any).execAction("underline");
      expect(execCommandSpy).toHaveBeenCalledWith("underline");
    });

    it("should call execCommand for strikethrough", () => {
      (component as any).execAction("strikethrough");
      expect(execCommandSpy).toHaveBeenCalledWith("strikeThrough");
    });

    it("should call formatBlock for heading1", () => {
      (component as any).execAction("heading1");
      expect(execCommandSpy).toHaveBeenCalledWith("formatBlock", false, "h1");
    });

    it("should call formatBlock for heading2", () => {
      (component as any).execAction("heading2");
      expect(execCommandSpy).toHaveBeenCalledWith("formatBlock", false, "h2");
    });

    it("should call formatBlock for heading3", () => {
      (component as any).execAction("heading3");
      expect(execCommandSpy).toHaveBeenCalledWith("formatBlock", false, "h3");
    });

    it("should call insertUnorderedList for unorderedList", () => {
      (component as any).execAction("unorderedList");
      expect(execCommandSpy).toHaveBeenCalledWith("insertUnorderedList");
    });

    it("should call insertOrderedList for orderedList", () => {
      (component as any).execAction("orderedList");
      expect(execCommandSpy).toHaveBeenCalledWith("insertOrderedList");
    });

    it("should call justifyLeft for alignLeft", () => {
      (component as any).execAction("alignLeft");
      expect(execCommandSpy).toHaveBeenCalledWith("justifyLeft");
    });

    it("should call justifyCenter for alignCenter", () => {
      (component as any).execAction("alignCenter");
      expect(execCommandSpy).toHaveBeenCalledWith("justifyCenter");
    });

    it("should call justifyRight for alignRight", () => {
      (component as any).execAction("alignRight");
      expect(execCommandSpy).toHaveBeenCalledWith("justifyRight");
    });

    it("should call removeFormat for removeFormat", () => {
      (component as any).execAction("removeFormat");
      expect(execCommandSpy).toHaveBeenCalledWith("removeFormat");
    });

    it("should not execute formatting when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      (component as any).execAction("bold");
      expect(execCommandSpy).not.toHaveBeenCalled();
    });

    it("should not execute formatting when readonly", () => {
      fixture.componentRef.setInput("readonly", true);
      fixture.detectChanges();

      (component as any).execAction("bold");
      expect(execCommandSpy).not.toHaveBeenCalled();
    });
  });

  describe("placeholder picker", () => {
    const testPlaceholders: RichTextPlaceholder[] = [
      { key: "firstName", label: "First Name", category: "Contact" },
      { key: "lastName", label: "Last Name", category: "Contact" },
      { key: "company", label: "Company", category: "Account" },
    ];

    beforeEach(() => {
      fixture.componentRef.setInput("placeholders", testPlaceholders);
      fixture.detectChanges();
    });

    it("should show placeholder picker button when placeholders are provided", () => {
      const btn = fixture.nativeElement.querySelector(
        ".rte-toolbar-btn--placeholder",
      );
      expect(btn).toBeTruthy();
    });

    it("should not show placeholder picker when no placeholders", () => {
      fixture.componentRef.setInput("placeholders", []);
      fixture.detectChanges();

      const btn = fixture.nativeElement.querySelector(
        ".rte-toolbar-btn--placeholder",
      );
      expect(btn).toBeNull();
    });

    it("should toggle dropdown on click", () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".rte-toolbar-btn--placeholder",
      );

      btn.click();
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".rte-placeholder-dropdown"),
      ).toBeTruthy();

      btn.click();
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".rte-placeholder-dropdown"),
      ).toBeNull();
    });

    it("should render category headers", () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".rte-toolbar-btn--placeholder",
      );
      btn.click();
      fixture.detectChanges();

      const categories = fixture.nativeElement.querySelectorAll(
        ".rte-placeholder-category",
      );
      expect(categories.length).toBe(2);
      expect(categories[0].textContent.trim()).toBe("Contact");
      expect(categories[1].textContent.trim()).toBe("Account");
    });

    it("should render placeholder options", () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".rte-toolbar-btn--placeholder",
      );
      btn.click();
      fixture.detectChanges();

      const options = fixture.nativeElement.querySelectorAll(
        ".rte-placeholder-option",
      );
      expect(options.length).toBe(3);
    });

    it("should close dropdown after inserting a placeholder", () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".rte-toolbar-btn--placeholder",
      );
      btn.click();
      fixture.detectChanges();

      const option = fixture.nativeElement.querySelector(
        ".rte-placeholder-option",
      );
      option.click();
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(".rte-placeholder-dropdown"),
      ).toBeNull();
    });

    it("should emit placeholderInserted when a placeholder is inserted", () => {
      const spy = vi.fn();
      component.placeholderInserted.subscribe(spy);

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".rte-toolbar-btn--placeholder",
      );
      btn.click();
      fixture.detectChanges();

      const option = fixture.nativeElement.querySelector(
        ".rte-placeholder-option",
      );
      option.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(testPlaceholders[0]);
    });

    it("should not open picker when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".rte-toolbar-btn--placeholder",
      );
      expect(btn.disabled).toBe(true);
    });
  });

  describe("placeholder serialisation", () => {
    it("should serialise placeholder chips as {{key}} tokens", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".rte-editor");
      editor.innerHTML =
        'Hello <span class="rte-placeholder" contenteditable="false" data-placeholder-key="firstName">First Name</span>!';
      editor.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.value()).toBe("Hello {{firstName}}!");
    });

    it("should deserialise {{key}} tokens into placeholder chips", () => {
      fixture.componentRef.setInput("placeholders", [
        { key: "firstName", label: "First Name" },
      ]);
      fixture.detectChanges();

      (component as any).renderHtmlToEditor("Hello {{firstName}}!");
      fixture.detectChanges();

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".rte-editor");
      const chip = editor.querySelector(".rte-placeholder");
      expect(chip).toBeTruthy();
      expect(chip!.getAttribute("data-placeholder-key")).toBe("firstName");
      expect(chip!.textContent).toContain("First Name");
    });

    it("should use key as label when placeholder is not defined", () => {
      fixture.componentRef.setInput("placeholders", []);
      fixture.detectChanges();

      (component as any).renderHtmlToEditor("Hello {{unknownKey}}!");
      fixture.detectChanges();

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".rte-editor");
      const chip = editor.querySelector(".rte-placeholder");
      expect(chip).toBeTruthy();
      expect(chip!.textContent).toContain("unknownKey");
    });
  });

  describe("focus tracking", () => {
    it("should track focus state", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".rte-editor");
      expect(component["isFocused"]()).toBe(false);

      editor.dispatchEvent(new Event("focus"));
      expect(component["isFocused"]()).toBe(true);

      editor.dispatchEvent(new Event("blur"));
      expect(component["isFocused"]()).toBe(false);
    });

    it("should add focused class to wrapper when focused", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".rte-editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.querySelector(
        ".rte-editor-wrapper--focused",
      );
      expect(wrapper).toBeTruthy();
    });
  });

  describe("types", () => {
    it("should have all default toolbar actions registered", () => {
      for (const action of DEFAULT_TOOLBAR_ACTIONS) {
        expect(TOOLBAR_BUTTON_REGISTRY[action]).toBeTruthy();
        expect(TOOLBAR_BUTTON_REGISTRY[action].label).toBeTruthy();
        expect(TOOLBAR_BUTTON_REGISTRY[action].icon).toBeTruthy();
      }
    });
  });
});
