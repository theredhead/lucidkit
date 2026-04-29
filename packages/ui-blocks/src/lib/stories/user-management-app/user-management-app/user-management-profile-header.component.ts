import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIAvatar, UIChip } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-user-management-profile-header",
  standalone: true,
  imports: [UIAvatar, UIChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./user-management-profile-header.component.html",
  styleUrl: "./user-management-profile-header.component.scss",
})
export class UIUserManagementProfileHeader {
  /**
   * The user's email address.
   */
  public readonly email = input.required<string>();

  /**
   * The user's display name.
   */
  public readonly name = input.required<string>();

  /**
   * The status label shown on the right.
   */
  public readonly status = input.required<string>();

  /**
   * The status chip color.
   */
  public readonly statusColor = input.required<string>();
}
