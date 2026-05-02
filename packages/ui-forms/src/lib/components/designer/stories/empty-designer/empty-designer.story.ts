import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import type { FormSchema } from "../../../../types/form-schema.types";
import { UIFormDesigner } from "../../form-designer.component";

@Component({
  selector: "ui-empty-designer-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIFormDesigner],
  templateUrl: "./empty-designer.story.html",
  styleUrl: "./empty-designer.story.scss",
})
export class EmptyDesignerStorySource {
  protected readonly savedSchema = signal<FormSchema | null>(null);

  protected onSave(schema: FormSchema): void {
    this.savedSchema.set(schema);
  }
}
