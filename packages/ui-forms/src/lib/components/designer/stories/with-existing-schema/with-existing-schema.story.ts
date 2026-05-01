import { UIFormDesigner } from "../../form-designer.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-with-existing-schema-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIFormDesigner],
  templateUrl: "./with-existing-schema.story.html",
  styleUrl: "./with-existing-schema.story.scss",
})
export class WithExistingSchemaStorySource {
  // Review required: this scaffold was generated from packages/ui-forms/src/lib/components/designer/form-designer.stories.ts.
}
