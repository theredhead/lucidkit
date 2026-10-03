import { UIQRCode } from "../../qr-code.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-custom-colors-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIQRCode],
  templateUrl: "./custom-colors.story.html",
  styleUrl: "./custom-colors.story.scss",
})
export class CustomColorsStorySource {

  /**
   * Storybook control forwarded to the qr-code example.
   */
  public readonly value = input<ReturnType<UIQRCode["value"]>>("https://theredhead.nl");

  /**
   * Storybook control forwarded to the qr-code example.
   */
  public readonly size = input<ReturnType<UIQRCode["size"]>>(160);

  /**
   * Storybook control forwarded to the qr-code example.
   */
  public readonly foreground = input<ReturnType<UIQRCode["foreground"]>>("#0a7cff");

  /**
   * Storybook control forwarded to the qr-code example.
   */
  public readonly background = input<ReturnType<UIQRCode["background"]>>("#eaf6ff");

  /**
   * Storybook control forwarded to the qr-code example.
   */
  public readonly ariaLabel = input<ReturnType<UIQRCode["ariaLabel"]>>("QR code");

}
