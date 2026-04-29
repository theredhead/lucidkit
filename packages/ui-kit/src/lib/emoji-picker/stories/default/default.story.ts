import { Component } from '@angular/core';
import { UIEmojiPicker } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIEmojiPicker],
  template: \`<ui-emoji-picker (emojiSelected)="onEmoji($event)" />\`,
})
export class ExampleComponent {
  onEmoji(emoji: string): void {
    console.log('Selected:', emoji);
  }
}
