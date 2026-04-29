import { Component } from '@angular/core';
import { UIRichTextView } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIRichTextView],
  template: `<ui-rich-text-view strategy="html" [content]="htmlContent" />`,
})
export class ExampleComponent {
  htmlContent = '<p>Hello <strong>world</strong></p>';
}
