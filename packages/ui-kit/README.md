# @theredhead/ui-kit

Core reusable UI components library for theredhead Angular applications.
Every component is **standalone**, uses **signal-based** inputs/state, and
**OnPush** change detection. There are no runtime dependencies beyond Angular
core and `@angular/cdk`.

---

## Components at a glance

| Component                        | Selector                             | Description                                                               |
| -------------------------------- | ------------------------------------ | ------------------------------------------------------------------------- |
| **UIButton**                     | `ui-button`                          | Push button with `filled`, `outlined`, `text`, and `ghost` variants       |
| **UIInput**                      | `ui-input`                           | Styled text input with label and two-way `[(value)]` binding              |
| **UISelect**                     | `ui-select`                          | Native `<select>` wrapper with label and two-way `[(value)]` binding      |
| **UICheckbox**                   | `ui-checkbox`                        | Styled checkbox with label and two-way model                              |
| **UIRadioGroup / UIRadioButton** | `ui-radio-group` / `ui-radio-button` | Radio button group with two-way value binding                             |
| **UISlider**                     | `ui-slider`                          | Range slider supporting single-value and range modes                      |
| **UIDatePicker**                 | `ui-date-picker`                     | Calendar date picker with locale-aware formatting, min/max constraints    |
| **UITimePicker**                 | `ui-time-picker`                     | Time input supporting 12 h / 24 h modes, step intervals                   |
| **UIDateTimePicker**             | `ui-date-time-picker`                | Composite control combining date picker + time picker                     |
| **UIAutocomplete**               | `ui-autocomplete`                    | Type-ahead input with popup suggestions, chip multi-select                |
| **UIFilter**                     | `ui-filter`                          | Predicate builder (AND/OR) emitting `Predicate<T>` for datasource use     |
| **UITableView**                  | `ui-table-view`                      | Virtual-scrolling data table with sortable columns, selection, pagination |
| **UITreeView**                   | `ui-tree-view`                       | Hierarchical tree with expand/collapse, selection, keyboard navigation    |
| **UIMapView**                    | `ui-map-view`                        | Tile-based slippy map (zero-dep) with markers, polylines, polygons        |
| **UIAccordion**                  | `ui-accordion`                       | Expandable/collapsible panels (single, collapsible, multi-expand modes)   |
| **UITabGroup / UITab**           | `ui-tab-group` / `ui-tab`            | Tabbed container with lazy-rendered tab panels                            |
| **UIBadge**                      | `ui-badge`                           | Small status badge/label with colour variants                             |
| **UIChip**                       | `ui-chip`                            | Rounded tag/chip with colour and optional removable                       |
| **UIAvatar**                     | `ui-avatar`                          | Circular avatar with image, initials fallback, or Gravatar                |
| **UIIcon**                       | `ui-icon`                            | Inline SVG icon renderer with bundled icon registry                       |
| **UIBreadcrumb**                 | `ui-breadcrumb`                      | Horizontal breadcrumb navigation trail                                    |
| **UIPagination**                 | `ui-pagination`                      | Page navigation bar with page-size selector                               |
| **UIProgress**                   | `ui-progress`                        | Progress bar (determinate / indeterminate) with colour variants           |
| **UIRepeater**                   | `ui-repeater`                        | Template repeater with grid, flex-row, flex-column, masonry layouts       |
| **UIFileUpload**                 | `ui-file-upload`                     | Drag-and-drop file upload zone with accept filter and size limits         |
| **UIRichTextEditor**             | `ui-rich-text-editor`                | WYSIWYG contenteditable editor with configurable toolbar                  |
| **UIDialog**                     | `ui-dialog`                          | Modal dialog container with backdrop, size options                        |
| **UIThemeToggle**                | `ui-theme-toggle`                    | Light/dark mode toggle button with inline SVG icons                       |

### Directives

| Directive              | Selector      | Description                                                 |
| ---------------------- | ------------- | ----------------------------------------------------------- |
| **UIDensityDirective** | `[uiDensity]` | Applies density CSS tokens (compact, comfortable, generous) |
| **UITooltip**          | `[uiTooltip]` | Tooltip popup on hover/focus                                |

### Services

| Service            | Description                                        |
| ------------------ | -------------------------------------------------- |
| **PopoverService** | Opens positioned popover overlays programmatically |
| **ModalService**   | Opens modal dialogs programmatically               |

---

## Table View columns

All columns extend `UITableViewColumn` and register via DI forwarding:

| Column               | Selector             | Notes                              |
| -------------------- | -------------------- | ---------------------------------- |
| **UITextColumn**     | `ui-text-column`     | Plain text with optional truncate  |
| **UINumberColumn**   | `ui-number-column`   | Locale-aware number formatting     |
| **UIBadgeColumn**    | `ui-badge-column`    | Badge cell with variant colours    |
| **UITemplateColumn** | `ui-template-column` | Consumer-projected `<ng-template>` |

## Table View datasources

| Class                       | Description                                                            |
| --------------------------- | ---------------------------------------------------------------------- |
| `ArrayDatasource`           | In-memory datasource backed by a plain array                           |
| `FilterableArrayDatasource` | Extends `ArrayDatasource` with client-side filtering                   |
| `DatasourceAdapter`         | Adds pagination, sorting, and signal state on top of any `IDatasource` |
| `RestDatasource`            | HTTP-backed datasource for REST APIs                                   |

## Tree View datasources

| Class                 | Description                                        |
| --------------------- | -------------------------------------------------- |
| `ArrayTreeDatasource` | In-memory tree datasource backed by nested objects |

---

## Quick start

```typescript
import { UIButton, UITableView, UITextColumn } from "@theredhead/ui-kit";

@Component({
  selector: "app-demo",
  standalone: true,
  imports: [UIButton, UITableView, UITextColumn],
  template: `
    <ui-button variant="filled" (click)="load()">Refresh</ui-button>

    <ui-table-view [datasource]="adapter">
      <ui-text-column key="name" headerText="Name" [sortable]="true" />
      <ui-text-column key="email" headerText="Email" [truncate]="true" />
    </ui-table-view>
  `,
})
export class DemoComponent {
  adapter = new DatasourceAdapter(new ArrayDatasource(this.data));
}
```

---

## Features

- No external runtime UI dependency — native browser controls
- Fully typed with TypeScript
- Signal-based reactive state (`input()`, `model()`, `computed()`, `effect()`)
- Modern control flow in templates (`@if`, `@for`, `@switch`)
- OnPush change detection throughout
- Keyboard accessible with ARIA patterns
- CSS custom-property theming (`--ui-*` tokens)
- Light & dark mode support via three-tier pattern
