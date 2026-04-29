import { Component } from '@angular/core';
import { UIFileBrowser } from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-column-view',
  standalone: true,
  imports: [UIFileBrowser],
  template: \`
    <ui-file-browser [datasource]="ds" viewMode="column" />
  \`,
  styles: [':host { display: block; height: 500px; }'],
})
export class ColumnViewComponent {
  readonly ds = new MyDatasource();
}
