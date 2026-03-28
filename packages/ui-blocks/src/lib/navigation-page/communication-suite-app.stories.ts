import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

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
  UISelect,
  UITabGroup,
  UITab,
  UITabSeparator,
  UITabSpacer,
  UITemplateColumn,
  UITextColumn,
  UIToggle,
} from "@theredhead/ui-kit";

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

// ── Seed data ────────────────────────────────────────────────────────

const CONTACTS: Contact[] = [
  {
    id: 1,
    name: "Alice Chen",
    email: "alice.chen@acme.com",
    department: "Engineering",
    title: "Staff Engineer",
    phone: "+1 555-0101",
    avatar: "AC",
    status: "online",
    company: "Acme Corp",
    external: false,
  },
  {
    id: 2,
    name: "Bob Martinez",
    email: "bob.martinez@acme.com",
    department: "Product",
    title: "Product Manager",
    phone: "+1 555-0102",
    avatar: "BM",
    status: "busy",
    company: "Acme Corp",
    external: false,
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol.davis@acme.com",
    department: "Design",
    title: "Senior Designer",
    phone: "+1 555-0103",
    avatar: "CD",
    status: "online",
    company: "Acme Corp",
    external: false,
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@acme.com",
    department: "Engineering",
    title: "Senior Developer",
    phone: "+1 555-0104",
    avatar: "DK",
    status: "away",
    company: "Acme Corp",
    external: false,
  },
  {
    id: 5,
    name: "Eva Johansson",
    email: "eva.j@partners.io",
    department: "Sales",
    title: "Account Executive",
    phone: "+46 70-555-0105",
    avatar: "EJ",
    status: "online",
    company: "Nordic Partners",
    external: true,
  },
  {
    id: 6,
    name: "Frank Müller",
    email: "frank.mueller@techgmbh.de",
    department: "Engineering",
    title: "Solutions Architect",
    phone: "+49 170-555-0106",
    avatar: "FM",
    status: "offline",
    company: "Tech GmbH",
    external: true,
  },
  {
    id: 7,
    name: "Grace Okafor",
    email: "grace.okafor@acme.com",
    department: "HR",
    title: "HR Director",
    phone: "+1 555-0107",
    avatar: "GO",
    status: "online",
    company: "Acme Corp",
    external: false,
  },
  {
    id: 8,
    name: "Henry Tanaka",
    email: "henry.tanaka@acme.com",
    department: "Finance",
    title: "CFO",
    phone: "+1 555-0108",
    avatar: "HT",
    status: "busy",
    company: "Acme Corp",
    external: false,
  },
  {
    id: 9,
    name: "Irene Vasquez",
    email: "irene.v@clientco.com",
    department: "Legal",
    title: "General Counsel",
    phone: "+1 555-0109",
    avatar: "IV",
    status: "offline",
    company: "ClientCo",
    external: true,
  },
  {
    id: 10,
    name: "James Wright",
    email: "james.wright@acme.com",
    department: "Marketing",
    title: "Marketing Lead",
    phone: "+1 555-0110",
    avatar: "JW",
    status: "online",
    company: "Acme Corp",
    external: false,
  },
  {
    id: 11,
    name: "Karen Lee",
    email: "karen.lee@acme.com",
    department: "Engineering",
    title: "QA Lead",
    phone: "+1 555-0111",
    avatar: "KL",
    status: "away",
    company: "Acme Corp",
    external: false,
  },
  {
    id: 12,
    name: "Lars Petersen",
    email: "lars.p@scandinavia.dk",
    department: "Operations",
    title: "Operations Director",
    phone: "+45 20-555-0112",
    avatar: "LP",
    status: "online",
    company: "Scandinavia Ltd",
    external: true,
  },
];

