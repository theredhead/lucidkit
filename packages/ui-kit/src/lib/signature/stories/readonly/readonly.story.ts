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
  selector: "ui-signature-readonly-demo",
  standalone: true,
  imports: [UISignature],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./readonly.story.html",
  styles: STORY_HOST_STYLES,
})
export class ReadonlyDemo {
  protected readonly frozenValue: SignatureValue = {
    kind: "strokes",
    strokes: [
      {
        points: [
          { x: 30, y: 100, time: 0 },
          { x: 80, y: 60, time: 50 },
          { x: 130, y: 100, time: 100 },
          { x: 180, y: 60, time: 150 },
          { x: 230, y: 100, time: 200 },
        ],
      },
    ],
    bounds: { width: 400, height: 160 },
  };
}
