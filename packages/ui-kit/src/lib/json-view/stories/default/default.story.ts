import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIJsonView } from "../../json-view.component";

const SAMPLE = {
  name: "UIJsonView",
  version: "1.0.0",
  features: ["collapsible", "syntax highlighting", "copy to clipboard"],
  config: {
    theme: "auto",
    indent: 2,
    collapsed: false,
  },
  stats: {
    components: 42,
    tests: 755,
    coverage: 0.91,
  },
  active: true,
  deprecated: null,
};

@Component({
  selector: "ui-json-view-default-story",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIJsonView],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class JsonViewDefaultStory {
  protected readonly sample = SAMPLE;
  protected readonly jsonString = JSON.stringify(SAMPLE, null, 2);
}
