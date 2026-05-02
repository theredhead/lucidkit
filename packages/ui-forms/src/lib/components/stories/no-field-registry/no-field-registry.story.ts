import { ChangeDetectionStrategy, Component } from "@angular/core";

import { FormEngine } from "../../../engine/form-engine";
import type { FormSchema } from "../../../types/form-schema.types";
import { UIForm } from "../../form.component";

const schema: FormSchema = {
  id: "no-registry-demo",
  title: "Contact Form",
  description: "Fill in your details and we will get back to you.",
  groups: [
    {
      id: "personal",
      title: "Personal Information",
      fields: [
        {
          id: "firstName",
          title: "First Name",
          component: "text",
          validation: [{ type: "required" }],
        },
        {
          id: "lastName",
          title: "Last Name",
          component: "text",
          validation: [{ type: "required" }],
        },
        {
          id: "email",
          title: "E-mail",
          component: "text",
          config: { textAdapter: "email" },
          validation: [{ type: "required" }, { type: "email" }],
        },
        {
          id: "subscribe",
          title: "Subscribe to newsletter",
          component: "toggle",
          defaultValue: false,
        },
      ],
    },
  ],
};

@Component({
  selector: "ui-no-field-registry-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIForm],
  templateUrl: "./no-field-registry.story.html",
  styleUrl: "./no-field-registry.story.scss",
})
export class NoFieldRegistryStorySource {

  public readonly engine = new FormEngine(schema);
}
