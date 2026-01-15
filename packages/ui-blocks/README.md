# @sigmax/ui-blocks

Advanced layout and block components library for Sigmax projects using Angular Material.

## Components

### UiMasterDetailViewComponent

A responsive master-detail layout component using Material design principles.

```typescript
import { UiMasterDetailViewComponent, MasterItem } from '@sigmax/ui-blocks';
import { signal } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UiMasterDetailViewComponent],
  template: `
    <ui-master-detail-view
      [items]="items()"
      [selectedItemId]="selectedItemId()"
      masterTitle="Users"
      detailPlaceholderText="Select a user to view details"
      (onSelectItem)="selectItem($event)"
    >
      <!-- Detail content goes here -->
      @if (selectedUser(); as user) {
        <div class="user-details">
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Role:</strong> {{ user.role }}</p>
        </div>
      }
    </ui-master-detail-view>
  `
})
export class UserListComponent {
  items = signal<MasterItem[]>([
    { id: 1, label: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, label: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  ]);
  
  selectedItemId = signal<string | number | null>(null);
  
  selectItem(item: MasterItem) {
    this.selectedItemId.set(item.id);
  }
  
  get selectedUser() {
    return computed(() => 
      this.items().find(item => item.id === this.selectedItemId())
    );
  }
}
```

#### Inputs

- `items: MasterItem[]` - List of items to display in master pane
- `selectedItemId: string | number | null` - Currently selected item ID
- `masterTitle: string` - Title for master pane (default: 'Items')
- `detailPlaceholderText: string` - Placeholder when no item selected

#### Outputs

- `onSelectItem: EventEmitter<MasterItem>` - Emitted when user selects an item

#### Content Projection

The component supports content projection for the detail panel. Use `<ng-content></ng-content>` in your template to display custom detail content.

## Features

✅ Built on Angular Material components (List, Divider)  
✅ Responsive grid layout (desktop & mobile)  
✅ Smooth Material transitions and animations  
✅ Keyboard navigation support  
✅ Material list activation states  
✅ State management with signals  
✅ Full TypeScript support  
✅ OnPush change detection  
✅ Mobile-friendly design  
✅ Accessible ARIA attributes  
✅ Material theming support

## Responsive Behavior

- **Desktop (> 768px)**: Two-column layout (300px master + detail)
- **Mobile (≤ 768px)**: Stacked layout

