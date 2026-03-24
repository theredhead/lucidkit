import { Component, ChangeDetectionStrategy, input } from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UITimeline } from "./timeline.component";
import { ArrayDatasource } from "../table-view/datasources/array-datasource";
import type { TimelineComponentResolver } from "./timeline.types";

// ── Demo data ─────────────────────────────────────────────────

interface ProjectEvent {
  id: number;
  title: string;
  date: string;
  description: string;
  type: "milestone" | "release" | "task";
}

const PROJECT_EVENTS: ProjectEvent[] = [
  {
    id: 1,
    title: "Project Kickoff",
    date: "2024-01-15",
    description: "Initial planning and team formation.",
    type: "milestone",
  },
  {
    id: 2,
    title: "Alpha Release",
    date: "2024-03-01",
    description: "First internal build with core features.",
    type: "release",
  },
  {
    id: 3,
    title: "Design Review",
    date: "2024-04-10",
    description: "UX audit and accessibility pass completed.",
    type: "task",
  },
  {
    id: 4,
    title: "Beta Release",
    date: "2024-06-15",
    description: "Public beta with feature-complete API surface.",
    type: "release",
  },
  {
    id: 5,
    title: "Launch",
    date: "2024-09-01",
    description: "Stable 1.0 release published to npm.",
    type: "milestone",
  },
];

// ── Demo components for withComponent story ──────────────────

@Component({
  selector: "ui-demo-milestone-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <strong>{{ event().title }}</strong>
      <div class="date">{{ event().date }}</div>
      <p class="desc">{{ event().description }}</p>
    </div>
  `,
  styles: `
    .card {
      color: #1d232b;
      background: #eef2ff;
      padding: 12px 16px;
      border-radius: 8px;
      border-left: 4px solid #4f6ef7;
    }
    .date {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }
    .desc {
      margin: 8px 0 0;
      font-size: 14px;
    }
    :host-context(html.dark-theme) {
      .card {
        color: #f2f6fb;
        background: #252a3a;
        border-left-color: #6b8aff;
      }
      .date {
        color: #9ca3af;
      }
    }
    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        .card {
          color: #f2f6fb;
          background: #252a3a;
          border-left-color: #6b8aff;
        }
        .date {
          color: #9ca3af;
        }
      }
    }
  `,
})
class DemoMilestoneCard {
  public readonly event = input.required<ProjectEvent>();
}

@Component({
  selector: "ui-demo-release-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <strong>{{ event().title }}</strong>
      <div class="date">{{ event().date }}</div>
      <p class="desc">{{ event().description }}</p>
    </div>
  `,
  styles: `
    .card {
      color: #1d232b;
      background: #f0fdf4;
      padding: 12px 16px;
      border-radius: 8px;
      border-left: 4px solid #22c55e;
    }
    .date {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }
    .desc {
      margin: 8px 0 0;
      font-size: 14px;
    }
    :host-context(html.dark-theme) {
      .card {
        color: #f2f6fb;
        background: #1a2e1f;
        border-left-color: #4ade80;
      }
      .date {
        color: #9ca3af;
      }
    }
    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        .card {
          color: #f2f6fb;
          background: #1a2e1f;
          border-left-color: #4ade80;
        }
        .date {
          color: #9ca3af;
        }
      }
    }
  `,
})
class DemoReleaseCard {
  public readonly event = input.required<ProjectEvent>();
}

@Component({
  selector: "ui-demo-task-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <strong>{{ event().title }}</strong>
      <div class="date">{{ event().date }}</div>
      <p class="desc">{{ event().description }}</p>
    </div>
  `,
  styles: `
    .card {
      color: #1d232b;
      background: #fffbeb;
      padding: 12px 16px;
      border-radius: 8px;
      border-left: 4px solid #f59e0b;
    }
    .date {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }
    .desc {
      margin: 8px 0 0;
      font-size: 14px;
    }
    :host-context(html.dark-theme) {
      .card {
        color: #f2f6fb;
        background: #2e2714;
        border-left-color: #fbbf24;
      }
      .date {
        color: #9ca3af;
      }
    }
    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        .card {
          color: #f2f6fb;
          background: #2e2714;
          border-left-color: #fbbf24;
        }
        .date {
          color: #9ca3af;
        }
      }
    }
  `,
})
class DemoTaskCard {
  public readonly event = input.required<ProjectEvent>();
}

const eventResolver: TimelineComponentResolver<ProjectEvent> = (event) => {
  switch (event.type) {
    case "milestone":
      return DemoMilestoneCard;
    case "release":
      return DemoReleaseCard;
    case "task":
      return DemoTaskCard;
  }
};

// ── Meta ───────────────────────────────────────────────────────

const meta: Meta<UITimeline<ProjectEvent>> = {
  title: "@theredhead/UI Kit/Timeline",
  component: UITimeline,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [DemoMilestoneCard, DemoReleaseCard, DemoTaskCard],
    }),
  ],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"] satisfies string[],
    },
    alignment: {
      control: "select",
      options: ["start", "end", "alternate"] satisfies string[],
    },
  },
};

export default meta;
type Story = StoryObj<UITimeline<ProjectEvent>>;

// ── Stories ────────────────────────────────────────────────────

export const VerticalAlternate: Story = {
  render: (args) => ({
    props: {
      ...args,
      datasource: new ArrayDatasource(PROJECT_EVENTS),
    },
    template: `
      <ui-timeline [datasource]="datasource" [orientation]="orientation" [alignment]="alignment">
        <ng-template let-event let-i="index">
          <div style="color: var(--ui-timeline-text); background: var(--ui-timeline-surface); padding: 12px 16px; border-radius: 8px;">
            <strong>{{ event.title }}</strong>
            <div style="font-size: 12px; opacity: 0.6; margin-top: 4px;">{{ event.date }}</div>
            <p style="margin: 8px 0 0; font-size: 14px;">{{ event.description }}</p>
          </div>
        </ng-template>
      </ui-timeline>
    `,
  }),
  args: {
    orientation: "vertical",
    alignment: "alternate",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-timeline [datasource]="events" alignment="alternate">
  <ng-template let-event let-i="index">
    <div class="event-card">
      <strong>{{ event.title }}</strong>
      <span>{{ event.date }}</span>
      <p>{{ event.description }}</p>
    </div>
  </ng-template>
</ui-timeline>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UITimeline } from '@theredhead/ui-kit';
import { ArrayDatasource } from '@theredhead/foundation';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITimeline],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly events = new ArrayDatasource([
    { title: 'Project Kickoff', date: '2024-01-15', description: 'Planning phase.' },
    { title: 'Alpha Release', date: '2024-03-01', description: 'First build.' },
    { title: 'Launch', date: '2024-09-01', description: 'Stable 1.0 release.' },
  ]);
}

// ── SCSS ──
.event-card {
  padding: 12px 16px;
  border-radius: 8px;
  color: var(--ui-text, #1d232b);
  background: var(--ui-surface, #f7f8fa);
}
`,
      },
    },
  },
};

