import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { FormEngine } from "../../../engine/form-engine";
import type { FormSchema, FormValues } from "../../../types/form-schema.types";
import { UIForm } from "../../form.component";

const schema: FormSchema = {
  id: "validation",
  title: "Validation Demo",
  description: "Try submitting with empty fields to see validation messages.",
  groups: [
    {
      id: "main",
      title: "All Validators",
      fields: [
        {
          id: "required",
          title: "Required Field",
          component: "text",
          validation: [{ type: "required" }],
        },
        {
          id: "email",
          title: "Email (with custom message)",
          component: "text",
          config: { textAdapter: "email" },
          validation: [
            { type: "required" },
            {
              type: "email",
              message: "Please enter a valid email address.",
            },
          ],
        },
        {
          id: "minmax",
          title: "Text (3\u201320 chars)",
          component: "text",
          validation: [
            { type: "minLength", params: { min: 3 } },
            { type: "maxLength", params: { max: 20 } },
          ],
        },
        {
          id: "age",
          title: "Age (18\u2013120)",
          component: "slider",
          defaultValue: 0,
          config: { min: 0, max: 150 },
          validation: [
            { type: "min", params: { min: 18 } },
            { type: "max", params: { max: 120 } },
          ],
        },
        {
          id: "pattern",
          title: "Uppercase only",
          component: "text",
          validation: [
            {
              type: "pattern",
              params: { pattern: "^[A-Z]+$" },
              message: "Only uppercase letters are allowed.",
            },
          ],
        },
      ],
    },
  ],
};

@Component({
  selector: "ui-validation-demo-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIForm, JsonPipe],
  templateUrl: "./validation-demo.story.html",
  styleUrl: "./validation-demo.story.scss",
})
export class ValidationDemoStorySource {

  public readonly engine = new FormEngine(schema);

  public readonly submitted = signal<FormValues | null>(null);

  public onSubmit(values: FormValues): void {
    this.submitted.set(values);
  }
}
