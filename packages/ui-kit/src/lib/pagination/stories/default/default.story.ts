import { Component, input, output, signal } from "@angular/core";

import { UIPagination } from "../../pagination.component";
import { type PageChangeEvent } from "../../pagination.types";

@Component({
  selector: "ui-pagination-demo",
  standalone: true,
  imports: [UIPagination],
  templateUrl: "./default.story.html",
})
export class PaginationDemo {
  public readonly currentPage = signal(0);

  public readonly ariaLabel = input("Pagination");

  public readonly disabled = input(false);

  public readonly pageSize = input(10);

  public readonly pageChange = output<PageChangeEvent>();

  public readonly totalItems = input(250);
}
