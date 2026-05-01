import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import {
  UIBreadcrumb,
  type BreadcrumbItem,
  type BreadcrumbVariant,
} from "../../breadcrumb.component";

@Component({
  selector: "ui-breadcrumb-button-demo",
  standalone: true,
  imports: [UIBreadcrumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./button-variant.story.html",
})
export class BreadcrumbButtonDemo {
  public readonly ariaLabel = input("Breadcrumb");

  public readonly disabled = input(false);

  public readonly items: BreadcrumbItem[] = [
    { label: "Home", url: "/" },
    { label: "Dashboard", url: "/dashboard" },
    { label: "Analytics", url: "/dashboard/analytics" },
    { label: "Monthly Report" },
  ];

  public readonly separator = input("/");

  public readonly variant = input<BreadcrumbVariant>("button");
}
