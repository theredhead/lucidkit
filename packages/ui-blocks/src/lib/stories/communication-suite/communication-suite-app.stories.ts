import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIDemoCommunicationSuiteApp } from "./communication-suite-app";

const meta: Meta = {
  title: "@theredhead/Showcases/Communication Suite",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    hideThemeToggle: true,
    docs: {
      description: {
        component:
          "An integrated **intra- and inter-enterprise communication suite** " +
          "showcasing mail, chat, calendar, meeting planning, room reservation, " +
          "and contact management. Features a unified navigation page with sidebar, " +
          "master-detail email views, real-time chat channel layout, calendar month " +
          "view with colour-coded events, meeting cards with attendee avatars, " +
          "room reservation grid with amenity chips, and layered settings — all " +
          "driven by in-memory data.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [UIDemoCommunicationSuiteApp],
    }),
  ],
};

export default meta;
type Story = StoryObj;

/**
 * ## Communication Suite — Full-featured showcase
 *
 * A unified enterprise communication platform built with `UINavigationPage`,
 * `UIMasterDetailView`, `UICalendarMonthView`, `UITabGroup`, and `UICard`.
 *
 * ### Pages
 *
 * - **Inbox** — master-detail email view with labels, priority badges, reply actions
 * - **Sent / Drafts / Archive** — folder-specific mail views
 * - **Channels** — split-panel chat with channel list, messages, and input bar
 * - **Direct Messages** — 1:1 messaging with call/video buttons
 * - **Schedule** — interactive calendar month view with colour-coded meeting types
 * - **Meetings** — today's schedule + upcoming meeting cards + meeting creation form
 * - **Room Reservation** — room cards with amenities, availability, and booking
 * - **Contacts** — tabbed contact directory (All / Internal / External) with add form
 * - **Settings** — general, notifications, privacy, and danger zone
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-demo-communication-suite-app />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-navigation-page [items]="nav" [(activePage)]="activePage" rootLabel="ConnectHub" storageKey="storybook-nav-comms-suite">
  <ng-template #content let-node>
    @if (node.id === 'inbox') {
      <ui-master-detail-view [datasource]="inboxDs" title="Inbox" [showFilter]="true">
        <ui-template-column key="subject" headerText="Subject">
          <ng-template let-row>
            @if (!row.read) { <strong>{{ row.subject }}</strong> }
            @else { {{ row.subject }} }
          </ng-template>
        </ui-template-column>
        <ui-text-column key="from" headerText="From" />
        <ng-template #detail let-mail>
          <!-- Mail detail with body, labels, reply/forward actions -->
        </ng-template>
      </ui-master-detail-view>
    }
    @if (node.id === 'channels') {
      <!-- Channel list sidebar + UIChatView for messages & composer -->
      <ui-chat-view
        [messages]="channelMessages()"
        [currentUser]="currentUser"
        placeholder="Message #general..."
      />
    }
    @if (node.id === 'schedule') {
      <ui-calendar-month-view
        [datasource]="calendarDs"
        [(selectedDate)]="selectedDate"
      />
    }
    @if (node.id === 'meetings') {
      <!-- Today's meetings + upcoming cards + create form -->
    }
    @if (node.id === 'rooms') {
      <!-- Room cards with amenities, availability, booking -->
    }
    @if (node.id === 'contacts') {
      <!-- Contact cards with status dots, mail/chat/call buttons -->
    }
  </ng-template>
</ui-navigation-page>

// ── TypeScript ──
import { Component, signal, computed } from '@angular/core';
import {
  UINavigationPage, navItem, navGroup, type NavigationNode,
  UIMasterDetailView, UIChatView, type ChatParticipant,
} from '@theredhead/lucid-blocks';
import {
  FilterableArrayDatasource, ArrayCalendarDatasource,
  UICalendarMonthView, UITabGroup, UITab, UITabSpacer,
  UIChip, UIAvatar, UIBadge, UIBadgeColumn, UITemplateColumn,
  UIIcon, UIIcons, UICard, UICardBody, UIButton, UIInput,
} from '@theredhead/lucid-kit';

@Component({
  selector: 'app-communication-suite',
  standalone: true,
  imports: [
    UINavigationPage, UIMasterDetailView, UIChatView, UICalendarMonthView,
    UITabGroup, UITab, UITabSpacer, UIChip, UIAvatar, UIBadge,
    UIBadgeColumn, UITemplateColumn, UIIcon, UICard, UICardBody,
    UIButton, UIInput,
  ],
  templateUrl: './communication-suite.component.html',
})
export class CommunicationSuiteComponent {
  protected readonly activePage = signal('inbox');
  protected readonly selectedChannel = signal(1);
  protected readonly selectedDate = signal(new Date());
  protected readonly inboxDs = new FilterableArrayDatasource(MESSAGES);
  protected readonly calendarDs = new ArrayCalendarDatasource(EVENTS);
  protected readonly icons = {
    inbox: UIIcons.Lucide.Account.Inbox,
    mail: UIIcons.Lucide.Account.Mail,
    send: UIIcons.Lucide.Communication.Send,
    calendar: UIIcons.Lucide.Time.Calendar,
    video: UIIcons.Lucide.Communication.Video,
    users: UIIcons.Lucide.Account.Users,
    hash: UIIcons.Lucide.Social.Hash,
    building: UIIcons.Lucide.Buildings.Building2,
    settings: UIIcons.Lucide.Account.Settings,
  };
  protected readonly nav: NavigationNode[] = [
    navGroup('mail', 'Mail', [
      navItem('inbox', 'Inbox', { icon: UIIcons.Lucide.Account.Inbox }),
      navItem('sent', 'Sent', { icon: UIIcons.Lucide.Communication.Send }),
    ], { icon: UIIcons.Lucide.Account.Mail, expanded: true }),
    navGroup('chat', 'Chat', [
      navItem('channels', 'Channels', { icon: UIIcons.Lucide.Social.Hash }),
      navItem('dms', 'Direct Messages', { icon: UIIcons.Lucide.Social.MessageSquare }),
    ], { icon: UIIcons.Lucide.Social.MessagesSquare }),
    navGroup('calendar', 'Calendar', [
      navItem('schedule', 'Schedule', { icon: UIIcons.Lucide.Time.CalendarDays }),
      navItem('meetings', 'Meetings', { icon: UIIcons.Lucide.Communication.Video }),
      navItem('rooms', 'Room Reservation', { icon: UIIcons.Lucide.Buildings.Building2 }),
    ], { icon: UIIcons.Lucide.Time.Calendar }),
    navItem('contacts', 'Contacts', { icon: UIIcons.Lucide.Account.Users }),
    navItem('settings', 'Settings', { icon: UIIcons.Lucide.Account.Settings }),
  ];
}

// ── SCSS ──
/* Uses component-scoped styles. Key patterns:
   - .chat-layout: split-panel chat with channel list + message area
   - .meeting-grid: auto-fill meeting cards
   - .room-grid: room cards with amenities and availability
   - .contact-grid: contact cards with status dots
   - .mail-body: pre-wrapped email body
*/
`,
      },
    },
  },
};
