import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
  UIBreadcrumb,
  type BreadcrumbItem,
  type BreadcrumbVariant,
} from "../../breadcrumb.component";

@Component({
  selector: "ui-breadcrumb-demo",
  standalone: true,
  imports: [UIBreadcrumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./default.story.html",
})
export class BreadcrumbDemo {
  public readonly variant = input<BreadcrumbVariant>("link");
  public readonly separator = input("/");
  public readonly disabled = input(false);
  public readonly ariaLabel = input("Breadcrumb");

  public readonly items: BreadcrumbItem[] = [
    { label: "Home", url: "/" },
    { label: "Dashboard", url: "/dashboard" },
    { label: "Analytics", url: "/dashboard/analytics" },
    { label: "Monthly Report" },
  ];
}
