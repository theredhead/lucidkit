import { Component } from '@angular/core';
import { UISourceTabs, type UISourceTab } from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-source-demo',
  standalone: true,
  imports: [UISourceTabs],
  template:     '<ui-source-tabs [tabs]="tabs" ariaLabel="Implementation example" />',
})
export class SourceDemoComponent {
  readonly tabs: UISourceTab[] = [
    { label: 'Markup', language: 'HTML', code: '<div>Hello</div>' },
    { label: 'TypeScript', language: 'TypeScript', code: 'export class Demo {}' },
    { label: 'Styles', language: 'SCSS', code: ':host { display: block; }' },
  ];
}
