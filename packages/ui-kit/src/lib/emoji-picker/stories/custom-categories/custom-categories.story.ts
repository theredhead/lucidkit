import { Component } from '@angular/core';
import { UIEmojiPicker, EmojiCategory } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIEmojiPicker],
  template: \`
    <ui-emoji-picker
      [categories]="customCategories"
      (emojiSelected)="onEmoji($event)"
    />
  \`,
})
export class ExampleComponent {
  customCategories: EmojiCategory[] = [
    { name: 'Favorites', emojis: ['😀', '😂', '❤️', '👍', '🎉'] },
    { name: 'Animals', emojis: ['🐶', '🐱', '🐭', '🐹', '🐰'] },
  ];

  onEmoji(emoji: string): void {
    console.log('Selected:', emoji);
  }
}
