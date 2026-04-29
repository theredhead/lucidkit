import { Component } from '@angular/core';
import {
  UIFileBrowser,
  type FileBrowserDatasource,
  type FileBrowserEntry,
  type FileActivateEvent,
} from '@theredhead/lucid-blocks';

class MyDatasource implements FileBrowserDatasource {
  getChildren(parent: FileBrowserEntry | null): FileBrowserEntry[] {
    // Return files/directories for the given parent
    return parent ? this.childrenOf(parent) : this.rootEntries();
  }
  isDirectory(entry: FileBrowserEntry): boolean {
    return entry.isDirectory;
  }
}

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [UIFileBrowser],
  template: \`
    <ui-file-browser [datasource]="ds" (fileActivated)="onOpen($event)" />
  \`,
  styles: [':host { display: block; height: 500px; }'],
})
export class FilesComponent {
  readonly ds = new MyDatasource();
  onOpen(event: FileActivateEvent): void {
    console.log('Opened:', event.entry.name);
  }
}
