import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import communicationSuiteData from "./data/communication-suite-app.data.json";

import {
	ArrayCalendarDatasource,
	type CalendarEvent,
	FilterableArrayDatasource,
	UIAccordion,
	UIAccordionItem,
	UIAvatar,
	UIBadge,
	UIBadgeColumn,
	UIButton,
	UICalendarMonthView,
	UICard,
	UICardBody,
	UICardFooter,
	UICardHeader,
	UICheckbox,
	UIChip,
	UIIcon,
	UIIcons,
	UIInput,
	UIProgress,
	UIDropdownList,
	type SelectOption,
	UITabGroup,
	UITab,
	UITabSeparator,
	UITabSpacer,
	UITemplateColumn,
	UITextColumn,
	UIToggle,
} from "@theredhead/lucid-kit";

import { UIChatView } from "../chat-view/chat-view.component";
import type {
	ChatMessage as ChatViewMessage,
	ChatParticipant,
} from "../chat-view/chat-view.types";
import { UIMasterDetailView } from "../master-detail-view/master-detail-view.component";
import { UINavigationPage } from "./navigation-page.component";
import {
	navItem,
	navGroup,
	type NavigationNode,
} from "./navigation-page.utils";

// ── Domain types ─────────────────────────────────────────────────────

interface MailMessage {
	readonly id: number;
	readonly from: string;
	readonly fromEmail: string;
	readonly to: string;
	readonly toEmail: string;
	readonly subject: string;
	readonly preview: string;
	readonly body: string;
	readonly date: string;
	readonly read: boolean;
	readonly starred: boolean;
	readonly folder: "inbox" | "sent" | "drafts" | "archive" | "trash";
	readonly labels: readonly string[];
	readonly hasAttachment: boolean;
	readonly priority: "low" | "normal" | "high" | "urgent";
}

interface Contact {
	readonly id: number;
	readonly name: string;
	readonly email: string;
	readonly department: string;
	readonly title: string;
	readonly phone: string;
	readonly avatar: string;
	readonly status: "online" | "busy" | "away" | "offline";
	readonly company: string;
	readonly external: boolean;
}

interface ChatChannel {
	readonly id: number;
	readonly name: string;
	readonly type: "direct" | "group" | "channel";
	readonly members: number;
	readonly lastMessage: string;
	readonly lastSender: string;
	readonly lastTime: string;
	readonly unread: number;
	readonly description: string;
	readonly pinned: boolean;
}

interface ChatMessage {
	readonly id: number;
	readonly channelId: number;
	readonly sender: string;
	readonly text: string;
	readonly time: string;
	readonly reactions: readonly string[];
}

interface Meeting {
	readonly id: number;
	readonly title: string;
	readonly organizer: string;
	readonly date: string;
	readonly startTime: string;
	readonly endTime: string;
	readonly type: "virtual" | "in-person" | "hybrid";
	readonly room: string;
	readonly link: string;
	readonly attendees: readonly string[];
	readonly status: "confirmed" | "tentative" | "cancelled";
	readonly description: string;
	readonly recurring: boolean;
	readonly recurrence: string;
}

interface Room {
	readonly id: number;
	readonly name: string;
	readonly building: string;
	readonly floor: number;
	readonly capacity: number;
	readonly amenities: readonly string[];
	readonly available: boolean;
	readonly nextAvailable: string;
	readonly image: string;
}

// ── External data ───────────────────────────────────────────────────

const CONTACTS = communicationSuiteData.contacts as Contact[];
const MAIL_MESSAGES = communicationSuiteData.mailMessages as MailMessage[];
const CHAT_CHANNELS = communicationSuiteData.chatChannels as ChatChannel[];
const CHAT_MESSAGES = communicationSuiteData.chatMessages as ChatMessage[];
const currentUserData = communicationSuiteData.currentUser as {
	readonly id: string;
	readonly name: string;
};

const CURRENT_USER: ChatParticipant = {
	id: currentUserData.id,
	name: currentUserData.name,
	avatarEmail: "kris.thompson@acme.com",
};

const CHAT_PARTICIPANTS: Record<string, ChatParticipant> = Object.fromEntries(
	CONTACTS.map((contact) => [
		contact.name,
		{
			id: `contact-${contact.id}`,
			name: contact.name,
			avatarEmail: contact.email,
		},
	]),
) as Record<string, ChatParticipant>;

CHAT_PARTICIPANTS[CURRENT_USER.name] = CURRENT_USER;

function toChatViewMessages(msgs: ChatMessage[]): ChatViewMessage[] {
	const today = new Date("2026-03-25");
	return msgs.map((m) => {
		const match = m.time.match(/(\d+):(\d+)(?:\s*(AM|PM))?/i);
		let hour = match ? parseInt(match[1], 10) : 0;
		const minute = match ? parseInt(match[2], 10) : 0;
		const meridiem = match?.[3]?.toUpperCase();
		if (meridiem === "PM" && hour < 12) {
			hour += 12;
		}
		if (meridiem === "AM" && hour === 12) {
			hour = 0;
		}
		const ts = new Date(today);
		ts.setHours(hour, minute, 0, 0);
		return {
			id: String(m.id),
			content: m.text,
			timestamp: ts,
			sender: CHAT_PARTICIPANTS[m.sender] ?? {
				id: m.sender.toLowerCase().replace(/\s/g, "-"),
				name: m.sender,
			},
		};
	});
}

const MEETINGS = communicationSuiteData.meetings as Meeting[];
const ROOMS = communicationSuiteData.rooms as Room[];

// ── Calendar events (generated from meetings) ────────────────────────

function meetingDate(dateStr: string, time: string): Date {
  return new Date(`${dateStr}T${time}:00`);
}

function meetingColor(type: string): string {
  switch (type) {
    case "virtual":
      return "#3584e4";
    case "in-person":
      return "#2ec27e";
    case "hybrid":
      return "#e5a50a";
    default:
      return "#888";
  }
}

const CALENDAR_EVENTS: CalendarEvent<Meeting>[] = MEETINGS.map((m) => ({
  id: String(m.id),
  title: m.title,
  start: meetingDate(m.date, m.startTime),
  end: meetingDate(m.date, m.endTime),
  color: meetingColor(m.type),
  payload: m,
}));

// ── Derived constants ────────────────────────────────────────────────

const UNREAD_COUNT = MAIL_MESSAGES.filter(
  (m) => !m.read && m.folder === "inbox",
).length;

const DEPARTMENTS = [...new Set(CONTACTS.map((c) => c.department))].sort();

// ── Icon constants ───────────────────────────────────────────────────

