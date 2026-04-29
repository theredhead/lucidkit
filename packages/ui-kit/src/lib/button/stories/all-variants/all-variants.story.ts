import { UIButton } from '@theredhead/lucid-kit';

@Component({
  imports: [UIButton],
  template: `
    <ui-button variant="filled">Filled</ui-button>
    <ui-button variant="outlined">Outlined</ui-button>
    <ui-button variant="ghost">Ghost</ui-button>
  `,
})
export class MyComponent {}
