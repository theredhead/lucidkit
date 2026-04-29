import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import videoSharingData from "./video-sharing-app.data.json";

import {
  FilterableArrayDatasource,
  UIAccordion,
  UIAccordionItem,
  UIAvatar,
  UIBadge,
  UIBadgeColumn,
  UIButton,
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
  UISlider,
  UITabGroup,
  UITab,
  UITabSeparator,
  UITabSpacer,
  UITemplateColumn,
  UITextColumn,
  UIToggle,
} from "@theredhead/lucid-kit";

import { UIMasterDetailView } from "../../../master-detail-view/master-detail-view.component";
import { UINavigationPage } from "../../../navigation-page/navigation-page.component";
import {
  navItem,
  navGroup,
  type NavigationNode,
} from "../../../navigation-page/navigation-page.utils";
import { UIVideoSharingPageHeader } from "./video-sharing-page-header.component";
import { UIVideoSharingStatCard } from "./video-sharing-stat-card.component";

// ── Domain types ─────────────────────────────────────────────────────

interface Video {
  readonly id: number;
  readonly title: string;
  readonly channel: string;
  readonly channelAvatar: string;
  readonly views: string;
  readonly uploaded: string;
  readonly duration: string;
  readonly category: string;
  readonly likes: number;
  readonly dislikes: number;
  readonly comments: number;
  readonly status:
    | "published"
    | "processing"
    | "draft"
    | "scheduled"
    | "removed";
}

interface Channel {
  readonly id: number;
  readonly name: string;
  readonly handle: string;
  readonly subscribers: string;
  readonly totalViews: string;
  readonly videoCount: number;
  readonly joinedDate: string;
  readonly verified: boolean;
  readonly description: string;
}

interface Comment {
  readonly id: number;
  readonly author: string;
  readonly text: string;
  readonly timestamp: string;
  readonly likes: number;
  readonly replies: number;
}

interface Playlist {
  readonly id: number;
  readonly name: string;
  readonly videoCount: number;
  readonly visibility: "public" | "private" | "unlisted";
  readonly lastUpdated: string;
}

// ── External data ───────────────────────────────────────────────────

const VIDEOS = videoSharingData.videos as Video[];
const CHANNELS = videoSharingData.channels as Channel[];
const COMMENTS = videoSharingData.comments as Comment[];
const PLAYLISTS = videoSharingData.playlists as Playlist[];

// ── Icon constants ───────────────────────────────────────────────────

const ICONS = {
  home: UIIcons.Lucide.Home.House,
  trending: UIIcons.Lucide.Arrows.TrendingUp,
  compass: UIIcons.Lucide.Navigation.Compass,
  play: UIIcons.Lucide.Multimedia.Play,
  video: UIIcons.Lucide.Communication.Video,
  upload: UIIcons.Lucide.Arrows.Upload,
  library: UIIcons.Lucide.Multimedia.Library,
  listVideo: UIIcons.Lucide.Multimedia.ListVideo,
  heart: UIIcons.Lucide.Multimedia.Heart,
  thumbsUp: UIIcons.Lucide.Social.ThumbsUp,
  thumbsDown: UIIcons.Lucide.Social.ThumbsDown,
  share: UIIcons.Lucide.Social.Share2,
  messageCircle: UIIcons.Lucide.Social.MessageCircle,
  bookmark: UIIcons.Lucide.Account.Bookmark,
  bell: UIIcons.Lucide.Account.Bell,
  clock: UIIcons.Lucide.Time.Clock,
  history: UIIcons.Lucide.Time.History,
  eye: UIIcons.Lucide.Accessibility.Eye,
  search: UIIcons.Lucide.Social.Search,
  settings: UIIcons.Lucide.Account.Settings,
  user: UIIcons.Lucide.Account.User,
  users: UIIcons.Lucide.Account.Users,
  flag: UIIcons.Lucide.Social.Flag,
  flame: UIIcons.Lucide.Social.Flame,
  film: UIIcons.Lucide.Multimedia.Film,
  clapperboard: UIIcons.Lucide.Multimedia.Clapperboard,
  star: UIIcons.Lucide.Multimedia.Star,
  volume2: UIIcons.Lucide.Multimedia.Volume2,
  globe: UIIcons.Lucide.Navigation.Globe,
} as const;

// ── Navigation structure ─────────────────────────────────────────────

const NAV: NavigationNode[] = [
  navItem("home", "Home", { icon: ICONS.home }),
  navItem("trending", "Trending", { icon: ICONS.flame }),
  navItem("explore", "Explore", { icon: ICONS.compass }),
  navGroup(
    "content-section",
    "Your Content",
    [
      navItem("videos", "Your Videos", {
        icon: ICONS.video,
        badge: String(VIDEOS.filter((v) => v.status !== "removed").length),
      }),
      navItem("upload", "Upload", { icon: ICONS.upload }),
    ],
    { icon: ICONS.clapperboard, expanded: true },
  ),
  navGroup(
    "library-section",
    "Library",
    [
      navItem("playlists", "Playlists", {
        icon: ICONS.listVideo,
        badge: String(PLAYLISTS.length),
      }),
      navItem("watch-history", "Watch History", { icon: ICONS.history }),
      navItem("liked", "Liked Videos", { icon: ICONS.heart }),
    ],
    { icon: ICONS.library },
  ),
  navItem("channels", "Channels", { icon: ICONS.users }),
  navItem("settings", "Settings", { icon: ICONS.settings }),
];

