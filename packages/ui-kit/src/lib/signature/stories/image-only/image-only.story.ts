import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from "@angular/core";
import { UISignature } from "./signature.component";
import type { SignatureImageValue, SignatureValue } from "./signature.types";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-image-only-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./image-only.story.html",
  styleUrl: "./image-only.story.scss",
})
export class ImageOnlyStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/signature/signature.stories.ts.
}
