import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UISourceTabs, type UISourceTab } from "../../source-tabs.component";

const SAMPLE_TABS: readonly UISourceTab[] = [
  {
    label: "Markup",
    language: "HTML",
    filename: "profile-card.component.html",
    code: `<ui-card>
  <ui-card-header subtitle="Updated 2m ago">Profile</ui-card-header>
  <ui-card-body>
    <p>Card content here.</p>
  </ui-card-body>
</ui-card>`,
  },
  {
    label: "TypeScript",
    language: "TypeScript",
    filename: "profile-card.component.ts",
    code: `import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UICard, UICardBody, UICardHeader } from "@theredhead/lucid-kit";

@Component({
  selector: "app-profile-card",
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody],
  templateUrl: "./profile-card.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent {}`,
  },
  {
    label: "Styles",
    language: "SCSS",
    filename: "profile-card.component.scss",
    code: `:host {
  display: block;
}

ui-card {
  max-inline-size: 28rem;
}`,
  },
];

@Component({
  selector: "ui-source-tabs-story-demo",
  standalone: true,
  imports: [UISourceTabs],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./default.story.html",
})
export class UISourceTabsStoryDemo {
  public readonly tabs = SAMPLE_TABS;
}
