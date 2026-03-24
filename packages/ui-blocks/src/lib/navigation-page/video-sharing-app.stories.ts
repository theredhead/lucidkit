import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

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
  UISelect,
  UISlider,
  UITabGroup,
  UITab,
  UITabSeparator,
  UITabSpacer,
  UITemplateColumn,
  UITextColumn,
  UIToggle,
} from "@theredhead/ui-kit";

import { UIMasterDetailView } from "../master-detail-view/master-detail-view.component";
import { UINavigationPage } from "./navigation-page.component";
import {
  navItem,
  navGroup,
  type NavigationNode,
} from "./navigation-page.utils";

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
  readonly status: "published" | "processing" | "draft" | "removed";
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

// ── Seed data ────────────────────────────────────────────────────────

const VIDEOS: Video[] = [
  {
    id: 1,
    title: "Building a REST API from Scratch — Full Course",
    channel: "CodeCraft Studio",
    channelAvatar: "CC",
    views: "1.2M views",
    uploaded: "2 weeks ago",
    duration: "3:24:10",
    category: "Education",
    likes: 42300,
    dislikes: 812,
    comments: 3480,
    status: "published",
  },
  {
    id: 2,
    title: "Lo-fi Beats to Code & Relax To",
    channel: "ChillWave Radio",
    channelAvatar: "CW",
    views: "8.4M views",
    uploaded: "6 months ago",
    duration: "11:54:32",
    category: "Music",
    likes: 195000,
    dislikes: 2100,
    comments: 12400,
    status: "published",
  },
  {
    id: 3,
    title: "Top 10 Hidden Gems in Iceland — Travel Vlog",
    channel: "Wanderlust Diaries",
    channelAvatar: "WD",
    views: "572K views",
    uploaded: "1 month ago",
    duration: "22:18",
    category: "Travel",
    likes: 23100,
    dislikes: 340,
    comments: 1850,
    status: "published",
  },
  {
    id: 4,
    title: "Why Quantum Computers Will Change Everything",
    channel: "ScienceNova",
    channelAvatar: "SN",
    views: "3.1M views",
    uploaded: "3 weeks ago",
    duration: "18:45",
    category: "Science",
    likes: 98700,
    dislikes: 1560,
    comments: 7200,
    status: "published",
  },
  {
    id: 5,
    title: "Perfect Homemade Ramen — Chef's Recipe",
    channel: "Umami Kitchen",
    channelAvatar: "UK",
    views: "2.7M views",
    uploaded: "2 months ago",
    duration: "16:33",
    category: "Food",
    likes: 87600,
    dislikes: 910,
    comments: 4320,
    status: "published",
  },
  {
    id: 6,
    title: "Advanced TypeScript Patterns You Should Know",
    channel: "CodeCraft Studio",
    channelAvatar: "CC",
    views: "340K views",
    uploaded: "5 days ago",
    duration: "45:12",
    category: "Education",
    likes: 15200,
    dislikes: 110,
    comments: 892,
    status: "published",
  },
  {
    id: 7,
    title: "Morning Yoga Flow — 20 Minute Routine",
    channel: "ZenBody Fitness",
    channelAvatar: "ZB",
    views: "1.8M views",
    uploaded: "4 months ago",
    duration: "21:07",
    category: "Fitness",
    likes: 67400,
    dislikes: 420,
    comments: 2910,
    status: "published",
  },
  {
    id: 8,
    title: "The History of the Internet in 30 Minutes",
    channel: "ScienceNova",
    channelAvatar: "SN",
    views: "890K views",
    uploaded: "1 week ago",
    duration: "31:22",
    category: "Science",
    likes: 34100,
    dislikes: 280,
    comments: 1640,
    status: "published",
  },
  {
    id: 9,
    title: "Street Photography Tips for Beginners",
    channel: "LensLife",
    channelAvatar: "LL",
    views: "445K views",
    uploaded: "3 months ago",
    duration: "14:58",
    category: "Education",
    likes: 19800,
    dislikes: 150,
    comments: 1120,
    status: "published",
  },
  {
    id: 10,
    title: "Uploading new content — processing",
    channel: "CodeCraft Studio",
    channelAvatar: "CC",
    views: "0 views",
    uploaded: "Just now",
    duration: "8:20",
    category: "Education",
    likes: 0,
    dislikes: 0,
    comments: 0,
    status: "processing",
  },
  {
    id: 11,
    title: "Draft: Gaming Setup Tour 2026",
    channel: "PixelPlay",
    channelAvatar: "PP",
    views: "0 views",
    uploaded: "—",
    duration: "12:44",
    category: "Gaming",
    likes: 0,
    dislikes: 0,
    comments: 0,
    status: "draft",
  },
  {
    id: 12,
    title: "[Removed] Community guideline violation",
    channel: "Unknown",
    channelAvatar: "XX",
    views: "12K views",
    uploaded: "2 weeks ago",
    duration: "5:10",
    category: "Other",
    likes: 0,
    dislikes: 0,
    comments: 0,
    status: "removed",
  },
];

