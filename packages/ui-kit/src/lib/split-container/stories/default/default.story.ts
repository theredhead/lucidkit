import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISplitContainer, UISplitPanel } from "@theredhead/lucid-kit";

@Component({
  selector: "app-split-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./split-demo.component.html",
})
export class SplitDemo {}