const MAIL_MESSAGES: MailMessage[] = [
  {
    id: 1,
    from: "Alice Chen",
    fromEmail: "alice.chen@acme.com",
    to: "You",
    toEmail: "me@acme.com",
    subject: "Q3 Architecture Review — Action Required",
    preview:
      "Hi, please review the attached architecture diagrams before Friday...",
    body: "Hi,\n\nPlease review the attached architecture diagrams before Friday's meeting. We need sign-off on the microservices migration plan and the new event-driven integration layer.\n\nKey topics:\n- Service mesh configuration\n- API gateway rate limits\n- Database sharding strategy\n\nLet me know if you have any questions.\n\nBest,\nAlice",
    date: "10:32 AM",
    read: false,
    starred: true,
    folder: "inbox",
    labels: ["engineering", "urgent"],
    hasAttachment: true,
    priority: "high",
  },
  {
    id: 2,
    from: "Bob Martinez",
    fromEmail: "bob.martinez@acme.com",
    to: "You",
    toEmail: "me@acme.com",
    subject: "Sprint Planning — Next Week",
    preview:
      "Team, let's align on sprint priorities for next week. I've drafted...",
    body: "Team,\n\nLet's align on sprint priorities for next week. I've drafted the backlog in Jira and we need to finalize story points.\n\nAgenda:\n1. Carry-over items from Sprint 14\n2. New feature: real-time notifications\n3. Tech debt budget (15%)\n4. Bug triage\n\nPlease come prepared with your capacity estimates.\n\nThanks,\nBob",
    date: "9:15 AM",
    read: false,
    starred: false,
    folder: "inbox",
    labels: ["product"],
    hasAttachment: false,
    priority: "normal",
  },
  {
    id: 3,
    from: "Carol Davis",
    fromEmail: "carol.davis@acme.com",
    to: "You",
    toEmail: "me@acme.com",
    subject: "Design System — New Component Proposals",
    preview:
      "I've put together mockups for the date range picker and timeline...",
    body: "Hey,\n\nI've put together mockups for the date range picker and timeline components. They follow our existing Material 3 token structure.\n\nFigma link: [internal-link]\n\nI'd love your feedback on:\n- The interaction patterns for range selection\n- Timeline node density options\n- Dark mode contrast ratios\n\nCheers,\nCarol",
    date: "Yesterday",
    read: true,
    starred: true,
    folder: "inbox",
    labels: ["design"],
    hasAttachment: true,
    priority: "normal",
  },
  {
    id: 4,
    from: "Eva Johansson",
    fromEmail: "eva.j@partners.io",
    to: "You",
    toEmail: "me@acme.com",
    subject: "Partnership Renewal — Contract Review",
    preview:
      "Please find attached the updated partnership agreement for FY2027...",
    body: "Dear team,\n\nPlease find attached the updated partnership agreement for FY2027. Key changes include:\n\n- Extended SLA terms (99.95% uptime)\n- New pricing tier for enterprise customers\n- Data residency clause for EU operations\n\nPlease review with your legal team and revert by end of month.\n\nKind regards,\nEva Johansson\nNordic Partners",
    date: "Yesterday",
    read: true,
    starred: false,
    folder: "inbox",
    labels: ["external", "legal"],
    hasAttachment: true,
    priority: "high",
  },
  {
    id: 5,
    from: "Grace Okafor",
    fromEmail: "grace.okafor@acme.com",
    to: "All Staff",
    toEmail: "all@acme.com",
    subject: "Company Town Hall — March 28",
    preview: "Join us for the quarterly town hall next Thursday at 3 PM EST...",
    body: "Hi everyone,\n\nJoin us for the quarterly town hall next Thursday at 3 PM EST.\n\nAgenda:\n- Q1 performance review (Henry)\n- Product roadmap update (Bob)\n- Engineering highlights (Alice)\n- Open Q&A session\n\nVirtual attendees: Meeting link will be sent 30 minutes before.\nIn-person: Main auditorium, Building A, Floor 1.\n\nPlease submit questions in advance via the HR portal.\n\nBest,\nGrace",
    date: "Mar 20",
    read: true,
    starred: false,
    folder: "inbox",
    labels: ["company", "event"],
    hasAttachment: false,
    priority: "normal",
  },
  {
    id: 6,
    from: "You",
    fromEmail: "me@acme.com",
    to: "Frank Müller",
    toEmail: "frank.mueller@techgmbh.de",
    subject: "Re: Integration API — Technical Specs",
    preview:
      "Frank, thanks for the detailed spec. I have a few questions about...",
    body: "Frank,\n\nThanks for the detailed spec. I have a few questions about the authentication flow:\n\n1. Are you using OAuth 2.0 with PKCE or standard client credentials?\n2. What's the token refresh interval?\n3. Do you support webhook callbacks for async operations?\n\nWe can discuss on our call Thursday.\n\nRegards",
    date: "Mar 19",
    read: true,
    starred: false,
    folder: "sent",
    labels: ["engineering", "external"],
    hasAttachment: false,
    priority: "normal",
  },
  {
    id: 7,
    from: "You",
    fromEmail: "me@acme.com",
    to: "Henry Tanaka",
    toEmail: "henry.tanaka@acme.com",
    subject: "Budget Approval — Cloud Infrastructure Q2",
    preview:
      "Henry, attached is the Q2 infrastructure budget proposal covering...",
    body: "Henry,\n\nAttached is the Q2 infrastructure budget proposal covering:\n\n- AWS compute scaling: +$12K/mo\n- Database cluster upgrade: $8K one-time\n- CDN expansion to APAC: +$3K/mo\n- Monitoring stack (Datadog): $5K/mo\n\nTotal incremental: $28K/month\nROI analysis is on page 4.\n\nHappy to walk through the numbers at your convenience.\n\nThanks",
    date: "Mar 18",
    read: true,
    starred: true,
    folder: "sent",
    labels: ["finance"],
    hasAttachment: true,
    priority: "high",
  },
  {
    id: 8,
    from: "You",
    fromEmail: "me@acme.com",
    to: "Team",
    toEmail: "eng-team@acme.com",
    subject: "Draft: Incident Response Playbook v2",
    preview:
      "Team, here's the updated incident response playbook. Please review...",
    body: "Team,\n\nHere's the updated incident response playbook. Major changes:\n\n- Severity classification updated (P0–P3 scale)\n- On-call rotation now 1 week instead of 2\n- Mandatory post-mortem for P0/P1\n- Slack channel naming convention standardized\n\nThis is still a draft — please add comments directly.\n\n[Draft will be finalized next week]",
    date: "Mar 17",
    read: true,
    starred: false,
    folder: "drafts",
    labels: ["engineering"],
    hasAttachment: false,
    priority: "normal",
  },
  {
    id: 9,
    from: "James Wright",
    fromEmail: "james.wright@acme.com",
    to: "You",
    toEmail: "me@acme.com",
    subject: "Product Launch Campaign — Asset Review",
    preview:
      "Can you take a look at the launch page copy and the demo video...",
    body: "Hey,\n\nCan you take a look at the launch page copy and the demo video script? We're targeting April 15 for the public launch.\n\nDeliverables needed from engineering:\n- Interactive demo environment\n- API documentation portal\n- Performance benchmarks page\n\nDeadline for assets: April 5.\n\nThanks,\nJames",
    date: "Mar 16",
    read: true,
    starred: false,
    folder: "inbox",
    labels: ["marketing"],
    hasAttachment: true,
    priority: "normal",
  },
  {
    id: 10,
    from: "Karen Lee",
    fromEmail: "karen.lee@acme.com",
    to: "You",
    toEmail: "me@acme.com",
    subject: "QA Report — Release Candidate 4.2.0",
    preview: "RC 4.2.0 regression suite complete. 3 blockers identified in...",
    body: "Hi,\n\nRC 4.2.0 regression suite complete.\n\nResults:\n- Total tests: 2,847\n- Passed: 2,831\n- Failed: 13\n- Skipped: 3\n\nBlockers (3):\n1. Payment flow timeout on high latency connections\n2. Calendar sync loses recurring events on timezone change\n3. File upload progress bar freezes at 99%\n\nFull report attached. Please triage before Wednesday.\n\nKaren",
    date: "Mar 15",
    read: true,
    starred: true,
    folder: "inbox",
    labels: ["engineering", "qa"],
    hasAttachment: true,
    priority: "urgent",
  },
  {
    id: 11,
    from: "David Kim",
    fromEmail: "david.kim@acme.com",
    to: "You",
    toEmail: "me@acme.com",
    subject: "Code Review — Event Bus Implementation",
    preview: "I've pushed the event bus PR. Key changes in src/core/events...",
    body: "Hey,\n\nI've pushed the event bus PR (#1847). Key changes:\n\n- New EventBus class with typed channels\n- Backpressure handling for high-throughput streams\n- Dead letter queue for failed deliveries\n- Unit tests (98% coverage)\n\nPR: github.com/acme/platform/pull/1847\n\nCould use a review before EOD if possible.\n\nThanks,\nDavid",
    date: "Mar 14",
    read: true,
    starred: false,
    folder: "archive",
    labels: ["engineering"],
    hasAttachment: false,
    priority: "normal",
  },
  {
    id: 12,
    from: "Irene Vasquez",
    fromEmail: "irene.v@clientco.com",
    to: "You",
    toEmail: "me@acme.com",
    subject: "Data Processing Agreement — Updates Required",
    preview: "Per GDPR Article 28, we need to update our DPA to include...",
    body: "Dear team,\n\nPer GDPR Article 28, we need to update our Data Processing Agreement to include:\n\n1. Sub-processor notification requirements\n2. Cross-border data transfer mechanisms (SCCs updated)\n3. Data retention schedule alignment\n4. Breach notification timeline (72 hours)\n\nPlease have your DPO review and sign by April 1.\n\nRegards,\nIrene Vasquez\nGeneral Counsel, ClientCo",
    date: "Mar 12",
    read: true,
    starred: false,
    folder: "archive",
    labels: ["legal", "external"],
    hasAttachment: true,
    priority: "high",
  },
];

