import { ChangeDetectionStrategy, Component } from "@angular/core";

import { FilterableArrayDatasource, UITextColumn } from "@theredhead/lucid-kit";

import { UISearchView } from "./search-view.component";
import type { SavedSearch } from "./saved-search.types";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-custom-layout-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./custom-layout.story.html",
  styleUrl: "./custom-layout.story.scss",
})
export class CustomLayoutStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/search-view/search-view.stories.ts.
}
