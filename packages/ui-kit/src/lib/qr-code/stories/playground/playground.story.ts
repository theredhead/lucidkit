import { UIQRCode } from "../../qr-code.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIQRCode],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {

  /**
   * Storybook control forwarded to the qr-code example.
   */
  public readonly value = input<ReturnType<UIQRCode["value"]>>("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

  /**
   * Storybook control forwarded to the qr-code example.
   */
  public readonly size = input<ReturnType<UIQRCode["size"]>>(180);

  /**
   * Storybook control forwarded to the qr-code example.
   */
  public readonly foreground = input<ReturnType<UIQRCode["foreground"]>>("#222");

  /**
   * Storybook control forwarded to the qr-code example.
   */
  public readonly background = input<ReturnType<UIQRCode["background"]>>("#fff");

  /**
   * Storybook control forwarded to the qr-code example.
   */
  public readonly ariaLabel = input<ReturnType<UIQRCode["ariaLabel"]>>("QR code");

}
