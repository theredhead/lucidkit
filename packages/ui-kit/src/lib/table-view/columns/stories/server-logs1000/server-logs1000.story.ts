import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from "@angular/core";

import { UITableView } from "../../../table-view.component";
import { UIAutogenerateColumnsDirective } from "../../autogenerate-columns.directive";
import { ArrayDatasource } from "../../../datasources/array-datasource";
import { FilterableArrayDatasource } from "../../../datasources/filterable-array-datasource";
import { UIFilter } from "../../../../filter/filter.component";
import { inferFilterFields } from "../../../../filter/infer-filter-fields";
import type {
  FilterExpression,
  FilterFieldDefinition,
} from "../../../../filter/filter.types";

function generateServerLogs(count: number) {
  const levels = ["INFO", "WARN", "ERROR", "DEBUG", "TRACE"];
  const services = [
    "api-gateway",
    "auth-service",
    "user-service",
    "payment-service",
    "notification-service",
    "search-service",
    "cache-service",
    "scheduler",
  ];
  const messages = [
    "Request processed successfully",
    "Connection timeout after 30s",
    "Rate limit exceeded for client",
    "Cache miss — fetching from DB",
    "Health check passed",
    "Retrying failed operation",
    "Session expired for user",
    "Index rebuild completed",
    "Queue depth threshold exceeded",
    "Certificate renewal scheduled",
  ];

  return Array.from({ length: count }, (_, i) => ({
    timestamp: `2026-03-${String((i % 28) + 1).padStart(2, "0")}T${String(i % 24).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}:${String((i * 13) % 60).padStart(2, "0")}Z`,
    level: levels[i % levels.length],
    service: services[i % services.length],
    message: messages[i % messages.length],
    responseTimeMs: 5 + ((i * 31) % 2000),
    statusCode: [200, 201, 204, 400, 401, 403, 404, 500, 502, 503][i % 10],
    requestId: `req-${crypto.randomUUID().slice(0, 8)}`,
  }));
}

@Component({
  selector: "ui-demo-autogenerate-logs",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  templateUrl: "./server-logs1000.story.html",
})
export class DemoAutogenerateLogsComponent {
  public readonly datasource = signal(
    new ArrayDatasource(generateServerLogs(1000)),
  );
}
