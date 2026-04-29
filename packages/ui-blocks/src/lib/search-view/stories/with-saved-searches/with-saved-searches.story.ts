import { Component } from '@angular/core';
import { FilterableArrayDatasource } from '@theredhead/lucid-foundation';
import { UISearchView, UITextColumn, type SavedSearch } from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UISearchView, UITextColumn],
  template: \`
    <ui-search-view
      [datasource]="ds"
      title="Products"
      [showFilter]="true"
      storageKey="my-products"
      (savedSearchChange)="onSavedSearchChange($event)"
    >
      <ui-text-column key="name" headerText="Name" />
      <ui-text-column key="category" headerText="Category" />
    </ui-search-view>
  \`,
})
export class ExampleComponent {
  readonly ds = new FilterableArrayDatasource(products);

  onSavedSearchChange(search: SavedSearch | null): void {
    console.log('Saved search:', search);
  }
}