const ICONS = {
  // Mail
  mail: UIIcons.Lucide.Account.Mail,
  inbox: UIIcons.Lucide.Account.Inbox,
  send: UIIcons.Lucide.Communication.Send,
  star: UIIcons.Lucide.Social.Star,
  archive: UIIcons.Lucide.Files.FolderArchive,
  trash: UIIcons.Lucide.Files.Trash2,
  fileText: UIIcons.Lucide.Files.FileText,
  attachment: UIIcons.Lucide.Files.Paperclip,
  reply: UIIcons.Lucide.Arrows.CornerUpLeft,
  replyAll: UIIcons.Lucide.Arrows.CornerDownLeft,
  forward: UIIcons.Lucide.Arrows.CornerUpRight,
  tag: UIIcons.Lucide.Account.Tag,

  // Chat
  messageCircle: UIIcons.Lucide.Social.MessageCircle,
  messagesSquare: UIIcons.Lucide.Social.MessagesSquare,
  messageSquare: UIIcons.Lucide.Social.MessageSquare,
  hash: UIIcons.Lucide.Social.Hash,
  pin: UIIcons.Lucide.Navigation.Pin,
  smile: UIIcons.Lucide.Account.Smile,

  // Calendar & Meetings
  calendar: UIIcons.Lucide.Time.Calendar,
  calendarDays: UIIcons.Lucide.Time.CalendarDays,
  calendarCheck: UIIcons.Lucide.Time.CalendarCheck,
  calendarPlus: UIIcons.Lucide.Time.CalendarPlus,
  clock: UIIcons.Lucide.Time.Clock,
  video: UIIcons.Lucide.Communication.Video,
  phone: UIIcons.Lucide.Communication.Phone,
  presentation: UIIcons.Lucide.Communication.Presentation,

  // Rooms
  building: UIIcons.Lucide.Buildings.Building2,
  hotel: UIIcons.Lucide.Buildings.Hotel,

  // People
  users: UIIcons.Lucide.Account.Users,
  user: UIIcons.Lucide.Account.User,
  contact: UIIcons.Lucide.Communication.Contact,
  userPlus: UIIcons.Lucide.Account.UserPlus,

  // General
  settings: UIIcons.Lucide.Account.Settings,
  bell: UIIcons.Lucide.Account.Bell,
  search: UIIcons.Lucide.Social.Search,
  plus: UIIcons.Lucide.Math.Plus,
  globe: UIIcons.Lucide.Navigation.Globe,
  link: UIIcons.Lucide.Account.Link,
  shield: UIIcons.Lucide.Account.Shield,
  circleCheck: UIIcons.Lucide.Notifications.CircleCheck,
  triangleAlert: UIIcons.Lucide.Notifications.TriangleAlert,
  monitor: UIIcons.Lucide.Devices.Monitor,
  mapPin: UIIcons.Lucide.Account.MapPin,
} as const;

// ── Navigation structure ─────────────────────────────────────────────

const NAV: NavigationNode[] = [
  navGroup(
    "mail-section",
    "Mail",
    [
      navItem("inbox", "Inbox", {
        icon: ICONS.inbox,
        badge: UNREAD_COUNT > 0 ? String(UNREAD_COUNT) : undefined,
      }),
      navItem("sent", "Sent", { icon: ICONS.send }),
      navItem("drafts", "Drafts", {
        icon: ICONS.fileText,
        badge:
          MAIL_MESSAGES.filter((m) => m.folder === "drafts").length > 0
            ? String(MAIL_MESSAGES.filter((m) => m.folder === "drafts").length)
            : undefined,
      }),
      navItem("archive", "Archive", { icon: ICONS.archive }),
    ],
    { icon: ICONS.mail, expanded: true },
  ),
  navGroup(
    "chat-section",
    "Chat",
    [
      navItem("channels", "Channels", {
        icon: ICONS.hash,
        badge: String(CHAT_CHANNELS.filter((c) => c.type === "channel").length),
      }),
      navItem("direct-messages", "Direct Messages", {
        icon: ICONS.messageSquare,
      }),
    ],
    { icon: ICONS.messagesSquare, expanded: true },
  ),
  navGroup(
    "calendar-section",
    "Calendar",
    [
      navItem("schedule", "Schedule", { icon: ICONS.calendarDays }),
      navItem("meetings", "Meetings", {
        icon: ICONS.video,
        badge: String(MEETINGS.filter((m) => m.status === "confirmed").length),
      }),
      navItem("rooms", "Room Reservation", { icon: ICONS.building }),
    ],
    { icon: ICONS.calendar, expanded: true },
  ),
  navItem("contacts", "Contacts", {
    icon: ICONS.users,
    badge: String(CONTACTS.length),
  }),
  navItem("settings", "Settings", { icon: ICONS.settings }),
];

// ── Helper functions ─────────────────────────────────────────────────

function statusColor(s: string): "success" | "warning" | "danger" | "neutral" {
  switch (s) {
    case "online":
      return "success";
    case "busy":
      return "danger";
    case "away":
      return "warning";
    default:
      return "neutral";
  }
}

function meetingTypeColor(
  t: string,
): "primary" | "success" | "warning" | "neutral" {
  switch (t) {
    case "virtual":
      return "primary";
    case "in-person":
      return "success";
    case "hybrid":
      return "warning";
    default:
      return "neutral";
  }
}

