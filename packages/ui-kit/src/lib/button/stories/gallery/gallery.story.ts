import { UIButton } from '@theredhead/lucid-kit';

@Component({
  imports: [UIButton],
  template: `
    <ui-button color="primary" variant="filled">Save</ui-button>
    <ui-button color="danger" variant="outlined">Delete</ui-button>
    <ui-button color="neutral" variant="ghost">Cancel</ui-button>
  `,
})
export class MyComponent {}
