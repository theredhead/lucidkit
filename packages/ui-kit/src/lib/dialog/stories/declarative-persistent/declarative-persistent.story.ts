import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { UIButton } from "../../../button/button.component";
import { UIDialogBody } from "../../dialog-body.component";
import { UIDialogFooter } from "../../dialog-footer.component";
import { UIDialogHeader } from "../../dialog-header.component";
import { UIDialog } from "../../dialog.component";

@Component({
  selector: "ui-dialog-persistent-demo",
  standalone: true,
  imports: [UIDialog, UIDialogHeader, UIDialogBody, UIDialogFooter, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./declarative-persistent.story.html",
})
export class PersistentDemo {
  public readonly showDialog = signal(false);
}
