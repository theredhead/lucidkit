import { Component } from "@angular/core";

import { UIThemeStudio } from "@theredhead/lucid-theme-studio";

/**
 * Demo host component for the Theme Studio story.
 * Renders the full split-pane theme editor.
 */
@Component({
  selector: "ui-story-theme-studio-default",
  standalone: true,
  imports: [UIThemeStudio],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class ThemeStudioDefaultStory {}
