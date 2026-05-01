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
}
