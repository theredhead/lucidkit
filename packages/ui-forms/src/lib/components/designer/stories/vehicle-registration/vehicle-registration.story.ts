import { ChangeDetectionStrategy, Component, input, signal } from "@angular/core";
import { JsonPipe } from "@angular/common";
import type { FormSchema } from "../../../../types/form-schema.types";
import type { ExportResult, ExportStrategy } from "../../../../export";
import { JsonExportStrategy, AngularComponentExportStrategy } from "../../../../export";
import { UIFormDesigner } from "../../form-designer.component";
import { UIButton } from "@theredhead/lucid-kit";

// ── Demo wrapper ────────────────────────────────────────────────────

@Component({
  selector: "ui-story-designer-demo",
  standalone: true,
  imports: [UIFormDesigner, JsonPipe, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./vehicle-registration.story.html",
})
export class StoryDesignerDemo {
  public readonly initialSchema = input<FormSchema | null>(null);

  protected readonly allStrategies: readonly ExportStrategy[] = [
    new JsonExportStrategy(),
    new AngularComponentExportStrategy(),
  ];

  protected readonly latestSchema = signal<FormSchema | null>(null);
  protected readonly lastExport = signal<ExportResult | null>(null);
  protected selectedStrategyIndex = 0;

  protected onSchemaChange(schema: FormSchema): void {
    this.latestSchema.set(schema);
  }

  protected onStrategyChange(event: Event): void {
    this.selectedStrategyIndex = Number(
      (event.target as HTMLSelectElement).value,
    );
  }

  protected onExport(): void {
    const schema = this.latestSchema();
    if (!schema) return;
    const strategy = this.allStrategies[this.selectedStrategyIndex];
    if (strategy) {
      this.lastExport.set(strategy.export(schema));
    }
  }
}
