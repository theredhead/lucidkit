import { Component, signal } from '@angular/core';
import { UIPropertySheet, type PropertyFieldDefinition } from '@theredhead/lucid-blocks';

interface Config {
  name: string;
  theme: string;
  accentColor: string;
  opacity: number;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [UIPropertySheet],
  template: \`
    <ui-property-sheet [fields]="fields" [(data)]="config" />
  \`,
})
export class SettingsComponent {
  readonly fields: PropertyFieldDefinition<Config>[] = [
    { key: 'name', label: 'Name', type: 'string', group: 'General' },
    { key: 'theme', label: 'Theme', type: 'select', group: 'Appearance',
      options: [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }] },
    { key: 'accentColor', label: 'Accent', type: 'color', group: 'Appearance' },
    { key: 'opacity', label: 'Opacity', type: 'slider', group: 'Appearance', min: 0, max: 100 },
  ];
  readonly config = signal<Config>({ name: 'My App', theme: 'light', accentColor: '#0061a4', opacity: 100 });
}
