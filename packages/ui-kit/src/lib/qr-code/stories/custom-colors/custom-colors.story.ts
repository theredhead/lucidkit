import { UIQRCode } from "../../qr-code.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-custom-colors-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIQRCode],
  templateUrl: "./custom-colors.story.html",
  styleUrl: "./custom-colors.story.scss",
})
export class CustomColorsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/qr-code/qr-code.stories.ts.
}
