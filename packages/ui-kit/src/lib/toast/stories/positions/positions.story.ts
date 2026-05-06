import { UIToastContainer } from "../../toast.component";
import { ToastService } from "../../toast.service";
import { UIButton } from "../../../button/button.component";
import { type ToastPosition } from "../../toast.types";

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

const POSITIONS: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

@Component({
  selector: "ui-positions-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToastContainer, UIButton],
  templateUrl: "./positions.story.html",
  styleUrl: "./positions.story.scss",
})
export class PositionsStorySource {
  private readonly toast = inject(ToastService);

  protected readonly positions = POSITIONS;

  protected show(position: ToastPosition): void {
    this.toast.info(`Toast at ${position}`, { position });
  }
}