const CHAT_CHANNELS: ChatChannel[] = [
  {
    id: 1,
    name: "general",
    type: "channel",
    members: 48,
    lastMessage: "Town hall recording has been posted to the intranet",
    lastSender: "Grace Okafor",
    lastTime: "11:42 AM",
    unread: 3,
    description: "Company-wide announcements and general discussion",
    pinned: true,
  },
  {
    id: 2,
    name: "engineering",
    type: "channel",
    members: 22,
    lastMessage:
      "Deployed v4.1.9 to staging — please smoke test the calendar module",
    lastSender: "Alice Chen",
    lastTime: "10:58 AM",
    unread: 7,
    description: "Engineering team discussions, PR reviews, and incidents",
    pinned: true,
  },
  {
    id: 3,
    name: "design-system",
    type: "channel",
    members: 12,
    lastMessage: "New icon set pushed to the registry, 14 new glyphs",
    lastSender: "Carol Davis",
    lastTime: "9:30 AM",
    unread: 2,
    description: "Component library, tokens, and design system updates",
    pinned: false,
  },
  {
    id: 4,
    name: "Alice Chen",
    type: "direct",
    members: 2,
    lastMessage: "Sounds good, I'll update the PR",
    lastSender: "Alice Chen",
    lastTime: "10:15 AM",
    unread: 0,
    description: "",
    pinned: false,
  },
  {
    id: 5,
    name: "Bob Martinez",
    type: "direct",
    members: 2,
    lastMessage: "Sprint retro moved to 3 PM",
    lastSender: "Bob Martinez",
    lastTime: "9:05 AM",
    unread: 1,
    description: "",
    pinned: false,
  },
  {
    id: 6,
    name: "Project Phoenix",
    type: "group",
    members: 8,
    lastMessage:
      "Milestone 3 is on track — deployment scheduled for next Tuesday",
    lastSender: "David Kim",
    lastTime: "Yesterday",
    unread: 0,
    description: "Cross-functional team for the Phoenix migration project",
    pinned: true,
  },
  {
    id: 7,
    name: "incidents",
    type: "channel",
    members: 30,
    lastMessage:
      "RESOLVED: API latency spike on us-east-1 — root cause: connection pool exhaustion",
    lastSender: "Karen Lee",
    lastTime: "Yesterday",
    unread: 0,
    description: "Production incident coordination and post-mortems",
    pinned: false,
  },
  {
    id: 8,
    name: "random",
    type: "channel",
    members: 48,
    lastMessage: "Has anyone tried the new coffee blend in the kitchen?",
    lastSender: "James Wright",
    lastTime: "Yesterday",
    unread: 0,
    description: "Water cooler chat and non-work banter",
    pinned: false,
  },
  {
    id: 9,
    name: "Eva Johansson",
    type: "direct",
    members: 2,
    lastMessage: "Contract revision sent — thanks for the quick turnaround",
    lastSender: "Eva Johansson",
    lastTime: "Mar 20",
    unread: 0,
    description: "",
    pinned: false,
  },
  {
    id: 10,
    name: "leadership",
    type: "group",
    members: 6,
    lastMessage: "Q2 OKR draft is ready for review",
    lastSender: "Henry Tanaka",
    lastTime: "Mar 19",
    unread: 0,
    description: "Senior leadership coordination and strategic discussions",
    pinned: false,
  },
];