const CHANNELS: Channel[] = [
  {
    id: 1,
    name: "CodeCraft Studio",
    handle: "@codecraft",
    subscribers: "1.4M",
    totalViews: "42M",
    videoCount: 284,
    joinedDate: "2019-06-15",
    verified: true,
    description:
      "Programming tutorials, code reviews, and developer tooling. New videos every Tuesday & Friday.",
  },
  {
    id: 2,
    name: "ChillWave Radio",
    handle: "@chillwave",
    subscribers: "3.2M",
    totalViews: "180M",
    videoCount: 52,
    joinedDate: "2020-01-10",
    verified: true,
    description:
      "24/7 lo-fi hip hop & ambient mixes for studying, coding, and relaxing.",
  },
  {
    id: 3,
    name: "Wanderlust Diaries",
    handle: "@wanderlust",
    subscribers: "890K",
    totalViews: "28M",
    videoCount: 127,
    joinedDate: "2018-03-22",
    verified: false,
    description:
      "Solo travel vlogs from around the world. Budget tips, hidden spots, and cultural deep dives.",
  },
  {
    id: 4,
    name: "ScienceNova",
    handle: "@sciencenova",
    subscribers: "5.6M",
    totalViews: "320M",
    videoCount: 198,
    joinedDate: "2017-09-01",
    verified: true,
    description:
      "Making complex science accessible. Physics, biology, tech, and everything in between.",
  },
  {
    id: 5,
    name: "Umami Kitchen",
    handle: "@umamikitchen",
    subscribers: "2.1M",
    totalViews: "95M",
    videoCount: 310,
    joinedDate: "2016-11-28",
    verified: true,
    description:
      "Restaurant-quality recipes made simple. Japanese, Korean, and fusion cuisine.",
  },
  {
    id: 6,
    name: "ZenBody Fitness",
    handle: "@zenbody",
    subscribers: "780K",
    totalViews: "18M",
    videoCount: 89,
    joinedDate: "2021-02-14",
    verified: false,
    description:
      "Yoga, meditation, and bodyweight workouts for all levels. Your daily dose of mindful movement.",
  },
];

const COMMENTS: Comment[] = [
  {
    id: 1,
    author: "DevMaster42",
    text: "This is exactly what I needed! Been struggling with REST APIs for weeks.",
    timestamp: "2 days ago",
    likes: 342,
    replies: 12,
  },
  {
    id: 2,
    author: "SarahCodes",
    text: "The section on middleware was incredibly clear. Subscribed!",
    timestamp: "1 week ago",
    likes: 128,
    replies: 3,
  },
  {
    id: 3,
    author: "NightOwlDev",
    text: "I listen to this every night while coding. It never gets old.",
    timestamp: "3 weeks ago",
    likes: 2100,
    replies: 45,
  },
  {
    id: 4,
    author: "TechReviewer",
    text: "Great explanation but I think you missed the point about error handling at 14:22.",
    timestamp: "5 days ago",
    likes: 67,
    replies: 8,
  },
  {
    id: 5,
    author: "WandererJane",
    text: "Iceland is on my bucket list! These hidden gems look amazing.",
    timestamp: "2 weeks ago",
    likes: 215,
    replies: 6,
  },
  {
    id: 6,
    author: "FoodLover99",
    text: "Made this last weekend. My family couldn't believe it was homemade!",
    timestamp: "1 month ago",
    likes: 890,
    replies: 22,
  },
  {
    id: 7,
    author: "QuantumFanatic",
    text: "Finally a video that explains quantum computing without dumbing it down too much.",
    timestamp: "4 days ago",
    likes: 456,
    replies: 15,
  },
  {
    id: 8,
    author: "BeginnerCoder",
    text: "Can you do a follow-up on GraphQL vs REST? Would love to see a comparison!",
    timestamp: "1 day ago",
    likes: 89,
    replies: 2,
  },
];

