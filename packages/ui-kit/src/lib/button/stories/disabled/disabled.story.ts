import { UIButton } from '@theredhead/lucid-kit';

@Component({
  imports: [UIButton],
  template: `
    <ui-button variant="filled" [disabled]="true">Disabled</ui-button>
  `,
})
export class MyComponent {}
