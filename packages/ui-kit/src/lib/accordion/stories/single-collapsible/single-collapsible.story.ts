import { Component, ChangeDetectionStrategy } from "@angular/core";

import { UIAccordion } from "../../accordion.component";
import { UIAccordionItem } from "../../accordion-item.component";

@Component({
  selector: "ui-accordion-collapsible-demo",
  standalone: true,
  imports: [UIAccordion, UIAccordionItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./single-collapsible.story.html",
})
export class AccordionCollapsibleDemo {}
