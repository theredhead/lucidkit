import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { VideoSharingAppStorySource } from "./video-sharing-app.story";

const meta: Meta = {
  title: "@theredhead/Showcases/Video Sharing App",
  component: VideoSharingAppStorySource,
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
      imports: [VideoSharingAppStorySource],
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
    template: `<ui-video-sharing-app-story-source />`,
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
