import { UISignature } from "../../signature.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISignature],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/signature/signature.stories.ts.

  public allowBrowse = (false) as const;
  public allowDraw = (true) as const;
  public allowDrop = (false) as const;
  public allowPaste = (false) as const;
  public ariaLabel = ("Sign here") as const;
  public disabled = (false) as const;
  public maxStrokeWidth = (3.5) as const;
  public minStrokeWidth = (1.5) as const;
  public pressureEnabled = (false) as const;
  public readOnly = (false) as const;
  public strokeColor = ("#1d232b") as const;
}
