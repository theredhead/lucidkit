import { Component } from '@angular/core';
import {
  UIFileBrowser,
  type FileBrowserEntry,
  type MetadataField,
} from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-icon-view',
  standalone: true,
  imports: [UIFileBrowser],
  template: \`
    <ui-file-browser
      [datasource]="ds"
      viewMode="icons"
      [showDetails]="true"
      [metadataProvider]="metadataProvider"
    />
  \`,
  styles: [':host { display: block; height: 500px; }'],
})
export class IconViewComponent {
  readonly ds = new MyDatasource();
  metadataProvider(entry: FileBrowserEntry): MetadataField[] {
    return [{ label: 'Size', value: entry.meta?.size }];
  }
}
