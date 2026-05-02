import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { FormEngine } from "../../../engine/form-engine";
import type { FormValues } from "../../../types/form-schema.types";
import { UIForm } from "../../form.component";
import { VEHICLE_REGISTRATION_SCHEMA } from "./vehicle-registration.schema";

@Component({
  selector: "ui-vehicle-registration-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIForm, JsonPipe],
  templateUrl: "./vehicle-registration.story.html",
  styleUrl: "./vehicle-registration.story.scss",
})
export class VehicleRegistrationStorySource {

  public readonly engine = new FormEngine(VEHICLE_REGISTRATION_SCHEMA);

  public readonly submitted = signal<FormValues | null>(null);

  public onSubmit(values: FormValues): void {
    this.submitted.set(values);
  }
}
