import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIBadge, UIIcon } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-communication-suite-page-header",
  standalone: true,
  imports: [UIBadge, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./communication-suite-page-header.component.html",
  styleUrl: "./communication-suite-page-header.component.scss",
})
export class UICommunicationSuitePageHeader {
  /**
   * The header icon SVG content.
   */
  public readonly icon = input.required<string>();

  /**
   * The page title.
   */
  public readonly title = input.required<string>();

  /**
   * Optional badge count shown beside the title.
   */
  public readonly badgeCount = input<number | null>(null);

  /**
   * The badge color token.
   */
  public readonly badgeColor = input<string>("primary");
}
