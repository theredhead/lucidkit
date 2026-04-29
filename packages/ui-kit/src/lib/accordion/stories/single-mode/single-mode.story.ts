import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UIAccordion } from "../../accordion.component";
import { UIAccordionItem } from "../../accordion-item.component";

@Component({
  selector: "ui-accordion-single-demo",
  standalone: true,
  imports: [UIAccordion, UIAccordionItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./single-mode.story.html",
})
export class AccordionSingleDemo {}
