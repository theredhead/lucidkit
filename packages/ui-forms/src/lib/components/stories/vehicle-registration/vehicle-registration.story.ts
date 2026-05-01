import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-vehicle-registration-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./vehicle-registration.story.html",
  styleUrl: "./vehicle-registration.story.scss",
})
export class VehicleRegistrationStorySource {
  // Review required: this scaffold was generated from packages/ui-forms/src/lib/components/form.stories.ts.
}