const PLAYLISTS: Playlist[] = [
  {
    id: 1,
    name: "Watch Later",
    videoCount: 47,
    visibility: "private",
    lastUpdated: "Today",
  },
  {
    id: 2,
    name: "Programming Tutorials",
    videoCount: 23,
    visibility: "public",
    lastUpdated: "2 days ago",
  },
  {
    id: 3,
    name: "Cooking Inspiration",
    videoCount: 15,
    visibility: "public",
    lastUpdated: "1 week ago",
  },
  {
    id: 4,
    name: "Study Music",
    videoCount: 8,
    visibility: "unlisted",
    lastUpdated: "3 days ago",
  },
  {
    id: 5,
    name: "Travel Plans 2026",
    videoCount: 31,
    visibility: "private",
    lastUpdated: "5 days ago",
  },
];

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
    UINavigationPage,
    UIMasterDetailView,
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
    UISlider,
    UITextColumn,
    UITemplateColumn,
    UIBadgeColumn,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: grid;
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

      /* Video grid */
      .video-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 1rem;
      }
      .video-thumb {
        aspect-ratio: 16 / 9;
        background: var(--ui-surface-dim, #e8eaed);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--ui-text-muted, #6b7280);
        font-size: 0.82rem;
        position: relative;
      }
      .video-duration {
        position: absolute;
        bottom: 6px;
        right: 6px;
        background: rgba(0, 0, 0, 0.75);
        color: #fff;
        font-size: 0.72rem;
        padding: 1px 6px;
        border-radius: 3px;
        font-weight: 600;
      }
      .video-meta {
        display: flex;
        gap: 0.65rem;
        margin-top: 0.65rem;
      }
      .video-info {
        flex: 1;
        min-width: 0;
      }
      .video-title {
        font-weight: 600;
        font-size: 0.88rem;
        line-height: 1.3;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .video-channel-name {
        font-size: 0.78rem;
        opacity: 0.65;
        margin: 0.2rem 0 0;
      }
      .video-stats {
        font-size: 0.75rem;
        opacity: 0.55;
        margin: 0.1rem 0 0;
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
        grid-template-columns: 8rem 1fr;
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

      /* Action bar */
      .action-bar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 0;
        flex-wrap: wrap;
      }
      .action-count {
        font-size: 0.82rem;
        font-weight: 600;
        margin-left: 0.25rem;
      }

      /* Channel cards */
      .channel-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      .channel-stats {
        display: flex;
        gap: 1rem;
        font-size: 0.82rem;
        margin-top: 0.5rem;
      }
      .channel-stat-item {
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }

      /* Playlist cards */
      .playlist-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1rem;
      }

      /* Trending list */
      .trending-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--ui-border, #d7dce2);
      }
      .trending-item:last-child {
        border-bottom: none;
      }
      .trending-rank {
        font-size: 1.5rem;
        font-weight: 800;
        opacity: 0.35;
        min-width: 2rem;
        text-align: center;
      }
      .trending-thumb {
        width: 160px;
        aspect-ratio: 16 / 9;
        background: var(--ui-surface-dim, #e8eaed);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        position: relative;
      }
      .trending-info {
        flex: 1;
        min-width: 0;
      }

      /* Upload form */
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        max-width: 36rem;
      }
      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .field-label {
        font-size: 0.82rem;
        font-weight: 600;
      }
      .form-field-full {
        grid-column: 1 / -1;
      }
      .form-actions {
        grid-column: 1 / -1;
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }

      /* Comment list */
      .comment-item {
        display: flex;
        gap: 0.75rem;
        padding: 0.75rem 0;
        border-bottom: 1px solid var(--ui-border, #d7dce2);
      }
      .comment-item:last-child {
        border-bottom: none;
      }
      .comment-body {
        flex: 1;
        min-width: 0;
      }
      .comment-author {
        font-weight: 600;
        font-size: 0.85rem;
      }
      .comment-time {
        font-size: 0.75rem;
        opacity: 0.55;
        margin-left: 0.5rem;
      }
      .comment-text {
        font-size: 0.85rem;
        line-height: 1.45;
        margin: 0.25rem 0 0.35rem;
      }
      .comment-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.78rem;
        opacity: 0.65;
      }
      .comment-action {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        cursor: pointer;
      }

      /* Settings */
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

      /* Category chip strip */
      .category-strip {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }

      /* Scrollable content area */
      .scroll-area {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding-right: 0.25rem;
      }
    `,
  ],
  template: `
    <ui-navigation-page
      [items]="nav"
      [(activePage)]="activePage"
      rootLabel="StreamHub"
    >
      <ng-template #content let-node>
        <!-- ─── Home ─── -->
        @if (node.id === "home") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.home" [size]="24" />
                <h2>Home</h2>
              </div>
              <div class="page-actions">
                <ui-input
                  placeholder="Search videos..."
                  ariaLabel="Search"
                  style="width: 240px"
                />
              </div>
            </div>

            <div class="category-strip">
              @for (cat of categories; track cat) {
                <ui-chip
                  [color]="selectedCategory() === cat ? 'primary' : 'neutral'"
                  (click)="selectedCategory.set(cat)"
                >
                  {{ cat }}
                </ui-chip>
              }
            </div>

            <div class="scroll-area">
              <div class="video-grid">
                @for (video of publishedVideos; track video.id) {
                  <div>
                    <div class="video-thumb">
                      <ui-icon [svg]="icons.play" [size]="32" />
                      <span class="video-duration">{{ video.duration }}</span>
                    </div>
                    <div class="video-meta">
                      <ui-avatar [name]="video.channel" size="sm" />
                      <div class="video-info">
                        <p class="video-title">{{ video.title }}</p>
                        <p class="video-channel-name">{{ video.channel }}</p>
                        <p class="video-stats">
                          {{ video.views }} · {{ video.uploaded }}
                        </p>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        <!-- ─── Trending ─── -->
        @if (node.id === "trending") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.flame" [size]="24" />
                <h2>Trending</h2>
              </div>
            </div>

            <ui-tab-group panelStyle="outline">
              <ui-tab label="Now" [icon]="icons.flame">
                <div class="scroll-area" style="padding-top: 0.5rem">
                  @for (
                    video of trendingVideos;
                    track video.id;
                    let i = $index
                  ) {
                    <div class="trending-item">
                      <span class="trending-rank">{{ i + 1 }}</span>
                      <div class="trending-thumb">
                        <ui-icon [svg]="icons.play" [size]="20" />
                        <span class="video-duration">{{ video.duration }}</span>
                      </div>
                      <div class="trending-info">
                        <p class="video-title">{{ video.title }}</p>
                        <p class="video-channel-name">{{ video.channel }}</p>
                        <p class="video-stats">
                          {{ video.views }} · {{ video.uploaded }}
                        </p>
                        <div
                          style="display: flex; gap: 0.5rem; margin-top: 0.35rem"
                        >
                          <ui-chip color="neutral">{{
                            video.category
                          }}</ui-chip>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </ui-tab>
              <ui-tab-separator />
              <ui-tab label="Music" [icon]="icons.volume2">
                <div style="padding: 1rem 0; font-size: 0.88rem; opacity: 0.65">
                  Trending music videos — curated by genre and popularity.
                </div>
              </ui-tab>
              <ui-tab label="Gaming" [icon]="icons.film">
                <div style="padding: 1rem 0; font-size: 0.88rem; opacity: 0.65">
                  Top gaming content — streams, walkthroughs, and esports
                  highlights.
                </div>
              </ui-tab>
            </ui-tab-group>
          </div>
        }

        <!-- ─── Explore ─── -->
        @if (node.id === "explore") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.compass" [size]="24" />
                <h2>Explore</h2>
              </div>
            </div>

            <div class="stats-grid">
              <ui-card variant="outlined">
                <ui-card-body>
                  <div class="stat-label">Total Videos</div>
                  <div class="stat-value">{{ publishedVideos.length }}</div>
                  <ui-progress [value]="100" ariaLabel="Videos" />
                </ui-card-body>
              </ui-card>
              <ui-card variant="outlined">
                <ui-card-body>
                  <div class="stat-label">Channels</div>
                  <div class="stat-value">{{ channelList.length }}</div>
                  <ui-progress [value]="100" ariaLabel="Channels" />
                </ui-card-body>
              </ui-card>
              <ui-card variant="outlined">
                <ui-card-body>
                  <div class="stat-label">Categories</div>
                  <div class="stat-value">{{ uniqueCategories.length }}</div>
                  <ui-progress
                    [value]="(uniqueCategories.length / 10) * 100"
                    ariaLabel="Categories"
                  />
                </ui-card-body>
              </ui-card>
              <ui-card variant="outlined">
                <ui-card-body>
                  <div class="stat-label">Top Channel</div>
                  <div class="stat-value" style="font-size: 1.25rem">
                    ScienceNova
                  </div>
                  <ui-progress [value]="82" ariaLabel="Engagement" />
                </ui-card-body>
              </ui-card>
            </div>

            <h3 style="margin: 0 0 0.75rem; font-size: 1rem">
              Browse by Category
            </h3>
            <div class="category-strip">
              @for (cat of uniqueCategories; track cat) {
                <ui-chip color="neutral">{{ cat }}</ui-chip>
              }
            </div>

            <h3 style="margin: 1rem 0 0.75rem; font-size: 1rem">
              Popular Channels
            </h3>
            <div class="channel-grid">
              @for (ch of channelList.slice(0, 4); track ch.id) {
                <ui-card variant="outlined">
                  <ui-card-body>
                    <div class="detail-header">
                      <ui-avatar [name]="ch.name" size="md" />
                      <div>
                        <h4 class="detail-name">
                          {{ ch.name }}
                          @if (ch.verified) {
                            <ui-chip color="primary">verified</ui-chip>
                          }
                        </h4>
                        <p class="detail-sub">{{ ch.handle }}</p>
                      </div>
                    </div>
                    <div class="channel-stats">
                      <span class="channel-stat-item">
                        <ui-icon [svg]="icons.users" [size]="14" />
                        {{ ch.subscribers }}
                      </span>
                      <span class="channel-stat-item">
                        <ui-icon [svg]="icons.eye" [size]="14" />
                        {{ ch.totalViews }}
                      </span>
                      <span class="channel-stat-item">
                        <ui-icon [svg]="icons.video" [size]="14" />
                        {{ ch.videoCount }}
                      </span>
                    </div>
                  </ui-card-body>
                </ui-card>
              }
            </div>
          </div>
        }

        <!-- ─── Your Videos (master-detail) ─── -->
        @if (node.id === "videos") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.video" [size]="24" />
                <h2>Your Videos</h2>
                <ui-badge
                  variant="count"
                  [count]="allVideos.length"
                  color="primary"
                />
              </div>
              <div class="page-actions">
                <ui-button
                  variant="outlined"
                  size="sm"
                  (click)="activePage.set('upload')"
                >
                  Upload New
                </ui-button>
              </div>
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="videosDs"
                title="Videos"
                [showFilter]="true"
                placeholder="Select a video to view details"
              >
                <ui-template-column key="title" headerText="Video">
                  <ng-template let-row>
                    <div
                      style="display: flex; align-items: center; gap: 0.5rem"
                    >
                      <ui-icon [svg]="icons.film" [size]="16" />
                      <span style="font-weight: 600">{{ row.title }}</span>
                    </div>
                  </ng-template>
                </ui-template-column>
                <ui-text-column key="views" headerText="Views" />
                <ui-badge-column key="status" headerText="Status" />

                <ng-template #detail let-video>
                  <div class="detail-header">
                    <ui-icon [svg]="icons.play" [size]="28" />
                    <div>
                      <h3 class="detail-name">{{ video.title }}</h3>
                      <p class="detail-sub">
                        {{ video.channel }} · {{ video.uploaded }}
                      </p>
                    </div>
                    <div style="margin-left: auto">
                      <ui-chip [color]="videoStatusColor(video.status)">
                        {{ video.status }}
                      </ui-chip>
                    </div>
                  </div>

                  <ui-tab-group panelStyle="flat">
                    <ui-tab label="Details" [icon]="icons.film">
                      <dl class="detail-grid" style="padding-top: 0.75rem">
                        <dt>Duration</dt>
                        <dd>{{ video.duration }}</dd>
                        <dt>Category</dt>
                        <dd>{{ video.category }}</dd>
                        <dt>Views</dt>
                        <dd>{{ video.views }}</dd>
                        <dt>Likes</dt>
                        <dd>{{ formatNum(video.likes) }}</dd>
                        <dt>Dislikes</dt>
                        <dd>{{ formatNum(video.dislikes) }}</dd>
                        <dt>Comments</dt>
                        <dd>{{ formatNum(video.comments) }}</dd>
                        <dt>Status</dt>
                        <dd>
                          <ui-chip [color]="videoStatusColor(video.status)">
                            {{ video.status }}
                          </ui-chip>
                        </dd>
                      </dl>
                    </ui-tab>
                    <ui-tab label="Engagement" [icon]="icons.thumbsUp">
                      <div style="padding-top: 0.75rem">
                        <div class="action-bar">
                          <ui-icon [svg]="icons.thumbsUp" [size]="16" />
                          <span class="action-count">
                            {{ formatNum(video.likes) }}
                          </span>
                          <ui-icon
                            [svg]="icons.thumbsDown"
                            [size]="16"
                            style="margin-left: 0.75rem"
                          />
                          <span class="action-count">
                            {{ formatNum(video.dislikes) }}
                          </span>
                          <ui-icon
                            [svg]="icons.messageCircle"
                            [size]="16"
                            style="margin-left: 0.75rem"
                          />
                          <span class="action-count">
                            {{ formatNum(video.comments) }}
                          </span>
                        </div>
                        @if (video.likes + video.dislikes > 0) {
                          <div style="margin-top: 0.5rem">
                            <span class="field-label">Like ratio</span>
                            <ui-progress
                              [value]="
                                (video.likes / (video.likes + video.dislikes)) *
                                100
                              "
                              ariaLabel="Like ratio"
                            />
                          </div>
                        }
                      </div>
                    </ui-tab>
                    <ui-tab-spacer />
                    <ui-tab [icon]="icons.share" ariaLabel="Share">
                      <div style="padding-top: 0.75rem; font-size: 0.88rem">
                        <p style="margin: 0 0 0.5rem">Share this video:</p>
                        <div style="display: flex; gap: 0.5rem">
                          <ui-button variant="outlined" size="sm">
                            Copy Link
                          </ui-button>
                          <ui-button variant="ghost" size="sm">
                            Embed
                          </ui-button>
                        </div>
                      </div>
                    </ui-tab>
                  </ui-tab-group>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── Upload ─── -->
        @if (node.id === "upload") {
          <div class="page-header">
            <div class="page-title">
              <ui-icon [svg]="icons.upload" [size]="24" />
              <h2>Upload Video</h2>
            </div>
          </div>

          <ui-card variant="outlined">
            <ui-card-header>
              <h3 style="margin: 0; font-size: 1rem">Video Details</h3>
            </ui-card-header>
            <ui-card-body>
              <div class="form-grid">
                <div class="form-field form-field-full">
                  <span class="field-label">Title</span>
                  <ui-input
                    placeholder="Enter video title"
                    ariaLabel="Video title"
                  />
                </div>
                <div class="form-field form-field-full">
                  <span class="field-label">Description</span>
                  <ui-input
                    placeholder="Describe your video..."
                    ariaLabel="Video description"
                  />
                </div>
                <div class="form-field">
                  <span class="field-label">Category</span>
                  <ui-select
                    [options]="categoryOptions"
                    placeholder="Select category"
                    ariaLabel="Category"
                  />
                </div>
                <div class="form-field">
                  <span class="field-label">Visibility</span>
                  <ui-select
                    [options]="visibilityOptions"
                    placeholder="Select visibility"
                    ariaLabel="Visibility"
                  />
                </div>
                <div class="form-field form-field-full">
                  <span class="field-label">Tags</span>
                  <ui-input
                    placeholder="tutorial, coding, typescript"
                    ariaLabel="Tags"
                  />
                </div>
                <div class="form-field form-field-full">
                  <ui-checkbox ariaLabel="Allow comments">
                    Allow comments on this video
                  </ui-checkbox>
                </div>
                <div class="form-field form-field-full">
                  <ui-checkbox ariaLabel="Age restriction">
                    This video is made for kids
                  </ui-checkbox>
                </div>
                <div class="form-actions">
                  <ui-button variant="filled">Publish</ui-button>
                  <ui-button variant="outlined">Save as Draft</ui-button>
                  <ui-button variant="ghost" (click)="activePage.set('videos')">
                    Cancel
                  </ui-button>
                </div>
              </div>
            </ui-card-body>
          </ui-card>
        }

        <!-- ─── Playlists ─── -->
        @if (node.id === "playlists") {
          <div class="page-header">
            <div class="page-title">
              <ui-icon [svg]="icons.listVideo" [size]="24" />
              <h2>Playlists</h2>
              <ui-badge
                variant="count"
                [count]="playlists.length"
                color="primary"
              />
            </div>
            <div class="page-actions">
              <ui-button variant="outlined" size="sm">New Playlist</ui-button>
            </div>
          </div>

          <div class="playlist-grid">
            @for (pl of playlists; track pl.id) {
              <ui-card variant="outlined">
                <ui-card-body>
                  <div
                    style="display: flex; align-items: center; justify-content: space-between"
                  >
                    <span style="font-weight: 700">{{ pl.name }}</span>
                    <ui-chip [color]="playlistVisColor(pl.visibility)">
                      {{ pl.visibility }}
                    </ui-chip>
                  </div>
                  <div
                    style="margin-top: 0.5rem; font-size: 0.82rem; opacity: 0.65"
                  >
                    {{ pl.videoCount }} videos · Updated {{ pl.lastUpdated }}
                  </div>
                </ui-card-body>
                <ui-card-footer>
                  <div style="display: flex; gap: 0.5rem">
                    <ui-button variant="ghost" size="sm">Play All</ui-button>
                    <ui-button variant="ghost" size="sm">Edit</ui-button>
                  </div>
                </ui-card-footer>
              </ui-card>
            }
          </div>
        }

        <!-- ─── Watch History ─── -->
        @if (node.id === "watch-history") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.history" [size]="24" />
                <h2>Watch History</h2>
              </div>
              <div class="page-actions">
                <ui-button variant="ghost" size="sm">Clear History</ui-button>
              </div>
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="historyDs"
                title="Recently Watched"
                placeholder="Select a video to see details"
              >
                <ui-template-column key="title" headerText="Video">
                  <ng-template let-row>
                    <div
                      style="display: flex; align-items: center; gap: 0.5rem"
                    >
                      <ui-icon [svg]="icons.clock" [size]="14" />
                      <span style="font-weight: 600">{{ row.title }}</span>
                    </div>
                  </ng-template>
                </ui-template-column>
                <ui-text-column key="channel" headerText="Channel" />
                <ui-text-column key="duration" headerText="Duration" />

                <ng-template #detail let-video>
                  <dl class="detail-grid">
                    <dt>Title</dt>
                    <dd>{{ video.title }}</dd>
                    <dt>Channel</dt>
                    <dd>{{ video.channel }}</dd>
                    <dt>Duration</dt>
                    <dd>{{ video.duration }}</dd>
                    <dt>Views</dt>
                    <dd>{{ video.views }}</dd>
                    <dt>Category</dt>
                    <dd>{{ video.category }}</dd>
                  </dl>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── Liked Videos ─── -->
        @if (node.id === "liked") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.heart" [size]="24" />
                <h2>Liked Videos</h2>
                <ui-badge
                  variant="count"
                  [count]="likedVideos.length"
                  color="primary"
                />
              </div>
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="likedDs"
                title="Liked"
                placeholder="Select a liked video"
              >
                <ui-template-column key="title" headerText="Video">
                  <ng-template let-row>
                    <div
                      style="display: flex; align-items: center; gap: 0.5rem"
                    >
                      <ui-icon [svg]="icons.heart" [size]="14" />
                      <span style="font-weight: 600">{{ row.title }}</span>
                    </div>
                  </ng-template>
                </ui-template-column>
                <ui-text-column key="channel" headerText="Channel" />
                <ui-text-column key="views" headerText="Views" />

                <ng-template #detail let-video>
                  <div class="detail-header">
                    <ui-icon [svg]="icons.heart" [size]="28" />
                    <div>
                      <h3 class="detail-name">{{ video.title }}</h3>
                      <p class="detail-sub">{{ video.channel }}</p>
                    </div>
                  </div>
                  <div class="action-bar">
                    <ui-icon [svg]="icons.thumbsUp" [size]="16" />
                    <span class="action-count">
                      {{ formatNum(video.likes) }}
                    </span>
                    <ui-icon
                      [svg]="icons.eye"
                      [size]="16"
                      style="margin-left: 0.75rem"
                    />
                    <span class="action-count">{{ video.views }}</span>
                  </div>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── Channels ─── -->
        @if (node.id === "channels") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.users" [size]="24" />
                <h2>Channels</h2>
                <ui-badge
                  variant="count"
                  [count]="channelList.length"
                  color="primary"
                />
              </div>
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="channelsDs"
                title="Channels"
                [showFilter]="true"
                placeholder="Select a channel to view its profile"
              >
                <ui-template-column key="name" headerText="Channel">
                  <ng-template let-row>
                    <div
                      style="display: flex; align-items: center; gap: 0.5rem"
                    >
                      <ui-avatar [name]="row.name" size="sm" />
                      <span style="font-weight: 600">{{ row.name }}</span>
                      @if (row.verified) {
                        <ui-chip color="primary">verified</ui-chip>
                      }
                    </div>
                  </ng-template>
                </ui-template-column>
                <ui-text-column key="subscribers" headerText="Subscribers" />
                <ui-text-column key="videoCount" headerText="Videos" />

                <ng-template #detail let-ch>
                  <div class="detail-header">
                    <ui-avatar [name]="ch.name" size="lg" />
                    <div>
                      <h3 class="detail-name">
                        {{ ch.name }}
                        @if (ch.verified) {
                          <ui-chip color="primary">verified</ui-chip>
                        }
                      </h3>
                      <p class="detail-sub">{{ ch.handle }}</p>
                    </div>
                    <div style="margin-left: auto">
                      <ui-button variant="filled" size="sm">
                        Subscribe
                      </ui-button>
                    </div>
                  </div>

                  <ui-tab-group panelStyle="flat">
                    <ui-tab label="About" [icon]="icons.user">
                      <dl class="detail-grid" style="padding-top: 0.75rem">
                        <dt>Subscribers</dt>
                        <dd>{{ ch.subscribers }}</dd>
                        <dt>Total Views</dt>
                        <dd>{{ ch.totalViews }}</dd>
                        <dt>Videos</dt>
                        <dd>{{ ch.videoCount }}</dd>
                        <dt>Joined</dt>
                        <dd>{{ ch.joinedDate }}</dd>
                        <dt>Description</dt>
                        <dd>{{ ch.description }}</dd>
                      </dl>
                    </ui-tab>
                    <ui-tab label="Community" [icon]="icons.messageCircle">
                      <div style="padding-top: 0.75rem">
                        <h4 style="margin: 0 0 0.5rem; font-size: 0.95rem">
                          Recent Comments
                        </h4>
                        @for (comment of recentComments; track comment.id) {
                          <div class="comment-item">
                            <ui-avatar [name]="comment.author" size="sm" />
                            <div class="comment-body">
                              <span class="comment-author">
                                {{ comment.author }}
                              </span>
                              <span class="comment-time">
                                {{ comment.timestamp }}
                              </span>
                              <p class="comment-text">{{ comment.text }}</p>
                              <div class="comment-actions">
                                <span class="comment-action">
                                  <ui-icon [svg]="icons.thumbsUp" [size]="12" />
                                  {{ comment.likes }}
                                </span>
                                <span class="comment-action">
                                  <ui-icon
                                    [svg]="icons.messageCircle"
                                    [size]="12"
                                  />
                                  {{ comment.replies }}
                                </span>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    </ui-tab>
                    <ui-tab-spacer />
                    <ui-tab [icon]="icons.bell" ariaLabel="Notifications">
                      <div style="padding-top: 0.75rem; font-size: 0.88rem">
                        <p style="margin: 0 0 0.5rem">
                          Notification preferences for this channel.
                        </p>
                        <div style="display: flex; gap: 0.5rem">
                          <ui-chip color="primary">All</ui-chip>
                          <ui-chip color="neutral">Personalized</ui-chip>
                          <ui-chip color="neutral">None</ui-chip>
                        </div>
                      </div>
                    </ui-tab>
                  </ui-tab-group>
                </ng-template>
              </ui-master-detail-view>
            </div>
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

            <ui-tab-group>
              <ui-tab label="Playback" [icon]="icons.play">
                <div style="padding-top: 0.75rem">
                  <ui-accordion mode="single">
                    <ui-accordion-item label="Video Quality" [expanded]="true">
                      <div class="settings-grid">
                        <div class="setting-row">
                          <div>
                            <div class="setting-label">Default Quality</div>
                            <div class="setting-desc">
                              Set the default video playback quality.
                            </div>
                          </div>
                          <ui-select
                            [options]="qualityOptions"
                            ariaLabel="Default quality"
                          />
                        </div>
                        <div class="setting-row">
                          <div>
                            <div class="setting-label">Auto-HD on Wi-Fi</div>
                            <div class="setting-desc">
                              Automatically switch to HD when on Wi-Fi.
                            </div>
                          </div>
                          <ui-toggle
                            [value]="true"
                            ariaLabel="Auto HD on WiFi"
                          />
                        </div>
                        <div class="setting-row">
                          <div>
                            <div class="setting-label">Autoplay</div>
                            <div class="setting-desc">
                              Automatically play the next video.
                            </div>
                          </div>
                          <ui-toggle
                            [value]="true"
                            ariaLabel="Autoplay next video"
                          />
                        </div>
                      </div>
                    </ui-accordion-item>
                    <ui-accordion-item label="Subtitles">
                      <div class="settings-grid">
                        <div class="setting-row">
                          <div>
                            <div class="setting-label">
                              Always Show Subtitles
                            </div>
                            <div class="setting-desc">
                              Enable subtitles by default on all videos.
                            </div>
                          </div>
                          <ui-toggle
                            [value]="false"
                            ariaLabel="Always show subtitles"
                          />
                        </div>
                        <div class="setting-row">
                          <div>
                            <div class="setting-label">Preferred Language</div>
                            <div class="setting-desc">
                              Subtitle language when available.
                            </div>
                          </div>
                          <ui-select
                            [options]="languageOptions"
                            ariaLabel="Subtitle language"
                          />
                        </div>
                      </div>
                    </ui-accordion-item>
                  </ui-accordion>
                </div>
              </ui-tab>
              <ui-tab label="Notifications" [icon]="icons.bell">
                <div style="padding-top: 0.75rem">
                  <div class="settings-grid">
                    <div class="setting-row">
                      <div>
                        <div class="setting-label">Subscriptions</div>
                        <div class="setting-desc">
                          Notify when subscribed channels upload new content.
                        </div>
                      </div>
                      <ui-toggle
                        [value]="true"
                        ariaLabel="Subscription notifications"
                      />
                    </div>
                    <div class="setting-row">
                      <div>
                        <div class="setting-label">Recommended Videos</div>
                        <div class="setting-desc">
                          Get notified about trending and recommended content.
                        </div>
                      </div>
                      <ui-toggle
                        [value]="false"
                        ariaLabel="Recommended notifications"
                      />
                    </div>
                    <div class="setting-row">
                      <div>
                        <div class="setting-label">Comment Replies</div>
                        <div class="setting-desc">
                          Notify when someone replies to your comments.
                        </div>
                      </div>
                      <ui-toggle
                        [value]="true"
                        ariaLabel="Comment reply notifications"
                      />
                    </div>
                  </div>
                </div>
              </ui-tab>
              <ui-tab label="Privacy" [icon]="icons.eye">
                <div style="padding-top: 0.75rem">
                  <div class="settings-grid">
                    <div class="setting-row">
                      <div>
                        <div class="setting-label">
                          Keep Watch History Private
                        </div>
                        <div class="setting-desc">
                          Your watch history will not be visible to others.
                        </div>
                      </div>
                      <ui-toggle
                        [value]="true"
                        ariaLabel="Private watch history"
                      />
                    </div>
                    <div class="setting-row">
                      <div>
                        <div class="setting-label">Hide Liked Videos</div>
                        <div class="setting-desc">
                          Your liked videos list will be private.
                        </div>
                      </div>
                      <ui-toggle
                        [value]="false"
                        ariaLabel="Hide liked videos"
                      />
                    </div>
                    <div class="setting-row">
                      <div>
                        <div class="setting-label">Restricted Mode</div>
                        <div class="setting-desc">
                          Filter out potentially mature content.
                        </div>
                      </div>
                      <ui-toggle [value]="false" ariaLabel="Restricted mode" />
                    </div>
                  </div>
                </div>
              </ui-tab>
              <ui-tab-spacer />
              <ui-tab [icon]="icons.flag" ariaLabel="Account">
                <div style="padding-top: 0.75rem">
                  <ui-card variant="outlined">
                    <ui-card-header>
                      <span
                        style="font-weight: 700; color: var(--ui-danger, #dc2626)"
                      >
                        Danger Zone
                      </span>
                    </ui-card-header>
                    <ui-card-body>
                      <p
                        style="margin: 0 0 1rem; font-size: 0.88rem; line-height: 1.5"
                      >
                        These actions are irreversible. Proceed with caution.
                      </p>
                      <div style="display: flex; gap: 0.5rem">
                        <ui-button variant="outlined" size="sm">
                          Download All Data
                        </ui-button>
                        <ui-button variant="outlined" size="sm">
                          Delete Channel
                        </ui-button>
                      </div>
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
class VideoSharingAppDemo {
  protected readonly icons = ICONS;
  protected readonly nav = NAV;
  protected readonly activePage = signal("home");
  protected readonly selectedCategory = signal("All");

  protected readonly allVideos = VIDEOS;
  protected readonly publishedVideos = VIDEOS.filter(
    (v) => v.status === "published",
  );
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
}

// ── Story meta ───────────────────────────────────────────────────────

const meta: Meta = {
  title: "@Theredhead/Showcases/Video Sharing App",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    hideThemeToggle: true,
    docs: {
      description: {
        component:
          "A fictional **Video Sharing** platform showcasing many components " +
          "composed together. Features a navigation page with sidebar, video grids, " +
          "trending lists, master-detail views with tabbed video details, channel " +
          "profiles with community comments, playlists, upload forms, watch history, " +
          "and layered settings — all driven by in-memory data.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [VideoSharingAppDemo],
    }),
  ],
};

