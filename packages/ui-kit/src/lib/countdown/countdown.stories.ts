import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UICountdown, type CountdownFormat, type CountdownMode } from "./countdown.component";

@Component({
  selector: "ui-countdown-demo",
  standalone: true,
  imports: [UICountdown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 32px; padding: 16px; background: var(--ui-surface, #fff); color: var(--ui-text, #1d232b);">
      <div>
        <h4 style="margin: 0 0 8px; color: var(--ui-text, #1d232b);">Countdown — 2 hours from now (dhms)</h4>
        <ui-countdown [target]="twoHours" format="dhms" />
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: var(--ui-text, #1d232b);">Countdown — 45 seconds (ms)</h4>
        <ui-countdown [target]="fortyFiveSec" format="ms" (expired)="onExpired()" />
        <p style="margin: 8px 0 0; font-size: 0.875rem; color: var(--ui-text-muted, #5a6470);">expired: {{ expired() }}</p>
      </div>
      <div>
        <h4 style="margin: 0 0 8px; color: var(--ui-text, #1d232b);">Elapsed — since 5 minutes ago (hms)</h4>
        <ui-countdown [target]="fiveMinAgo" mode="elapsed" format="hms" />
      </div>
    </div>
  `,
})
class CountdownDemo {
  protected readonly twoHours = Date.now() + 2 * 60 * 60 * 1000;
  protected readonly fortyFiveSec = Date.now() + 45 * 1000;
  protected readonly fiveMinAgo = Date.now() - 5 * 60 * 1000;
  protected readonly expired = signal(false);

  protected onExpired(): void {
    this.expired.set(true);
  }
}

const meta: Meta<UICountdown> = {
  title: "@theredhead/UI Kit/Countdown",
  component: UICountdown,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [CountdownDemo],
    }),
  ],
  argTypes: {
    mode: {
      control: "select",
      options: ["countdown", "elapsed"] satisfies CountdownMode[],
      description: "Count down to target or count up from target.",
    },
    format: {
      control: "select",
      options: ["dhms", "hms", "ms"] satisfies CountdownFormat[],
      description: "Which time units are displayed.",
    },
  },
};
export default meta;
type Story = StoryObj<UICountdown>;

export const Default: Story = {
  render: (args) => ({
    props: { ...args, target: Date.now() + 60 * 60 * 1000 },
    template: `<ui-countdown [target]="target" [mode]="mode" [format]="format" />`,
  }),
  args: { mode: "countdown", format: "hms" },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-countdown [target]="launchDate" (expired)="onLaunch()" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UICountdown } from '@theredhead/lucid-kit';

@Component({
  standalone: true,
  imports: [UICountdown],
  template: \`<ui-countdown [target]="launchDate" format="hms" (expired)="onLaunch()" />\`,
})
export class ExampleComponent {
  public readonly launchDate = new Date('2027-01-01T00:00:00Z');
  public onLaunch(): void { /* handle expiry */ }
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

export const Showcase: Story = {
  render: () => ({ template: `<ui-countdown-demo />` }),
  parameters: {
    docs: { source: { code: "See CountdownDemo component in stories file." } },
  },
};
