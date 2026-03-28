import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UIChatView } from "./chat-view.component";
import type { ChatMessage, ChatParticipant } from "./chat-view.types";

const alice: ChatParticipant = { id: "alice", name: "Alice" };
const bob: ChatParticipant = { id: "bob", name: "Bob", avatarSrc: "bob.jpg" };

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

describe("UIChatView", () => {
  let component: UIChatView;
  let fixture: ComponentFixture<UIChatView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIChatView],
    }).compileComponents();

    fixture = TestBed.createComponent(UIChatView);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("currentUser", alice);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it("should default messages to empty", () => {
      expect(component.messages()).toEqual([]);
    });

    it("should default composerMode to text", () => {
      expect(component.composerMode()).toBe("text");
    });

    it("should default placeholder", () => {
      expect(component.placeholder()).toBe("Type a message…");
    });

    it("should default ariaLabel to Chat", () => {
      expect(component.ariaLabel()).toBe("Chat");
    });
  });

  describe("empty state", () => {
    it("should show empty message when no messages", () => {
      const el: HTMLElement = fixture.nativeElement;
      const empty = el.querySelector(".chat-empty");
      expect(empty).toBeTruthy();
      expect(empty!.textContent!.trim()).toBe("No messages yet");
    });
  });

  describe("message rendering", () => {
    it("should render messages", () => {
      const msgs = [
        makeMessage("1", bob, "Hello"),
        makeMessage("2", alice, "Hi there"),
      ];
      fixture.componentRef.setInput("messages", msgs);
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      const bubbles = el.querySelectorAll(".bubble-content");
      expect(bubbles.length).toBe(2);
      expect(bubbles[0].textContent!.trim()).toBe("Hello");
      expect(bubbles[1].textContent!.trim()).toBe("Hi there");
    });

    it("should mark own messages with --mine class", () => {
      const msgs = [
        makeMessage("1", bob, "Hello"),
        makeMessage("2", alice, "Reply"),
      ];
      fixture.componentRef.setInput("messages", msgs);
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      const messageEls = el.querySelectorAll("ui-message-bubble");
      expect(messageEls[0].classList.contains("ui-message-bubble--mine")).toBe(
        false,
      );
      expect(messageEls[1].classList.contains("ui-message-bubble--mine")).toBe(
        true,
      );
    });

    it("should show avatar for other users only", () => {
      const msgs = [
        makeMessage("1", bob, "Hello"),
        makeMessage("2", alice, "Reply"),
      ];
      fixture.componentRef.setInput("messages", msgs);
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      const messageEls = el.querySelectorAll("ui-message-bubble");
      expect(messageEls[0].querySelector("ui-avatar")).toBeTruthy();
      expect(messageEls[1].querySelector("ui-avatar")).toBeNull();
    });

    it("should show sender name for other users only", () => {
      const msgs = [
        makeMessage("1", bob, "Hello"),
        makeMessage("2", alice, "Reply"),
      ];
      fixture.componentRef.setInput("messages", msgs);
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      const names = el.querySelectorAll(".bubble-sender");
      expect(names.length).toBe(1);
      expect(names[0].textContent!.trim()).toBe("Bob");
    });

    it("should render system messages", () => {
      const msgs = [
        makeMessage("1", bob, "Alice joined the chat", { type: "system" }),
      ];
      fixture.componentRef.setInput("messages", msgs);
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      const systemMsg = el.querySelector(".chat-system-message");
      expect(systemMsg).toBeTruthy();
      expect(systemMsg!.textContent!.trim()).toBe("Alice joined the chat");
    });

    it("should render rich-text messages with innerHTML", () => {
      const msgs = [
        makeMessage("1", bob, "<strong>Bold</strong> text", {
          type: "rich-text",
        }),
      ];
      fixture.componentRef.setInput("messages", msgs);
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      const bubble = el.querySelector(".bubble-content");
      expect(bubble!.querySelector("strong")).toBeTruthy();
    });
  });

  describe("date grouping", () => {
    it("should group messages by date", () => {
      const msgs = [
        makeMessage("1", bob, "Yesterday", {
          timestamp: new Date(Date.now() - 86_400_000),
        }),
        makeMessage("2", bob, "Today", {
          timestamp: new Date(),
        }),
      ];
      fixture.componentRef.setInput("messages", msgs);
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      const dividers = el.querySelectorAll(".chat-date-label");
      expect(dividers.length).toBe(2);
    });

    it('should show "Today" label for today\'s messages', () => {
      const msgs = [makeMessage("1", bob, "Now", { timestamp: new Date() })];
      fixture.componentRef.setInput("messages", msgs);
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      const label = el.querySelector(".chat-date-label");
      expect(label!.textContent!.trim()).toBe("Today");
    });
  });

  describe("composer", () => {
    it("should render a textarea in text mode", () => {
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector(".chat-composer-input")).toBeTruthy();
      expect(el.querySelector("ui-rich-text-editor")).toBeNull();
    });

    it("should render UIRichTextEditor in rich-text mode", () => {
      fixture.componentRef.setInput("composerMode", "rich-text");
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector("ui-rich-text-editor")).toBeTruthy();
      expect(el.querySelector(".chat-composer-input")).toBeNull();
    });

    it("should disable send button when composer is empty", () => {
      const el: HTMLElement = fixture.nativeElement;
      const sendBtn = el.querySelector(
        ".chat-send-button",
      ) as HTMLButtonElement;
      expect(sendBtn.disabled).toBe(true);
    });

    it("should enable send button when composer has content", () => {
      const textarea = fixture.nativeElement.querySelector(
        ".chat-composer-input",
      ) as HTMLTextAreaElement;
      textarea.value = "Hello";
      textarea.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const sendBtn = fixture.nativeElement.querySelector(
        ".chat-send-button",
      ) as HTMLButtonElement;
      expect(sendBtn.disabled).toBe(false);
    });

    it("should emit messageSend on send button click", () => {
      const spy = vi.fn();
      component.messageSend.subscribe(spy);

      // Type a message
      const textarea = fixture.nativeElement.querySelector(
        ".chat-composer-input",
      ) as HTMLTextAreaElement;
      textarea.value = "Hello World";
      textarea.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      // Click send
      const sendBtn = fixture.nativeElement.querySelector(
        ".chat-send-button",
      ) as HTMLButtonElement;
      sendBtn.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith({ content: "Hello World" });
    });

    it("should clear composer after sending", () => {
      const textarea = fixture.nativeElement.querySelector(
        ".chat-composer-input",
      ) as HTMLTextAreaElement;
      textarea.value = "Test";
      textarea.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const sendBtn = fixture.nativeElement.querySelector(
        ".chat-send-button",
      ) as HTMLButtonElement;
      sendBtn.click();
      fixture.detectChanges();

      // Verify send button is disabled again (composer cleared)
      expect(sendBtn.disabled).toBe(true);
    });

    it("should send on Enter key (without Shift)", () => {
      const spy = vi.fn();
      component.messageSend.subscribe(spy);

      const textarea = fixture.nativeElement.querySelector(
        ".chat-composer-input",
      ) as HTMLTextAreaElement;
      textarea.value = "Enter test";
      textarea.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        shiftKey: false,
      });
      textarea.dispatchEvent(enterEvent);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith({ content: "Enter test" });
    });

    it("should not send on Shift+Enter", () => {
      const spy = vi.fn();
      component.messageSend.subscribe(spy);

      const textarea = fixture.nativeElement.querySelector(
        ".chat-composer-input",
      ) as HTMLTextAreaElement;
      textarea.value = "Shift enter";
      textarea.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const shiftEnterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        shiftKey: true,
      });
      textarea.dispatchEvent(shiftEnterEvent);
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });

    it("should not send empty or whitespace-only messages", () => {
      const spy = vi.fn();
      component.messageSend.subscribe(spy);

      const textarea = fixture.nativeElement.querySelector(
        ".chat-composer-input",
      ) as HTMLTextAreaElement;
      textarea.value = "   ";
      textarea.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const sendBtn = fixture.nativeElement.querySelector(
        ".chat-send-button",
      ) as HTMLButtonElement;
      sendBtn.click();
      fixture.detectChanges();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("should have aria-label on the message list", () => {
      const el: HTMLElement = fixture.nativeElement;
      const list = el.querySelector(".chat-messages");
      expect(list!.getAttribute("role")).toBe("log");
      expect(list!.getAttribute("aria-label")).toBe("Chat");
    });

    it("should have aria-label on the composer", () => {
      const el: HTMLElement = fixture.nativeElement;
      const textarea = el.querySelector(".chat-composer-input");
      expect(textarea!.getAttribute("aria-label")).toBe("Message composer");
    });

    it("should have aria-label on the send button", () => {
      const el: HTMLElement = fixture.nativeElement;
      const btn = el.querySelector(".chat-send-button");
      expect(btn!.getAttribute("aria-label")).toBe("Send message");
    });
  });

  describe("isMine (via DOM)", () => {
    it("should right-align own messages", () => {
      fixture.componentRef.setInput("messages", [
        makeMessage("1", alice, "My message"),
      ]);
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      const msgEl = el.querySelector("ui-message-bubble");
      expect(msgEl!.classList.contains("ui-message-bubble--mine")).toBe(true);
    });

    it("should left-align other messages", () => {
      fixture.componentRef.setInput("messages", [
        makeMessage("1", bob, "Their message"),
      ]);
      fixture.detectChanges();

      const el: HTMLElement = fixture.nativeElement;
      const msgEl = el.querySelector("ui-message-bubble");
      expect(msgEl!.classList.contains("ui-message-bubble--mine")).toBe(false);
    });
  });
});
