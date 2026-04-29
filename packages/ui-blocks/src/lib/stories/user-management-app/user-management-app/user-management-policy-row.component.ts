import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-user-management-policy-row",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./user-management-policy-row.component.html",
  styleUrl: "./user-management-policy-row.component.scss",
})
export class UIUserManagementPolicyRow {
  /**
   * The policy label.
   */
  public readonly label = input.required<string>();

  /**
   * Supporting description text for the policy.
   */
  public readonly description = input.required<string>();
}
