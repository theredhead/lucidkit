import { UIFormDesigner } from "../../form-designer.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-empty-designer-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIFormDesigner],
  templateUrl: "./empty-designer.story.html",
  styleUrl: "./empty-designer.story.scss",
})
export class EmptyDesignerStorySource {
  // Review required: this scaffold was generated from packages/ui-forms/src/lib/components/designer/form-designer.stories.ts.
}
