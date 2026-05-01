import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

import {
  UIBreadcrumb,
  type BreadcrumbItem,
  type BreadcrumbVariant,
} from "../../breadcrumb.component";

const DEFAULT_ITEMS: readonly BreadcrumbItem[] = [
  { label: "Home", url: "/" },
  { label: "Products", url: "/products" },
  { label: "Detail" },
];

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIBreadcrumb],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  public readonly ariaLabel = input("Breadcrumb");

  public readonly disabled = input(false);

  public readonly items = input<readonly BreadcrumbItem[]>(DEFAULT_ITEMS);

  public readonly separator = input("/");

  public readonly variant = input<BreadcrumbVariant>("link");

  public readonly itemClicked = output<BreadcrumbItem>();
}
