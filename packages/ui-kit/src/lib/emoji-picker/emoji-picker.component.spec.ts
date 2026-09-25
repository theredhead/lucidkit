import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UIEmojiPicker } from "./emoji-picker.component";
import { DEFAULT_EMOJI_CATEGORIES } from "./emoji-picker.data";
import type { EmojiCategory } from "./emoji-picker.types";

describe("UIEmojiPicker", () => {
  let component: UIEmojiPicker;
  let fixture: ComponentFixture<UIEmojiPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIEmojiPicker],
    }).compileComponents();
    fixture = TestBed.createComponent(UIEmojiPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it("should use default emoji categories", () => {
      expect(component.categories()).toEqual(DEFAULT_EMOJI_CATEGORIES);
    });

    it('should default searchPlaceholder to "Search emoji…"', () => {
      expect(component.searchPlaceholder()).toBe("Search emoji…");
    });

    it('should default ariaLabel to "Emoji picker"', () => {
      expect(component.ariaLabel()).toBe("Emoji picker");
    });
  });

  describe("rendering", () => {
    it("should render a search input", () => {
      const input = fixture.nativeElement.querySelector(".ep-search-input");
      expect(input).toBeTruthy();
    });

    it("should render category tabs", () => {
      const tabs = fixture.nativeElement.querySelectorAll(".ep-tab");
      // "All" tab + one per category
      expect(tabs.length).toBe(DEFAULT_EMOJI_CATEGORIES.length + 1);
    });

    it("should render category headers", () => {
      const headers = fixture.nativeElement.querySelectorAll(
        ".ep-category-header",
      );
      expect(headers.length).toBe(DEFAULT_EMOJI_CATEGORIES.length);
    });

    it("should render emoji buttons", () => {
      const emojis = fixture.nativeElement.querySelectorAll(".ep-emoji");
      expect(emojis.length).toBeGreaterThan(0);
    });
  });

  describe("category filtering", () => {
    it("should show only selected category when a tab is clicked", () => {
      const tabs = fixture.nativeElement.querySelectorAll(".ep-tab");
      // Click the second tab (first real category)
      tabs[1].click();
      fixture.detectChanges();

      const headers = fixture.nativeElement.querySelectorAll(
        ".ep-category-header",
      );
      expect(headers.length).toBe(1);
      expect(headers[0].textContent.trim()).toBe(
        DEFAULT_EMOJI_CATEGORIES[0].name,
      );
    });

    it("should show all categories when 'All' tab is clicked", () => {
      // First select a category
      fixture.componentRef.setInput("categories", DEFAULT_EMOJI_CATEGORIES);
      fixture.detectChanges();

      const tabs = fixture.nativeElement.querySelectorAll(".ep-tab");
      tabs[1].click();
      fixture.detectChanges();

      // Then click "All"
      tabs[0].click();
      fixture.detectChanges();

      const headers = fixture.nativeElement.querySelectorAll(
        ".ep-category-header",
      );
      expect(headers.length).toBe(DEFAULT_EMOJI_CATEGORIES.length);
    });
  });

  describe("custom categories", () => {
    const customCategories: EmojiCategory[] = [
      { name: "Custom", emojis: ["😀", "😁", "😂"] },
      { name: "Hearts", emojis: ["❤️", "💙", "💚"] },
    ];

    it("should use custom categories when provided", () => {
      fixture.componentRef.setInput("categories", customCategories);
      fixture.detectChanges();

      const headers = fixture.nativeElement.querySelectorAll(
        ".ep-category-header",
      );
      expect(headers.length).toBe(2);
      expect(headers[0].textContent.trim()).toBe("Custom");
      expect(headers[1].textContent.trim()).toBe("Hearts");
    });

    it("should render custom emoji buttons", () => {
      fixture.componentRef.setInput("categories", customCategories);
      fixture.detectChanges();

      const emojis = fixture.nativeElement.querySelectorAll(".ep-emoji");
      expect(emojis.length).toBe(6);
    });
  });

  describe("emoji selection", () => {
    it("should emit emojiSelected when an emoji is clicked", () => {
      const spy = vi.fn();
      component.emojiSelected.subscribe(spy);

      const emojiBtn = fixture.nativeElement.querySelector(".ep-emoji");
      emojiBtn.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(typeof spy.mock.calls[0][0]).toBe("string");
    });
  });

  describe("search", () => {
    it("should filter emoji based on search term", () => {
      const searchInput =
        fixture.nativeElement.querySelector(".ep-search-input");
      searchInput.value = "😀";
      searchInput.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const emojis = fixture.nativeElement.querySelectorAll(".ep-emoji");
      // Should find the exact emoji
      expect(emojis.length).toBeGreaterThan(0);
      expect(emojis[0].textContent.trim()).toBe("😀");
    });

    it("should find built-in emoji by semantic search term", () => {
      const searchInput =
        fixture.nativeElement.querySelector(".ep-search-input");
      searchInput.value = "heart";
      searchInput.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const emojis = Array.from(
        fixture.nativeElement.querySelectorAll(".ep-emoji") as NodeListOf<HTMLElement>,
      ).map((element) => element.textContent?.trim());
      expect(emojis).toContain("❤️");
    });

    it("should find frequently used emoji across categories", () => {
      const searchInput =
        fixture.nativeElement.querySelector(".ep-search-input");
      const expectations: readonly (readonly [string, readonly string[]])[] = [
        ["wink", ["😉"]],
        ["angry", ["😠", "😡", "👿"]],
        ["clap", ["👏"]],
        ["party", ["🥳", "🎉"]],
        ["cat", ["🐱"]],
        ["apple", ["🍎"]],
        ["airplane", ["✈️"]],
        ["camera", ["📷", "📸"]],
        ["lock", ["🔒"]],
        ["united states", ["🇺🇸"]],
      ];

      for (const [term, expectedEmojis] of expectations) {
        searchInput.value = term;
        searchInput.dispatchEvent(new Event("input"));
        fixture.detectChanges();

        const emojis = Array.from(
          fixture.nativeElement.querySelectorAll(".ep-emoji") as NodeListOf<HTMLElement>,
        ).map((element) => element.textContent?.trim());
        expect(
          emojis.some((emoji) => expectedEmojis.includes(emoji ?? "")),
          `expected "${term}" to find one of ${expectedEmojis.join(", ")}`,
        )
          .toBe(true);
      }
    });

    it("should search custom categories by category name and search terms", () => {
      fixture.componentRef.setInput("categories", [
        {
          name: "Custom reactions",
          emojis: ["⭐", "💡"],
          searchTerms: {
            "⭐": ["star", "favorite"],
            "💡": ["idea", "light bulb"],
          },
        },
      ]);
      fixture.detectChanges();
      const searchInput =
        fixture.nativeElement.querySelector(".ep-search-input");
      searchInput.value = "idea";
      searchInput.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll(".ep-emoji")).toHaveLength(1);
      expect(fixture.nativeElement.querySelector(".ep-emoji").textContent.trim())
        .toBe("💡");
    });

    it("should use caller-provided localized search metadata", () => {
      fixture.componentRef.setInput("emojiSearchTerms", {
        "😀": ["glimlach"],
      });
      fixture.detectChanges();
      const searchInput =
        fixture.nativeElement.querySelector(".ep-search-input");
      searchInput.value = "glimlach";
      searchInput.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const emojis = Array.from(
        fixture.nativeElement.querySelectorAll(".ep-emoji") as NodeListOf<HTMLElement>,
      ).map((element) => element.textContent?.trim());
      expect(emojis).toContain("😀");
    });

    it("should show empty state when no emoji match", () => {
      const searchInput =
        fixture.nativeElement.querySelector(".ep-search-input");
      searchInput.value = "zzzzzzzznotanemoji";
      searchInput.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const empty = fixture.nativeElement.querySelector(".ep-empty");
      expect(empty).toBeTruthy();
      expect(empty.textContent.trim()).toBe("No emoji found");
    });
  });

  describe("hover preview", () => {
    it("should show preview when hovering an emoji", () => {
      const emojiBtn = fixture.nativeElement.querySelector(".ep-emoji");
      emojiBtn.dispatchEvent(new PointerEvent("pointerenter"));
      fixture.detectChanges();

      const preview = fixture.nativeElement.querySelector(".ep-preview-emoji");
      expect(preview).toBeTruthy();
      expect(preview.textContent.trim()).toBe(emojiBtn.textContent.trim());
    });

    it("should show localized search terms beside the hovered emoji", () => {
      fixture.componentRef.setInput("emojiSearchTerms", {
        "😀": ["glimlach", "blij", "gezicht"],
      });
      fixture.detectChanges();
      const emojiButton = Array.from(
        fixture.nativeElement.querySelectorAll(".ep-emoji") as NodeListOf<HTMLButtonElement>,
      ).find((button) => button.textContent?.trim() === "😀");
      emojiButton?.dispatchEvent(new PointerEvent("pointerenter"));
      fixture.detectChanges();

      const terms = fixture.nativeElement.querySelector(".ep-preview-terms");
      expect(terms.textContent.trim()).toBe("glimlach, blij, gezicht");
    });

    it("should clear preview emoji when pointer leaves", () => {
      const emojiBtn = fixture.nativeElement.querySelector(".ep-emoji");
      emojiBtn.dispatchEvent(new PointerEvent("pointerenter"));
      fixture.detectChanges();
      const preview = fixture.nativeElement.querySelector(".ep-preview-emoji");
      expect(preview.textContent.trim()).toBe(emojiBtn.textContent.trim());

      emojiBtn.dispatchEvent(new PointerEvent("pointerleave"));
      fixture.detectChanges();
      expect(preview.textContent.trim()).toBe("");
    });

    it("should not show preview when previewSize is 0", () => {
      fixture.componentRef.setInput("previewSize", 0);
      fixture.detectChanges();

      const emojiBtn = fixture.nativeElement.querySelector(".ep-emoji");
      emojiBtn.dispatchEvent(new PointerEvent("pointerenter"));
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".ep-preview")).toBeFalsy();
    });

    it("should default previewSize to 64", () => {
      expect(component.previewSize()).toBe(64);
    });
  });
});
