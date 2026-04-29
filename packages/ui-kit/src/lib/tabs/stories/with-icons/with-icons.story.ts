import { Component } from '@angular/core';
import { UITabGroup, UITab, UIIcons } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITabGroup, UITab],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  protected readonly icons = {
    house: UIIcons.Lucide.Buildings.House,
    activity: UIIcons.Lucide.Account.Activity,
    settings: UIIcons.Lucide.Account.Settings,
  } as const;
}
