import { UIInput } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: `<ui-input [disabled]="true" placeholder="Cannot edit" />`,
})
export class MyComponent {}
