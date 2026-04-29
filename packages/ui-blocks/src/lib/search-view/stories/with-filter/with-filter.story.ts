import { ChangeDetectionStrategy, Component } from "@angular/core";

import { FilterableArrayDatasource, UITextColumn } from "@theredhead/lucid-kit";

import { UISearchView } from "./search-view.component";
import type { SavedSearch } from "./saved-search.types";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-with-filter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./with-filter.story.html",
  styleUrl: "./with-filter.story.scss",
})
export class WithFilterStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/search-view/search-view.stories.ts.
}
