import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UISkeleton } from "../../skeleton.component";

@Component({
  selector: "ui-skeleton-demo",
  standalone: true,
  imports: [UISkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./showcase.story.html",
})
export class SkeletonDemo {}
