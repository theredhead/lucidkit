import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import type { FormSchema } from "../../../../types/form-schema.types";
import { UIFormDesigner } from "../../form-designer.component";

const CONTACT_FORM_SCHEMA: FormSchema = {
  id: "contact",
  title: "Contact Form",
  description: "A simple contact form built in the designer",
  groups: [
    {
      id: "personal",
      title: "Personal Information",
      fields: [
        {
          id: "firstName",
          title: "First Name",
          component: "text",
          validation: [{ type: "required", message: "First name is required." }],
        },
        {
          id: "lastName",
          title: "Last Name",
          component: "text",
          validation: [{ type: "required", message: "Last name is required." }],
        },
        {
          id: "email",
          title: "E-mail",
          component: "text",
          config: { type: "email" },
          validation: [
            { type: "required", message: "E-mail is required." },
            { type: "email", message: "Enter a valid e-mail address." },
          ],
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
          options: [
            { label: "General inquiry", value: "general" },
            { label: "Support", value: "support" },
            { label: "Sales", value: "sales" },
          ],
          validation: [{ type: "required", message: "Please select a subject." }],
        },
        {
          id: "body",
          title: "Message",
          component: "text",
          config: { multiline: true, rows: 4 },
          validation: [
            { type: "required", message: "Message is required." },
            { type: "minLength", params: { min: 10 }, message: "At least 10 characters." },
          ],
        },
      ],
    },
  ],
};

@Component({
  selector: "ui-with-existing-schema-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIFormDesigner],
  templateUrl: "./with-existing-schema.story.html",
  styleUrl: "./with-existing-schema.story.scss",
})
export class WithExistingSchemaStorySource {

  public readonly existingSchema = CONTACT_FORM_SCHEMA;

  protected readonly savedSchema = signal<FormSchema | null>(null);

  protected onSave(schema: FormSchema): void {
    this.savedSchema.set(schema);
  }
}
