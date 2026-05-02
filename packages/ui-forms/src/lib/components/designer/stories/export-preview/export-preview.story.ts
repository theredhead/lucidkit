import { ChangeDetectionStrategy, Component } from "@angular/core";

import type { ExportStrategy } from "../../../../export";
import { AngularComponentExportStrategy, JsonExportStrategy } from "../../../../export";
import type { ExportResult } from "../../../../export";
import type { FormSchema } from "../../../../types/form-schema.types";

// ── Demo schema shown in the export preview ─────────────────────────

const DEMO_SCHEMA: FormSchema = {
  id: "contact",
  title: "Contact Form",
  description: "A simple contact form",
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
          id: "email",
          title: "E-mail",
          component: "text",
          config: { type: "email" },
          validation: [
            { type: "required", message: "E-mail is required." },
            { type: "email", message: "Enter a valid e-mail address." },
          ],
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

// ── Export preview wrapper ──────────────────────────────────────────

@Component({
  selector: "ui-story-export-preview",
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./export-preview.story.html",
  styleUrl: "./export-preview.story.scss",
})
export class StoryExportPreview {

  private readonly strategies: readonly ExportStrategy[] = [
    new AngularComponentExportStrategy(),
    new JsonExportStrategy(),
  ];

  protected readonly results: readonly ExportResult[] =
    this.strategies.map((s) => s.export(DEMO_SCHEMA));
}
