import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIAvatar, UIBadge, UIChip } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-communication-suite-mail-detail",
  standalone: true,
  imports: [UIAvatar, UIBadge, UIChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./communication-suite-mail-detail.component.html",
  styleUrl: "./communication-suite-mail-detail.component.scss",
})
export class UICommunicationSuiteMailDetail {
  /**
   * Optional avatar name rendered beside the detail header.
   */
  public readonly avatarName = input<string | null>(null);

  /**
   * The mail subject.
   */
  public readonly title = input.required<string>();

  /**
   * The main metadata line shown on the left.
   */
  public readonly primaryMeta = input.required<string>();

  /**
   * Optional metadata shown on the right of the first row.
   */
  public readonly primaryMetaAside = input<string | null>(null);

  /**
   * Optional secondary metadata line.
   */
  public readonly secondaryMeta = input<string | null>(null);

  /**
   * Optional priority label.
   */
  public readonly priority = input<string | null>(null);

  /**
   * The badge color used for the priority label.
   */
  public readonly priorityColor = input<string>("primary");

  /**
   * Optional labels shown above the body.
   */
  public readonly labels = input<readonly string[]>([]);

  /**
   * The chip color used for labels.
   */
  public readonly labelColor = input<string>("primary");

  /**
   * The mail body content.
   */
  public readonly body = input.required<string>();
}