const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    channelId: 2,
    sender: "Alice Chen",
    text: "Deployed v4.1.9 to staging — please smoke test the calendar module",
    time: "10:58 AM",
    reactions: [],
  },
  {
    id: 2,
    channelId: 2,
    sender: "David Kim",
    text: "On it. I'll check the recurring event sync first since that was flaky",
    time: "11:02 AM",
    reactions: [],
  },
  {
    id: 3,
    channelId: 2,
    sender: "Karen Lee",
    text: "Calendar looks good so far. File upload still has the 99% freeze though",
    time: "11:15 AM",
    reactions: [],
  },
  {
    id: 4,
    channelId: 2,
    sender: "Alice Chen",
    text: "That's in a separate PR (#1853). Should land tomorrow morning",
    time: "11:18 AM",
    reactions: [],
  },
  {
    id: 5,
    channelId: 2,
    sender: "David Kim",
    text: "Recurring events confirmed working. Timezone edge case also fixed",
    time: "11:34 AM",
    reactions: [],
  },
  {
    id: 6,
    channelId: 1,
    sender: "Grace Okafor",
    text: "Town hall recording has been posted to the intranet. Thanks everyone for attending!",
    time: "11:42 AM",
    reactions: [],
  },
  {
    id: 7,
    channelId: 1,
    sender: "Bob Martinez",
    text: "Great session. The product roadmap slide was very clear this time",
    time: "11:45 AM",
    reactions: [],
  },
  {
    id: 8,
    channelId: 1,
    sender: "James Wright",
    text: "Agreed! Also loved the engineering demo. Well done @Alice",
    time: "11:48 AM",
    reactions: [],
  },
  {
    id: 9,
    channelId: 3,
    sender: "Carol Davis",
    text: "New icon set pushed to the registry, 14 new glyphs added to the Communication category",
    time: "9:30 AM",
    reactions: [],
  },
  {
    id: 10,
    channelId: 3,
    sender: "Carol Davis",
    text: "Also updated the Figma component library with the new card variants",
    time: "9:32 AM",
    reactions: [],
  },
];

