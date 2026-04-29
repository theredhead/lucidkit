import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UIBreadcrumb, type BreadcrumbItem } from "../../breadcrumb.component";

@Component({
  selector: "ui-breadcrumb-demo",
  standalone: true,
  imports: [UIBreadcrumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./default.story.html",
})
export class BreadcrumbDemo {
  public readonly items: BreadcrumbItem[] = [
    { label: "Home", url: "/" },
    { label: "Dashboard", url: "/dashboard" },
    { label: "Analytics", url: "/dashboard/analytics" },
    { label: "Monthly Report" },
  ];
}
