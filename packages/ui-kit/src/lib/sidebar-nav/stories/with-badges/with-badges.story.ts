import { Component } from '@angular/core';
import { UISidebarNav, UISidebarItem, UIIcons } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-mailbox',
  standalone: true,
  imports: [UISidebarNav, UISidebarItem],
  template: `
    <ui-sidebar-nav>
      <ui-sidebar-item label="Inbox" [icon]="inboxIcon" badge="24" [active]="true" />
      <ui-sidebar-item label="Sent"  [icon]="sendIcon" badge="3" />
      <ui-sidebar-item label="Trash" [icon]="trashIcon" />
    </ui-sidebar-nav>
  `,
})
export class MailboxComponent {
  readonly inboxIcon = UIIcons.Lucide.Account.Inbox;
  readonly sendIcon = UIIcons.Lucide.Communication.Send;
  readonly trashIcon = UIIcons.Lucide.Files.Trash2;
}
