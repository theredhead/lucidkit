import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIIcon, UIIcons } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-story-icon-text-editing",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIIcon],
  templateUrl: "./text-editing.story.html",
  styleUrl: "./text-editing.story.scss",
})
export class TextEditingStorySource {
  protected readonly icons = [
    { name: "Bold", svg: UIIcons.Lucide.Text.Bold },
    { name: "Italic", svg: UIIcons.Lucide.Text.Italic },
    { name: "Underline", svg: UIIcons.Lucide.Text.Underline },
    { name: "Strikethrough", svg: UIIcons.Lucide.Text.Strikethrough },
    { name: "Heading1", svg: UIIcons.Lucide.Text.Heading1 },
    { name: "Heading2", svg: UIIcons.Lucide.Text.Heading2 },
    { name: "Heading3", svg: UIIcons.Lucide.Text.Heading3 },
    { name: "List", svg: UIIcons.Lucide.Text.List },
    { name: "ListOrdered", svg: UIIcons.Lucide.Text.ListOrdered },
    { name: "Code", svg: UIIcons.Lucide.Development.Code },
    { name: "RemoveFormatting", svg: UIIcons.Lucide.Text.RemoveFormatting },
  ] as const;
}
