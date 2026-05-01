import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UserManagementAppDemo } from "./user-management-app";

@Component({
  selector: "ui-user-management-app-story-source",
  standalone: true,
  imports: [UserManagementAppDemo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./user-management-app.story.html",
  styleUrl: "./user-management-app.story.scss",
})
export class UserManagementAppStorySource {}
