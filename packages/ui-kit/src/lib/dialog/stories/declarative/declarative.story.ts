import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from "@angular/core";

import { UIButton } from "../../../button/button.component";
import { UIInput } from "../../../input/input.component";
import { UIDialogBody } from "../../dialog-body.component";
import { UIDialogFooter } from "../../dialog-footer.component";
import { UIDialogHeader } from "../../dialog-header.component";
import { UIDialog } from "../../dialog.component";
import { ModalService } from "../../dialog.service";
import { ModalRef, type UIModalContent } from "../../dialog.types";

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
