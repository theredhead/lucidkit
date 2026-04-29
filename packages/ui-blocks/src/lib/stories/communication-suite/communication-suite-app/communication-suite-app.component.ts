import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  effect,
  signal,
  viewChild,
} from "@angular/core";
import communicationSuiteData from "./communication-suite-app.data.json";

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

import { UIChatView } from "../../../chat-view/chat-view.component";
import type {
  ChatMessage as ChatViewMessage,
  ChatParticipant,
} from "../../../chat-view/chat-view.types";
import { UIMasterDetailView } from "../../../master-detail-view/master-detail-view.component";
import { UINavigationPage } from "../../../navigation-page/navigation-page.component";
import {
  navItem,
  navGroup,
  type NavigationNode,
} from "../../../navigation-page/navigation-page.utils";
import { UICommunicationSuiteMailDetail } from "./communication-suite-mail-detail.component";
import { UICommunicationSuiteMeetingCard } from "./communication-suite-meeting-card.component";
import { UICommunicationSuitePageHeader } from "./communication-suite-page-header.component";

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
    UICommunicationSuiteMailDetail,
    UICommunicationSuiteMeetingCard,
    UICommunicationSuitePageHeader,
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
  templateUrl: "./communication-suite-app.component.html",
  styleUrl: "./communication-suite-app.component.scss",
})
export class UIDemoCommunicationSuiteApp {
  protected readonly nav = NAV;
  protected readonly activePage = signal("inbox");
  protected readonly selectedChannel = signal(2);
  protected readonly selectedDm = signal(4);
  protected readonly selectedDate = signal(new Date("2026-03-25"));
  protected readonly selectedBuilding = signal("All");
  protected readonly calendarPageIndex = signal(0);
  protected readonly visibleMeetingsCount = signal(18);

  protected readonly calendarPageSize = 120;
  protected readonly meetingsPageSize = 18;

  protected readonly meetingsLoadMoreSentinel = viewChild<
    ElementRef<HTMLElement>
  >("meetingsLoadMoreSentinel");

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

  protected readonly selectedMonthCalendarEvents = computed(() => {
    const selectedDate = this.selectedDate();
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    return CALENDAR_EVENTS.filter(
      (event) =>
        event.start.getFullYear() === year && event.start.getMonth() === month,
    );
  });

  protected readonly pagedCalendarEvents = computed(() => {
    const start = this.calendarPageIndex() * this.calendarPageSize;
    return this.selectedMonthCalendarEvents().slice(
      start,
      start + this.calendarPageSize,
    );
  });

  protected readonly calendarDs = computed(
    () => new ArrayCalendarDatasource(this.pagedCalendarEvents()),
  );

  // ── Meetings ──

  protected readonly allMeetings = MEETINGS;
  protected readonly confirmedMeetings = MEETINGS.filter(
    (m) => m.status === "confirmed",
  );
  protected readonly todayMeetings = MEETINGS.filter(
    (m) => m.date === "2026-03-25",
  );
  protected readonly visibleMeetings = computed(() =>
    this.allMeetings.slice(0, this.visibleMeetingsCount()),
  );
  protected readonly hasMoreMeetings = computed(
    () => this.visibleMeetingsCount() < this.allMeetings.length,
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

  public constructor() {
    effect(() => {
      const selectedDate = this.selectedDate();
      selectedDate.getFullYear();
      selectedDate.getMonth();
      this.calendarPageIndex.set(0);
    });

    effect((onCleanup) => {
      const sentinel = this.meetingsLoadMoreSentinel()?.nativeElement;
      if (!sentinel) {
        return;
      }

      const root = sentinel.closest(".scroll-area");
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.loadMoreMeetings();
          }
        },
        {
          root: root instanceof HTMLElement ? root : null,
          rootMargin: "0px 0px 320px 0px",
        },
      );

      observer.observe(sentinel);
      onCleanup(() => observer.disconnect());
    });
  }

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

  protected loadMoreMeetings(): void {
    if (!this.hasMoreMeetings()) {
      return;
    }

    this.visibleMeetingsCount.update((count) =>
      Math.min(count + this.meetingsPageSize, this.allMeetings.length),
    );
  }
}

// ── Storybook meta ───────────────────────────────────────────────────
