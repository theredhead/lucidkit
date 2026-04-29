import { Component, signal } from '@angular/core';
import { UIChatView, ChatMessage, ChatParticipant, MessageSendEvent } from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [UIChatView],
  template: \`
    <ui-chat-view
      [messages]="messages()"
      [currentUser]="me"
      (messageSend)="onSend($event)"
    />
  \`,
  styles: [\`:host { display: block; height: 500px; }\`],
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
