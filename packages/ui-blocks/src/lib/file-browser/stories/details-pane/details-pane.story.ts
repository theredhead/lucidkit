import { Component } from '@angular/core';
import {
  UIFileBrowser,
  type FileBrowserEntry,
  type MetadataField,
} from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-details-pane',
  standalone: true,
  imports: [UIFileBrowser],
  template: \`
    <ui-file-browser
      [datasource]="ds"
      [showDetails]="true"
      [metadataProvider]="metadataProvider"
    />
  \`,
  styles: [':host { display: block; height: 500px; }'],
})
export class DetailsPaneComponent {
  readonly ds = new MyDatasource();
  metadataProvider(entry: FileBrowserEntry): MetadataField[] {
    return [
      { label: 'Size', value: entry.meta?.size ?? 'N/A' },
      { label: 'Type', value: entry.meta?.type ?? 'Unknown' },
    ];
  }
}
