import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import {
  UIDropdownList,
  UIDropdownListPanel,
  type SelectOption,
} from "./dropdown-list.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-disabled-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./disabled.story.html",
  styleUrl: "./disabled.story.scss",
})
export class DisabledStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/dropdown-list/dropdown-list.stories.ts.
}
