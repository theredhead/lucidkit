import { ChangeDetectionStrategy, Component } from "@angular/core";

import { VideoSharingAppDemo } from "./video-sharing-app";

@Component({
  selector: "ui-video-sharing-app-story-source",
  standalone: true,
  imports: [VideoSharingAppDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./video-sharing-app.story.html",
  styleUrl: "./video-sharing-app.story.scss",
})
export class VideoSharingAppStorySource {}
