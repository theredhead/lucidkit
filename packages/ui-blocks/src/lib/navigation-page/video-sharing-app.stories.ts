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
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import videoSharingData from "./data/video-sharing-app.data.json";

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

      .home-top-bar {
        position: sticky;
        top: -1.5rem;
        z-index: 2;
        background: var(--ui-surface, #1f242c);
        color: var(--ui-text, #1d232b);
        margin: -1.5rem -1.5rem 1rem;
        padding: 1.5rem 1.5rem 0.75rem;
      }

      .home-top-bar .category-strip {
        margin-bottom: 0;
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
        background: var(--ui-surface-dim, #2a313c);
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
        background: var(--ui-surface-dim, #2a313c);
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

      /* Load more sentinel */
      .load-more-sentinel {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem 0;
      }
    `,
  ],
  template: `
    <ui-navigation-page
      [items]="nav"
      [(activePage)]="activePage"
      rootLabel="StreamHub"
      storageKey="storybook-nav-video-sharing"
    >
      <ng-template #content let-node>
        <!-- ─── Home ─── -->
        @if (node.id === "home") {
          <div class="home-top-bar">
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
          </div>

          <div class="video-grid">
            @for (video of visibleVideos(); track video.id) {
              <div>
                <div class="video-thumb">
                  <ui-icon [svg]="icons.play" [size]="32" />
                  <span class="video-duration">{{ video.duration }}</span>
                </div>
                <div class="video-meta">
                  <ui-avatar [name]="video.channel" size="small" />
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
          @if (hasMoreVideos()) {
            <div class="load-more-sentinel" #loadMoreSentinel>
              <ui-progress
                variant="circular"
                mode="indeterminate"
                ariaLabel="Loading more videos"
              />
            </div>
          }
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
                      <ui-avatar [name]="ch.name" size="medium" />
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
                  size="small"
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
                          <ui-button variant="outlined" size="small">
                            Copy Link
                          </ui-button>
                          <ui-button variant="ghost" size="small">
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
                  <ui-dropdown-list
                    [options]="categoryOptions"
                    placeholder="Select category"
                    ariaLabel="Category"
                  />
                </div>
                <div class="form-field">
                  <span class="field-label">Visibility</span>
                  <ui-dropdown-list
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
              <ui-button variant="outlined" size="small"
                >New Playlist</ui-button
              >
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
                    <ui-button variant="ghost" size="small">Play All</ui-button>
                    <ui-button variant="ghost" size="small">Edit</ui-button>
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
                <ui-button variant="ghost" size="small"
                  >Clear History</ui-button
                >
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
                      <ui-avatar [name]="row.name" size="small" />
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
                    <ui-avatar [name]="ch.name" size="large" />
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
                      <ui-button variant="filled" size="small">
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
                            <ui-avatar [name]="comment.author" size="small" />
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
                          <ui-dropdown-list
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
                          <ui-dropdown-list
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
                        <ui-button variant="outlined" size="small">
                          Download All Data
                        </ui-button>
                        <ui-button variant="outlined" size="small">
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

const meta: Meta = {
  title: "@theredhead/Showcases/Video Sharing App",
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
<ui-navigation-page [items]="nav" [(activePage)]="activePage" rootLabel="StreamHub" storageKey="storybook-nav-video-sharing">
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
} from '@theredhead/lucid-blocks';
import {
  FilterableArrayDatasource, UITabGroup, UITab, UITabSpacer,
  UIChip, UIAvatar, UIBadgeColumn, UITemplateColumn, UIIcon, UIIcons,
  UIProgress, UISlider, UICard, UICardBody,
} from '@theredhead/lucid-kit';

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
