import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UIAccordion } from "../../accordion.component";
import { UIAccordionItem } from "../../accordion-item.component";

@Component({
  selector: "ui-accordion-multi-demo",
  standalone: true,
  imports: [UIAccordion, UIAccordionItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./multi-mode.story.html",
})
export class AccordionMultiDemo {}
