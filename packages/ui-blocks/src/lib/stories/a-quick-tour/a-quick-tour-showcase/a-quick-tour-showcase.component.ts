import {
  DOCUMENT,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  inject,
  signal,
} from "@angular/core";
import {
  ArrayCalendarDatasource,
  type CalendarEvent,
  FilterableArrayDatasource,
  UIAvatar,
  UIBadge,
  UIBadgeColumn,
  UIButton,
  UICalendarMonthView,
  UICarousel,
  UICard,
  UICardBody,
  UICardFooter,
  UICardHeader,
  UIChart,
  UIChip,
  UICheckbox,
  UIDropdownList,
  UIIcon,
  UIIcons,
  UIInput,
  UIIndicatesTouch,
  UIProgress,
  SingleCarouselStrategy,
  UITab,
  UITabGroup,
  UITextColumn,
  UIToggle,
  type SelectOption,
  BarGraphStrategy,
} from "@theredhead/lucid-kit";

import { UIChatView } from "../../../chat-view/chat-view.component";
import type {
  ChatMessage,
  ChatParticipant,
} from "../../../chat-view/chat-view.types";
import { UIMasterDetailView } from "../../../master-detail-view/master-detail-view.component";
import { UINavigationPage } from "../../../navigation-page/navigation-page.component";
import {
  navItem,
  type NavigationNode,
} from "../../../navigation-page/navigation-page.utils";
import { UIQuickTourMetricCard } from "./quick-tour-metric-card.component";
import { UIQuickTourNoteCard } from "./quick-tour-note-card.component";

interface WorkspaceMetric {
  readonly label: string;
  readonly value: number;
}

interface WorkflowItem {
  readonly id: number;
  readonly title: string;
  readonly owner: string;
  readonly status: "planned" | "active" | "review" | "done";
  readonly area: string;
  readonly summary: string;
  readonly impact: string;
  readonly nextStep: string;
}

interface CalendarSession {
  readonly title: string;
  readonly kind: "focus" | "review" | "handoff";
}

interface StoryIndexResponse {
  readonly entries: Record<string, StoryIndexEntry>;
}

interface StoryIndexEntry {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly type: "story" | "docs";
  readonly tags?: readonly string[];
}

interface StoryCatalogCard {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly href: string;
  readonly storyCount: number;
  readonly screenshots: readonly StoryScreenshot[];
  readonly hasScreenshots: boolean;
}

interface StoryCatalogGroup {
  readonly key: string;
  readonly label: string;
  readonly stories: readonly StoryCatalogCard[];
}

interface ScreenshotManifest {
  readonly components: readonly ScreenshotManifestComponent[];
}

interface ScreenshotManifestComponent {
  readonly title: string;
  readonly category: string;
  readonly primaryStoryId: string;
  readonly screenshots: readonly ScreenshotManifestEntry[];
}

interface ScreenshotManifestEntry {
  readonly storyId: string;
  readonly storyName: string;
  readonly theme: "light" | "dark";
  readonly filePath: string;
}

interface StoryScreenshot {
  readonly id: string;
  readonly label: string;
  readonly theme: "light" | "dark";
  readonly src: string;
}

const CURRENT_USER: ChatParticipant = {
  id: "kris",
  name: "Kris Thompson",
  avatarEmail: "kris@lucidkit.dev",
};

const TEAMMATES: Record<string, ChatParticipant> = {
  "Mina Patel": {
    id: "mina",
    name: "Mina Patel",
    avatarEmail: "mina@lucidkit.dev",
  },
  "Jules Carter": {
    id: "jules",
    name: "Jules Carter",
    avatarEmail: "jules@lucidkit.dev",
  },
  "Ava Nguyen": {
    id: "ava",
    name: "Ava Nguyen",
    avatarEmail: "ava@lucidkit.dev",
  },
};

const NAV: NavigationNode[] = [
  navItem("overview", "Overview", {
    icon: UIIcons.Lucide.Layout.LayoutDashboard,
  }),
  navItem("workflows", "Data Views", {
    icon: UIIcons.Lucide.Text.ListFilter,
  }),
  navItem("messages", "Messages", {
    icon: UIIcons.Lucide.Social.MessagesSquare,
  }),
  navItem("schedule", "Schedule", {
    icon: UIIcons.Lucide.Time.CalendarDays,
  }),
  navItem("setup", "Forms & Settings", {
    icon: UIIcons.Lucide.Account.Settings,
  }),
];

const METRICS: readonly WorkspaceMetric[] = [
  { label: "UI kit primitives", value: 70 },
  { label: "Composite blocks", value: 14 },
  { label: "Form & workspace flows", value: 5 },
  { label: "Showcase apps", value: 5 },
];

