import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-user-management-form-field",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./user-management-form-field.component.html",
  styleUrl: "./user-management-form-field.component.scss",
  host: {
    "[class.form-field-full]": "fullWidth()",
  },
})
export class UIUserManagementFormField {
  /**
   * The field label text.
   */
  public readonly label = input.required<string>();

  /**
   * Whether the field spans the full grid width.
   */
  public readonly fullWidth = input(false);
}
