import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIDemoCommunicationSuiteApp } from "./communication-suite-app";

@Component({
  selector: "ui-communication-suite-app-story-source",
  standalone: true,
  imports: [UIDemoCommunicationSuiteApp],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./communication-suite-app.story.html",
  styleUrl: "./communication-suite-app.story.scss",
})
export class CommunicationSuiteAppStorySource {}
