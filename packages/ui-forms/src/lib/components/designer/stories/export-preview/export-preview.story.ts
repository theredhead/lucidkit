import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from "@angular/core";

import { JsonPipe } from "@angular/common";

import { provideBuiltInFormFields } from "../../../../registry/built-in-fields";
import type { FormSchema } from "../../../../types/form-schema.types";
import type { ExportResult, ExportStrategy } from "../../../../export";
import {
  JsonExportStrategy,
  AngularComponentExportStrategy,
} from "../../../../export";
import { UIFormDesigner } from "../../form-designer.component";
import { UIButton } from "@theredhead/lucid-kit";

// ── Export preview wrapper ──────────────────────────────────────────

@Component({
  selector: "ui-story-export-preview",
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./export-preview.story.html",
})
export class StoryExportPreview {
  public readonly schema = input.required<FormSchema>();

  private readonly strategies: readonly ExportStrategy[] = [
    new AngularComponentExportStrategy(),
    new JsonExportStrategy(),
  ];

  protected readonly results = computed(() =>
    this.strategies.map((s) => s.export(this.schema())),
  );
}
