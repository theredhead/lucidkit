import { Component, signal } from '@angular/core';
import { UIChatView, ChatMessage, ChatParticipant } from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-rich-chat',
  standalone: true,
  imports: [UIChatView],
  template: \`
    <ui-chat-view
      [messages]="messages()"
      [currentUser]="me"
      composerMode="rich-text"
      (messageSend)="onSend($event)"
    />
  \`,
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
