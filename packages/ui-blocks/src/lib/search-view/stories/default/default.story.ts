import { Component } from '@angular/core';
import { FilterableArrayDatasource } from '@theredhead/lucid-foundation';
import { UISearchView, UITextColumn } from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UISearchView, UITextColumn],
  template: \`
    <ui-search-view [datasource]="ds" title="Products" [pageSize]="10">
      <ui-text-column key="name" headerText="Name" />
      <ui-text-column key="category" headerText="Category" />
      <ui-text-column key="sku" headerText="SKU" />
    </ui-search-view>
  \`,
})
export class ExampleComponent {
  readonly ds = new FilterableArrayDatasource(products);
}
