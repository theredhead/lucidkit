import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { FormEngine } from "../../../engine/form-engine";
import type { FormSchema, FormValues } from "../../../types/form-schema.types";
import { UIForm } from "../../form.component";

const schema: FormSchema = {
  id: "conditional",
  title: "Conditional Fields Demo",
  description: "Fields appear and disappear based on your choices.",
  groups: [
    {
      id: "main",
      title: "Preferences",
      fields: [
        {
          id: "contactMethod",
          title: "Preferred Contact Method",
          component: "select",
          config: {
            options: [
              { label: "Email", value: "email" },
              { label: "Phone", value: "phone" },
              { label: "Post", value: "post" },
            ],
          },
          validation: [{ type: "required" }],
        },
        {
          id: "emailAddress",
          title: "E-mail Address",
          component: "text",
          config: { textAdapter: "email" },
          visibleWhen: {
            field: "contactMethod",
            operator: "equals",
            value: "email",
          },
          validation: [{ type: "required" }, { type: "email" }],
        },
        {
          id: "phone",
          title: "Phone Number",
          component: "text",
          config: { textAdapter: "phone" },
          visibleWhen: {
            field: "contactMethod",
            operator: "equals",
            value: "phone",
          },
          validation: [{ type: "required" }],
        },
        {
          id: "address",
          title: "Postal Address",
          component: "text",
          visibleWhen: {
            field: "contactMethod",
            operator: "equals",
            value: "post",
          },
          validation: [{ type: "required" }],
        },
        {
          id: "newsletter",
          title: "Subscribe to newsletter",
          component: "toggle",
        },
        {
          id: "frequency",
          title: "Newsletter frequency",
          component: "select",
          visibleWhen: {
            field: "newsletter",
            operator: "equals",
            value: true,
          },
          config: {
            options: [
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
            ],
          },
        },
      ],
    },
  ],
};

@Component({
  selector: "ui-conditional-fields-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIForm, JsonPipe],
  templateUrl: "./conditional-fields.story.html",
  styleUrl: "./conditional-fields.story.scss",
})
export class ConditionalFieldsStorySource {
  public readonly engine = new FormEngine(schema);

  public readonly submitted = signal<FormValues | null>(null);

  public onSubmit(values: FormValues): void {
    this.submitted.set(values);
  }
}
