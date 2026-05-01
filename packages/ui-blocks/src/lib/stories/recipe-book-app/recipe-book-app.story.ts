import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIDemoRecipeBookApp } from "./recipe-book-app";

@Component({
  selector: "ui-recipe-book-app-story-source",
  standalone: true,
  imports: [UIDemoRecipeBookApp],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./recipe-book-app.story.html",
  styleUrl: "./recipe-book-app.story.scss",
})
export class RecipeBookAppStorySource {}
