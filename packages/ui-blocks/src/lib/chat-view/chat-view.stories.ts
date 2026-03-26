import { Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIChatView } from "./chat-view.component";
import type { ChatMessage, ChatParticipant } from "./chat-view.types";

const alice: ChatParticipant = {
  id: "alice",
  name: "Alice Johnson",
  avatarEmail: "alice@example.com",
};

const bob: ChatParticipant = {
  id: "bob",
  name: "Bob Smith",
  avatarEmail: "bob@example.com",
};

const system: ChatParticipant = {
  id: "system",
  name: "System",
};

function msg(
  id: string,
  sender: ChatParticipant,
  content: string,
  minutesAgo: number,
  type: "text" | "rich-text" | "system" = "text",
): ChatMessage {
  return {
    id,
    sender,
    content,
    timestamp: new Date(Date.now() - minutesAgo * 60_000),
    type,
  };
}

const sampleMessages: ChatMessage[] = [
  msg("1", system, "Bob joined the conversation", 30, "system"),
  msg("2", bob, "Hey Alice! How is the component library coming along?", 25),
  msg("3", alice, "Pretty well! Just finished the file browser block.", 22),
  msg("4", bob, "Nice! What are you working on next?", 20),
  msg(
    "5",
    alice,
    "The chat view — that is what you are looking at right now!",
    18,
  ),
  msg("6", bob, "Haha, very meta. Looks great so far!", 15),
  msg("7", alice, "Thanks! Still need to wire up the rich-text mode.", 12),
  msg("8", bob, "Looking forward to trying it out.", 10),
];

@Component({
  selector: "ui-story-chat-demo",
  standalone: true,
  imports: [UIChatView],
  template: `
    <div
      style="height: 500px; color: #1d232b; background: #f7f8fa; padding: 16px;"
    >
      <ui-chat-view
        [messages]="messages()"
        [currentUser]="currentUser"
        [composerMode]="composerMode"
        (messageSend)="onSend($event)"
      />
    </div>
  `,
})
class ChatDemoComponent {
  public currentUser = alice;
  public composerMode: "text" | "rich-text" = "text";
  public messages = signal<ChatMessage[]>([...sampleMessages]);

  public onSend(event: { content: string }): void {
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: this.currentUser,
      content: event.content,
      timestamp: new Date(),
    };
    this.messages.update((prev) => [...prev, newMsg]);
  }
}

@Component({
  selector: "ui-story-rich-text-demo",
  standalone: true,
  imports: [UIChatView],
  template: `
    <div
      style="height: 500px; color: #1d232b; background: #f7f8fa; padding: 16px;"
    >
      <ui-chat-view
        [messages]="messages()"
        [currentUser]="currentUser"
        composerMode="rich-text"
        (messageSend)="onSend($event)"
      />
    </div>
  `,
})
class RichTextDemoComponent {
  public currentUser = alice;
  public messages = signal<ChatMessage[]>([
    msg(
      "1",
      bob,
      "Check out this <strong>bold</strong> and <em>italic</em> text!",
      10,
      "rich-text",
    ),
    msg("2", alice, "Neat! The rich-text editor integrates nicely.", 8),
    msg(
      "3",
      bob,
      'Here is a <a href="#">link</a> in a message.',
      5,
      "rich-text",
    ),
  ]);

  public onSend(event: { content: string }): void {
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: this.currentUser,
      content: event.content,
      timestamp: new Date(),
      type: "rich-text",
    };
    this.messages.update((prev) => [...prev, newMsg]);
  }
}

const meta: Meta<UIChatView> = {
  title: "@Theredhead/UI Blocks/Chat View",
  component: UIChatView,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [ChatDemoComponent, RichTextDemoComponent],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIChatView>;

export const Default: Story = {
  render: () => ({
    template: `<ui-story-chat-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-chat-view
  [messages]="messages()"
  [currentUser]="me"
  (messageSend)="onSend($event)"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIChatView, ChatMessage, ChatParticipant, MessageSendEvent } from '@theredhead/ui-blocks';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [UIChatView],
  template: \\\`
    <ui-chat-view
      [messages]="messages()"
      [currentUser]="me"
      (messageSend)="onSend($event)"
    />
  \\\`,
  styles: [\\\`:host { display: block; height: 500px; }\\\`],
})
export class ChatComponent {
  readonly me: ChatParticipant = { id: 'user-1', name: 'Alice' };
  readonly messages = signal<ChatMessage[]>([]);

  onSend(event: MessageSendEvent): void {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: this.me,
      content: event.content,
      timestamp: new Date(),
    };
    this.messages.update(prev => [...prev, msg]);
  }
}

// ── SCSS ──
:host {
  display: block;
  height: 500px;
}
`,
      },
    },
  },
};

export const RichTextComposer: Story = {
  render: () => ({
    template: `<ui-story-rich-text-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-chat-view
  [messages]="messages()"
  [currentUser]="me"
  composerMode="rich-text"
  (messageSend)="onSend($event)"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIChatView, ChatMessage, ChatParticipant } from '@theredhead/ui-blocks';

@Component({
  selector: 'app-rich-chat',
  standalone: true,
  imports: [UIChatView],
  template: \\\`
    <ui-chat-view
      [messages]="messages()"
      [currentUser]="me"
      composerMode="rich-text"
      (messageSend)="onSend($event)"
    />
  \\\`,
})
export class RichChatComponent {
  readonly me: ChatParticipant = { id: 'user-1', name: 'Alice' };
  readonly messages = signal<ChatMessage[]>([]);

  onSend(event: { content: string }): void {
    this.messages.update(prev => [...prev, {
      id: crypto.randomUUID(),
      sender: this.me,
      content: event.content,
      timestamp: new Date(),
      type: 'rich-text',
    }]);
  }
}

// ── SCSS ──
/* No custom styles needed */
`,
      },
    },
  },
};

export const EmptyChat: Story = {
  render: () => ({
    template: `
      <div style="height: 400px; color: #1d232b; background: #f7f8fa; padding: 16px;">
        <ui-chat-view [messages]="[]" [currentUser]="currentUser" />
      </div>
    `,
    props: {
      currentUser: alice,
    },
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-chat-view [messages]="[]" [currentUser]="me" />

// ── TypeScript ──
import { UIChatView, ChatParticipant } from '@theredhead/ui-blocks';
// Shows "No messages yet" empty state.

// ── SCSS ──
/* No custom styles needed */
`,
      },
    },
  },
};
