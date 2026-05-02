import { JsonPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  resource,
  signal,
} from "@angular/core";

import { FormEngine } from "../../../engine/form-engine";
import type { FormSchema, FormValues } from "../../../types/form-schema.types";
import { UIForm } from "../../form.component";

@Component({
  selector: "ui-vehicle-registration-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIForm, JsonPipe],
  templateUrl: "./vehicle-registration.story.html",
  styleUrl: "./vehicle-registration.story.scss",
})
export class VehicleRegistrationStorySource {
  protected readonly schemaResource = resource<FormSchema, void>({
    loader: async ({ abortSignal }) => {
      const res = await fetch(
        "/assets/schemas/vehicle-registration.schema.json",
        { signal: abortSignal },
      );
      return res.json() as Promise<FormSchema>;
    },
  });

  protected readonly engine = computed(() => {
    const schema = this.schemaResource.value();
    return schema ? new FormEngine(schema) : null;
  });

  protected readonly submitted = signal<FormValues | null>(null);

  public onSubmit(values: FormValues): void {
    this.submitted.set(values);
  }
}
