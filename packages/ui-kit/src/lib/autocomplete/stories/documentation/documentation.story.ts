import { UIAutocomplete } from "../../autocomplete.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-documentation-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAutocomplete],
  templateUrl: "./documentation.story.html",
  styleUrl: "./documentation.story.scss",
})
export class DocumentationStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/autocomplete/autocomplete.stories.ts.
}
