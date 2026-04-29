import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-quick-tour-note-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./quick-tour-note-card.component.html",
  styleUrl: "./quick-tour-note-card.component.scss",
})
export class UIQuickTourNoteCard {
  /**
   * The note title.
   */
  public readonly title = input.required<string>();

  /**
   * The supporting note copy.
   */
  public readonly body = input.required<string>();
}