const WORKFLOWS: readonly WorkflowItem[] = [
  {
    id: 1,
    title: "Launch Workspace",
    owner: "Mina Patel",
    status: "active",
    area: "Navigation + cards",
    summary:
      "A homepage that makes the product feel understandable in 10 seconds.",
    impact: "Great first-impression flow for dashboards and internal tools.",
    nextStep: "Wire CTA cards to your real routes and data sources.",
  },
  {
    id: 2,
    title: "Approvals Inbox",
    owner: "Jules Carter",
    status: "review",
    area: "Master-detail + badges",
    summary:
      "Review items quickly with a browsable list and a rich detail pane.",
    impact: "Useful for tickets, CRM records, order queues, and admin tools.",
    nextStep: "Replace mock rows with your datasource and projected columns.",
  },
  {
    id: 3,
    title: "Team Comms",
    owner: "Ava Nguyen",
    status: "planned",
    area: "Chat + composer",
    summary:
      "A compact threaded conversation area for product and support teams.",
    impact: "Lets users message without leaving the workflow context.",
    nextStep: "Hook the send event into your API and persistence layer.",
  },
  {
    id: 4,
    title: "Release Checklist",
    owner: "Kris Thompson",
    status: "done",
    area: "Inputs + toggles",
    summary:
      "A small settings and checklist surface for repeatable operational work.",
    impact: "Great for onboarding, preferences, and runbook-style screens.",
    nextStep: "Bind fields to signals or forms and keep the styling tokens.",
  },
];

const CHART_DATA: readonly WorkspaceMetric[] = [
  { label: "Navigation", value: 92 },
  { label: "Data views", value: 87 },
  { label: "Communication", value: 78 },
  { label: "Scheduling", value: 73 },
  { label: "Forms", value: 84 },
];

const CHAT_MESSAGES: readonly ChatMessage[] = [
  {
    id: "1",
    content:
      "This is the kind of starter screen I wish every component library had.",
    timestamp: new Date("2026-04-26T09:05:00"),
    sender: TEAMMATES["Mina Patel"],
  },
  {
    id: "2",
    content:
      "Exactly. Users can see navigation, lists, chat, calendar, charts, and forms in one pass.",
    timestamp: new Date("2026-04-26T09:06:00"),
    sender: TEAMMATES["Jules Carter"],
  },
  {
    id: "3",
    content:
      "And the composer can stay lightweight for team workflows instead of looking like a full document editor.",
    timestamp: new Date("2026-04-26T09:07:00"),
    sender: CURRENT_USER,
    type: "rich-text",
  },
  {
    id: "4",
    content: "Ship this as the first stop before the deeper app showcases.",
    timestamp: new Date("2026-04-26T09:08:00"),
    sender: TEAMMATES["Ava Nguyen"],
  },
];

const CALENDAR_EVENTS: readonly CalendarEvent<CalendarSession>[] = [
  {
    id: "ev-1",
    title: "Design crit",
    start: new Date("2026-04-27T10:00:00"),
    end: new Date("2026-04-27T11:00:00"),
    color: "#d97706",
    data: { title: "Design crit", kind: "review" },
  },
  {
    id: "ev-2",
    title: "Deep work block",
    start: new Date("2026-04-28T13:00:00"),
    end: new Date("2026-04-28T16:00:00"),
    color: "#2563eb",
    data: { title: "Deep work block", kind: "focus" },
  },
  {
    id: "ev-3",
    title: "Engineering handoff",
    start: new Date("2026-04-29T15:30:00"),
    end: new Date("2026-04-29T16:15:00"),
    color: "#059669",
    data: { title: "Engineering handoff", kind: "handoff" },
  },
  {
    id: "ev-4",
    title: "Launch rehearsal",
    start: new Date("2026-04-30T11:00:00"),
    end: new Date("2026-04-30T12:00:00"),
    color: "#7c3aed",
    data: { title: "Launch rehearsal", kind: "review" },
  },
];

const CADENCE_OPTIONS: readonly SelectOption[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "milestones", label: "Milestones only" },
];

