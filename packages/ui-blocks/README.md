# @theredhead/ui-blocks

Higher-level layout compositions for Theredhead Angular applications. Built on
top of `@theredhead/ui-kit` primitives, standalone, signal-based, and OnPush.

---

## Components

### UIMasterDetailView

A responsive master-detail layout. The master pane can render data as either a
**table** (`UITableView`) or a **tree** (`UITreeView`). The detail pane uses
content projection so you can render anything for the selected item.

```typescript
import { UIMasterDetailView } from "@theredhead/ui-blocks";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [UIMasterDetailView, UITextColumn],
  template: `
    <ui-master-detail-view
      [datasource]="adapter"
      masterTitle="Users"
      detailPlaceholderText="Select a user to view details"
      (selectedItemChange)="onSelect($event)"
    >
      <ui-text-column key="name" headerText="Name" [sortable]="true" />
      <ui-text-column key="email" headerText="Email" />

      <ng-template #detail let-item>
        <h2>{{ item.name }}</h2>
        <p>{{ item.email }}</p>
      </ng-template>
    </ui-master-detail-view>
  `,
})
export class UsersComponent {
  datasource = new ArrayDatasource(this.users);

  onSelect(item: unknown) {
    console.log("selected", item);
  }
}
```

#### Key inputs

| Input                   | Type                                         | Default            | Description                            |
| ----------------------- | -------------------------------------------- | ------------------ | -------------------------------------- |
| `datasource`            | `IDatasource<T> \| ITreeDatasource<T>` | —                  | Data source (flat table or tree mode)  |
| `data`                  | `readonly T[]`                               | `[]`               | Convenience raw data array             |
| `masterTitle`           | `string`                                     | `'Items'`          | Title shown above the master pane      |
| `detailPlaceholderText` | `string`                                     | `'Select an item'` | Placeholder when nothing is selected   |
| `mode`                  | `'table' \| 'tree'`                          | `'table'`          | Master pane display mode               |
| `showFilter`            | `boolean`                                    | `false`            | Show a filter section above the master |

#### Outputs

| Output               | Type | Description                    |
| -------------------- | ---- | ------------------------------ |
| `selectedItemChange` | `T`  | Emitted when selection changes |

#### Content projection

- **Columns** — project `UITableViewColumn` children for table mode
- **`#detail` template** — rendered in the detail pane with the selected item
- **`#filter` template** — optional filter controls above the master pane

---

## Features

- Standalone component — no module imports needed
- Responsive grid layout (two-column on desktop, stacked on mobile)
- Supports both flat-list (table) and hierarchical (tree) master views
- Signal-based state management
- OnPush change detection
- Keyboard navigation support
- CSS custom-property theming (`--ui-*` tokens)
- Light & dark mode support
