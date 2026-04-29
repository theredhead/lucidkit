import { Component } from '@angular/core';
import { UIRichTextView } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIRichTextView],
  template: `<ui-rich-text-view [content]="markdownContent" />`,
})
export class ExampleComponent {
  markdownContent = '# Hello\n**world**\n\nThis is a paragraph.';
}
