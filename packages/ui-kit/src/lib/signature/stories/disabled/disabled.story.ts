import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from "@angular/core";
import { UISignature } from "../../signature.component";
import type { SignatureImageValue, SignatureValue } from "../../signature.types";

// ── Demo wrappers ─────────────────────────────────────────────────────────────

const STORY_HOST_STYLES = [
  `
  :host {
    display: block;
    max-width: 480px;
  }
  ui-signature {
    min-height: 160px;
  }
  .value-log {
    margin-top: 0.75rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    font-family: monospace;
    background: #f0f2f5;
    border: 1px solid #d7dce2;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-all;
    color: #1d232b;
    max-height: 80px;
    overflow-y: auto;
  }
`,
];

@Component({
  selector: "ui-signature-disabled-demo",
  standalone: true,
  imports: [UISignature],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./disabled.story.html",
  styles: STORY_HOST_STYLES,
})
export class DisabledDemo {}