// ── Chat participants (for UIChatView) ───────────────────────────

const CURRENT_USER: ChatParticipant = {
  id: "you",
  name: "You",
  avatarEmail: "you@acme.com",
};

const CHAT_PARTICIPANTS: Record<string, ChatParticipant> = {
  "Alice Chen": {
    id: "alice",
    name: "Alice Chen",
    avatarEmail: "alice@acme.com",
  },
  "David Kim": {
    id: "david",
    name: "David Kim",
    avatarEmail: "david@acme.com",
  },
  "Karen Lee": {
    id: "karen",
    name: "Karen Lee",
    avatarEmail: "karen@acme.com",
  },
  "Grace Okafor": {
    id: "grace",
    name: "Grace Okafor",
    avatarEmail: "grace@acme.com",
  },
  "Bob Martinez": {
    id: "bob",
    name: "Bob Martinez",
    avatarEmail: "bob@acme.com",
  },
  "James Wright": {
    id: "james",
    name: "James Wright",
    avatarEmail: "james@acme.com",
  },
  "Carol Davis": {
    id: "carol",
    name: "Carol Davis",
    avatarEmail: "carol@acme.com",
  },
  "Eva Johansson": {
    id: "eva",
    name: "Eva Johansson",
    avatarEmail: "eva@acme.com",
  },
  "Henry Tanaka": {
    id: "henry",
    name: "Henry Tanaka",
    avatarEmail: "henry@acme.com",
  },
};

