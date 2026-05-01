import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import type { CommandPaletteItem } from "../../command-palette.types";
import { UICommandPalette } from "../../command-palette.component";

const DEFAULT_COMMANDS: readonly CommandPaletteItem[] = [
  {
    id: "new-project",
    label: "New Project",
    group: "Workspace",
    shortcut: "Cmd+N",
    keywords: ["create", "workspace"],
  },
  {
    id: "open-settings",
    label: "Open Settings",
    group: "Workspace",
    shortcut: "Cmd+,",
    keywords: ["preferences", "config"],
  },
  {
    id: "toggle-sidebar",
    label: "Toggle Sidebar",
    group: "View",
    shortcut: "Cmd+B",
  },
  {
    id: "show-command-palette",
    label: "Show Command Palette",
    group: "View",
    shortcut: "Cmd+K",
  },
];

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICommandPalette],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly commands = DEFAULT_COMMANDS;

  private readonly _paletteOpen = signal(false);

  public get paletteOpen(): boolean {
    return this._paletteOpen();
  }

  public set paletteOpen(value: boolean) {
    this._paletteOpen.set(value);
  }

  public onExecute(_event: unknown): void {
    this.paletteOpen = false;
  }
}