export const VerticalStart: Story = {
  render: (args) => ({
    props: {
      ...args,
      datasource: new ArrayDatasource(PROJECT_EVENTS),
    },
    template: `
      <ui-timeline [datasource]="datasource" [orientation]="orientation" [alignment]="alignment">
        <ng-template let-event>
          <div style="color: var(--ui-timeline-text); background: var(--ui-timeline-surface); padding: 12px 16px; border-radius: 8px;">
            <strong>{{ event.title }}</strong>
            <div style="font-size: 12px; opacity: 0.6; margin-top: 4px;">{{ event.date }}</div>
            <p style="margin: 8px 0 0; font-size: 14px;">{{ event.description }}</p>
          </div>
        </ng-template>
      </ui-timeline>
    `,
  }),
  args: {
    orientation: "vertical",
    alignment: "start",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-timeline [datasource]="events" alignment="start">
  <ng-template let-event>
    <div class="event-card">
      <strong>{{ event.title }}</strong>
      <p>{{ event.description }}</p>
    </div>
  </ng-template>
</ui-timeline>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UITimeline } from '@theredhead/ui-kit';
import { ArrayDatasource } from '@theredhead/foundation';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITimeline],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly events = new ArrayDatasource(myEvents);
}

// ── SCSS ──
/* No custom styles needed — timeline tokens handle theming. */
`,
      },
    },
  },
};

export const Horizontal: Story = {
  render: (args) => ({
    props: {
      ...args,
      datasource: new ArrayDatasource(PROJECT_EVENTS),
    },
    template: `
      <ui-timeline [datasource]="datasource" [orientation]="orientation" [alignment]="alignment">
        <ng-template let-event>
          <div style="color: var(--ui-timeline-text); background: var(--ui-timeline-surface); padding: 12px 16px; border-radius: 8px; max-width: 180px;">
            <strong>{{ event.title }}</strong>
            <div style="font-size: 12px; opacity: 0.6; margin-top: 4px;">{{ event.date }}</div>
          </div>
        </ng-template>
      </ui-timeline>
    `,
  }),
  args: {
    orientation: "horizontal",
    alignment: "start",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-timeline [datasource]="events" orientation="horizontal">
  <ng-template let-event>
    <div class="event-card">
      <strong>{{ event.title }}</strong>
      <span>{{ event.date }}</span>
    </div>
  </ng-template>
</ui-timeline>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UITimeline } from '@theredhead/ui-kit';
import { ArrayDatasource } from '@theredhead/foundation';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITimeline],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly events = new ArrayDatasource(myEvents);
}

// ── SCSS ──
/* No custom styles needed — timeline tokens handle theming. */
`,
      },
    },
  },
};

export const WithComponentResolver: Story = {
  render: (args) => ({
    props: {
      ...args,
      datasource: new ArrayDatasource(PROJECT_EVENTS),
      resolver: eventResolver,
    },
    template: `
      <ui-timeline
        [datasource]="datasource"
        [withComponent]="resolver"
        [orientation]="orientation"
        [alignment]="alignment"
      />
    `,
  }),
  args: {
    orientation: "vertical",
    alignment: "start",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-timeline
  [datasource]="events"
  [withComponent]="resolver"
  alignment="start"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UITimeline, type TimelineComponentResolver } from '@theredhead/ui-kit';
import { ArrayDatasource } from '@theredhead/foundation';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UITimeline],
  template: \\\`
    <ui-timeline [datasource]="events" [withComponent]="resolver" />
  \\\`,
})
export class ExampleComponent {
  readonly events = new ArrayDatasource(myEvents);

  readonly resolver: TimelineComponentResolver<MyEvent> = (event) => {
    switch (event.type) {
      case 'milestone': return MilestoneCard;
      case 'release':   return ReleaseCard;
      default:          return DefaultCard;
    }
  };
}

// ── SCSS ──
/* Each resolved component manages its own styles. */
`,
      },
    },
  },
};
