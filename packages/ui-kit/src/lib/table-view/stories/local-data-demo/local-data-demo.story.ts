import { Component, signal, viewChild } from '@angular/core';
import {
  UITableView, UITextColumn, UINumberColumn, UIBadgeColumn, UITemplateColumn,
  UIButton, UIFilter, UIDensityDirective,
  FilterableArrayDatasource, SelectionModel,
} from '@theredhead/lucid-kit';
import type { FilterExpression, FilterFieldDefinition } from '@theredhead/lucid-kit';

interface Row { id: number; name: string; email: string; age: number; status: string; }

readonly datasource = new FilterableArrayDatasource<Row>(rows);
readonly selectionModel = new SelectionModel<Row>('multiple', row => row.id);
private readonly table = viewChild.required(UITableView);

onExpressionChange(expression: FilterExpression<Row>): void {
  this.datasource.filterBy(expression);
  this.table().refreshDatasource();
}

onSelectionChange(rows: readonly Row[]): void { /* update UI */ }
onAction(row: Row): void { /* handle action */ }