// ── Helper functions ─────────────────────────────────────────────────

function statusColor(
  status: string,
): "success" | "warning" | "danger" | "neutral" {
  switch (status) {
    case "published":
      return "success";
    case "processing":
      return "warning";
    case "draft":
      return "neutral";
    case "removed":
      return "danger";
    default:
      return "neutral";
  }
}

function visibilityColor(vis: string): "success" | "warning" | "neutral" {
  switch (vis) {
    case "public":
      return "success";
    case "unlisted":
      return "warning";
    default:
      return "neutral";
  }
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

// ── Demo component ───────────────────────────────────────────────────

@Component({
  selector: "ui-demo-video-sharing-app",
  standalone: true,
  imports: [
    UIVideoSharingPageHeader,
    UIVideoSharingStatCard,
    UINavigationPage,
    UIMasterDetailView,
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
    UISlider,
    UITextColumn,
    UITemplateColumn,
    UIBadgeColumn,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./video-sharing-app.component.html",
  styleUrl: "./video-sharing-app.component.scss",
})
export class VideoSharingAppDemo {
  protected readonly icons = ICONS;
  protected readonly nav = NAV;
  protected readonly activePage = signal("home");
  protected readonly selectedCategory = signal("All");

  protected readonly allVideos = VIDEOS.filter((v) => v.status !== "removed");
  protected readonly publishedVideos = VIDEOS.filter(
    (v) => v.status === "published",
  );

  private readonly videoBatchSize = 12;
  protected readonly visibleVideoCount = signal(12);
  protected readonly visibleVideos = computed(() =>
    this.publishedVideos.slice(0, this.visibleVideoCount()),
  );
  protected readonly hasMoreVideos = computed(
    () => this.visibleVideoCount() < this.publishedVideos.length,
  );

  protected readonly loadMoreSentinel =
    viewChild<ElementRef<HTMLElement>>("loadMoreSentinel");

  private readonly destroyRef = inject(DestroyRef);
  protected readonly trendingVideos = [...VIDEOS]
    .filter((v) => v.status === "published")
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);
  protected readonly likedVideos = VIDEOS.filter((v) => v.likes > 50000);
  protected readonly channelList = CHANNELS;
  protected readonly playlists = PLAYLISTS;
  protected readonly recentComments = COMMENTS.slice(0, 4);

  protected readonly categories = [
    "All",
    "Education",
    "Music",
    "Science",
    "Travel",
    "Food",
    "Fitness",
    "Gaming",
  ];
  protected readonly uniqueCategories = [
    ...new Set(VIDEOS.map((v) => v.category)),
  ];

  protected readonly videosDs = new FilterableArrayDatasource(VIDEOS);
  protected readonly channelsDs = new FilterableArrayDatasource(CHANNELS);
  protected readonly historyDs = new FilterableArrayDatasource(
    VIDEOS.filter((v) => v.status === "published").slice(0, 6),
  );
  protected readonly likedDs = new FilterableArrayDatasource(
    VIDEOS.filter((v) => v.likes > 50000),
  );

  protected readonly categoryOptions = [
    "Education",
    "Music",
    "Science",
    "Travel",
    "Food",
    "Fitness",
    "Gaming",
    "Other",
  ].map((c) => ({ label: c, value: c }));

  protected readonly visibilityOptions = [
    { label: "Public", value: "public" },
    { label: "Unlisted", value: "unlisted" },
    { label: "Private", value: "private" },
  ];

  protected readonly qualityOptions = [
    { label: "Auto", value: "auto" },
    { label: "1080p", value: "1080" },
    { label: "720p", value: "720" },
    { label: "480p", value: "480" },
    { label: "360p", value: "360" },
  ];

  protected readonly languageOptions = [
    { label: "English", value: "en" },
    { label: "Spanish", value: "es" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Japanese", value: "ja" },
  ];

  protected videoStatusColor(
    status: string,
  ): "success" | "warning" | "danger" | "neutral" {
    return statusColor(status);
  }

  protected playlistVisColor(vis: string): "success" | "warning" | "neutral" {
    return visibilityColor(vis);
  }

  protected formatNum(n: number): string {
    return formatNumber(n);
  }

  public constructor() {
    afterNextRender(() => this.setupInfiniteScroll());
  }

  private setupInfiniteScroll(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && this.hasMoreVideos()) {
          this.loadMoreVideos();
        }
      },
      { rootMargin: "200px" },
    );

    this.destroyRef.onDestroy(() => observer.disconnect());

    // Re-observe whenever the sentinel element (re)appears
    let currentEl: HTMLElement | null = null;
    const check = (): void => {
      const el = this.loadMoreSentinel()?.nativeElement ?? null;
      if (el !== currentEl) {
        if (currentEl) observer.unobserve(currentEl);
        if (el) observer.observe(el);
        currentEl = el;
      }
      if (!this.destroyed) requestAnimationFrame(check);
    };
    check();
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
    });
  }

  private destroyed = false;

  private loadMoreVideos(): void {
    this.visibleVideoCount.update((n) =>
      Math.min(n + this.videoBatchSize, this.publishedVideos.length),
    );
  }
}

// ── Story meta ───────────────────────────────────────────────────────