const THEME_OPTIONS: readonly SelectOption[] = [
  { value: "adaptive", label: "Adaptive theme" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const NEXT_STEPS: readonly string[] = [
  "Start with blocks for navigation-heavy screens.",
  "Drop to primitives when you need tighter control.",
  "Keep tokens and surfaces, replace only your data and content.",
];

const STORY_CATALOG_GROUP_ORDER = [
  "UI Kit",
  "UI Blocks",
  "UI Forms",
  "Showcases",
] as const;

@Component({
  selector: "ui-demo-quick-tour-showcase",
  standalone: true,
  imports: [
    UIQuickTourMetricCard,
    UIQuickTourNoteCard,
    UINavigationPage,
    UIMasterDetailView,
    UIChatView,
    UICalendarMonthView,
    UIAvatar,
    UIBadge,
    UIBadgeColumn,
    UIButton,
    UICard,
    UICardBody,
    UICardFooter,
    UICardHeader,
    UIChart,
    UIChip,
    UICheckbox,
    UICarousel,
    UIDropdownList,
    UIIcon,
    UIIndicatesTouch,
    UIInput,
    UIProgress,
    UITab,
    UITabGroup,
    UITextColumn,
    UIToggle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./a-quick-tour-showcase.component.html",
  styleUrl: "./a-quick-tour-showcase.component.scss",
})
export class UIDemoQuickTourShowcase implements OnDestroy {
  protected readonly nav = NAV;

  protected readonly activePage = signal("overview");

  protected readonly selectedDate = signal(new Date("2026-04-27T00:00:00"));

  protected readonly metrics = METRICS;

  protected readonly nextSteps = NEXT_STEPS;

  protected readonly chartData = CHART_DATA;

  protected readonly chartStrategy = new BarGraphStrategy({
    barWidthRatio: 0.72,
    borderRadius: 10,
  });

  protected readonly screenshotCarouselStrategy = new SingleCarouselStrategy();

  protected readonly activeScreenshotTheme = signal<"light" | "dark">("dark");

  protected readonly workflowDatasource = new FilterableArrayDatasource([
    ...WORKFLOWS,
  ]);

  protected readonly chatMessages = CHAT_MESSAGES;

  protected readonly currentUser = CURRENT_USER;

  protected readonly calendarEvents = CALENDAR_EVENTS;

  protected readonly calendarDatasource = new ArrayCalendarDatasource(
    CALENDAR_EVENTS,
  );

  protected readonly cadenceOptions = CADENCE_OPTIONS;

  protected readonly themeOptions = THEME_OPTIONS;

  protected readonly storyCatalogState = signal<"loading" | "ready" | "error">(
    "loading",
  );

  protected readonly storyCatalogGroups = signal<readonly StoryCatalogGroup[]>(
    [],
  );

  protected readonly storyCatalogCount = computed(() =>
    this.storyCatalogGroups().reduce(
      (count, group) => count + group.stories.length,
      0,
    ),
  );

  protected readonly themedStoryCatalogGroups = computed(() => {
    const activeTheme = this.activeScreenshotTheme();

    return this.storyCatalogGroups().map((group) => ({
      ...group,
      stories: group.stories.map((story) => {
        const screenshots = this.filterScreenshotsForTheme(
          story.screenshots,
          activeTheme,
        );

        return {
          ...story,
          screenshots,
          hasScreenshots: screenshots.length > 0,
        };
      }),
    }));
  });

  protected readonly icons = {
    sparkles: UIIcons.Lucide.Design.WandSparkles,
    barChart: UIIcons.Lucide.Charts.ChartColumn,
    checkCircle: UIIcons.Lucide.Notifications.CircleCheckBig,
    compass: UIIcons.Lucide.Navigation.Compass,
    layers: UIIcons.Lucide.Design.Layers,
    workflow: UIIcons.Lucide.Account.Waypoints,
    messages: UIIcons.Lucide.Social.MessagesSquare,
    calendar: UIIcons.Lucide.Time.CalendarDays,
    clock: UIIcons.Lucide.Time.Clock3,
    sliders: UIIcons.Lucide.Account.Settings2,
    wand: UIIcons.Lucide.Design.WandSparkles,
  } as const;

  private readonly document = inject(DOCUMENT);

  private themeObserver: MutationObserver | null = null;

  public constructor() {
    this.syncActiveScreenshotTheme();
    this.observeThemeChanges();
    void this.loadStoryCatalog();
  }

  public ngOnDestroy(): void {
    this.themeObserver?.disconnect();
  }

  private async loadStoryCatalog(): Promise<void> {
    try {
      const [indexResponse, manifestResponse] = await Promise.all([
        fetch("./index.json", { cache: "no-cache" }),
        fetch("./storybook-screenshots/manifest.json", { cache: "no-cache" }),
      ]);

      if (!indexResponse.ok) {
        throw new Error(
          `Failed to load Storybook index: ${indexResponse.status}`,
        );
      }

      const index = (await indexResponse.json()) as StoryIndexResponse;
      const manifest = manifestResponse.ok
        ? ((await manifestResponse.json()) as ScreenshotManifest)
        : null;

      this.storyCatalogGroups.set(
        this.buildStoryCatalogGroups(index, manifest),
      );
      this.storyCatalogState.set("ready");
    } catch {
      this.storyCatalogState.set("error");
    }
  }

  private buildStoryCatalogGroups(
    index: StoryIndexResponse,
    manifest: ScreenshotManifest | null,
  ): readonly StoryCatalogGroup[] {
    const groupedStories = new Map<string, StoryCatalogCard[]>();
    const manifestEntries = this.buildScreenshotLookup(manifest);
    const titleEntries = new Map<
      string,
      {
        category: string;
        title: string;
        href: string;
        storyCount: number;
        screenshots: readonly StoryScreenshot[];
      }
    >();

    for (const entry of Object.values(index.entries)) {
      if (entry.type !== "story") {
        continue;
      }

      const titleParts = entry.title.split("/").map((part) => part.trim());
      const category = titleParts[1] ?? titleParts[0] ?? "Stories";
      const title =
        titleParts.slice(2).join(" / ") || titleParts.at(-1) || entry.title;
      const titleKey = `${category}::${title}`;
      const existing = titleEntries.get(titleKey);

      if (existing) {
        titleEntries.set(titleKey, {
          ...existing,
          storyCount: existing.storyCount + 1,
        });
        continue;
      }

      titleEntries.set(titleKey, {
        category,
        title,
        href: `./?path=/story/${entry.id}`,
        storyCount: 1,
        screenshots: manifestEntries.get(titleKey) ?? [],
      });
    }

    for (const [id, entry] of titleEntries.entries()) {
      const stories = groupedStories.get(entry.category) ?? [];
      stories.push({
        id,
        title: entry.title,
        category: entry.category,
        href: entry.href,
        storyCount: entry.storyCount,
        screenshots: entry.screenshots,
        hasScreenshots: entry.screenshots.length > 0,
      });
      groupedStories.set(entry.category, stories);
    }

    return [...groupedStories.entries()]
      .sort(([categoryA], [categoryB]) => {
        const indexA = STORY_CATALOG_GROUP_ORDER.indexOf(
          categoryA as (typeof STORY_CATALOG_GROUP_ORDER)[number],
        );
        const indexB = STORY_CATALOG_GROUP_ORDER.indexOf(
          categoryB as (typeof STORY_CATALOG_GROUP_ORDER)[number],
        );

        if (indexA !== -1 || indexB !== -1) {
          return (
            (indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA) -
            (indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB)
          );
        }

        return categoryA.localeCompare(categoryB);
      })
      .map(([category, stories]) => ({
        key: category.toLowerCase().replace(/\s+/g, "-"),
        label: category,
        stories: [...stories].sort((storyA, storyB) =>
          storyA.title.localeCompare(storyB.title),
        ),
      }));
  }

  private buildScreenshotLookup(
    manifest: ScreenshotManifest | null,
  ): ReadonlyMap<string, readonly StoryScreenshot[]> {
    const lookup = new Map<string, readonly StoryScreenshot[]>();

    if (!manifest) {
      return lookup;
    }

    for (const component of manifest.components) {
      const titleParts = component.title.split("/").map((part) => part.trim());
      const category = titleParts[1] ?? component.category ?? "Stories";
      const title =
        titleParts.slice(2).join(" / ") || titleParts.at(-1) || component.title;
      const titleKey = `${category}::${title}`;

      lookup.set(
        titleKey,
        component.screenshots.map((screenshot) => ({
          id: `${screenshot.storyId}-${screenshot.theme}`,
          label: screenshot.storyName,
          theme: screenshot.theme,
          src: this.toScreenshotSrc(screenshot.filePath),
        })),
      );
    }

    return lookup;
  }

  private toScreenshotSrc(filePath: string): string {
    return `./${filePath.replace(/^artifacts\//, "")}`;
  }

  private filterScreenshotsForTheme(
    screenshots: readonly StoryScreenshot[],
    theme: "light" | "dark",
  ): readonly StoryScreenshot[] {
    const themed = screenshots.filter(
      (screenshot) => screenshot.theme === theme,
    );
    return themed.length > 0 ? themed : screenshots;
  }

  private observeThemeChanges(): void {
    const root = this.document.documentElement;

    this.themeObserver = new MutationObserver(() => {
      this.syncActiveScreenshotTheme();
    });

    this.themeObserver.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  private syncActiveScreenshotTheme(): void {
    this.activeScreenshotTheme.set(this.detectActiveScreenshotTheme());
  }

  private detectActiveScreenshotTheme(): "light" | "dark" {
    const root = this.document.documentElement;

    if (root.classList.contains("light-theme")) {
      return "light";
    }

    if (root.classList.contains("dark-theme")) {
      return "dark";
    }

    return typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
}
