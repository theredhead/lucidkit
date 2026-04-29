import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { UIIcons, UIButton } from "@theredhead/lucid-kit";

import { UICommandPalette } from "./command-palette.component";
import type {
  CommandExecuteEvent,
  CommandPaletteItem,
} from "./command-palette.types";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-minimal-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./minimal.story.html",
  styleUrl: "./minimal.story.scss",
})
export class MinimalStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/command-palette/command-palette.stories.ts.
}
