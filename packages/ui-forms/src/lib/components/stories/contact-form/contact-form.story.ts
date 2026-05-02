import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { FormEngine } from "../../../engine/form-engine";
import type { FormSchema, FormValues } from "../../../types/form-schema.types";
import { UIForm } from "../../form.component";

const schema: FormSchema = {
  id: "contact",
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
          description: "We'll never share your email with anyone.",
          config: { textAdapter: "email" },
          validation: [{ type: "required" }, { type: "email" }],
        },
      ],
    },
    {
      id: "message",
      title: "Your Message",
      fields: [
        {
          id: "subject",
          title: "Subject",
          component: "select",
          config: {
            options: [
              { label: "General inquiry", value: "general" },
              { label: "Bug report", value: "bug" },
              { label: "Feature request", value: "feature" },
            ],
          },
          validation: [{ type: "required" }],
        },
        {
          id: "body",
          title: "Message",
          component: "text",
          config: { multiline: true, rows: 4 },
          validation: [
            { type: "required" },
            { type: "minLength", params: { min: 10 } },
          ],
        },
      ],
    },
  ],
};

@Component({
  selector: "ui-contact-form-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIForm, JsonPipe],
  templateUrl: "./contact-form.story.html",
  styleUrl: "./contact-form.story.scss",
})
export class ContactFormStorySource {
  public readonly engine = new FormEngine(schema);

  public readonly submitted = signal<FormValues | null>(null);

  public onSubmit(values: FormValues): void {
    this.submitted.set(values);
  }
}
