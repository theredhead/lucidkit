import { Component } from '@angular/core';
import { UIRichTextView } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIRichTextView],
  template: `<ui-rich-text-view [content]="htmlContent" />`,
})
export class ExampleComponent {
  htmlContent = '<p>Hello <strong>world</strong></p>';
}
