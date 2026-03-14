# @sigmax/ui-kit

Core reusable UI components library for Sigmax projects.

## Components

### UIButton

Native `<button>` wrapper with variant and size presets. Content is projected via `<ng-content>`.

```typescript
import { UIButton } from "@sigmax/ui-kit";

@Component({
  selector: "app-example",
  standalone: true,
  imports: [UIButton],
  template: `
    <ui-button variant="filled" size="md" (click)="handleClick()">
      Primary Button
    </ui-button>

    <ui-button variant="outlined" size="sm" [disabled]="true">
      Disabled
    </ui-button>

    <ui-button variant="ghost" size="lg"> Ghost Large </ui-button>
  `,
})
export class ExampleComponent {
  handleClick() {
    console.log("Button clicked");
  }
}
```

#### Inputs

- `variant: 'filled' | 'outlined' | 'ghost'` – Visual style (default: `'filled'`)
- `size: 'sm' | 'md' | 'lg'` – Size preset (default: `'md'`)
- `type: 'button' | 'submit' | 'reset'` – Native button type (default: `'button'`)
- `disabled: boolean` – Disable button (default: `false`)

### UISelect

Native `<select>` wrapper with two-way `[(value)]` binding.

### UIInput

Native `<input>` wrapper supporting text, number, and date types with two-way `[(value)]` binding.

### UIFilter

macOS Finder-style predicate builder. Emits a `Predicate<T>` for use with `FilterableArrayDatasource`.

### UITableView

Virtual-scrolling table with column resize, selection, sorting, and filtering support.

## Features

✅ No Material dependency — native browser controls
✅ Fully typed with TypeScript
✅ Signal-based reactive state
✅ Modern control flow in templates
✅ OnPush change detection
✅ Keyboard accessible
✅ CSS custom-property theming (`--tv-*` tokens)
✅ Light & dark mode support
