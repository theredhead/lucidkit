import { Component, ChangeDetectionStrategy } from "@angular/core";

import { type SkeletonVariant, UISkeleton } from "../../skeleton.component";

@Component({
  selector: "ui-skeleton-demo",
  standalone: true,
  imports: [UISkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./showcase.story.html",
})
export class SkeletonDemo {}
