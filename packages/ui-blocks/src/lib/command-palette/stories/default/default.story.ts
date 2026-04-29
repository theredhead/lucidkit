import { Component, signal } from '@angular/core';
import {
  UICommandPalette,
  type CommandPaletteItem,
  type CommandExecuteEvent,
} from '@theredhead/lucid-blocks';
import { UIIcons } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICommandPalette],
  template: \`
    <button (click)="paletteOpen.set(true)">Open</button>
    <ui-command-palette
      [commands]="commands"
      [(open)]="paletteOpen"
      (execute)="onExecute($event)"
    />
  \`,
})
export class ExampleComponent {
  readonly paletteOpen = signal(false);
  readonly commands: CommandPaletteItem[] = [
    { id: 'save', label: 'Save', group: 'File', shortcut: 'Cmd+S', icon: UIIcons.Lucide.Files.Save },
    { id: 'find', label: 'Find', group: 'Search', shortcut: 'Cmd+F', icon: UIIcons.Lucide.Social.Search },
  ];

  onExecute(event: CommandExecuteEvent): void {
    console.log('Executed:', event.command.label);
  }
}
