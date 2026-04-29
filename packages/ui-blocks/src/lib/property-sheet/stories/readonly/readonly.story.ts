import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { UIPropertySheet } from "./property-sheet.component";
import type {
  PropertyChangeEvent,
  PropertyFieldDefinition,
} from "./property-sheet.types";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-readonly-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./readonly.story.html",
  styleUrl: "./readonly.story.scss",
})
export class ReadonlyStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/property-sheet/property-sheet.stories.ts.
}
