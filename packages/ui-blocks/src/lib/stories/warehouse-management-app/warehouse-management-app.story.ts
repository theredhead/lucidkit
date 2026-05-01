import { ChangeDetectionStrategy, Component } from "@angular/core";

import { WarehouseManagementAppDemo } from "./warehouse-management-app";

@Component({
  selector: "ui-warehouse-management-app-story-source",
  standalone: true,
  imports: [WarehouseManagementAppDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./warehouse-management-app.story.html",
  styleUrl: "./warehouse-management-app.story.scss",
})
export class WarehouseManagementAppStorySource {}
