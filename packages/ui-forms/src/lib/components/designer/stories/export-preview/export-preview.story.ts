import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import type { FormSchema } from "../../../../types/form-schema.types";
import type { ExportStrategy } from "../../../../export";
import { JsonExportStrategy, AngularComponentExportStrategy } from "../../../../export";

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
