import { Component } from '@angular/core';
import { UIRichTextView } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIRichTextView],
  template: `<ui-rich-text-view strategy="markdown" [content]="markdownContent" />`,
})
export class ExampleComponent {
  markdownContent = '## Hello\n\n**Bold**, *italic*, `code`.';
}
