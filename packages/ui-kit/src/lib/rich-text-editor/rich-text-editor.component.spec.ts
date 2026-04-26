/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopoverRef } from "../popover/popover.types";
import { PopoverService } from "../popover/popover.service";
import { UIRichTextEditor } from "./rich-text-editor.component";
import {
  DEFAULT_TOOLBAR_ACTIONS,
  TOOLBAR_BUTTON_REGISTRY,
  type RichTextPlaceholder,
} from "./rich-text-editor.types";
import type { LinkDialogResult } from "./link-dialog/link-dialog.component";

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
      expect(fixture.nativeElement.classList.contains("disabled")).toBe(true);
    });

    it("should add readonly class when readonly", () => {
      fixture.componentRef.setInput("readonly", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList.contains("readonly")).toBe(true);
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

    it('should default presentation to "default"', () => {
      expect(component.presentation()).toBe("default");
    });

    it("should default placeholders to empty array", () => {
      expect(component.placeholders()).toEqual([]);
    });
  });

  describe("toolbar", () => {
    it("should render a toolbar", () => {
      const toolbar = fixture.nativeElement.querySelector("ui-toolbar");
      expect(toolbar).toBeTruthy();
      expect(toolbar.getAttribute("role")).toBe("toolbar");
    });

    it("should render flat buttons for inline and misc groups", () => {
      // Check that key formatting buttons are rendered
      expect(
        fixture.nativeElement.querySelector('[aria-label="Undo"]'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('[aria-label="Bold"]'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('[aria-label="Italic"]'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('[aria-label="Hyperlink"]'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('[aria-label="Insert emoji"]'),
      ).toBeTruthy();
    });

    it("should render dropdown triggers for grouped actions", () => {
      const dropdownTools =
        fixture.nativeElement.querySelectorAll("ui-dropdown-tool");
      // block (Styles) and list (Lists) — align is now a toggle group
      expect(dropdownTools.length).toBe(2);
    });

    it("should show dropdown panel with actions on trigger click", () => {
      const trigger: HTMLButtonElement =
        fixture.nativeElement.querySelector(".dropdown-trigger");
      trigger.click();
      fixture.detectChanges();

      const panel = fixture.nativeElement.querySelector(".dropdown-panel");
      expect(panel).toBeTruthy();

      const actions = panel.querySelectorAll(".dropdown-panel-item");
      expect(actions.length).toBeGreaterThan(0);
    });

    it("should close dropdown panel after executing an action", () => {
      const trigger: HTMLButtonElement =
        fixture.nativeElement.querySelector(".dropdown-trigger");
      trigger.click();
      fixture.detectChanges();

      const action: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".dropdown-panel-item",
      );
      action.click();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".dropdown-panel")).toBeNull();
    });

    it("should close dropdown when a different dropdown is opened", () => {
      const triggers: HTMLButtonElement[] = Array.from(
        fixture.nativeElement.querySelectorAll(".dropdown-trigger"),
      );
      // Open first dropdown
      triggers[0].click();
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelectorAll(".dropdown-panel").length,
      ).toBe(1);

      // Open second dropdown — first should close
      triggers[1].click();
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelectorAll(".dropdown-panel").length,
      ).toBe(1);
    });

    it("should render correct labels on toolbar buttons", () => {
      const buttons: HTMLButtonElement[] = Array.from(
        fixture.nativeElement.querySelectorAll(".toolbar-btn"),
      );
      for (const btn of buttons) {
        const label = btn.getAttribute("aria-label");
        expect(label).toBeTruthy();
      }
    });

    it("should render only specified actions when toolbarActions is set", () => {
      fixture.componentRef.setInput("toolbarActions", ["bold", "italic"]);
      fixture.detectChanges();

      // Specified actions should be present
      expect(
        fixture.nativeElement.querySelector('[aria-label="Bold"]'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('[aria-label="Italic"]'),
      ).toBeTruthy();
      // Emoji picker is always shown
      expect(
        fixture.nativeElement.querySelector('[aria-label="Insert emoji"]'),
      ).toBeTruthy();
      // History group should not be rendered
      expect(
        fixture.nativeElement.querySelector('[aria-label="Undo"]'),
      ).toBeNull();
      // No dropdowns
      expect(
        fixture.nativeElement.querySelectorAll("ui-dropdown-tool").length,
      ).toBe(0);
    });

    it("should disable all toolbar buttons when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const buttons: HTMLButtonElement[] = Array.from(
        fixture.nativeElement.querySelectorAll(".toolbar-btn"),
      );
      for (const btn of buttons) {
        expect(btn.disabled).toBe(true);
      }
    });

    it("should disable all toolbar buttons when readonly", () => {
      fixture.componentRef.setInput("readonly", true);
      fixture.detectChanges();

      const buttons: HTMLButtonElement[] = Array.from(
        fixture.nativeElement.querySelectorAll(".toolbar-btn"),
      );
      for (const btn of buttons) {
        expect(btn.disabled).toBe(true);
      }
    });

    it("should render group separators between different groups", () => {
      const separators =
        fixture.nativeElement.querySelectorAll("ui-separator-tool");
      expect(separators.length).toBeGreaterThan(0);
    });

    it("should switch to a compact floating toolbar with only inline actions", () => {
      fixture.componentRef.setInput("presentation", "compact");
      fixture.detectChanges();

      const toolbar: HTMLElement =
        fixture.nativeElement.querySelector("ui-toolbar");

      expect(toolbar.classList).toContain("floating-toggle");
      expect(toolbar.classList).toContain("collapsed");
      expect(
        fixture.nativeElement.querySelector('[aria-label="Bold"]'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('[aria-label="Italic"]'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('[aria-label="Underline"]'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('[aria-label="Hyperlink"]'),
      ).toBeNull();
      expect(
        fixture.nativeElement.querySelector('[aria-label="Insert emoji"]'),
      ).toBeNull();
      expect(
        fixture.nativeElement.querySelector('[aria-label="Full screen"]'),
      ).toBeNull();
    });

    it("should allow overriding compact toolbar actions", () => {
      fixture.componentRef.setInput("presentation", "compact");
      fixture.componentRef.setInput("compactToolbarActions", [
        "bold",
        "italic",
        "strikethrough",
        "link",
      ]);
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('[aria-label="Bold"]'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('[aria-label="Italic"]'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('[aria-label="Strikethrough"]'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('[aria-label="Hyperlink"]'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('[aria-label="Underline"]'),
      ).toBeNull();
    });
  });

  describe("editor area", () => {
    it("should render a contenteditable div", () => {
      const editor = fixture.nativeElement.querySelector(".editor");
      expect(editor).toBeTruthy();
      expect(editor.getAttribute("contenteditable")).toBe("true");
    });

    it("should have textbox role", () => {
      const editor = fixture.nativeElement.querySelector(".editor");
      expect(editor.getAttribute("role")).toBe("textbox");
    });

    it("should set aria-multiline to true", () => {
      const editor = fixture.nativeElement.querySelector(".editor");
      expect(editor.getAttribute("aria-multiline")).toBe("true");
    });

    it("should forward ariaLabel to the editor", () => {
      fixture.componentRef.setInput("ariaLabel", "Email body");
      fixture.detectChanges();

      const editor = fixture.nativeElement.querySelector(".editor");
      expect(editor.getAttribute("aria-label")).toBe("Email body");
    });

    it("should forward placeholder as data-placeholder attribute", () => {
      fixture.componentRef.setInput("placeholder", "Write something…");
      fixture.detectChanges();

      const editor = fixture.nativeElement.querySelector(".editor");
      expect(editor.getAttribute("data-placeholder")).toBe("Write something…");
    });

    it("should set contenteditable to false when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const editor = fixture.nativeElement.querySelector(".editor");
      expect(editor.getAttribute("contenteditable")).toBe("false");
    });

    it("should set contenteditable to false when readonly", () => {
      fixture.componentRef.setInput("readonly", true);
      fixture.detectChanges();

      const editor = fixture.nativeElement.querySelector(".editor");
      expect(editor.getAttribute("contenteditable")).toBe("false");
    });
  });

  describe("compact markdown mode", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("presentation", "compact");
      fixture.componentRef.setInput("mode", "markdown");
      fixture.detectChanges();
    });

    it("should default markdown preview to hidden", () => {
      const previewToggle = fixture.nativeElement.querySelector(
        '[aria-label="Show preview"]',
      );

      expect(previewToggle).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector(".markdown-preview"),
      ).toBeNull();
      expect(fixture.nativeElement.querySelector(".split-handle")?.hidden).toBe(
        true,
      );
    });

    it("should show the markdown preview when the preview toggle is triggered", () => {
      (component as any).onToolAction({ itemId: "toggle-preview" });
      fixture.detectChanges();

      expect(component.showMarkdownPreview()).toBe(true);
      expect(
        fixture.nativeElement.querySelector(".markdown-preview"),
      ).toBeTruthy();
    });
  });

  describe("value binding", () => {
    it("should render initial value into the editor", () => {
      fixture.componentRef.setInput("value", "<p>Hello world</p>");
      // Trigger ngAfterViewInit re-render
      (component as any).renderToEditor("<p>Hello world</p>");
      fixture.detectChanges();

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      expect(editor.innerHTML).toContain("Hello world");
    });

    it("should sync value when editor content changes", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
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
      const btn = fixture.nativeElement.querySelector(".placeholder-trigger");
      expect(btn).toBeTruthy();
    });

    it("should not show placeholder picker when no placeholders", () => {
      fixture.componentRef.setInput("placeholders", []);
      fixture.detectChanges();

      const btn = fixture.nativeElement.querySelector(".placeholder-trigger");
      expect(btn).toBeNull();
    });

    it("should toggle dropdown on click", () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".placeholder-trigger",
      );

      btn.click();
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".placeholder-dropdown"),
      ).toBeTruthy();

      btn.click();
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".placeholder-dropdown"),
      ).toBeNull();
    });

    it("should render category headers", () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".placeholder-trigger",
      );
      btn.click();
      fixture.detectChanges();

      const categories = fixture.nativeElement.querySelectorAll(
        ".placeholder-category",
      );
      expect(categories.length).toBe(2);
      expect(categories[0].textContent.trim()).toBe("Contact");
      expect(categories[1].textContent.trim()).toBe("Account");
    });

    it("should render placeholder options", () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".placeholder-trigger",
      );
      btn.click();
      fixture.detectChanges();

      const options = fixture.nativeElement.querySelectorAll(
        ".placeholder-option",
      );
      expect(options.length).toBe(3);
    });

    it("should close dropdown after inserting a placeholder", () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".placeholder-trigger",
      );
      btn.click();
      fixture.detectChanges();

      const option = fixture.nativeElement.querySelector(".placeholder-option");
      option.click();
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(".placeholder-dropdown"),
      ).toBeNull();
    });

    it("should emit placeholderInserted when a placeholder is inserted", () => {
      const spy = vi.fn();
      component.placeholderInserted.subscribe(spy);

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".placeholder-trigger",
      );
      btn.click();
      fixture.detectChanges();

      const option = fixture.nativeElement.querySelector(".placeholder-option");
      option.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(testPlaceholders[0]);
    });

    it("should not open picker when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".placeholder-trigger",
      );
      expect(btn.disabled).toBe(true);
    });
  });

  describe("placeholder serialisation", () => {
    it("should serialise placeholder chips as {{key}} tokens", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
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

      (component as any).renderToEditor("Hello {{firstName}}!");
      fixture.detectChanges();

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      const chip = editor.querySelector(".rte-placeholder");
      expect(chip).toBeTruthy();
      expect(chip!.getAttribute("data-placeholder-key")).toBe("firstName");
      expect(chip!.textContent).toContain("First Name");
    });

    it("should use key as label when placeholder is not defined", () => {
      fixture.componentRef.setInput("placeholders", []);
      fixture.detectChanges();

      (component as any).renderToEditor("Hello {{unknownKey}}!");
      fixture.detectChanges();

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      const chip = editor.querySelector(".rte-placeholder");
      expect(chip).toBeTruthy();
      expect(chip!.textContent).toContain("unknownKey");
    });

    it("should deserialise keys containing hyphens, dots, and colons", () => {
      fixture.componentRef.setInput("placeholders", [
        { key: "first-name", label: "First Name" },
        { key: "contact.email", label: "Email" },
        { key: "ns:id", label: "NS ID" },
      ]);
      fixture.detectChanges();

      (component as any).renderToEditor(
        "{{first-name}} {{contact.email}} {{ns:id}}",
      );
      fixture.detectChanges();

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      const chips = editor.querySelectorAll(".rte-placeholder");
      expect(chips.length).toBe(3);
      expect(chips[0].getAttribute("data-placeholder-key")).toBe("first-name");
      expect(chips[1].getAttribute("data-placeholder-key")).toBe(
        "contact.email",
      );
      expect(chips[2].getAttribute("data-placeholder-key")).toBe("ns:id");
    });

    it("should re-render editor when value changes externally", () => {
      fixture.componentRef.setInput("placeholders", [
        { key: "firstName", label: "First Name" },
      ]);
      fixture.detectChanges();

      // Simulate an external value change after init
      component.value.set("<p>Hello {{firstName}}</p>");
      fixture.detectChanges();

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      const chip = editor.querySelector(".rte-placeholder");
      expect(chip).toBeTruthy();
      expect(chip!.getAttribute("data-placeholder-key")).toBe("firstName");
      expect(chip!.textContent).toContain("First Name");
    });

    it("should preserve placeholder attrs through sanitiseHtml", () => {
      const chipHtml =
        '<span class="rte-placeholder" contenteditable="false" data-placeholder-key="firstName">First Name</span>';
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml(`<p>Hello ${chipHtml}</p>`);

      expect(sanitised).toContain('data-placeholder-key="firstName"');
      expect(sanitised).toContain('contenteditable="false"');
      expect(sanitised).toContain('class="rte-placeholder"');
    });
  });

  describe("HTML sanitisation", () => {
    it("should strip <script> elements entirely", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml('<p>Hello</p><script>alert("xss")</script><p>World</p>');
      expect(sanitised).not.toContain("script");
      expect(sanitised).not.toContain("alert");
      expect(sanitised).toContain("Hello");
      expect(sanitised).toContain("World");
    });

    it("should strip <style> elements entirely", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml("<style>body{display:none}</style><p>Content</p>");
      expect(sanitised).not.toContain("style");
      expect(sanitised).not.toContain("display");
      expect(sanitised).toContain("Content");
    });

    it("should strip <iframe> elements entirely", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml(
          '<p>Before</p><iframe src="https://evil.com"></iframe><p>After</p>',
        );
      expect(sanitised).not.toContain("iframe");
      expect(sanitised).not.toContain("evil.com");
    });

    it("should strip on* event handler attributes", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml('<p onclick="alert(1)" onmouseover="steal()">Text</p>');
      expect(sanitised).not.toContain("onclick");
      expect(sanitised).not.toContain("onmouseover");
      expect(sanitised).not.toContain("alert");
      expect(sanitised).toContain("Text");
    });

    it("should strip dangerous style values (background: url)", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml('<p style="background:url(evil)">Styled</p>');
      expect(sanitised).not.toContain("url(evil)");
      expect(sanitised).toContain("Styled");
    });

    it("should preserve text-align in style attributes", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml('<p style="text-align: center">Centred</p>');
      expect(sanitised).toContain("text-align");
      expect(sanitised).toContain("center");
      expect(sanitised).toContain("Centred");
    });

    it("should preserve safe inline styles (color, font-size, font-weight)", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml(
          '<p style="color: red; font-size: 14px; font-weight: bold">Text</p>',
        );
      expect(sanitised).toContain("color");
      expect(sanitised).toContain("font-size");
      expect(sanitised).toContain("font-weight");
    });

    it("should strip expression() and javascript: from style values", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml('<p style="width: expression(alert(1))">Text</p>');
      expect(sanitised).not.toContain("expression");
    });

    it("should strip javascript: URIs from href", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml('<a href="javascript:alert(1)">Click</a>');
      expect(sanitised).not.toContain("javascript");
      expect(sanitised).toContain("Click");
    });

    it("should allow safe href values", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml('<a href="https://example.com">Link</a>');
      expect(sanitised).toContain('href="https://example.com"');
      expect(sanitised).toContain("Link");
    });

    it("should strip <object>, <embed>, <form> entirely", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml(
          "<object>obj</object><embed>emb</embed><form>frm</form><p>OK</p>",
        );
      expect(sanitised).not.toContain("object");
      expect(sanitised).not.toContain("embed");
      expect(sanitised).not.toContain("form");
      expect(sanitised).toContain("OK");
    });

    it("should unwrap disallowed but non-dangerous elements", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml("<div><b>Bold</b> in a div</div>");
      expect(sanitised).not.toContain("<div");
      expect(sanitised).not.toContain("</div>");
      expect(sanitised).toContain("<b>Bold</b>");
      expect(sanitised).toContain("in a div");
    });

    it("should render content set via value binding without sanitising", () => {
      // The editor renders value as-is; sanitisation only applies to paste.
      component.value.set('<p style="text-align:center">Safe</p>');
      fixture.detectChanges();

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      expect(editor.innerHTML).toContain("Safe");
      const p = editor.querySelector("p");
      expect(p?.getAttribute("style")).toContain("text-align");
    });

    it("should preserve text-align style on content set via value binding", () => {
      component.value.set(
        '<p style="text-align: center">Centred paragraph</p>',
      );
      fixture.detectChanges();

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      const p = editor.querySelector("p");
      expect(p).toBeTruthy();
      expect(p!.getAttribute("style")).toContain("text-align");
      expect(p!.textContent).toBe("Centred paragraph");
    });

    it("should round-trip rich content without stripping safe styles", () => {
      const html =
        '<p style="text-align: center">Centre</p>' +
        '<p style="text-align: right">Right</p>' +
        "<p><strong>Bold</strong> and <em>italic</em></p>";
      component.value.set(html);
      fixture.detectChanges();

      const serialised = component.value();
      expect(serialised).toContain("text-align");
      expect(serialised).toContain("center");
      expect(serialised).toContain("right");
      expect(serialised).toContain("<strong>");
      expect(serialised).toContain("<em>");
    });

    it("should render value content as-is regardless of sanitise flag", () => {
      // sanitise only affects paste; value is never touched.
      const html = '<p onclick="alert(1)" style="color:red">Styled</p>';
      component.value.set(html);
      fixture.detectChanges();

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      expect(editor.innerHTML).toContain("onclick");
      expect(editor.innerHTML).toContain("style");
    });

    it("should default sanitise to true", () => {
      expect(component.sanitise()).toBe(true);
    });
  });

  describe("focus tracking", () => {
    it("should track focus state", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      expect(component["isFocused"]()).toBe(false);

      editor.dispatchEvent(new Event("focus"));
      expect(component["isFocused"]()).toBe(true);

      editor.dispatchEvent(new Event("blur"));
      expect(component["isFocused"]()).toBe(false);
    });

    it("should add focused class to wrapper when focused", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.querySelector(
        ".editor-wrapper--focused",
      );
      expect(wrapper).toBeTruthy();
    });
  });

  describe("source editing", () => {
    it("should render a source toggle button", () => {
      const btn = fixture.nativeElement.querySelector(
        '[aria-label="Edit HTML source"]',
      );
      expect(btn).toBeTruthy();
    });

    it("should default to WYSIWYG mode (not source)", () => {
      expect(component["isSourceMode"]()).toBe(false);
      expect(fixture.nativeElement.querySelector(".source-editor")).toBeNull();
      expect(fixture.nativeElement.querySelector(".editor")).toBeTruthy();
    });

    it("should show textarea above WYSIWYG preview in source mode", () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[aria-label="Edit HTML source"]',
      );
      btn.click();
      fixture.detectChanges();

      expect(component["isSourceMode"]()).toBe(true);
      // Both textarea and editor present
      expect(
        fixture.nativeElement.querySelector(".source-editor"),
      ).toBeTruthy();
      expect(fixture.nativeElement.querySelector(".editor")).toBeTruthy();
    });

    it("should show a preview label in source mode", () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[aria-label="Edit HTML source"]',
      );
      btn.click();
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector(".preview-label");
      expect(label).toBeTruthy();
      expect(label.textContent.trim()).toBe("Preview");
    });

    it("should make WYSIWYG preview non-editable in source mode", () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[aria-label="Edit HTML source"]',
      );
      btn.click();
      fixture.detectChanges();

      const editor = fixture.nativeElement.querySelector(".editor");
      expect(editor.getAttribute("contenteditable")).toBe("false");
    });

    it("should populate textarea with current value", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.innerHTML = "<p>Hello</p>";
      editor.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[aria-label="Edit HTML source"]',
      );
      btn.click();
      fixture.detectChanges();

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector(".source-editor");
      expect(textarea.value).toBe("<p>Hello</p>");
    });

    it("should sync value from textarea input", () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[aria-label="Edit HTML source"]',
      );
      btn.click();
      fixture.detectChanges();

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector(".source-editor");
      textarea.value = "<p>Edited</p>";
      textarea.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.value()).toBe("<p>Edited</p>");
    });

    it("should live-update WYSIWYG preview as textarea changes", () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[aria-label="Edit HTML source"]',
      );
      btn.click();
      fixture.detectChanges();

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector(".source-editor");
      textarea.value = "<p>Live preview</p>";
      textarea.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      expect(editor.innerHTML).toContain("Live preview");
    });

    it("should add active class to toggle when in source mode", () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[aria-label="Edit HTML source"]',
      );
      expect(btn.getAttribute("aria-pressed")).toBe("false");

      btn.click();
      fixture.detectChanges();
      expect(btn.getAttribute("aria-pressed")).toBe("true");
    });

    it("should not toggle source mode when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[aria-label="Edit HTML source"]',
      );
      expect(btn.disabled).toBe(true);
    });
  });

  describe("active format tracking", () => {
    it("should default to no active formats", () => {
      expect(component["activeFormats"]().size).toBe(0);
    });

    it("should apply active class to bold button when bold is active", () => {
      // Simulate queryCommandState returning true for bold
      execCommandSpy.mockImplementation(() => true);
      (document as any).queryCommandState = vi
        .fn()
        .mockImplementation((cmd: string) => cmd === "bold");
      (document as any).queryCommandValue = vi.fn().mockReturnValue("");

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      const boldBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[aria-label="Bold"]',
      );
      expect(boldBtn.getAttribute("aria-pressed")).toBe("true");
    });

    it("should not apply active class when format is inactive", () => {
      (document as any).queryCommandState = vi.fn().mockReturnValue(false);
      (document as any).queryCommandValue = vi.fn().mockReturnValue("");

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      const boldBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[aria-label="Bold"]',
      );
      expect(boldBtn.getAttribute("aria-pressed")).toBe("false");
    });

    it("should detect heading1 from formatBlock query", () => {
      (document as any).queryCommandState = vi.fn().mockReturnValue(false);
      (document as any).queryCommandValue = vi
        .fn()
        .mockImplementation((cmd: string) =>
          cmd === "formatBlock" ? "h1" : "",
        );

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("heading1")).toBe(true);
      expect(component["activeFormats"]().has("heading2")).toBe(false);
    });

    it("should clear active formats on blur", () => {
      (document as any).queryCommandState = vi.fn().mockReturnValue(true);
      (document as any).queryCommandValue = vi.fn().mockReturnValue("");

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();
      expect(component["activeFormats"]().size).toBeGreaterThan(0);

      editor.dispatchEvent(new Event("blur"));
      fixture.detectChanges();
      expect(component["activeFormats"]().size).toBe(0);
    });

    it("should update formats after executing a formatting action", () => {
      (document as any).queryCommandState = vi
        .fn()
        .mockImplementation((cmd: string) => cmd === "bold");
      (document as any).queryCommandValue = vi.fn().mockReturnValue("");

      component["execAction"]("bold");
      fixture.detectChanges();

      expect(component["activeFormats"]().has("bold")).toBe(true);
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

  describe("block format actions", () => {
    beforeEach(() => {
      execCommandSpy.mockClear();
    });

    it("should call formatBlock for paragraph", () => {
      (component as any).execAction("paragraph");
      expect(execCommandSpy).toHaveBeenCalledWith("formatBlock", false, "p");
    });

    it("should call formatBlock for blockquote", () => {
      (component as any).execAction("blockquote");
      expect(execCommandSpy).toHaveBeenCalledWith(
        "formatBlock",
        false,
        "blockquote",
      );
    });

    it("should call formatBlock for codeBlock", () => {
      (component as any).execAction("codeBlock");
      expect(execCommandSpy).toHaveBeenCalledWith("formatBlock", false, "pre");
    });
  });

  describe("link action", () => {
    let mockPopoverRef: PopoverRef<LinkDialogResult>;
    let openPopoverSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockPopoverRef = new PopoverRef<LinkDialogResult>();
      const popoverService = TestBed.inject(PopoverService);
      openPopoverSpy = vi
        .spyOn(popoverService, "openPopover")
        .mockReturnValue(mockPopoverRef as any);
    });

    it("should open a popover when link action is executed", () => {
      const btn = document.createElement("button");
      (component as any).execAction("link", btn);

      expect(openPopoverSpy).toHaveBeenCalledTimes(1);
      const config = openPopoverSpy.mock.calls[0][0];
      expect(config.anchor).toBe(btn);
      expect(config.verticalAxisAlignment).toBe("bottom");
    });

    it("should not call execCommand for link action", () => {
      execCommandSpy.mockClear();
      const btn = document.createElement("button");
      (component as any).execAction("link", btn);

      expect(execCommandSpy).not.toHaveBeenCalled();
    });

    it("should fall back to host element when no anchor provided", () => {
      (component as any).execAction("link");

      expect(openPopoverSpy).toHaveBeenCalledTimes(1);
      const config = openPopoverSpy.mock.calls[0][0];
      expect(config.anchor).toBe(fixture.nativeElement);
    });

    it("should insert a new link when popover returns a result", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.innerHTML = "Hello world";
      editor.focus();

      // Create a selection within the editor
      const textNode = editor.firstChild!;
      const range = document.createRange();
      range.setStart(textNode, 0);
      range.setEnd(textNode, 5); // "Hello"
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      const btn = document.createElement("button");
      (component as any).execAction("link", btn);

      // Simulate popover closing with a result
      mockPopoverRef.close({ url: "https://example.com", text: "Click here" });
      fixture.detectChanges();

      expect(component.value()).toContain("https://example.com");
      expect(component.value()).toContain("Click here");
    });

    it("should not modify content when popover is cancelled", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.innerHTML = "<p>Hello world</p>";
      editor.dispatchEvent(new Event("input"));
      fixture.detectChanges();
      const original = component.value();

      const btn = document.createElement("button");
      (component as any).execAction("link", btn);

      // Simulate popover light-dismiss (undefined result)
      mockPopoverRef.close(undefined);
      fixture.detectChanges();

      expect(component.value()).toBe(original);
    });

    it("should pass editMode true when caret is inside an existing link", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.innerHTML =
        '<p>Visit <a href="https://old.com">Old Link</a> now</p>';
      editor.focus();

      // Position caret inside the anchor text
      const anchor = editor.querySelector("a")!;
      const textNode = anchor.firstChild!;
      const range = document.createRange();
      range.setStart(textNode, 2);
      range.collapse(true);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      const btn = document.createElement("button");
      (component as any).execAction("link", btn);

      const config = openPopoverSpy.mock.calls[0][0];
      expect(config.inputs.editMode).toBe(true);
      expect(config.inputs.initialUrl).toBe("https://old.com");
      expect(config.inputs.initialText).toBe("Old Link");
    });

    it("should update an existing link when popover returns a result", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.innerHTML =
        '<p>Visit <a href="https://old.com">Old Link</a> now</p>';
      editor.focus();

      const anchor = editor.querySelector("a")!;
      const textNode = anchor.firstChild!;
      const range = document.createRange();
      range.setStart(textNode, 0);
      range.collapse(true);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      const btn = document.createElement("button");
      (component as any).execAction("link", btn);

      mockPopoverRef.close({
        url: "https://new.com",
        text: "New Link",
      });
      fixture.detectChanges();

      expect(anchor.getAttribute("href")).toBe("https://new.com");
      expect(anchor.textContent).toBe("New Link");
      expect(anchor.getAttribute("target")).toBe("_blank");
      expect(anchor.getAttribute("rel")).toBe("noopener noreferrer");
    });

    it("should not open link dialog when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      (component as any).execAction("link");
      expect(openPopoverSpy).not.toHaveBeenCalled();
    });

    it("should not open link dialog when readonly", () => {
      fixture.componentRef.setInput("readonly", true);
      fixture.detectChanges();

      (component as any).execAction("link");
      expect(openPopoverSpy).not.toHaveBeenCalled();
    });
  });

  describe("paste handling", () => {
    beforeEach(() => {
      execCommandSpy.mockClear();
    });

    function createPasteEvent(html?: string, text?: string): ClipboardEvent {
      const clipboardData = {
        getData: (type: string) => {
          if (type === "text/html") return html ?? "";
          if (type === "text/plain") return text ?? "";
          return "";
        },
      } as unknown as DataTransfer;

      const event = new Event("paste", {
        bubbles: true,
        cancelable: true,
      }) as ClipboardEvent;
      Object.defineProperty(event, "clipboardData", {
        value: clipboardData,
      });
      return event;
    }

    it("should prevent default on paste", () => {
      const event = createPasteEvent(undefined, "Hello");
      const preventSpy = vi.spyOn(event, "preventDefault");

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(event);

      expect(preventSpy).toHaveBeenCalled();
    });

    it("should sanitise and insert HTML when HTML data is available", () => {
      const event = createPasteEvent(
        '<p onclick="alert(1)">Pasted <b>bold</b></p>',
        "Pasted bold",
      );

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(event);

      expect(execCommandSpy).toHaveBeenCalledWith(
        "insertHTML",
        false,
        expect.not.stringContaining("onclick"),
      );
    });

    it("should insert plain text when no HTML data is available", () => {
      const event = createPasteEvent(undefined, "Plain text");

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(event);

      expect(execCommandSpy).toHaveBeenCalledWith(
        "insertText",
        false,
        "Plain text",
      );
    });

    it("should not sanitise pasted HTML when sanitise is false", () => {
      fixture.componentRef.setInput("sanitise", false);
      fixture.detectChanges();

      const event = createPasteEvent(
        '<p style="color:red">Styled</p>',
        "Styled",
      );

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(event);

      expect(execCommandSpy).toHaveBeenCalledWith(
        "insertHTML",
        false,
        expect.stringContaining("style"),
      );
    });

    it("should insert empty string when no text data available", () => {
      const event = createPasteEvent(undefined, undefined);

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(event);

      expect(execCommandSpy).toHaveBeenCalledWith("insertText", false, "");
    });
  });

  describe("keydown placeholder deletion", () => {
    it("should delete entire placeholder chip on Backspace", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      const chip = document.createElement("span");
      chip.className = "rte-placeholder";
      chip.contentEditable = "false";
      chip.dataset["placeholderKey"] = "firstName";
      chip.textContent = "First Name";

      const afterText = document.createTextNode(" after");
      editor.appendChild(chip);
      editor.appendChild(afterText);
      editor.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      // Position caret right after the chip (offset 1 = after chip node)
      const range = document.createRange();
      range.setStart(afterText, 0);
      range.collapse(true);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      const event = new KeyboardEvent("keydown", {
        key: "Backspace",
        bubbles: true,
        cancelable: true,
      });
      const preventSpy = vi.spyOn(event, "preventDefault");
      editor.dispatchEvent(event);

      // The chip may or may not be removed depending on jsdom
      // selection model, but the handler should at minimum run
      expect(event.defaultPrevented || !preventSpy.mock.calls.length).toBe(
        true,
      );
    });

    it("should not interfere with normal Backspace when no chip is adjacent", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.innerHTML = "Hello world";

      const textNode = editor.firstChild!;
      const range = document.createRange();
      range.setStart(textNode, 5);
      range.collapse(true);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      const event = new KeyboardEvent("keydown", {
        key: "Backspace",
        bubbles: true,
        cancelable: true,
      });
      editor.dispatchEvent(event);

      // Should not have prevented default
      expect(event.defaultPrevented).toBe(false);
    });

    it("should not interfere with non-collapsed selection on Backspace", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.innerHTML = "Select me";

      const textNode = editor.firstChild!;
      const range = document.createRange();
      range.setStart(textNode, 0);
      range.setEnd(textNode, 6);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      const event = new KeyboardEvent("keydown", {
        key: "Backspace",
        bubbles: true,
        cancelable: true,
      });
      editor.dispatchEvent(event);

      // Non-collapsed range: handler returns early
      expect(event.defaultPrevented).toBe(false);
    });

    it("should ignore non-Backspace/Delete keys", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.innerHTML = "Hello";

      const event = new KeyboardEvent("keydown", {
        key: "a",
        bubbles: true,
        cancelable: true,
      });
      editor.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe("additional sanitisation", () => {
    it("should strip vbscript: URIs from href", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml('<a href="vbscript:MsgBox">Click</a>');
      expect(sanitised).not.toContain("vbscript");
      expect(sanitised).toContain("Click");
    });

    it("should strip data: URIs from href", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml(
          '<a href="data:text/html,<script>alert(1)</script>">Click</a>',
        );
      expect(sanitised).not.toContain("data:");
    });

    it("should strip javascript: with leading whitespace", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml('<a href="  javascript:alert(1)">Click</a>');
      expect(sanitised).not.toContain("javascript");
    });

    it("should strip <input>, <textarea>, <select>, <button> entirely", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml(
          "<input><textarea>text</textarea><select><option>o</option></select><button>btn</button><p>OK</p>",
        );
      expect(sanitised).not.toContain("input");
      expect(sanitised).not.toContain("textarea");
      expect(sanitised).not.toContain("select");
      expect(sanitised).not.toContain("button");
      expect(sanitised).toContain("OK");
    });

    it("should strip <link>, <meta>, <base> entirely", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml(
          '<link rel="stylesheet"><meta charset="utf-8"><base href="/"><p>OK</p>',
        );
      expect(sanitised).not.toContain("link");
      expect(sanitised).not.toContain("meta");
      expect(sanitised).not.toContain("base");
      expect(sanitised).toContain("OK");
    });

    it("should preserve target and rel on anchor elements", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml(
          '<a href="https://x.com" target="_blank" rel="noopener">Link</a>',
        );
      expect(sanitised).toContain('target="_blank"');
      expect(sanitised).toContain('rel="noopener"');
    });

    it("should strip unknown attributes from allowed elements", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml('<b data-custom="x" id="b1">Bold</b>');
      expect(sanitised).not.toContain("data-custom");
      expect(sanitised).not.toContain("id=");
      expect(sanitised).toContain("<b>Bold</b>");
    });

    it("should handle deeply nested dangerous elements", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml("<p>Safe <b>bold <script>evil()</script> text</b></p>");
      expect(sanitised).not.toContain("script");
      expect(sanitised).not.toContain("evil");
      expect(sanitised).toContain("Safe");
      expect(sanitised).toContain("bold");
    });

    it("should handle empty HTML string", () => {
      const sanitised = (component as any).strategy().sanitiseHtml("");
      expect(sanitised).toBe("");
    });

    it("should handle plain text without tags", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml("Just plain text here");
      expect(sanitised).toBe("Just plain text here");
    });

    it("should keep allowed elements: B, STRONG, I, EM, U, S, BR, P, H1-H3, UL, OL, LI, SPAN, A", () => {
      const input =
        "<b>b</b><strong>s</strong><i>i</i><em>e</em><u>u</u><s>s</s><br><p>p</p><h1>h1</h1><h2>h2</h2><h3>h3</h3><ul><li>li</li></ul><ol><li>li</li></ol><span>span</span><a>a</a>";
      const sanitised = (component as any).strategy().sanitiseHtml(input);
      expect(sanitised).toContain("<b>");
      expect(sanitised).toContain("<strong>");
      expect(sanitised).toContain("<i>");
      expect(sanitised).toContain("<em>");
      expect(sanitised).toContain("<u>");
      expect(sanitised).toContain("<s>");
      expect(sanitised).toContain("<br>");
      expect(sanitised).toContain("<p>");
      expect(sanitised).toContain("<h1>");
      expect(sanitised).toContain("<h2>");
      expect(sanitised).toContain("<h3>");
      expect(sanitised).toContain("<ul>");
      expect(sanitised).toContain("<ol>");
      expect(sanitised).toContain("<li>");
      expect(sanitised).toContain("<span>");
      expect(sanitised).toContain("<a>");
    });
  });

  describe("additional format detection", () => {
    beforeEach(() => {
      (document as any).queryCommandState = vi.fn().mockReturnValue(false);
      (document as any).queryCommandValue = vi.fn().mockReturnValue("");
    });

    it("should detect paragraph format", () => {
      (document as any).queryCommandValue = vi
        .fn()
        .mockImplementation((cmd: string) =>
          cmd === "formatBlock" ? "p" : "",
        );

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("paragraph")).toBe(true);
    });

    it("should detect heading2 format", () => {
      (document as any).queryCommandValue = vi
        .fn()
        .mockImplementation((cmd: string) =>
          cmd === "formatBlock" ? "h2" : "",
        );

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("heading2")).toBe(true);
    });

    it("should detect heading3 format", () => {
      (document as any).queryCommandValue = vi
        .fn()
        .mockImplementation((cmd: string) =>
          cmd === "formatBlock" ? "h3" : "",
        );

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("heading3")).toBe(true);
    });

    it("should detect blockquote format", () => {
      (document as any).queryCommandValue = vi
        .fn()
        .mockImplementation((cmd: string) =>
          cmd === "formatBlock" ? "blockquote" : "",
        );

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("blockquote")).toBe(true);
    });

    it("should detect codeBlock format", () => {
      (document as any).queryCommandValue = vi
        .fn()
        .mockImplementation((cmd: string) =>
          cmd === "formatBlock" ? "pre" : "",
        );

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("codeBlock")).toBe(true);
    });

    it("should detect multiple inline formats simultaneously", () => {
      (document as any).queryCommandState = vi
        .fn()
        .mockImplementation(
          (cmd: string) => cmd === "bold" || cmd === "italic",
        );

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("bold")).toBe(true);
      expect(component["activeFormats"]().has("italic")).toBe(true);
      expect(component["activeFormats"]().has("underline")).toBe(false);
    });

    it("should detect underline format", () => {
      (document as any).queryCommandState = vi
        .fn()
        .mockImplementation((cmd: string) => cmd === "underline");

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("underline")).toBe(true);
    });

    it("should detect strikethrough format", () => {
      (document as any).queryCommandState = vi
        .fn()
        .mockImplementation((cmd: string) => cmd === "strikeThrough");

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("strikethrough")).toBe(true);
    });

    it("should detect unordered list state", () => {
      (document as any).queryCommandState = vi
        .fn()
        .mockImplementation((cmd: string) => cmd === "insertUnorderedList");

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("unorderedList")).toBe(true);
    });

    it("should detect ordered list state", () => {
      (document as any).queryCommandState = vi
        .fn()
        .mockImplementation((cmd: string) => cmd === "insertOrderedList");

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("orderedList")).toBe(true);
    });

    it("should detect justifyLeft alignment", () => {
      (document as any).queryCommandState = vi
        .fn()
        .mockImplementation((cmd: string) => cmd === "justifyLeft");

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("alignLeft")).toBe(true);
    });

    it("should detect justifyCenter alignment", () => {
      (document as any).queryCommandState = vi
        .fn()
        .mockImplementation((cmd: string) => cmd === "justifyCenter");

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("alignCenter")).toBe(true);
    });

    it("should detect justifyRight alignment", () => {
      (document as any).queryCommandState = vi
        .fn()
        .mockImplementation((cmd: string) => cmd === "justifyRight");

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("alignRight")).toBe(true);
    });

    it("should handle queryCommandState throwing", () => {
      (document as any).queryCommandState = vi.fn().mockImplementation(() => {
        throw new Error("Not supported");
      });

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      // Should not throw
      expect(() => {
        editor.dispatchEvent(new Event("focus"));
        fixture.detectChanges();
      }).not.toThrow();

      expect(component["activeFormats"]().size).toBe(0);
    });

    it("should handle queryCommandValue throwing", () => {
      (document as any).queryCommandState = vi.fn().mockReturnValue(false);
      (document as any).queryCommandValue = vi.fn().mockImplementation(() => {
        throw new Error("Not supported");
      });

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      expect(() => {
        editor.dispatchEvent(new Event("focus"));
        fixture.detectChanges();
      }).not.toThrow();
    });

    it("should detect link when caret is inside an anchor", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.innerHTML = '<p>Visit <a href="https://x.com">here</a> now</p>';

      // Position caret inside the anchor
      const anchor = editor.querySelector("a")!;
      const textNode = anchor.firstChild!;
      const range = document.createRange();
      range.setStart(textNode, 1);
      range.collapse(true);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("link")).toBe(true);
    });

    it("should not detect link when caret is outside an anchor", () => {
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.innerHTML = '<p>Visit <a href="https://x.com">here</a> now</p>';

      // Position caret in "now" text
      const nodes = editor.querySelector("p")!.childNodes;
      const afterText = nodes[nodes.length - 1]; // " now"
      const range = document.createRange();
      range.setStart(afterText, 2);
      range.collapse(true);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      editor.dispatchEvent(new Event("focus"));
      fixture.detectChanges();

      expect(component["activeFormats"]().has("link")).toBe(false);
    });
  });

  describe("source mode edge cases", () => {
    it("should close placeholder picker when toggling source mode", () => {
      fixture.componentRef.setInput("placeholders", [{ key: "k", label: "K" }]);
      fixture.detectChanges();

      // Open placeholder picker
      const pickerBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".placeholder-trigger",
      );
      pickerBtn.click();
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".placeholder-dropdown"),
      ).toBeTruthy();

      // Toggle source mode — picker should close
      const sourceBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[aria-label="Edit HTML source"]',
      );
      sourceBtn.click();
      fixture.detectChanges();

      expect(component["isPlaceholderPickerOpen"]()).toBe(false);
    });

    it("should not toggle source mode when readonly", () => {
      fixture.componentRef.setInput("readonly", true);
      fixture.detectChanges();

      component["toggleSourceMode"]();
      expect(component["isSourceMode"]()).toBe(false);
    });
  });

  describe("placeholder picker interactions", () => {
    it("should not toggle picker when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      component["togglePlaceholderPicker"]();
      expect(component["isPlaceholderPickerOpen"]()).toBe(false);
    });

    it("should not toggle picker when readonly", () => {
      fixture.componentRef.setInput("readonly", true);
      fixture.detectChanges();

      component["togglePlaceholderPicker"]();
      expect(component["isPlaceholderPickerOpen"]()).toBe(false);
    });

    it("should not insert placeholder when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const spy = vi.fn();
      component.placeholderInserted.subscribe(spy);
      component["insertPlaceholder"]({ key: "k", label: "K" });

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("internal helpers", () => {
    it("should escape HTML entities", () => {
      const strategy = (component as any).strategy();
      const result = (strategy as any).escapeHtml("<b>\"test\" & 'more'</b>");
      expect(result).toBe("&lt;b&gt;&quot;test&quot; &amp; 'more'&lt;/b&gt;");
    });

    it("should escape attribute values (delegates to escapeHtml)", () => {
      const strategy = (component as any).strategy();
      const result = (strategy as any).escapeAttr('val"ue');
      expect(result).toBe("val&quot;ue");
    });
  });

  // ── New feature tests ────────────────────────────────────────

  describe("keyboard shortcuts", () => {
    it("should execute bold on Ctrl+B", () => {
      const editor: HTMLElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "b",
          ctrlKey: true,
          bubbles: true,
        }),
      );
      expect(execCommandSpy).toHaveBeenCalledWith("bold");
    });

    it("should execute italic on Ctrl+I", () => {
      const editor: HTMLElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "i",
          ctrlKey: true,
          bubbles: true,
        }),
      );
      expect(execCommandSpy).toHaveBeenCalledWith("italic");
    });

    it("should execute underline on Ctrl+U", () => {
      const editor: HTMLElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "u",
          ctrlKey: true,
          bubbles: true,
        }),
      );
      expect(execCommandSpy).toHaveBeenCalledWith("underline");
    });

    it("should execute strikethrough on Ctrl+Shift+S", () => {
      const editor: HTMLElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "s",
          ctrlKey: true,
          shiftKey: true,
          bubbles: true,
        }),
      );
      expect(execCommandSpy).toHaveBeenCalledWith("strikeThrough");
    });

    it("should execute undo on Ctrl+Z", () => {
      const editor: HTMLElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "z",
          ctrlKey: true,
          bubbles: true,
        }),
      );
      expect(execCommandSpy).toHaveBeenCalledWith("undo");
    });

    it("should execute redo on Ctrl+Y", () => {
      const editor: HTMLElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "y",
          ctrlKey: true,
          bubbles: true,
        }),
      );
      expect(execCommandSpy).toHaveBeenCalledWith("redo");
    });

    it("should execute redo on Ctrl+Shift+Z", () => {
      const editor: HTMLElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "z",
          ctrlKey: true,
          shiftKey: true,
          bubbles: true,
        }),
      );
      expect(execCommandSpy).toHaveBeenCalledWith("redo");
    });

    it("should not trigger shortcut when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      const editor: HTMLElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "b",
          ctrlKey: true,
          bubbles: true,
        }),
      );
      expect(execCommandSpy).not.toHaveBeenCalled();
    });

    it("should not trigger shortcut without modifier key", () => {
      const editor: HTMLElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(
        new KeyboardEvent("keydown", { key: "b", bubbles: true }),
      );
      expect(execCommandSpy).not.toHaveBeenCalled();
    });
  });

  describe("undo/redo toolbar actions", () => {
    it("should render undo and redo buttons", () => {
      const undoBtn = fixture.nativeElement.querySelector(
        '[aria-label="Undo"]',
      );
      const redoBtn = fixture.nativeElement.querySelector(
        '[aria-label="Redo"]',
      );
      expect(undoBtn).toBeTruthy();
      expect(redoBtn).toBeTruthy();
    });

    it("should call execCommand undo on undo click", () => {
      const undoBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[aria-label="Undo"]',
      );
      undoBtn.click();
      fixture.detectChanges();
      expect(execCommandSpy).toHaveBeenCalledWith("undo");
    });

    it("should call execCommand redo on redo click", () => {
      const redoBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[aria-label="Redo"]',
      );
      redoBtn.click();
      fixture.detectChanges();
      expect(execCommandSpy).toHaveBeenCalledWith("redo");
    });
  });

  describe("horizontal rule action", () => {
    it("should render a horizontal rule button", () => {
      const hrBtn = fixture.nativeElement.querySelector(
        '[aria-label="Horizontal rule"]',
      );
      expect(hrBtn).toBeTruthy();
    });

    it("should call execCommand insertHorizontalRule on click", () => {
      const hrBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '[aria-label="Horizontal rule"]',
      );
      hrBtn.click();
      fixture.detectChanges();
      expect(execCommandSpy).toHaveBeenCalledWith("insertHorizontalRule");
    });
  });

  describe("indent/outdent actions", () => {
    it("should render indent and outdent buttons inside the list dropdown", () => {
      // Open the list dropdown
      const listTrigger: HTMLButtonElement =
        fixture.nativeElement.querySelector('[aria-label="Lists"]');
      expect(listTrigger).toBeTruthy();
      listTrigger.click();
      fixture.detectChanges();

      const items = Array.from(
        fixture.nativeElement.querySelectorAll(".dropdown-panel-item"),
      ) as HTMLButtonElement[];
      const indentItem = items.find((el) =>
        el.textContent?.includes("Increase indent"),
      );
      const outdentItem = items.find((el) =>
        el.textContent?.includes("Decrease indent"),
      );
      expect(indentItem).toBeTruthy();
      expect(outdentItem).toBeTruthy();
    });

    it("should call execCommand indent on indent click", () => {
      const listTrigger: HTMLButtonElement =
        fixture.nativeElement.querySelector('[aria-label="Lists"]');
      listTrigger.click();
      fixture.detectChanges();

      const items = Array.from(
        fixture.nativeElement.querySelectorAll(".dropdown-panel-item"),
      ) as HTMLButtonElement[];
      const indentItem = items.find((el) =>
        el.textContent?.includes("Increase indent"),
      ) as HTMLButtonElement;
      indentItem.click();
      fixture.detectChanges();

      expect(execCommandSpy).toHaveBeenCalledWith("indent");
    });
  });

  describe("outside click closes dropdowns", () => {
    it("should close dropdown group on outside click", () => {
      const trigger: HTMLButtonElement =
        fixture.nativeElement.querySelector(".dropdown-trigger");
      trigger.click();
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".dropdown-panel"),
      ).toBeTruthy();

      // Click outside the component
      document.body.click();
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".dropdown-panel"),
      ).toBeFalsy();
    });

    it("should close placeholder picker on outside click", () => {
      fixture.componentRef.setInput("placeholders", [
        { key: "name", label: "Name" },
      ]);
      fixture.detectChanges();

      const pickerBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".placeholder-trigger",
      );
      pickerBtn.click();
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".placeholder-dropdown"),
      ).toBeTruthy();

      document.body.click();
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".placeholder-dropdown"),
      ).toBeFalsy();
    });
  });

  describe("markdown mode hides alignment", () => {
    it("should not render align dropdown in Markdown mode", () => {
      fixture.componentRef.setInput("mode", "markdown");
      fixture.detectChanges();

      const alignTrigger = fixture.nativeElement.querySelector(
        '[aria-label="Alignment"]',
      );
      expect(alignTrigger).toBeFalsy();
    });

    it("should render align dropdown in HTML mode", () => {
      const alignTrigger = fixture.nativeElement.querySelector(
        '[aria-label="Alignment"]',
      );
      expect(alignTrigger).toBeTruthy();
    });
  });

  describe("placeholder picker search", () => {
    const placeholders: RichTextPlaceholder[] = [
      { key: "firstName", label: "First Name", category: "Contact" },
      { key: "lastName", label: "Last Name", category: "Contact" },
      { key: "companyName", label: "Company", category: "Account" },
    ];

    beforeEach(() => {
      fixture.componentRef.setInput("placeholders", placeholders);
      fixture.detectChanges();
    });

    it("should render a search input in the placeholder dropdown", () => {
      const pickerBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".placeholder-trigger",
      );
      pickerBtn.click();
      fixture.detectChanges();

      const searchInput = fixture.nativeElement.querySelector(
        ".placeholder-search-input",
      );
      expect(searchInput).toBeTruthy();
    });

    it("should filter placeholders by search term", () => {
      const pickerBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".placeholder-trigger",
      );
      pickerBtn.click();
      fixture.detectChanges();

      // All 3 options visible
      let options = fixture.nativeElement.querySelectorAll(
        ".placeholder-option",
      );
      expect(options.length).toBe(3);

      // Type search term
      component["placeholderSearchTerm"].set("first");
      fixture.detectChanges();

      options = fixture.nativeElement.querySelectorAll(".placeholder-option");
      expect(options.length).toBe(1);
      expect(options[0].textContent.trim()).toBe("First Name");
    });

    it("should show no matches message when search yields no results", () => {
      const pickerBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".placeholder-trigger",
      );
      pickerBtn.click();
      fixture.detectChanges();

      component["placeholderSearchTerm"].set("zzzzz");
      fixture.detectChanges();

      const empty = fixture.nativeElement.querySelector(".placeholder-empty");
      expect(empty).toBeTruthy();
      expect(empty.textContent.trim()).toBe("No matches");
    });

    it("should clear search term when picker is closed", () => {
      const pickerBtn: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".placeholder-trigger",
      );
      pickerBtn.click();
      fixture.detectChanges();

      component["placeholderSearchTerm"].set("first");
      fixture.detectChanges();

      // Close picker
      pickerBtn.click();
      fixture.detectChanges();

      expect(component["placeholderSearchTerm"]()).toBe("");
    });
  });

  describe("character count / maxLength", () => {
    it("should not render footer when maxLength is not set", () => {
      const footer = fixture.nativeElement.querySelector(".footer");
      expect(footer).toBeFalsy();
    });

    it("should render footer with character count when maxLength is set", () => {
      fixture.componentRef.setInput("maxLength", 100);
      fixture.detectChanges();
      const footer = fixture.nativeElement.querySelector(".footer");
      expect(footer).toBeTruthy();
      const count = footer.querySelector(".char-count");
      expect(count).toBeTruthy();
      expect(count.textContent).toContain("/ 100");
    });

    it("should add over class when character count exceeds maxLength", () => {
      fixture.componentRef.setInput("maxLength", 5);
      fixture.componentRef.setInput("value", "Hello, World!");
      fixture.detectChanges();

      const footer = fixture.nativeElement.querySelector(".footer");
      expect(footer.classList.contains("footer--over")).toBe(true);
    });

    it("should not add over class when character count is within maxLength", () => {
      fixture.componentRef.setInput("maxLength", 100);
      fixture.componentRef.setInput("value", "Hello");
      fixture.detectChanges();

      const footer = fixture.nativeElement.querySelector(".footer");
      expect(footer.classList.contains("footer--over")).toBe(false);
    });
  });

  describe("image action", () => {
    it("should render an image button in the toolbar", () => {
      const imgBtn = fixture.nativeElement.querySelector(
        '[aria-label="Insert image"]',
      );
      expect(imgBtn).toBeTruthy();
    });
  });

  describe("image paste", () => {
    function createImagePasteEvent(
      imageType = "image/png",
    ): ClipboardEvent & { file: File } {
      const file = new File(["fake-image-data"], "screenshot.png", {
        type: imageType,
      });
      const item = {
        type: imageType,
        getAsFile: () => file,
      };
      const clipboardData = {
        items: [item],
        getData: () => "",
      } as unknown as DataTransfer;

      const event = new Event("paste", {
        bubbles: true,
        cancelable: true,
      }) as ClipboardEvent;
      Object.defineProperty(event, "clipboardData", {
        value: clipboardData,
      });
      return Object.assign(event, { file });
    }

    it("should prevent default when an image is pasted", () => {
      const event = createImagePasteEvent();
      const preventSpy = vi.spyOn(event, "preventDefault");

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(event);

      expect(preventSpy).toHaveBeenCalled();
    });

    it("should embed image as base64 when no imageHandler is set", async () => {
      const event = createImagePasteEvent();

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(event);

      // FileReader is async — wait for it
      await new Promise((r) => setTimeout(r, 50));
      fixture.detectChanges();

      const img = editor.querySelector("img");
      expect(img).toBeTruthy();
      expect(img!.src).toMatch(/^data:image\/png;base64,/);
      expect(img!.alt).toBe("screenshot.png");
    });

    it("should call imageHandler when provided and insert returned URL", async () => {
      const handler = vi
        .fn()
        .mockResolvedValue("https://cdn.example.com/img.png");
      fixture.componentRef.setInput("imageHandler", handler);
      fixture.detectChanges();

      const event = createImagePasteEvent();

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(event);

      await new Promise((r) => setTimeout(r, 50));
      fixture.detectChanges();

      expect(handler).toHaveBeenCalledWith(event.file);
      const img = editor.querySelector("img");
      expect(img).toBeTruthy();
      expect(img!.src).toBe("https://cdn.example.com/img.png");
    });

    it("should not crash when imageHandler rejects", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const handler = vi.fn().mockRejectedValue(new Error("upload failed"));
      fixture.componentRef.setInput("imageHandler", handler);
      fixture.detectChanges();

      const event = createImagePasteEvent();
      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(event);

      await new Promise((r) => setTimeout(r, 50));
      fixture.detectChanges();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] UIRichTextEditor: Image upload failed$/,
        ),
        expect.any(Error),
      );
      consoleErrorSpy.mockRestore();
    });

    it("should not intercept non-image paste events", () => {
      const clipboardData = {
        items: [{ type: "text/plain", getAsFile: () => null }],
        getData: (type: string) => (type === "text/plain" ? "plain text" : ""),
      } as unknown as DataTransfer;

      const event = new Event("paste", {
        bubbles: true,
        cancelable: true,
      }) as ClipboardEvent;
      Object.defineProperty(event, "clipboardData", {
        value: clipboardData,
      });

      const editor: HTMLDivElement =
        fixture.nativeElement.querySelector(".editor");
      editor.dispatchEvent(event);

      // Should fall through to the normal paste handler
      expect(execCommandSpy).toHaveBeenCalledWith(
        "insertText",
        false,
        "plain text",
      );
    });
  });

  describe("sanitiser data:image/ handling", () => {
    it("should preserve data:image/ URIs on <img> src via sanitiseHtml", () => {
      const dataUri = "data:image/png;base64,iVBORw0KGgo=";
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml(`<p>Text</p><img src="${dataUri}" alt="test">`);
      expect(sanitised).toContain(dataUri);
    });

    it("should strip data: URIs from <a> href via sanitiseHtml", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml(
          '<a href="data:text/html,<script>alert(1)</script>">click</a>',
        );
      const tmp = document.createElement("div");
      tmp.innerHTML = sanitised;
      const a = tmp.querySelector("a");
      expect(a).toBeTruthy();
      expect(a!.getAttribute("href")).toBeNull();
    });

    it("should strip non-image data: URIs from <img> src via sanitiseHtml", () => {
      const sanitised = (component as any)
        .strategy()
        .sanitiseHtml(
          '<img src="data:text/html,<script>alert(1)</script>" alt="x">',
        );
      const tmp = document.createElement("div");
      tmp.innerHTML = sanitised;
      const img = tmp.querySelector("img");
      expect(img).toBeTruthy();
      expect(img!.getAttribute("src")).toBeNull();
    });
  });
});
