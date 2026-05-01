import { UIQRCode } from "../../qr-code.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-wi-fi-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIQRCode],
  templateUrl: "./wi-fi.story.html",
  styleUrl: "./wi-fi.story.scss",
})
export class WiFiStorySource {
}
