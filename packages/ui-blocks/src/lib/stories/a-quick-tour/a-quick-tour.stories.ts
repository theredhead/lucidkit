import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { QuickTourStorySource } from "./a-quick-tour.story";

const meta: Meta = {
  title: "@theredhead/Showcases/A Quick Tour",
  component: QuickTourStorySource,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    hideThemeToggle: true,
    docs: {
      description: {
        component:
          "A fast first-stop showcase that introduces LucidKit through a single friendly workspace instead of a full enterprise app. " +
          "It samples `UINavigationPage`, `UIMasterDetailView`, `UIChatView`, `UICalendarMonthView`, `UIChart`, cards, tabs, badges, inputs, and toggles in one shallow tour.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [QuickTourStorySource],
    }),
  ],
};

export default meta;
type Story = StoryObj;

/**
 * A short, welcoming overview of the library before the larger app showcases.
 *
 * Use the sidebar to move through five small product surfaces:
 *
 * - **Overview** — hero messaging, cards, chips, progress, and a chart
 * - **Data Views** — a filterable master-detail layout with tabs in the detail pane
 * - **Messages** — chat view with the compact rich-text composer
 * - **Schedule** — calendar month view plus upcoming sessions
 * - **Forms & Settings** — inputs, dropdowns, checkbox, toggle, and small settings rows
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-a-quick-tour-story-source />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-navigation-page [items]="nav" [(activePage)]="activePage" rootLabel="LucidKit">
  <ng-template #content let-node>
    @if (node.id === 'workflows') {
      <ui-master-detail-view [datasource]="workflowDatasource" title="Workflow patterns" [showFilter]="true">
        <ui-text-column key="title" headerText="Workflow" />
        <ui-text-column key="owner" headerText="Owner" />
        <ui-badge-column key="status" headerText="Status" />
      </ui-master-detail-view>
    }

    @if (node.id === 'messages') {
      <ui-chat-view
        [messages]="chatMessages"
        [currentUser]="currentUser"
        composerMode="rich-text"
        composerPresentation="compact"
      />
    }

    @if (node.id === 'schedule') {
      <ui-calendar-month-view
        [datasource]="calendarDatasource"
        [(selectedDate)]="selectedDate"
      />
    }
  </ng-template>
</ui-navigation-page>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  ArrayCalendarDatasource,
  FilterableArrayDatasource,
  UIBadgeColumn,
  UITextColumn,
} from '@theredhead/lucid-kit';
import {
  UIChatView,
  UIMasterDetailView,
  UINavigationPage,
  navItem,
} from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-quick-tour',
  standalone: true,
  imports: [
    UINavigationPage,
    UIMasterDetailView,
    UIChatView,
    UITextColumn,
    UIBadgeColumn,
  ],
  templateUrl: './quick-tour.component.html',
})
export class QuickTourComponent {
  readonly activePage = signal('overview');
  readonly selectedDate = signal(new Date());
  readonly nav = [
    navItem('overview', 'Overview'),
    navItem('workflows', 'Data Views'),
    navItem('messages', 'Messages'),
    navItem('schedule', 'Schedule'),
  ];

  readonly workflowDatasource = new FilterableArrayDatasource(workflows);
  readonly calendarDatasource = new ArrayCalendarDatasource(events);
  readonly chatMessages = messages;
  readonly currentUser = me;
}

// ── SCSS ──
/* Start with a friendly hero, then combine navigation,
   data views, communication, scheduling, and small
   settings surfaces into one shallow guided tour. */
`,
      },
    },
  },
};