function meetingStatusColor(
  s: string,
): "success" | "warning" | "danger" | "neutral" {
  switch (s) {
    case "confirmed":
      return "success";
    case "tentative":
      return "warning";
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
}

function priorityColor(
  p: string,
): "danger" | "warning" | "neutral" | "primary" {
  switch (p) {
    case "urgent":
      return "danger";
    case "high":
      return "warning";
    case "normal":
      return "neutral";
    case "low":
      return "primary";
    default:
      return "neutral";
  }
}

function channelIcon(type: string): string {
  switch (type) {
    case "channel":
      return ICONS.hash;
    case "direct":
      return ICONS.user;
    case "group":
      return ICONS.users;
    default:
      return ICONS.messageCircle;
  }
}

// ── Demo component ───────────────────────────────────────────────────

@Component({
  selector: "ui-demo-communication-suite-app",
  standalone: true,
  imports: [
    UINavigationPage,
    UIChatView,
    UIMasterDetailView,
    UICalendarMonthView,
    UITabGroup,
    UITab,
    UITabSeparator,
    UITabSpacer,
    UIButton,
    UIIcon,
    UIInput,
    UIDropdownList,
    UICheckbox,
    UIToggle,
    UIBadge,
    UIChip,
    UIAvatar,
    UICard,
    UICardHeader,
    UICardBody,
    UICardFooter,
    UIAccordion,
    UIAccordionItem,
    UIProgress,
    UITextColumn,
    UITemplateColumn,
    UIBadgeColumn,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        overflow: hidden;
      }

      .page-fill {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .page-fill > ui-tab-group {
        flex: 1;
        min-height: 0;
      }

      .page-fill > ui-tab-group ::ng-deep .panel {
        display: flex;
        flex-direction: column;
      }

      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 1.25rem;
      }
      .page-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .page-title h2 {
        margin: 0;
        font-size: 1.35rem;
        font-weight: 700;
      }
      .page-actions {
        display: flex;
        gap: 0.5rem;
      }

      /* Master-detail wrapper */
      .mdv-wrap {
        flex: 1;
        min-height: 0;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
        overflow: hidden;
      }

      /* Detail pane */
      .detail-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .detail-name {
        font-size: 1.15rem;
        font-weight: 700;
        margin: 0;
      }
      .detail-sub {
        font-size: 0.82rem;
        opacity: 0.65;
        margin: 0.15rem 0 0;
      }
      .detail-grid {
        display: grid;
        grid-template-columns: 9rem 1fr;
        gap: 0.35rem 1rem;
        font-size: 0.88rem;
      }
      .detail-grid dt {
        font-weight: 600;
        margin: 0;
      }
      .detail-grid dd {
        margin: 0;
      }

      /* Scroll area */
      .scroll-area {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding-right: 0.25rem;
      }

      /* Stats grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .stat-value {
        font-size: 1.75rem;
        font-weight: 800;
        margin: 0.25rem 0;
      }
      .stat-label {
        font-size: 0.78rem;
        opacity: 0.65;
      }
      .stat-icon-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      /* Tags row */
      .tags-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-top: 0.5rem;
      }

      /* ── Mail-specific ── */

      .mail-body {
        white-space: pre-wrap;
        line-height: 1.65;
        font-size: 0.92rem;
        padding: 1rem 0;
        border-top: 1px solid var(--ui-border, #d7dce2);
        margin-top: 0.75rem;
      }
      .mail-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--ui-border, #d7dce2);
      }
      .mail-meta-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.82rem;
        opacity: 0.65;
        margin-top: 0.25rem;
      }

      /* ── Chat-specific ── */

      .chat-layout {
        display: flex;
        gap: 1rem;
        height: 100%;
      }
      .chat-channel-list {
        width: 280px;
        flex-shrink: 0;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
        overflow-y: auto;
      }
      .chat-channel-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        cursor: pointer;
        border-bottom: 1px solid var(--ui-border, #d7dce2);
        transition: background 0.12s;
      }
      .chat-channel-item:hover {
        background: color-mix(
          in srgb,
          var(--ui-accent, #3584e4) 6%,
          transparent
        );
      }
      .chat-channel-item:last-child {
        border-bottom: none;
      }
      .chat-channel-item-active {
        background: color-mix(
          in srgb,
          var(--ui-accent, #3584e4) 10%,
          transparent
        );
      }
      .chat-channel-info {
        flex: 1;
        min-width: 0;
      }
      .chat-channel-name {
        font-weight: 600;
        font-size: 0.88rem;
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }
      .chat-channel-preview {
        font-size: 0.78rem;
        opacity: 0.6;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .chat-channel-time {
        font-size: 0.72rem;
        opacity: 0.5;
        white-space: nowrap;
      }
      .chat-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      .chat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--ui-border, #d7dce2);
        font-weight: 600;
      }
      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .chat-msg {
        display: flex;
        gap: 0.75rem;
      }
      .chat-msg-content {
        flex: 1;
      }
      .chat-msg-sender {
        font-weight: 600;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .chat-msg-time {
        font-weight: 400;
        font-size: 0.72rem;
        opacity: 0.5;
      }
      .chat-msg-text {
        font-size: 0.88rem;
        line-height: 1.45;
        margin-top: 0.15rem;
      }
      .chat-input-bar {
        display: flex;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border-top: 1px solid var(--ui-border, #d7dce2);
      }
      .chat-input-bar ui-input {
        flex: 1;
      }
      .chat-main ui-chat-view {
        flex: 1;
        min-height: 0;
        border: none;
        border-radius: 0;
      }

      /* ── Calendar / Schedule ── */

      .calendar-wrap {
        flex: 1;
        min-height: 0;
      }

      /* ── Meeting cards ── */

      .meeting-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1rem;
      }
      .meeting-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
      }
      .meeting-time {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.82rem;
        margin: 0.5rem 0;
        opacity: 0.75;
      }
      .meeting-attendees {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-top: 0.5rem;
      }
      .meeting-meta-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.82rem;
        margin-top: 0.35rem;
      }

      /* ── Room cards ── */

      .room-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
      }
      .room-card-header {
        height: 100px;
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--ui-accent, #3584e4) 20%, transparent),
          color-mix(in srgb, var(--ui-accent, #3584e4) 6%, transparent)
        );
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px 6px 0 0;
      }
      .room-amenities {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-top: 0.5rem;
      }
      .room-availability {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.82rem;
        margin-top: 0.5rem;
      }

      /* ── Contact cards ── */

      .contact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
      }
      .contact-card-top {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .contact-name {
        font-weight: 600;
      }
      .contact-title-dept {
        font-size: 0.78rem;
        opacity: 0.65;
      }
      .contact-actions-row {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.75rem;
      }
      .contact-status-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 0.35rem;
      }
      .contact-status-dot-online {
        background: #2ec27e;
      }
      .contact-status-dot-busy {
        background: #e5392f;
      }
      .contact-status-dot-away {
        background: #e5a50a;
      }
      .contact-status-dot-offline {
        background: #999;
      }

      /* ── Compose ── */

      .compose-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 42rem;
      }
      .compose-field {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .field-label {
        font-size: 0.82rem;
        font-weight: 600;
      }
      .compose-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }

      /* ── Category strip ── */

      .category-strip {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }

      /* ── Settings ── */

      .settings-grid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 36rem;
      }
      .setting-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 0.5rem;
        font-size: 0.88rem;
      }
      .setting-label {
        font-weight: 600;
      }
      .setting-desc {
        font-size: 0.78rem;
        opacity: 0.65;
        margin-top: 0.15rem;
      }

      /* ── Today strip ── */

      .today-meetings {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .today-meeting-card {
        display: flex;
        gap: 1rem;
        padding: 0.75rem 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 0.5rem;
        align-items: center;
      }
      .today-meeting-time {
        font-weight: 700;
        font-size: 0.88rem;
        min-width: 6rem;
        text-align: center;
      }
      .today-meeting-info {
        flex: 1;
      }
      .today-meeting-title {
        font-weight: 600;
      }
      .today-meeting-sub {
        font-size: 0.78rem;
        opacity: 0.65;
        margin-top: 0.15rem;
      }
    `,
  ],
  template: `
    <ui-navigation-page
      [items]="nav"
      [(activePage)]="activePage"
      rootLabel="ConnectHub"
      storageKey="storybook-nav-comms-suite"
    >
      <ng-template #content let-node>
        <!-- ─── Inbox ─── -->
        @if (node.id === "inbox") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.inbox" [size]="24" />
                <h2>Inbox</h2>
                <ui-badge
                  variant="count"
                  [count]="unreadCount"
                  color="primary"
                />
              </div>
              <div class="page-actions">
                <ui-button variant="filled" (click)="activePage.set('compose')">
                  <ui-icon [svg]="icons.plus" [size]="16" /> Compose
                </ui-button>
              </div>
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="inboxDs"
                title="Inbox"
                [showFilter]="true"
                [rowHeight]="56"
                placeholder="Select a message to read..."
              >
                <ui-template-column key="subject" headerText="Subject">
                  <ng-template let-row>
                    <div
                      style="display: flex; flex-direction: column; padding-top: 6px; padding-bottom: 6px; width: 100%;"
                    >
                      <div
                        style="display: flex; align-items: center; gap: 0.5rem;"
                      >
                        @if (!row.read) {
                          <strong>{{ row.subject }}</strong>
                        } @else {
                          <span>{{ row.subject }}</span>
                        }
                        <div style="flex: 1 1 auto;"></div>
                        @if (row.hasAttachment) {
                          <ui-icon [svg]="icons.attachment" [size]="13" />
                        }
                        @if (row.starred) {
                          <ui-icon [svg]="icons.star" [size]="13" />
                        }
                      </div>
                      <div style="display: flex; flex-direction: row;">
                        <div>{{ row.from }}</div>
                        <div style="flex: 1 1 auto;"></div>
                        <div>{{ row.date }}</div>
                      </div>
                    </div>
                  </ng-template>
                </ui-template-column>

                <ng-template #detail let-mail>
                  <div class="detail-header">
                    <ui-avatar [name]="mail.from" [size]="40" />
                    <div>
                      <h3 class="detail-name">{{ mail.subject }}</h3>
                      <div class="mail-meta-row">
                        <span
                          >{{ mail.from }} &lt;{{ mail.fromEmail }}&gt;</span
                        >
                        <span>{{ mail.date }}</span>
                      </div>
                      <div class="mail-meta-row">
                        <span
                          >To: {{ mail.to }} &lt;{{ mail.toEmail }}&gt;</span
                        >
                        @if (mail.priority !== "normal") {
                          <ui-badge [color]="priorityColor(mail.priority)">
                            {{ mail.priority }}
                          </ui-badge>
                        }
                      </div>
                    </div>
                  </div>

                  <div class="tags-row">
                    @for (label of mail.labels; track label) {
                      <ui-chip color="primary" size="small">{{
                        label
                      }}</ui-chip>
                    }
                  </div>

                  <div class="mail-body">{{ mail.body }}</div>

                  <div class="mail-actions">
                    <ui-button variant="outline" size="small">
                      <ui-icon [svg]="icons.reply" [size]="14" /> Reply
                    </ui-button>
                    <ui-button variant="outline" size="small">
                      <ui-icon [svg]="icons.replyAll" [size]="14" /> Reply All
                    </ui-button>
                    <ui-button variant="outline" size="small">
                      <ui-icon [svg]="icons.forward" [size]="14" /> Forward
                    </ui-button>
                    <ui-button variant="ghost" size="small">
                      <ui-icon [svg]="icons.archive" [size]="14" /> Archive
                    </ui-button>
                    <ui-button variant="ghost" size="small" color="danger">
                      <ui-icon [svg]="icons.trash" [size]="14" /> Delete
                    </ui-button>
                  </div>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── Sent ─── -->
        @if (node.id === "sent") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.send" [size]="24" />
                <h2>Sent</h2>
              </div>
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="sentDs"
                title="Sent Messages"
                [showFilter]="true"
                placeholder="Select a sent message..."
              >
                <ui-template-column key="subject" headerText="Subject">
                  <ng-template let-row>
                    <div
                      style="display: flex; align-items: center; gap: 0.5rem;"
                    >
                      {{ row.subject }}
                      @if (row.hasAttachment) {
                        <ui-icon [svg]="icons.attachment" [size]="13" />
                      }
                    </div>
                  </ng-template>
                </ui-template-column>
                <ui-text-column key="to" headerText="To" />
                <ui-text-column key="date" headerText="Date" />

                <ng-template #detail let-mail>
                  <div class="detail-header">
                    <ui-avatar [name]="mail.to" [size]="40" />
                    <div>
                      <h3 class="detail-name">{{ mail.subject }}</h3>
                      <div class="mail-meta-row">
                        <span
                          >To: {{ mail.to }} &lt;{{ mail.toEmail }}&gt;</span
                        >
                        <span>{{ mail.date }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="mail-body">{{ mail.body }}</div>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── Drafts ─── -->
        @if (node.id === "drafts") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.fileText" [size]="24" />
                <h2>Drafts</h2>
              </div>
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="draftsDs"
                title="Drafts"
                placeholder="Select a draft to continue editing..."
              >
                <ui-text-column key="subject" headerText="Subject" />
                <ui-text-column key="to" headerText="To" />
                <ui-text-column key="date" headerText="Date" />

                <ng-template #detail let-mail>
                  <h3 class="detail-name">{{ mail.subject }}</h3>
                  <div class="mail-meta-row" style="margin-bottom: 0.5rem;">
                    <span>To: {{ mail.to }}</span>
                  </div>
                  <div class="mail-body">{{ mail.body }}</div>
                  <div class="mail-actions">
                    <ui-button variant="filled">Edit Draft</ui-button>
                    <ui-button variant="ghost" color="danger"
                      >Discard</ui-button
                    >
                  </div>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── Archive ─── -->
        @if (node.id === "archive") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.archive" [size]="24" />
                <h2>Archive</h2>
              </div>
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="archiveDs"
                title="Archived Messages"
                [showFilter]="true"
                placeholder="Select an archived message..."
              >
                <ui-text-column key="subject" headerText="Subject" />
                <ui-text-column key="from" headerText="From" />
                <ui-text-column key="date" headerText="Date" />

                <ng-template #detail let-mail>
                  <div class="detail-header">
                    <ui-avatar [name]="mail.from" [size]="40" />
                    <div>
                      <h3 class="detail-name">{{ mail.subject }}</h3>
                      <div class="mail-meta-row">
                        <span>{{ mail.from }}</span>
                        <span>{{ mail.date }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="tags-row">
                    @for (label of mail.labels; track label) {
                      <ui-chip color="neutral" size="small">{{
                        label
                      }}</ui-chip>
                    }
                  </div>
                  <div class="mail-body">{{ mail.body }}</div>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── Chat — Channels ─── -->
        @if (node.id === "channels") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.hash" [size]="24" />
                <h2>Channels</h2>
              </div>
              <div class="page-actions">
                <ui-input
                  placeholder="Search channels..."
                  ariaLabel="Search channels"
                  style="width: 200px"
                />
              </div>
            </div>

            <div class="chat-layout">
              <div class="chat-channel-list">
                @for (ch of chatChannels; track ch.id) {
                  <div
                    class="chat-channel-item"
                    [class.chat-channel-item-active]="
                      selectedChannel() === ch.id
                    "
                    (click)="selectedChannel.set(ch.id)"
                    (keydown.enter)="selectedChannel.set(ch.id)"
                    tabindex="0"
                    role="button"
                  >
                    <ui-icon [svg]="channelIcon(ch.type)" [size]="18" />
                    <div class="chat-channel-info">
                      <div class="chat-channel-name">
                        {{ ch.name }}
                        @if (ch.pinned) {
                          <ui-icon [svg]="icons.pin" [size]="12" />
                        }
                      </div>
                      <div class="chat-channel-preview">
                        {{ ch.lastSender }}: {{ ch.lastMessage }}
                      </div>
                    </div>
                    <div
                      style="display: flex; flex-direction: column; align-items: end; gap: 0.25rem;"
                    >
                      <span class="chat-channel-time">{{ ch.lastTime }}</span>
                      @if (ch.unread > 0) {
                        <ui-badge
                          variant="count"
                          [count]="ch.unread"
                          color="primary"
                        />
                      }
                    </div>
                  </div>
                }
              </div>

              <div class="chat-main">
                @if (activeChannel(); as ch) {
                  <div class="chat-header">
                    <div
                      style="display: flex; align-items: center; gap: 0.5rem;"
                    >
                      <ui-icon [svg]="channelIcon(ch.type)" [size]="18" />
                      <span>{{ ch.name }}</span>
                      <ui-badge color="neutral"
                        >{{ ch.members }} members</ui-badge
                      >
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                      <ui-button
                        variant="ghost"
                        size="small"
                        ariaLabel="Search"
                      >
                        <ui-icon [svg]="icons.search" [size]="16" />
                      </ui-button>
                      <ui-button
                        variant="ghost"
                        size="small"
                        ariaLabel="Members"
                      >
                        <ui-icon [svg]="icons.users" [size]="16" />
                      </ui-button>
                    </div>
                  </div>
                  <ui-chat-view
                    [messages]="channelMessages()"
                    [currentUser]="currentUser"
                    [placeholder]="'Message #' + ch.name + '...'"
                    [ariaLabel]="'Chat in ' + ch.name"
                  />
                }
              </div>
            </div>
          </div>
        }

        <!-- ─── Chat — Direct Messages ─── -->
        @if (node.id === "direct-messages") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.messageSquare" [size]="24" />
                <h2>Direct Messages</h2>
              </div>
            </div>

            <div class="chat-layout">
              <div class="chat-channel-list">
                @for (ch of directMessages; track ch.id) {
                  <div
                    class="chat-channel-item"
                    [class.chat-channel-item-active]="selectedDm() === ch.id"
                    (click)="selectedDm.set(ch.id)"
                    (keydown.enter)="selectedDm.set(ch.id)"
                    tabindex="0"
                    role="button"
                  >
                    <ui-avatar [name]="ch.name" [size]="28" />
                    <div class="chat-channel-info">
                      <div class="chat-channel-name">{{ ch.name }}</div>
                      <div class="chat-channel-preview">
                        {{ ch.lastMessage }}
                      </div>
                    </div>
                    <div
                      style="display: flex; flex-direction: column; align-items: end; gap: 0.25rem;"
                    >
                      <span class="chat-channel-time">{{ ch.lastTime }}</span>
                      @if (ch.unread > 0) {
                        <ui-badge
                          variant="count"
                          [count]="ch.unread"
                          color="primary"
                        />
                      }
                    </div>
                  </div>
                }
              </div>

              <div class="chat-main">
                @if (activeDm(); as dm) {
                  <div class="chat-header">
                    <div
                      style="display: flex; align-items: center; gap: 0.5rem;"
                    >
                      <ui-avatar [name]="dm.name" [size]="24" />
                      <span>{{ dm.name }}</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                      <ui-button variant="ghost" size="small" ariaLabel="Call">
                        <ui-icon [svg]="icons.phone" [size]="16" />
                      </ui-button>
                      <ui-button
                        variant="ghost"
                        size="small"
                        ariaLabel="Video call"
                      >
                        <ui-icon [svg]="icons.video" [size]="16" />
                      </ui-button>
                    </div>
                  </div>
                  <ui-chat-view
                    [messages]="dmMessages()"
                    [currentUser]="currentUser"
                    [placeholder]="'Message ' + dm.name + '...'"
                    [ariaLabel]="'Chat with ' + dm.name"
                  />
                }
              </div>
            </div>
          </div>
        }

        <!-- ─── Schedule (Calendar) ─── -->
        @if (node.id === "schedule") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.calendarDays" [size]="24" />
                <h2>Schedule</h2>
              </div>
              <div class="page-actions">
                <ui-button variant="filled">
                  <ui-icon [svg]="icons.calendarPlus" [size]="16" /> New Event
                </ui-button>
              </div>
            </div>

            <div class="category-strip">
              <ui-chip color="primary" size="small">
                <span
                  style="display: inline-block; width:8px; height:8px; border-radius:50%; background:#3584e4; margin-right:0.35rem;"
                ></span>
                Virtual
              </ui-chip>
              <ui-chip color="success" size="small">
                <span
                  style="display: inline-block; width:8px; height:8px; border-radius:50%; background:#2ec27e; margin-right:0.35rem;"
                ></span>
                In-Person
              </ui-chip>
              <ui-chip color="warning" size="small">
                <span
                  style="display: inline-block; width:8px; height:8px; border-radius:50%; background:#e5a50a; margin-right:0.35rem;"
                ></span>
                Hybrid
              </ui-chip>
            </div>

            <div class="calendar-wrap">
              <ui-calendar-month-view
                [datasource]="calendarDs"
                [(selectedDate)]="selectedDate"
                ariaLabel="Meeting schedule"
              />
            </div>
          </div>
        }

        <!-- ─── Meetings ─── -->
        @if (node.id === "meetings") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.video" [size]="24" />
                <h2>Meetings</h2>
                <ui-badge
                  variant="count"
                  [count]="confirmedMeetings.length"
                  color="primary"
                />
              </div>
              <div class="page-actions">
                <ui-button variant="filled">
                  <ui-icon [svg]="icons.plus" [size]="16" /> Schedule Meeting
                </ui-button>
              </div>
            </div>

            <ui-tab-group panelStyle="flat">
              <ui-tab label="Today" [icon]="icons.clock">
                <div class="today-meetings" style="padding-top: 0.5rem;">
                  @for (m of todayMeetings; track m.id) {
                    <div class="today-meeting-card">
                      <div class="today-meeting-time">
                        {{ m.startTime }} - {{ m.endTime }}
                      </div>
                      <div class="today-meeting-info">
                        <div class="today-meeting-title">{{ m.title }}</div>
                        <div class="today-meeting-sub">
                          <ui-badge
                            [color]="meetingTypeColor(m.type)"
                            size="small"
                          >
                            {{ m.type }}
                          </ui-badge>
                          @if (m.room) {
                            <span> {{ m.room }}</span>
                          }
                          @if (m.link) {
                            <span> · {{ m.attendees.length }} attendees</span>
                          }
                        </div>
                      </div>
                      <div style="display: flex; gap: 0.35rem;">
                        @if (m.type !== "in-person") {
                          <ui-button variant="filled" size="small">
                            <ui-icon [svg]="icons.video" [size]="14" /> Join
                          </ui-button>
                        }
                        <ui-badge [color]="meetingStatusColor(m.status)">
                          {{ m.status }}
                        </ui-badge>
                      </div>
                    </div>
                  } @empty {
                    <div
                      style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem 0; opacity: 0.5;"
                    >
                      <ui-icon [svg]="icons.calendarCheck" [size]="48" />
                      <p style="margin-top: 1rem;">
                        No meetings scheduled for today
                      </p>
                    </div>
                  }
                </div>
              </ui-tab>

              <ui-tab label="Upcoming" [icon]="icons.calendarDays">
                <div class="scroll-area" style="padding-top: 0.5rem;">
                  <div class="meeting-grid">
                    @for (m of allMeetings; track m.id) {
                      <ui-card variant="outlined">
                        <ui-card-body>
                          <div class="meeting-header">
                            <strong>{{ m.title }}</strong>
                            <ui-badge [color]="meetingTypeColor(m.type)">
                              {{ m.type }}
                            </ui-badge>
                          </div>
                          <div class="meeting-time">
                            <ui-icon [svg]="icons.clock" [size]="14" />
                            {{ m.date }} · {{ m.startTime }} - {{ m.endTime }}
                          </div>
                          <div class="meeting-meta-row">
                            <ui-icon [svg]="icons.user" [size]="14" />
                            Organizer: {{ m.organizer }}
                          </div>
                          @if (m.room) {
                            <div class="meeting-meta-row">
                              <ui-icon [svg]="icons.mapPin" [size]="14" />
                              {{ m.room }}
                            </div>
                          }
                          @if (m.link) {
                            <div class="meeting-meta-row">
                              <ui-icon [svg]="icons.link" [size]="14" />
                              Virtual meeting link
                            </div>
                          }
                          @if (m.recurring) {
                            <div class="meeting-meta-row">
                              <ui-icon [svg]="icons.calendarDays" [size]="14" />
                              {{ m.recurrence }}
                            </div>
                          }
                          <div class="meeting-attendees">
                            @for (a of m.attendees.slice(0, 5); track a) {
                              <ui-avatar [name]="a" [size]="22" />
                            }
                            @if (m.attendees.length > 5) {
                              <ui-badge color="neutral">
                                +{{ m.attendees.length - 5 }}
                              </ui-badge>
                            }
                          </div>
                        </ui-card-body>
                        <ui-card-footer>
                          <div
                            style="display: flex; gap: 0.5rem; align-items: center;"
                          >
                            <ui-badge [color]="meetingStatusColor(m.status)">
                              {{ m.status }}
                            </ui-badge>
                            @if (m.type !== "in-person") {
                              <ui-button variant="outline" size="small">
                                <ui-icon [svg]="icons.video" [size]="14" /> Join
                              </ui-button>
                            }
                          </div>
                        </ui-card-footer>
                      </ui-card>
                    }
                  </div>
                </div>
              </ui-tab>

              <ui-tab-spacer />
              <ui-tab label="Create" [icon]="icons.plus">
                <div class="compose-form" style="padding-top: 0.5rem;">
                  <div class="compose-field">
                    <span class="field-label">Meeting Title</span>
                    <ui-input
                      placeholder="e.g. Sprint Planning"
                      ariaLabel="Meeting title"
                    />
                  </div>
                  <div
                    style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;"
                  >
                    <div class="compose-field">
                      <span class="field-label">Date</span>
                      <ui-input placeholder="2026-03-28" ariaLabel="Date" />
                    </div>
                    <div class="compose-field">
                      <span class="field-label">Time</span>
                      <ui-input placeholder="10:00 - 11:00" ariaLabel="Time" />
                    </div>
                  </div>
                  <div class="compose-field">
                    <span class="field-label">Type</span>
                    <ui-dropdown-list
                      [options]="meetingTypeOptions"
                      ariaLabel="Meeting type"
                    />
                  </div>
                  <div class="compose-field">
                    <span class="field-label"
                      >Room (for in-person / hybrid)</span
                    >
                    <ui-dropdown-list
                      [options]="roomOptions"
                      ariaLabel="Room selection"
                    />
                  </div>
                  <div class="compose-field">
                    <span class="field-label">Description</span>
                    <ui-input
                      placeholder="Meeting agenda and notes..."
                      ariaLabel="Description"
                    />
                  </div>
                  <div class="compose-field">
                    <span class="field-label">Attendees</span>
                    <ui-input
                      placeholder="Search contacts to add..."
                      ariaLabel="Attendees"
                    />
                  </div>
                  <div style="display: flex; gap: 0.5rem;">
                    <ui-checkbox ariaLabel="Recurring"
                      >Recurring meeting</ui-checkbox
                    >
                    <ui-checkbox ariaLabel="Send invites"
                      >Send calendar invites</ui-checkbox
                    >
                  </div>
                  <div class="compose-actions">
                    <ui-button variant="filled">Schedule Meeting</ui-button>
                    <ui-button variant="ghost">Cancel</ui-button>
                  </div>
                </div>
              </ui-tab>
            </ui-tab-group>
          </div>
        }

        <!-- ─── Room Reservation ─── -->
        @if (node.id === "rooms") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.building" [size]="24" />
                <h2>Room Reservation</h2>
              </div>
              <div class="page-actions">
                <ui-input
                  placeholder="Search rooms..."
                  ariaLabel="Search"
                  style="width: 200px"
                />
              </div>
            </div>

            <div class="category-strip">
              @for (building of buildings; track building) {
                <ui-chip
                  [color]="
                    selectedBuilding() === building ? 'primary' : 'neutral'
                  "
                  (click)="selectedBuilding.set(building)"
                >
                  {{ building }}
                </ui-chip>
              }
            </div>

            <div class="scroll-area">
              <div class="room-grid">
                @for (room of filteredRooms(); track room.id) {
                  <ui-card variant="outlined">
                    <div class="room-card-header">
                      <ui-icon [svg]="icons.building" [size]="36" />
                    </div>
                    <ui-card-body>
                      <div
                        style="display: flex; justify-content: space-between; align-items: start;"
                      >
                        <strong>{{ room.name }}</strong>
                        <ui-badge
                          [color]="room.available ? 'success' : 'warning'"
                        >
                          {{ room.available ? "Available" : "Occupied" }}
                        </ui-badge>
                      </div>
                      <div class="meeting-meta-row">
                        <ui-icon [svg]="icons.building" [size]="13" />
                        {{ room.building }}, Floor {{ room.floor }}
                      </div>
                      <div class="meeting-meta-row">
                        <ui-icon [svg]="icons.users" [size]="13" />
                        Capacity: {{ room.capacity }}
                      </div>
                      <div class="room-availability">
                        <ui-icon [svg]="icons.clock" [size]="13" />
                        Next available: {{ room.nextAvailable }}
                      </div>
                      <div class="room-amenities">
                        @for (amenity of room.amenities; track amenity) {
                          <ui-chip color="neutral" size="small">{{
                            amenity
                          }}</ui-chip>
                        }
                      </div>
                    </ui-card-body>
                    <ui-card-footer>
                      <ui-button
                        [variant]="room.available ? 'filled' : 'outline'"
                        size="small"
                        [ariaLabel]="
                          room.available ? 'Book now' : 'Reserve next slot'
                        "
                      >
                        {{ room.available ? "Book Now" : "Reserve Next Slot" }}
                      </ui-button>
                    </ui-card-footer>
                  </ui-card>
                }
              </div>
            </div>
          </div>
        }

        <!-- ─── Contacts ─── -->
        @if (node.id === "contacts") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.users" [size]="24" />
                <h2>Contacts</h2>
                <ui-badge
                  variant="count"
                  [count]="allContacts.length"
                  color="primary"
                />
              </div>
              <div class="page-actions">
                <ui-input
                  placeholder="Search contacts..."
                  ariaLabel="Search"
                  style="width: 200px"
                />
              </div>
            </div>

            <ui-tab-group panelStyle="flat">
              <ui-tab label="All" [icon]="icons.users">
                <div class="scroll-area" style="padding-top: 0.5rem;">
                  <div class="contact-grid">
                    @for (c of allContacts; track c.id) {
                      <ui-card variant="outlined">
                        <ui-card-body>
                          <div class="contact-card-top">
                            <ui-avatar [name]="c.name" [size]="40" />
                            <div>
                              <div class="contact-name">
                                <span
                                  class="contact-status-dot"
                                  [class.contact-status-dot-online]="
                                    c.status === 'online'
                                  "
                                  [class.contact-status-dot-busy]="
                                    c.status === 'busy'
                                  "
                                  [class.contact-status-dot-away]="
                                    c.status === 'away'
                                  "
                                  [class.contact-status-dot-offline]="
                                    c.status === 'offline'
                                  "
                                ></span>
                                {{ c.name }}
                                @if (c.external) {
                                  <ui-badge color="warning" size="small"
                                    >external</ui-badge
                                  >
                                }
                              </div>
                              <div class="contact-title-dept">
                                {{ c.title }} · {{ c.department }}
                              </div>
                              <div class="contact-title-dept">
                                {{ c.company }}
                              </div>
                            </div>
                          </div>
                          <div class="contact-actions-row">
                            <ui-button
                              variant="outline"
                              size="small"
                              ariaLabel="Email"
                            >
                              <ui-icon [svg]="icons.mail" [size]="14" />
                            </ui-button>
                            <ui-button
                              variant="outline"
                              size="small"
                              ariaLabel="Chat"
                            >
                              <ui-icon
                                [svg]="icons.messageCircle"
                                [size]="14"
                              />
                            </ui-button>
                            <ui-button
                              variant="outline"
                              size="small"
                              ariaLabel="Call"
                            >
                              <ui-icon [svg]="icons.phone" [size]="14" />
                            </ui-button>
                            <ui-button
                              variant="outline"
                              size="small"
                              ariaLabel="Video call"
                            >
                              <ui-icon [svg]="icons.video" [size]="14" />
                            </ui-button>
                          </div>
                        </ui-card-body>
                      </ui-card>
                    }
                  </div>
                </div>
              </ui-tab>

              <ui-tab label="Internal" [icon]="icons.building">
                <div class="scroll-area" style="padding-top: 0.5rem;">
                  <div class="contact-grid">
                    @for (c of internalContacts; track c.id) {
                      <ui-card variant="outlined">
                        <ui-card-body>
                          <div class="contact-card-top">
                            <ui-avatar [name]="c.name" [size]="40" />
                            <div>
                              <div class="contact-name">
                                <span
                                  class="contact-status-dot"
                                  [class.contact-status-dot-online]="
                                    c.status === 'online'
                                  "
                                  [class.contact-status-dot-busy]="
                                    c.status === 'busy'
                                  "
                                  [class.contact-status-dot-away]="
                                    c.status === 'away'
                                  "
                                  [class.contact-status-dot-offline]="
                                    c.status === 'offline'
                                  "
                                ></span>
                                {{ c.name }}
                              </div>
                              <div class="contact-title-dept">
                                {{ c.title }} · {{ c.department }}
                              </div>
                            </div>
                          </div>
                        </ui-card-body>
                      </ui-card>
                    }
                  </div>
                </div>
              </ui-tab>

              <ui-tab label="External" [icon]="icons.globe">
                <div class="scroll-area" style="padding-top: 0.5rem;">
                  <div class="contact-grid">
                    @for (c of externalContacts; track c.id) {
                      <ui-card variant="outlined">
                        <ui-card-body>
                          <div class="contact-card-top">
                            <ui-avatar [name]="c.name" [size]="40" />
                            <div>
                              <div class="contact-name">
                                <span
                                  class="contact-status-dot"
                                  [class.contact-status-dot-online]="
                                    c.status === 'online'
                                  "
                                  [class.contact-status-dot-busy]="
                                    c.status === 'busy'
                                  "
                                  [class.contact-status-dot-away]="
                                    c.status === 'away'
                                  "
                                  [class.contact-status-dot-offline]="
                                    c.status === 'offline'
                                  "
                                ></span>
                                {{ c.name }}
                                <ui-badge color="warning" size="small"
                                  >external</ui-badge
                                >
                              </div>
                              <div class="contact-title-dept">
                                {{ c.title }} · {{ c.company }}
                              </div>
                            </div>
                          </div>
                        </ui-card-body>
                      </ui-card>
                    }
                  </div>
                </div>
              </ui-tab>

              <ui-tab-spacer />
              <ui-tab [icon]="icons.userPlus" ariaLabel="Add contact">
                <div class="compose-form" style="padding-top: 0.5rem;">
                  <div class="compose-field">
                    <span class="field-label">Full Name</span>
                    <ui-input
                      placeholder="e.g. Jane Doe"
                      ariaLabel="Full name"
                    />
                  </div>
                  <div class="compose-field">
                    <span class="field-label">Email</span>
                    <ui-input
                      placeholder="jane.doe@example.com"
                      ariaLabel="Email"
                    />
                  </div>
                  <div
                    style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;"
                  >
                    <div class="compose-field">
                      <span class="field-label">Company</span>
                      <ui-input
                        placeholder="Company name"
                        ariaLabel="Company"
                      />
                    </div>
                    <div class="compose-field">
                      <span class="field-label">Department</span>
                      <ui-input
                        placeholder="Department"
                        ariaLabel="Department"
                      />
                    </div>
                  </div>
                  <div class="compose-field">
                    <span class="field-label">Phone</span>
                    <ui-input placeholder="+1 555-0100" ariaLabel="Phone" />
                  </div>
                  <div>
                    <ui-checkbox ariaLabel="External contact"
                      >External contact (partner / vendor)</ui-checkbox
                    >
                  </div>
                  <div class="compose-actions">
                    <ui-button variant="filled">Add Contact</ui-button>
                    <ui-button variant="ghost">Cancel</ui-button>
                  </div>
                </div>
              </ui-tab>
            </ui-tab-group>
          </div>
        }

        <!-- ─── Settings ─── -->
        @if (node.id === "settings") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.settings" [size]="24" />
                <h2>Settings</h2>
              </div>
            </div>

            <ui-tab-group panelStyle="flat">
              <ui-tab label="General" [icon]="icons.settings">
                <div class="settings-grid">
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Email Signature</div>
                      <div class="setting-desc">
                        Default signature appended to outgoing emails
                      </div>
                    </div>
                    <ui-button variant="outline" size="small">Edit</ui-button>
                  </div>
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Out of Office</div>
                      <div class="setting-desc">
                        Automatic reply when you're unavailable
                      </div>
                    </div>
                    <ui-toggle ariaLabel="Out of office" />
                  </div>
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Default Calendar View</div>
                      <div class="setting-desc">
                        Choose between month, week, or day view
                      </div>
                    </div>
                    <ui-dropdown-list
                      [options]="calendarViewOptions"
                      ariaLabel="Calendar view"
                    />
                  </div>
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Working Hours</div>
                      <div class="setting-desc">
                        Set your available hours for meeting scheduling
                      </div>
                    </div>
                    <span style="font-size: 0.88rem;">9:00 AM - 5:00 PM</span>
                  </div>
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Time Zone</div>
                      <div class="setting-desc">
                        Affects calendar and meeting times
                      </div>
                    </div>
                    <ui-dropdown-list
                      [options]="timezoneOptions"
                      ariaLabel="Time zone"
                    />
                  </div>
                </div>
              </ui-tab>

              <ui-tab label="Notifications" [icon]="icons.bell">
                <div class="settings-grid">
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Email Notifications</div>
                      <div class="setting-desc">
                        Desktop and push notifications for new emails
                      </div>
                    </div>
                    <ui-toggle ariaLabel="Email notifications" />
                  </div>
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Chat Mentions</div>
                      <div class="setting-desc">
                        Notify when someone mentions you in a channel
                      </div>
                    </div>
                    <ui-toggle ariaLabel="Chat mention notifications" />
                  </div>
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Meeting Reminders</div>
                      <div class="setting-desc">
                        Reminder before meetings start
                      </div>
                    </div>
                    <ui-dropdown-list
                      [options]="reminderTimeOptions"
                      ariaLabel="Reminder time"
                    />
                  </div>
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Do Not Disturb</div>
                      <div class="setting-desc">
                        Silence all notifications during focus time
                      </div>
                    </div>
                    <ui-toggle ariaLabel="Do not disturb" />
                  </div>
                </div>
              </ui-tab>

              <ui-tab label="Privacy" [icon]="icons.shield">
                <div class="settings-grid">
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Show Online Status</div>
                      <div class="setting-desc">
                        Let others see when you're online
                      </div>
                    </div>
                    <ui-toggle ariaLabel="Show online status" />
                  </div>
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Read Receipts</div>
                      <div class="setting-desc">
                        Show when you've read messages in chat
                      </div>
                    </div>
                    <ui-toggle ariaLabel="Read receipts" />
                  </div>
                  <div class="setting-row">
                    <div>
                      <div class="setting-label">Calendar Visibility</div>
                      <div class="setting-desc">
                        Who can see your calendar events
                      </div>
                    </div>
                    <ui-dropdown-list
                      [options]="calendarVisibilityOptions"
                      ariaLabel="Calendar visibility"
                    />
                  </div>
                </div>
              </ui-tab>

              <ui-tab-spacer />
              <ui-tab [icon]="icons.triangleAlert" ariaLabel="Danger Zone">
                <div class="settings-grid">
                  <ui-card variant="outlined">
                    <ui-card-body>
                      <h4
                        style="margin: 0 0 0.5rem; color: var(--ui-text, #1d232b);"
                      >
                        Delete Account
                      </h4>
                      <p
                        style="font-size: 0.82rem; opacity: 0.65; margin: 0 0 1rem;"
                      >
                        This will permanently delete your account and all
                        associated data. This action cannot be undone.
                      </p>
                      <ui-button
                        variant="filled"
                        color="danger"
                        ariaLabel="Delete account"
                      >
                        Delete Account
                      </ui-button>
                    </ui-card-body>
                  </ui-card>
                </div>
              </ui-tab>
            </ui-tab-group>
          </div>
        }
      </ng-template>
    </ui-navigation-page>
  `,
})
class UIDemoCommunicationSuiteApp {
  protected readonly nav = NAV;
  protected readonly activePage = signal("inbox");
  protected readonly selectedChannel = signal(2);
  protected readonly selectedDm = signal(4);
  protected readonly selectedDate = signal(new Date("2026-03-25"));
  protected readonly selectedBuilding = signal("All");

  protected readonly icons = ICONS;
  protected readonly unreadCount = UNREAD_COUNT;

  // ── Mail datasources ──

  protected readonly inboxDs = new FilterableArrayDatasource(
    MAIL_MESSAGES.filter((m) => m.folder === "inbox"),
  );
  protected readonly sentDs = new FilterableArrayDatasource(
    MAIL_MESSAGES.filter((m) => m.folder === "sent"),
  );
  protected readonly draftsDs = new FilterableArrayDatasource(
    MAIL_MESSAGES.filter((m) => m.folder === "drafts"),
  );
  protected readonly archiveDs = new FilterableArrayDatasource(
    MAIL_MESSAGES.filter((m) => m.folder === "archive"),
  );

  // ── Chat ──

  protected readonly chatChannels = CHAT_CHANNELS.filter(
    (c) => c.type === "channel" || c.type === "group",
  );
  protected readonly directMessages = CHAT_CHANNELS.filter(
    (c) => c.type === "direct",
  );

  protected readonly currentUser = CURRENT_USER;

  protected readonly activeChannel = computed(() => {
    return (
      this.chatChannels.find((c) => c.id === this.selectedChannel()) ?? null
    );
  });

  protected readonly channelMessages = computed(() => {
    return toChatViewMessages(
      CHAT_MESSAGES.filter((m) => m.channelId === this.selectedChannel()),
    );
  });

  protected readonly activeDm = computed(() => {
    return this.directMessages.find((c) => c.id === this.selectedDm()) ?? null;
  });

  protected readonly dmMessages = computed(() => {
    return toChatViewMessages(
      CHAT_MESSAGES.filter((m) => m.channelId === this.selectedDm()),
    );
  });

  // ── Calendar ──

  protected readonly calendarDs = new ArrayCalendarDatasource(CALENDAR_EVENTS);

  // ── Meetings ──

  protected readonly allMeetings = MEETINGS;
  protected readonly confirmedMeetings = MEETINGS.filter(
    (m) => m.status === "confirmed",
  );
  protected readonly todayMeetings = MEETINGS.filter(
    (m) => m.date === "2026-03-25",
  );

  // ── Rooms ──

  protected readonly allRooms = ROOMS;
  protected readonly roomOptions = ROOMS.map((r) => ({
    value: r.name,
    label: `${r.name} (${r.building}, capacity ${r.capacity})`,
  }));
  protected readonly meetingTypeOptions: SelectOption[] = [
    { value: "virtual", label: "Virtual" },
    { value: "in-person", label: "In-Person" },
    { value: "hybrid", label: "Hybrid" },
  ];
  protected readonly calendarViewOptions: SelectOption[] = [
    { value: "month", label: "Month" },
    { value: "week", label: "Week" },
    { value: "day", label: "Day" },
  ];
  protected readonly timezoneOptions: SelectOption[] = [
    { value: "est", label: "Eastern (UTC-5)" },
    { value: "cst", label: "Central (UTC-6)" },
    { value: "pst", label: "Pacific (UTC-8)" },
    { value: "cet", label: "Central European (UTC+1)" },
    { value: "jst", label: "Japan Standard (UTC+9)" },
  ];
  protected readonly reminderTimeOptions: SelectOption[] = [
    { value: "5", label: "5 minutes" },
    { value: "10", label: "10 minutes" },
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
  ];
  protected readonly calendarVisibilityOptions: SelectOption[] = [
    { value: "everyone", label: "Everyone" },
    { value: "team", label: "My Team Only" },
    { value: "private", label: "Private" },
  ];
  protected readonly buildings = [
    "All",
    ...new Set(ROOMS.map((r) => r.building)),
  ];

  protected readonly filteredRooms = computed(() => {
    const b = this.selectedBuilding();
    return b === "All" ? ROOMS : ROOMS.filter((r) => r.building === b);
  });

  // ── Contacts ──

  protected readonly allContacts = CONTACTS;
  protected readonly internalContacts = CONTACTS.filter((c) => !c.external);
  protected readonly externalContacts = CONTACTS.filter((c) => c.external);
  protected readonly departments = DEPARTMENTS;

  // ── Helpers ──

  protected statusColor(
    s: string,
  ): "success" | "warning" | "danger" | "neutral" {
    return statusColor(s);
  }

  protected meetingTypeColor(
    t: string,
  ): "primary" | "success" | "warning" | "neutral" {
    return meetingTypeColor(t);
  }

  protected meetingStatusColor(
    s: string,
  ): "success" | "warning" | "danger" | "neutral" {
    return meetingStatusColor(s);
  }

  protected priorityColor(
    p: string,
  ): "danger" | "warning" | "neutral" | "primary" {
    return priorityColor(p);
  }

  protected channelIcon(type: string): string {
    return channelIcon(type);
  }
}

// ── Storybook meta ───────────────────────────────────────────────────

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
