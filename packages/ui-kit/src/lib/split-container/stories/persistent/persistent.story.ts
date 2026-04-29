import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISplitContainer, UISplitPanel } from "@theredhead/lucid-kit";

@Component({
  selector: "app-persistent-demo",
  standalone: true,
  imports: [UISplitContainer, UISplitPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./persistent-demo.component.html",
})
export class PersistentSplitDemo {}
