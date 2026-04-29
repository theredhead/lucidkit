import { Component } from '@angular/core';
import { UITabGroup, UITab, UITabSeparator, UITabSpacer, UIIcons } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITabGroup, UITab, UITabSeparator, UITabSpacer],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  protected readonly icons = {
    inbox: UIIcons.Lucide.Mail.Inbox,
    send: UIIcons.Lucide.Mail.Send,
    archive: UIIcons.Lucide.Mail.Archive,
    settings: UIIcons.Lucide.Account.Settings,
    help: UIIcons.Lucide.Accessibility.BadgeQuestionMark,
    home: UIIcons.Lucide.Buildings.House,
    search: UIIcons.Lucide.Social.Search,
    bell: UIIcons.Lucide.Account.Bell,
    user: UIIcons.Lucide.Account.User,
  } as const;
}
