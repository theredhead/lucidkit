import { UIFileUpload } from "../../file-upload.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIFileUpload],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {

  public accept = ("") as const;
  public ariaLabel = ("Upload file") as const;
  public disabled = (false) as const;
  public label = ("Drop files here or click to browse") as const;
  public multiple = (false) as const;
}
