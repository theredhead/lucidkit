import { UIButton } from '@theredhead/lucid-kit';

@Component({
  imports: [UIButton],
  template: `
    <ui-button color="primary">Save</ui-button>
    <ui-button color="danger" variant="outlined">Delete</ui-button>
  `,
})
export class MyComponent {}
