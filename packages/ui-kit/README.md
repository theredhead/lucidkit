# @sigmax/ui-kit

Core reusable UI components library for Sigmax projects using Angular Material.

## Components

### UiButtonComponent

Angular Material-based button component with multiple variants and sizes.

```typescript
import { UiButtonComponent } from '@sigmax/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UiButtonComponent],
  template: `
    <ui-button 
      label="Primary Button"
      variant="raised"
      color="primary"
      size="medium"
      (onClick)="handleClick()"
    />
    
    <ui-button 
      label="Accent Stroked"
      variant="stroked"
      color="accent"
      [isDisabled]="isDisabled()"
    />
    
    <ui-button 
      label="Loading"
      size="large"
      [isLoading]="isLoading()"
    />
  `
})
export class ExampleComponent {
  handleClick() {
    console.log('Button clicked');
  }
}
```

#### Inputs

- `label: string` - Button text (default: 'Click me')
- `variant: 'basic' | 'raised' | 'stroked' | 'flat'` - Button style (default: 'raised')
- `color: 'primary' | 'accent' | 'warn'` - Material color (default: 'primary')
- `size: 'small' | 'medium' | 'large'` - Button size (default: 'medium')
- `isDisabled: boolean` - Disable button (default: false)
- `isLoading: signal<boolean>` - Show loading spinner

#### Outputs

- `onClick: EventEmitter<void>` - Emitted on button click

## Features

✅ Built on Angular Material buttons  
✅ Fully typed with TypeScript  
✅ Signal-based reactive state  
✅ Modern control flow in templates  
✅ OnPush change detection  
✅ Material ripple effects  
✅ Keyboard accessible  
✅ Responsive design  
✅ Material color theming support

