import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UIMessageBubble } from "./message-bubble.component";
import type { ChatMessage, ChatParticipant } from "../chat-view.types";

const alice: ChatParticipant = { id: "alice", name: "Alice" };
const bob: ChatParticipant = {
  id: "bob",
  name: "Bob",
  avatarSrc: "bob.jpg",
  avatarEmail: "bob@example.com",
};

function makeMessage(
  id: string,
  sender: ChatParticipant,
  content: string,
  overrides: Partial<ChatMessage> = {},
): ChatMessage {
  return {
    id,
    sender,
    content,
    timestamp: new Date("2025-01-15T10:00:00Z"),
    ...overrides,
  };
}

describe("UIMessageBubble", () => {
  let component: UIMessageBubble;
  let fixture: ComponentFixture<UIMessageBubble>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIMessageBubble],
    }).compileComponents();

    fixture = TestBed.createComponent(UIMessageBubble);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("message", makeMessage("1", bob, "Hello"));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it("should default isMine to false", () => {
      expect(component.isMine()).toBe(false);
    });
  });

  describe("other user messages", () => {
    it("should render avatar for other users", () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector("ui-avatar")).toBeTruthy();
    });

    it("should render sender name", () => {
      const el: HTMLElement = fixture.nativeElement;
      const sender = el.querySelector(".bubble-sender");
      expect(sender).toBeTruthy();
      expect(sender!.textContent!.trim()).toBe("Bob");
    });

    it("should render bubble content", () => {
      const el: HTMLElement = fixture.nativeElement;
      const content = el.querySelector(".bubble-content");
      expect(content).toBeTruthy();
      expect(content!.textContent!.trim()).toBe("Hello");
    });

    it("should render timestamp", () => {
      const el: HTMLElement = fixture.nativeElement;
      const time = el.querySelector(".bubble-timestamp");
      expect(time).toBeTruthy();
      expect(time!.textContent!.trim()).toBeTruthy();
    });

    it("should not have --mine host class", () => {
      expect(
        fixture.nativeElement.classList.contains("ui-message-bubble--mine"),
      ).toBe(false);
    });
  });

  describe("own messages", () => {
    beforeEach(() => {
      fixture.componentRef.setInput(
        "message",
        makeMessage("2", alice, "My reply"),
      );
      fixture.componentRef.setInput("isMine", true);
      fixture.detectChanges();
    });

    it("should have --mine host class", () => {
      expect(
        fixture.nativeElement.classList.contains("ui-message-bubble--mine"),
      ).toBe(true);
    });

    it("should not render avatar", () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector("ui-avatar")).toBeNull();
    });

    it("should not render sender name", () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector(".bubble-sender")).toBeNull();
    });

    it("should render bubble content", () => {
      const el: HTMLElement = fixture.nativeElement;
      const content = el.querySelector(".bubble-content");
      expect(content!.textContent!.trim()).toBe("My reply");
    });
  });

  describe("rich-text messages", () => {
    it("should render HTML content for rich-text type", () => {
      fixture.componentRef.setInput(
        "message",
        makeMessage("3", bob, "<strong>Bold</strong> text", {
          type: "rich-text",
        }),
      );
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      const content = el.querySelector(".bubble-content");
      expect(content!.querySelector("strong")).toBeTruthy();
    });

    it("should render plain text for text type", () => {
      fixture.componentRef.setInput(
        "message",
        makeMessage("4", bob, "<strong>Not bold</strong>"),
      );
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      const content = el.querySelector(".bubble-content");
      expect(content!.querySelector("strong")).toBeNull();
      expect(content!.textContent).toContain("<strong>Not bold</strong>");
    });
  });

  describe("host class", () => {
    it("should have ui-message-bubble class", () => {
      expect(
        fixture.nativeElement.classList.contains("ui-message-bubble"),
      ).toBe(true);
    });
  });
});