function toChatViewMessages(msgs: ChatMessage[]): ChatViewMessage[] {
  const today = new Date("2026-03-25");
  return msgs.map((m) => {
    const match = m.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    let h = match ? parseInt(match[1], 10) : 0;
    const min = match ? parseInt(match[2], 10) : 0;
    if (match && match[3].toUpperCase() === "PM" && h < 12) h += 12;
    if (match && match[3].toUpperCase() === "AM" && h === 12) h = 0;
    const ts = new Date(today);
    ts.setHours(h, min, 0, 0);
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

const MEETINGS: Meeting[] = [
  {
    id: 1,
    title: "Sprint Planning — Sprint 15",
    organizer: "Bob Martinez",
    date: "2026-03-25",
    startTime: "10:00",
    endTime: "11:30",
    type: "hybrid",
    room: "Collaboration Hub",
    link: "https://meet.acme.com/sprint-15",
    attendees: [
      "Alice Chen",
      "Bob Martinez",
      "David Kim",
      "Karen Lee",
      "Carol Davis",
    ],
    status: "confirmed",
    description:
      "Sprint planning for Sprint 15. Review backlog, estimate stories, assign tasks.",
    recurring: true,
    recurrence: "Every 2 weeks",
  },
  {
    id: 2,
    title: "Architecture Review",
    organizer: "Alice Chen",
    date: "2026-03-26",
    startTime: "14:00",
    endTime: "15:00",
    type: "virtual",
    room: "",
    link: "https://meet.acme.com/arch-review",
    attendees: ["Alice Chen", "David Kim", "Frank Müller"],
    status: "confirmed",
    description:
      "Review the microservices migration plan and event-driven architecture proposal.",
    recurring: false,
    recurrence: "",
  },
  {
    id: 3,
    title: "1:1 — Henry Tanaka",
    organizer: "You",
    date: "2026-03-25",
    startTime: "13:00",
    endTime: "13:30",
    type: "in-person",
    room: "Executive Boardroom",
    link: "",
    attendees: ["Henry Tanaka"],
    status: "confirmed",
    description: "Monthly budget review and Q2 planning discussion.",
    recurring: true,
    recurrence: "Monthly",
  },
  {
    id: 4,
    title: "Design Review — New Components",
    organizer: "Carol Davis",
    date: "2026-03-27",
    startTime: "11:00",
    endTime: "12:00",
    type: "hybrid",
    room: "Design Lab",
    link: "https://meet.acme.com/design-review",
    attendees: ["Carol Davis", "Alice Chen", "Bob Martinez"],
    status: "confirmed",
    description:
      "Review mockups for date range picker, timeline, and notification center components.",
    recurring: true,
    recurrence: "Weekly",
  },
  {
    id: 5,
    title: "All Hands — Town Hall",
    organizer: "Grace Okafor",
    date: "2026-03-28",
    startTime: "15:00",
    endTime: "16:30",
    type: "hybrid",
    room: "Main Auditorium",
    link: "https://meet.acme.com/town-hall-q1",
    attendees: [
      "All Staff",
      "Grace Okafor",
      "Henry Tanaka",
      "Bob Martinez",
      "Alice Chen",
    ],
    status: "confirmed",
    description:
      "Quarterly town hall: Q1 review, product roadmap, engineering highlights, open Q&A.",
    recurring: true,
    recurrence: "Quarterly",
  },
  {
    id: 6,
    title: "Client Sync — Nordic Partners",
    organizer: "Eva Johansson",
    date: "2026-03-26",
    startTime: "09:00",
    endTime: "09:45",
    type: "virtual",
    room: "",
    link: "https://meet.partners.io/acme-sync",
    attendees: ["Eva Johansson", "Lars Petersen"],
    status: "confirmed",
    description: "Partnership renewal discussion and FY2027 contract review.",
    recurring: true,
    recurrence: "Biweekly",
  },
  {
    id: 7,
    title: "Incident Post-Mortem — API Latency",
    organizer: "Karen Lee",
    date: "2026-03-27",
    startTime: "14:00",
    endTime: "14:45",
    type: "virtual",
    room: "",
    link: "https://meet.acme.com/postmortem-api",
    attendees: ["Karen Lee", "Alice Chen", "David Kim"],
    status: "confirmed",
    description:
      "Post-mortem for the us-east-1 API latency incident. Root cause: connection pool exhaustion.",
    recurring: false,
    recurrence: "",
  },
  {
    id: 8,
    title: "Product Launch Kickoff",
    organizer: "James Wright",
    date: "2026-03-28",
    startTime: "10:00",
    endTime: "11:00",
    type: "in-person",
    room: "Innovation Suite",
    link: "",
    attendees: ["James Wright", "Bob Martinez", "Carol Davis", "Alice Chen"],
    status: "tentative",
    description:
      "Kick off the April 15 product launch campaign. Asset assignments and timeline review.",
    recurring: false,
    recurrence: "",
  },
  {
    id: 9,
    title: "Legal Review — DPA Update",
    organizer: "Irene Vasquez",
    date: "2026-03-28",
    startTime: "11:30",
    endTime: "12:15",
    type: "virtual",
    room: "",
    link: "https://meet.clientco.com/dpa-review",
    attendees: ["Irene Vasquez", "Grace Okafor"],
    status: "tentative",
    description:
      "Review updated Data Processing Agreement per GDPR Article 28 requirements.",
    recurring: false,
    recurrence: "",
  },
  {
    id: 10,
    title: "Engineering Standup",
    organizer: "Alice Chen",
    date: "2026-03-25",
    startTime: "09:15",
    endTime: "09:30",
    type: "virtual",
    room: "",
    link: "https://meet.acme.com/standup",
    attendees: ["Alice Chen", "David Kim", "Karen Lee"],
    status: "confirmed",
    description: "Daily engineering standup — blockers, progress, plans.",
    recurring: true,
    recurrence: "Daily (weekdays)",
  },
  {
    id: 11,
    title: "Team Lunch — Engineering",
    organizer: "Alice Chen",
    date: "2026-03-26",
    startTime: "12:00",
    endTime: "13:00",
    type: "in-person",
    room: "Cafeteria",
    link: "",
    attendees: ["Alice Chen", "David Kim", "Karen Lee", "Carol Davis"],
    status: "confirmed",
    description: "Monthly team lunch. This month: Italian catering.",
    recurring: true,
    recurrence: "Monthly",
  },
  {
    id: 12,
    title: "Security Audit Planning",
    organizer: "David Kim",
    date: "2026-03-29",
    startTime: "10:00",
    endTime: "11:00",
    type: "virtual",
    room: "",
    link: "https://meet.acme.com/security-audit",
    attendees: ["David Kim", "Alice Chen", "Irene Vasquez"],
    status: "confirmed",
    description:
      "Plan the Q2 security audit scope: penetration testing, dependency scanning, access reviews.",
    recurring: false,
    recurrence: "",
  },
];

const ROOMS: Room[] = [
  {
    id: 1,
    name: "Collaboration Hub",
    building: "Building A",
    floor: 2,
    capacity: 12,
    amenities: [
      "Video conferencing",
      "Whiteboard",
      "Dual monitors",
      "Standing desk option",
    ],
    available: true,
    nextAvailable: "Now",
    image: "collab-hub.jpg",
  },
  {
    id: 2,
    name: "Executive Boardroom",
    building: "Building A",
    floor: 5,
    capacity: 20,
    amenities: [
      "Video conferencing",
      "Projector",
      "Catering service",
      "Soundproofed",
    ],
    available: false,
    nextAvailable: "2:00 PM",
    image: "boardroom.jpg",
  },
  {
    id: 3,
    name: "Design Lab",
    building: "Building B",
    floor: 1,
    capacity: 8,
    amenities: [
      "Large display",
      "Drawing tablets",
      "Whiteboard wall",
      "Natural light",
    ],
    available: true,
    nextAvailable: "Now",
    image: "design-lab.jpg",
  },
  {
    id: 4,
    name: "Main Auditorium",
    building: "Building A",
    floor: 1,
    capacity: 200,
    amenities: [
      "Stage",
      "Projector",
      "PA system",
      "Live streaming",
      "Recording",
    ],
    available: false,
    nextAvailable: "Tomorrow 8:00 AM",
    image: "auditorium.jpg",
  },
  {
    id: 5,
    name: "Innovation Suite",
    building: "Building B",
    floor: 3,
    capacity: 16,
    amenities: [
      "Video conferencing",
      "Interactive display",
      "Breakout area",
      "Snack bar",
    ],
    available: true,
    nextAvailable: "Now",
    image: "innovation.jpg",
  },
  {
    id: 6,
    name: "Focus Pod Alpha",
    building: "Building A",
    floor: 3,
    capacity: 2,
    amenities: ["Soundproofed", "Monitor", "Standing desk"],
    available: true,
    nextAvailable: "Now",
    image: "focus-pod.jpg",
  },
  {
    id: 7,
    name: "Focus Pod Beta",
    building: "Building A",
    floor: 3,
    capacity: 2,
    amenities: ["Soundproofed", "Monitor", "Standing desk"],
    available: false,
    nextAvailable: "3:30 PM",
    image: "focus-pod.jpg",
  },
  {
    id: 8,
    name: "Training Room",
    building: "Building B",
    floor: 2,
    capacity: 30,
    amenities: [
      "Projector",
      "Individual workstations",
      "Video conferencing",
      "Recording",
    ],
    available: true,
    nextAvailable: "Now",
    image: "training.jpg",
  },
  {
    id: 9,
    name: "Cafeteria Meeting Nook",
    building: "Building A",
    floor: 1,
    capacity: 6,
    amenities: ["Informal", "Coffee available", "Natural light"],
    available: true,
    nextAvailable: "Now",
    image: "cafe-nook.jpg",
  },
  {
    id: 10,
    name: "Rooftop Terrace",
    building: "Building B",
    floor: 5,
    capacity: 25,
    amenities: ["Outdoor", "Weather dependent", "Portable whiteboard", "Wi-Fi"],
    available: true,
    nextAvailable: "Now",
    image: "rooftop.jpg",
  },
];

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
    UISelect,
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
                placeholder="Select a message to read..."
              >
                <ui-template-column key="subject" headerText="Subject">
                  <ng-template let-row>
                    <div
                      style="display: flex; flex-direction: column; padding: .15rem; width: 100%;"
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
                    <ui-select ariaLabel="Meeting type">
                      <option value="virtual">Virtual</option>
                      <option value="in-person">In-Person</option>
                      <option value="hybrid">Hybrid</option>
                    </ui-select>
                  </div>
                  <div class="compose-field">
                    <span class="field-label"
                      >Room (for in-person / hybrid)</span
                    >
                    <ui-select ariaLabel="Room selection">
                      @for (room of allRooms; track room.id) {
                        <option [value]="room.name">
                          {{ room.name }} ({{ room.building }}, capacity
                          {{ room.capacity }})
                        </option>
                      }
                    </ui-select>
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
                    <ui-select ariaLabel="Calendar view" style="width: 120px;">
                      <option value="month">Month</option>
                      <option value="week">Week</option>
                      <option value="day">Day</option>
                    </ui-select>
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
                    <ui-select ariaLabel="Time zone" style="width: 180px;">
                      <option value="est">Eastern (UTC-5)</option>
                      <option value="cst">Central (UTC-6)</option>
                      <option value="pst">Pacific (UTC-8)</option>
                      <option value="cet">Central European (UTC+1)</option>
                      <option value="jst">Japan Standard (UTC+9)</option>
                    </ui-select>
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
                    <ui-select ariaLabel="Reminder time" style="width: 120px;">
                      <option value="5">5 minutes</option>
                      <option value="10">10 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                    </ui-select>
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
                    <ui-select
                      ariaLabel="Calendar visibility"
                      style="width: 160px;"
                    >
                      <option value="everyone">Everyone</option>
                      <option value="team">My Team Only</option>
                      <option value="private">Private</option>
                    </ui-select>
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
<ui-navigation-page [items]="nav" [(activePage)]="activePage" rootLabel="ConnectHub">
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
} from '@theredhead/ui-blocks';
import {
  FilterableArrayDatasource, ArrayCalendarDatasource,
  UICalendarMonthView, UITabGroup, UITab, UITabSpacer,
  UIChip, UIAvatar, UIBadge, UIBadgeColumn, UITemplateColumn,
  UIIcon, UIIcons, UICard, UICardBody, UIButton, UIInput,
} from '@theredhead/ui-kit';

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
