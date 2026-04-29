import { Component } from '@angular/core';
import { UIFileBrowser } from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-detail-view',
  standalone: true,
  imports: [UIFileBrowser],
  template: \`
    <ui-file-browser [datasource]="ds" viewMode="detail" />
  \`,
  styles: [':host { display: block; height: 500px; }'],
})
export class DetailViewComponent {
  readonly ds = new MyDatasource();
}
