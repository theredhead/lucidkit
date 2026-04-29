import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISplitContainer, UISplitPanel } from "@theredhead/lucid-kit";

@Component({
  selector: "app-divider-width-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./divider-width-demo.component.html",
})
export class DividerWidthDemo {}
