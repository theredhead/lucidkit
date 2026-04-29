import { Component, signal } from "@angular/core";
import { UIPagination } from "../../pagination.component";

@Component({
  selector: "ui-pagination-demo",
  standalone: true,
  imports: [UIPagination],
  templateUrl: "./default.story.html",
})
export class PaginationDemo {
  public readonly currentPage = signal(0);
}
