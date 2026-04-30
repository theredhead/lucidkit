import { Component, signal } from "@angular/core";
import { UITableView } from "../../../table-view.component";
import { UIAutogenerateColumnsDirective } from "../../autogenerate-columns.directive";
import { ArrayDatasource } from "../../../datasources/array-datasource";

@Component({
  selector: "ui-demo-autogenerate-custom",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  templateUrl: "./autogenerate-custom.story.html",
})
export class DemoAutogenerateCustomComponent {
  public readonly datasource = signal(
    new ArrayDatasource([
      {
        userId: 1,
        userName: "john_doe",
        userEmail: "john@example.com",
        createdAt: "2024-01-15",
      },
      {
        userId: 2,
        userName: "jane_smith",
        userEmail: "jane@example.com",
        createdAt: "2024-02-20",
      },
      {
        userId: 3,
        userName: "bob_johnson",
        userEmail: "bob@example.com",
        createdAt: "2024-03-10",
      },
    ]),
  );

  public readonly config = signal({
    excludeKeys: ["userId"],
    headerMap: {
      userName: "Username",
      userEmail: "Email Address",
      createdAt: "Joined",
    },
  });
}
