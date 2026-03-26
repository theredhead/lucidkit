import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

import { UIThemeToggle } from "../packages/ui-kit/src/lib/theme-toggle/theme-toggle.component";
import { ThemeStudioService } from "../packages/ui-theme/src/lib/services/theme-studio.service";

/**
 * Internal toolbar shown at the top of every Storybook story.
 * Contains the theme toggle and a button to open the Theme Studio.
 *
 * @internal — Not exported from any package; used only in `.storybook/preview.ts`.
 */
@Component({
  selector: "ui-story-toolbar",
  standalone: true,
  imports: [UIThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="story-toolbar">
      <button class="story-toolbar-btn" (click)="openStudio()">Theme Studio</button>
      <ui-theme-toggle />
    </div>
  `,
  styles: `
    .story-toolbar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      margin-bottom: 12px;
    }
    .story-toolbar-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--ui-border, #d7dce2);
      background: var(--ui-surface, #ffffff);
      color: var(--ui-text, #1d232b);
      font-family: inherit;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .story-toolbar-btn:hover {
      border-color: var(--ui-accent, #3584e4);
      background: var(--ui-hover-bg, #f0f1f3);
    }
  `,
})
export class StoryToolbar {
  private readonly studio = inject(ThemeStudioService);

  protected openStudio(): void {
    this.studio.open();
  }
}
