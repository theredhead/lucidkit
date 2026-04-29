import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { UIButton } from "../../../button/button.component";
import { UIDialogBody } from "../../dialog-body.component";
import { UIDialogFooter } from "../../dialog-footer.component";
import { UIDialogHeader } from "../../dialog-header.component";
import { UIDialog } from "../../dialog.component";

// ════════════════════════════════════════════════════════════════════
//  Declarative demos  (UIDialog component with content projection)
// ════════════════════════════════════════════════════════════════════

@Component({
  selector: "ui-dialog-declarative-demo",
  standalone: true,
  imports: [UIDialog, UIDialogHeader, UIDialogBody, UIDialogFooter, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./declarative.story.html",
})
export class DeclarativeDemo {
  public readonly showDialog = signal(false);
}
