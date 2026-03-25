import type { Meta, StoryObj } from "@storybook/angular";
import { UIEmojiPicker } from "./emoji-picker.component";
import type { EmojiCategory } from "./emoji-picker.types";

const meta: Meta<UIEmojiPicker> = {
  title: "@Theredhead/UI Kit/Emoji Picker",
  component: UIEmojiPicker,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<UIEmojiPicker>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-emoji-picker (emojiSelected)="onEmoji($event)" />`,
  }),
  args: {},
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-emoji-picker (emojiSelected)="onEmoji($event)" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIEmojiPicker } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIEmojiPicker],
  template: \\\`<ui-emoji-picker (emojiSelected)="onEmoji($event)" />\\\`,
})
export class ExampleComponent {
  onEmoji(emoji: string): void {
    console.log('Selected:', emoji);
  }
}

// ── SCSS ──
/* No custom styles needed — emoji picker handles its own theming. */
`,
      },
    },
  },
};

const customCategories: EmojiCategory[] = [
  {
    name: "Favorites",
    emojis: ["😀", "😂", "❤️", "👍", "🎉", "🔥", "✨", "💯", "🙏", "😎"],
  },
  {
    name: "Animals",
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯"],
  },
  {
    name: "Food",
    emojis: ["🍕", "🍔", "🍟", "🌮", "🍣", "🍩", "🍰", "☕", "🍺", "🍷"],
  },
];

export const CustomCategories: Story = {
  render: (args) => ({
    props: { ...args, customCategories },
    template: `<ui-emoji-picker [categories]="customCategories" (emojiSelected)="onEmoji($event)" />`,
  }),
  args: {},
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-emoji-picker
  [categories]="customCategories"
  (emojiSelected)="onEmoji($event)"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIEmojiPicker, EmojiCategory } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIEmojiPicker],
  template: \\\`
    <ui-emoji-picker
      [categories]="customCategories"
      (emojiSelected)="onEmoji($event)"
    />
  \\\`,
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

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};
