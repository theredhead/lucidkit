import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
  UIBadge,
  UIButton,
  UICard,
  UICardBody,
  UICardFooter,
  UICardHeader,
  UIChip,
  UIIcon,
} from "@theredhead/lucid-kit";

@Component({
  selector: "ui-user-management-role-card",
  standalone: true,
  imports: [
    UIBadge,
    UIButton,
    UICard,
    UICardBody,
    UICardFooter,
    UICardHeader,
    UIChip,
    UIIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./user-management-role-card.component.html",
  styleUrl: "./user-management-role-card.component.scss",
})
export class UIUserManagementRoleCard {
  /**
   * The role name.
   */
  public readonly name = input.required<string>();

  /**
   * The role level.
   */
  public readonly level = input.required<string>();

  /**
   * The level badge color.
   */
  public readonly levelColor = input.required<string>();

  /**
   * The role description.
   */
  public readonly description = input.required<string>();

  /**
   * The role user count.
   */
  public readonly userCount = input.required<number>();

  /**
   * The users icon.
   */
  public readonly usersIcon = input.required<string>();

  /**
   * The granted privileges.
   */
  public readonly privileges = input<readonly string[]>([]);
}
