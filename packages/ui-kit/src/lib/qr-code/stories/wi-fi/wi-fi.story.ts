import { UIQRCode } from "../../qr-code.component";
import { UIInput } from "../../../input/input.component";

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from "@angular/core";

@Component({
  selector: "ui-wi-fi-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIQRCode, UIInput],
  templateUrl: "./wi-fi.story.html",
  styleUrl: "./wi-fi.story.scss",
})
export class WiFiStorySource {
  protected readonly ssid = signal("MyNetwork");
  protected readonly passphrase = signal("MyPassword");

  protected readonly wifiString = computed(
    () => `WIFI:S:${this.ssid()};T:WPA;P:${this.passphrase()};;`,
  );
}
