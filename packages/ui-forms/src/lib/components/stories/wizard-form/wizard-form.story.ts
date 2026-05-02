import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { FormEngine } from "../../../engine/form-engine";
import type { FormSchema, FormValues } from "../../../types/form-schema.types";
import { UIFormWizard } from "../../form-wizard.component";

const schema: FormSchema = {
  id: "wizard",
  title: "Account Setup Wizard",
  description: "Complete all steps to create your account.",
  groups: [
    {
      id: "account",
      title: "Account",
      description: "Choose a username and password.",
      fields: [
        {
          id: "username",
          title: "Username",
          component: "text",
          validation: [
            { type: "required" },
            {
              type: "minLength",
              params: { min: 3 },
              message: "Username must be at least 3 characters.",
            },
          ],
        },
        {
          id: "password",
          title: "Password",
          component: "text",
          config: { type: "password" },
          validation: [
            { type: "required" },
            {
              type: "minLength",
              params: { min: 8 },
              message: "Password must be at least 8 characters.",
            },
          ],
        },
      ],
    },
    {
      id: "profile",
      title: "Profile",
      description: "Tell us about yourself.",
      fields: [
        {
          id: "displayName",
          title: "Display Name",
          component: "text",
          validation: [{ type: "required" }],
        },
        {
          id: "bio",
          title: "Short Bio",
          component: "text",
          config: { multiline: true, rows: 3 },
        },
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Configure how you want to be notified.",
      fields: [
        {
          id: "emailNotifs",
          title: "Email notifications",
          component: "toggle",
          defaultValue: true,
        },
        {
          id: "digestFrequency",
          title: "Digest Frequency",
          component: "select",
          config: {
            options: [
              { label: "Real-time", value: "realtime" },
              { label: "Hourly", value: "hourly" },
              { label: "Daily", value: "daily" },
            ],
          },
          defaultValue: "daily",
        },
      ],
    },
  ],
};

@Component({
  selector: "ui-wizard-form-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIFormWizard, JsonPipe],
  templateUrl: "./wizard-form.story.html",
  styleUrl: "./wizard-form.story.scss",
})
export class WizardFormStorySource {
  public readonly engine = new FormEngine(schema);

  public readonly submitted = signal<FormValues | null>(null);

  public onSubmit(values: FormValues): void {
    this.submitted.set(values);
  }
}