export default meta;
type Story = StoryObj;

/**
 * A fully interactive video sharing application. Navigate the sidebar
 * to explore different sections:
 *
 * - **Home** — video grid with category chips and search
 * - **Trending** — ranked trending list with tabbed genre filters
 * - **Explore** — dashboard stats, categories, and popular channel cards
 * - **Your Videos** — master-detail view with engagement tabs and like-ratio progress
 * - **Upload** — form with inputs, selects, and checkboxes
 * - **Playlists** — card grid with visibility chips
 * - **Watch History** — master-detail view of recently watched videos
 * - **Liked Videos** — master-detail view with engagement actions
 * - **Channels** — master-detail view with tabbed channel profiles and community comments
 * - **Settings** — accordion-based playback settings, notification toggles, and privacy options
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-demo-video-sharing-app />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-navigation-page [items]="nav" [(activePage)]="activePage" rootLabel="StreamHub">
  <ng-template #content let-node>
    @if (node.id === 'home') {
      <!-- Video grid with category chip filters -->
      <div class="category-strip">
        @for (cat of categories; track cat) {
          <ui-chip [color]="selectedCategory() === cat ? 'primary' : 'neutral'"
                   (click)="selectedCategory.set(cat)">
            {{ cat }}
          </ui-chip>
        }
      </div>
      <!-- Video cards with thumbnails -->
    }
    @if (node.id === 'videos') {
      <ui-master-detail-view [datasource]="videosDs" title="Videos" [showFilter]="true">
        <ui-template-column key="title" headerText="Video">
          <ng-template let-row>
            <ui-icon [svg]="icons.film" [size]="16" />
            {{ row.title }}
          </ng-template>
        </ui-template-column>
        <ui-badge-column key="status" headerText="Status" />

        <ng-template #detail let-video>
          <ui-tab-group panelStyle="flat">
            <ui-tab label="Details" [icon]="icons.film">
              <!-- Video details -->
            </ui-tab>
            <ui-tab label="Engagement" [icon]="icons.thumbsUp">
              <!-- Like/dislike/comment counts with progress bar -->
            </ui-tab>
            <ui-tab-spacer />
            <ui-tab [icon]="icons.share" ariaLabel="Share">
              <!-- Share options -->
            </ui-tab>
          </ui-tab-group>
        </ng-template>
      </ui-master-detail-view>
    }
  </ng-template>
</ui-navigation-page>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UINavigationPage, navItem, navGroup, type NavigationNode,
  UIMasterDetailView,
} from '@theredhead/ui-blocks';
import {
  FilterableArrayDatasource, UITabGroup, UITab, UITabSpacer,
  UIChip, UIAvatar, UIBadgeColumn, UITemplateColumn, UIIcon, UIIcons,
  UIProgress, UISlider, UICard, UICardBody,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-video-sharing',
  standalone: true,
  imports: [
    UINavigationPage, UIMasterDetailView,
    UITabGroup, UITab, UITabSpacer,
    UIChip, UIAvatar, UIBadgeColumn, UITemplateColumn,
    UIIcon, UIProgress, UICard, UICardBody,
  ],
  templateUrl: './video-sharing.component.html',
})
export class VideoSharingComponent {
  protected readonly activePage = signal('home');
  protected readonly selectedCategory = signal('All');
  protected readonly videosDs = new FilterableArrayDatasource(VIDEOS);
  protected readonly icons = {
    home: UIIcons.Lucide.Home.House,
    flame: UIIcons.Lucide.Social.Flame,
    play: UIIcons.Lucide.Multimedia.Play,
    film: UIIcons.Lucide.Multimedia.Film,
    thumbsUp: UIIcons.Lucide.Social.ThumbsUp,
    share: UIIcons.Lucide.Social.Share2,
  };
  protected readonly nav: NavigationNode[] = [
    navItem('home', 'Home', { icon: UIIcons.Lucide.Home.House }),
    navItem('trending', 'Trending', { icon: UIIcons.Lucide.Social.Flame }),
    navGroup('content', 'Your Content', [
      navItem('videos', 'Your Videos', { icon: UIIcons.Lucide.Multimedia.Video }),
      navItem('upload', 'Upload', { icon: UIIcons.Lucide.Arrows.Upload }),
    ], { icon: UIIcons.Lucide.Multimedia.Clapperboard }),
  ];
}
`,
      },
    },
  },
};
