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
  selector: "ui-pressure-sensitive-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./pressure-sensitive.story.html",
  styleUrl: "./pressure-sensitive.story.scss",
})
export class PressureSensitiveStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/signature/signature.stories.ts.
}
