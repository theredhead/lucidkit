import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed } from "@angular/core";

import { FormEngine } from "../../../engine/form-engine";
import type { FormSchema } from "../../../types/form-schema.types";
import { UIForm } from "../../form.component";

const schema: FormSchema = {
  id: "no-submit",
  title: "Live Binding Demo",
  description:
    "The form has no submit button \u2014 values are read directly from the engine.",
  groups: [
    {
      id: "main",
      title: "Your Details",
      fields: [
        {
          id: "name",
          title: "Name",
          component: "text",
          validation: [{ type: "required" }],
        },
        {
          id: "subscribe",
          title: "Subscribe to newsletter",
          component: "toggle",
          defaultValue: false,
        },
        {
          id: "role",
          title: "Role",
          component: "select",
          config: {
            options: [
              { label: "Developer", value: "dev" },
              { label: "Designer", value: "design" },
              { label: "Manager", value: "mgr" },
            ],
          },
        },
      ],
    },
  ],
};

@Component({
  selector: "ui-without-submit-button-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIForm, JsonPipe],
  templateUrl: "./without-submit-button.story.html",
  styleUrl: "./without-submit-button.story.scss",
})
export class WithoutSubmitButtonStorySource {

  public readonly engine = new FormEngine(schema);

  public readonly liveOutput = computed(() => this.engine.output()());
}
