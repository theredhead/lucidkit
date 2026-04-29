import { UIButton } from '@theredhead/lucid-kit';

@Component({
  imports: [UIButton],
  template: `
    <ui-button variant="filled" size="small">Small</ui-button>
    <ui-button variant="filled" size="medium">Medium</ui-button>
    <ui-button variant="filled" size="large">Large</ui-button>
  `,
})
export class MyComponent {}
