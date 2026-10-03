import { UIQRCode } from "../../qr-code.component";
import { UIInput } from "../../../input/input.component";

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  input,
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

  /**
   * Wi-Fi network name controlled by the story or the inline editor.
   */
  public readonly ssid = model("GuestNetwork");

  /**
   * Wi-Fi password controlled by the story or the inline editor.
   */
  public readonly passphrase = model("welcome123");

  /**
   * QR code dimensions in pixels.
   */
  public readonly size = input(200);

  /**
   * QR code foreground color.
   */
  public readonly foreground = input("#222");

  /**
   * QR code background color.
   */
  public readonly background = input("#fff");

  /**
   * Accessible QR code description.
   */
  public readonly ariaLabel = input("Wi-Fi QR code");

  protected readonly wifiString = computed(
    () => `WIFI:S:${this.ssid()};T:WPA;P:${this.passphrase()};;`,
  );
}
