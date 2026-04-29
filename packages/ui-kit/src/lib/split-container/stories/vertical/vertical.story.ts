import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISplitContainer, UISplitPanel } from "@theredhead/lucid-kit";

@Component({
  selector: "app-vertical-split-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./vertical-split-demo.component.html",
})
export class VerticalSplitDemo {}
