# @theredhead/lucid-foundation — API Inventory

> Machine-readable inventory of all public exports.
> Referenced from the root [AGENTS.md](../../AGENTS.md).

## Exports

| Kind      | Name                            | File                                                      | Selector      | Description                                                                       |
| --------- | ------------------------------- | --------------------------------------------------------- | ------------- | --------------------------------------------------------------------------------- |
| Interface | `ILoggingStrategy`              | `src/lib/logger/logger.ts`                                | —             | Strategy interface for pluggable log output (console, telemetry, etc.)            |
| Class     | `Logger`                        | `src/lib/logger/logger.ts`                                | —             | Context-scoped logger bound to a strategy and context string                      |
| Class     | `ConsoleLoggingStrategy`        | `src/lib/logger/logger.ts`                                | —             | Default logging strategy that writes to browser console with timestamps           |
| Service   | `LoggerFactory`                 | `src/lib/logger/logger-factory/logger-factory.service.ts` | —             | Injectable service that creates context-scoped Logger instances                   |
| Type      | `Predicate`                     | `src/lib/types/index.ts`                                  | —             | Predicate function type `(value: T) => boolean`                                   |
| Class     | `Emitter`                       | `src/lib/types/emitter.ts`                                | —             | Lightweight typed event emitter for discrete notifications                        |
| Enum      | `SortDirection`                 | `src/lib/types/sort.ts`                                   | —             | `Ascending = "asc"`, `Descending = "desc"`                                        |
| Type      | `SortExpression`                | `src/lib/types/sort.ts`                                   | —             | Ordered array of sort criteria `{ columnKey, direction }[]`                       |
| Function  | `compileSortExpression`         | `src/lib/types/sort.ts`                                   | —             | Compiles a SortExpression into a comparator function for flat arrays              |
| Function  | `compileTreeSortExpression`     | `src/lib/types/sort.ts`                                   | —             | Compiles a SortExpression into a comparator for TreeNode objects                  |
| Type      | `FilterExpression`              | `src/lib/types/filter.ts`                                 | —             | Property-level or row-level filter predicates array                               |
| Interface | `RangeDefinition`               | `src/lib/types/range.ts`                                  | —             | Defines a contiguous range `{ start, length }` of row indices                     |
| Interface | `RowChangedNotification`        | `src/lib/types/notifications.ts`                          | —             | Notification emitted when a single row's data has changed                         |
| Interface | `RowRangeChangedNotification`   | `src/lib/types/notifications.ts`                          | —             | Notification emitted when a range of rows has changed                             |
| Type      | `RowResult`                     | `src/lib/datasources/datasource.ts`                       | —             | Union type `T \| Promise<T>` for sync or async row results                        |
| Interface | `IDatasource`                   | `src/lib/datasources/datasource.ts`                       | —             | Core datasource contract: `getNumberOfItems()`, `getObjectAtRowIndex()`           |
| Interface | `ISortableDatasource`           | `src/lib/datasources/datasource.ts`                       | —             | Extends IDatasource with `sortBy()` method                                        |
| Interface | `IFilterableDatasource`         | `src/lib/datasources/datasource.ts`                       | —             | Extends IDatasource with `filterBy()` method                                      |
| Interface | `IActiveDatasource`             | `src/lib/datasources/datasource.ts`                       | —             | Extends IDatasource with row-changed event emitters                               |
| Interface | `AutocompleteDatasource`        | `src/lib/datasources/datasource.ts`                       | —             | Autocomplete suggestion provider: `completeFor(query, selection)`                 |
| Interface | `TreeNode`                      | `src/lib/datasources/datasource.ts`                       | —             | Hierarchical node `{ id, data, children?, expanded?, disabled?, icon? }`          |
| Interface | `ITreeDatasource`               | `src/lib/datasources/datasource.ts`                       | —             | Core tree datasource: `getRootNodes()`, `getChildren()`, `hasChildren()`          |
| Type      | `TreeSelectionMode`             | `src/lib/datasources/datasource.ts`                       | —             | `"none" \| "single" \| "path" \| "multiple"`                                      |
| Interface | `IFilterableTreeDatasource`     | `src/lib/datasources/datasource.ts`                       | —             | ITreeDatasource with `filterBy()` method                                          |
| Interface | `ISortableTreeDatasource`       | `src/lib/datasources/datasource.ts`                       | —             | ITreeDatasource with `sortBy()` method                                            |
| Interface | `IReorderableDatasource`        | `src/lib/datasources/datasource.ts`                       | —             | Datasource with `moveItem()` support                                              |
| Interface | `IInsertableDatasource`         | `src/lib/datasources/datasource.ts`                       | —             | Datasource with `insertItem()` support                                            |
| Interface | `IRemovableDatasource`          | `src/lib/datasources/datasource.ts`                       | —             | Datasource with `removeItem()` support                                            |
| Class     | `ArrayDatasource`               | `src/lib/datasources/array-datasource.ts`                 | —             | In-memory array datasource with reorder, insert, and remove                       |
| Class     | `FilterableArrayDatasource`     | `src/lib/datasources/filterable-array-datasource.ts`      | —             | In-memory array datasource with filtering support                                 |
| Class     | `SortableArrayDatasource`       | `src/lib/datasources/sortable-array-datasource.ts`        | —             | In-memory array datasource with sorting support                                   |
| Class     | `RestDatasource`                | `src/lib/datasources/rest-datasource.ts`                  | —             | Lazy REST datasource with pagination and per-page caching                         |
| Class     | `ArrayTreeDatasource`           | `src/lib/datasources/array-tree-datasource.ts`            | —             | In-memory tree datasource backed by nested nodes                                  |
| Class     | `FilterableArrayTreeDatasource` | `src/lib/datasources/filterable-array-tree-datasource.ts` | —             | In-memory tree datasource with filtering support                                  |
| Class     | `SortableArrayTreeDatasource`   | `src/lib/datasources/sortable-array-tree-datasource.ts`   | —             | In-memory tree datasource with sorting at all levels                              |
| Function  | `isFilterableDatasource`        | `src/lib/datasources/type-guards.ts`                      | —             | Type guard for IFilterableDatasource                                              |
| Function  | `isSortableDatasource`          | `src/lib/datasources/type-guards.ts`                      | —             | Type guard for ISortableDatasource                                                |
| Function  | `isTreeDatasource`              | `src/lib/datasources/type-guards.ts`                      | —             | Type guard for ITreeDatasource                                                    |
| Function  | `isFilterableTreeDatasource`    | `src/lib/datasources/type-guards.ts`                      | —             | Type guard for IFilterableTreeDatasource                                          |
| Function  | `isSortableTreeDatasource`      | `src/lib/datasources/type-guards.ts`                      | —             | Type guard for ISortableTreeDatasource                                            |
| Function  | `isReorderableDatasource`       | `src/lib/datasources/type-guards.ts`                      | —             | Type guard for IReorderableDatasource                                             |
| Function  | `isInsertableDatasource`        | `src/lib/datasources/type-guards.ts`                      | —             | Type guard for IInsertableDatasource                                              |
| Function  | `isRemovableDatasource`         | `src/lib/datasources/type-guards.ts`                      | —             | Type guard for IRemovableDatasource                                               |
| Function  | `moveItemInArray`               | `src/lib/datasources/array-utils.ts`                      | —             | Mutates array: moves item from one index to another                               |
| Function  | `moveItemToArray`               | `src/lib/datasources/array-utils.ts`                      | —             | Mutates both arrays: moves item between source and target                         |
| Function  | `moveItemInArrayPure`           | `src/lib/datasources/array-utils.ts`                      | —             | Pure: returns new array with item moved                                           |
| Function  | `moveItemToArrayPure`           | `src/lib/datasources/array-utils.ts`                      | —             | Pure: returns tuple of new source and target arrays                               |
| Function  | `decodeJwt`                     | `src/lib/jwt/jwt.parser.ts`                               | —             | Decodes compact JWT string to typed header, payload, and signature                |
| Function  | `extractClaim`                  | `src/lib/jwt/jwt.parser.ts`                               | —             | Decodes JWT and extracts a single claim value                                     |
| Function  | `extractPermissions`            | `src/lib/jwt/jwt.parser.ts`                               | —             | Extracts permission/scope claim as readonly string array                          |
| Function  | `isExpired`                     | `src/lib/jwt/jwt.validators.ts`                           | —             | Checks if JWT `exp` claim is in the past                                          |
| Function  | `isJwtValid`                    | `src/lib/jwt/jwt.validators.ts`                           | —             | Returns true if JWT passes all validation checks                                  |
| Function  | `isNotYetValid`                 | `src/lib/jwt/jwt.validators.ts`                           | —             | Checks if JWT `nbf` claim is in the future                                        |
| Function  | `secondsUntilExpiry`            | `src/lib/jwt/jwt.validators.ts`                           | —             | Calculates seconds remaining until JWT expires                                    |
| Function  | `validateJwt`                   | `src/lib/jwt/jwt.validators.ts`                           | —             | Composite validator: returns array of validation issues                           |
| Interface | `JwtHeader`                     | `src/lib/jwt/jwt.types.ts`                                | —             | Standard JWT header fields `{ alg, typ?, kid? }`                                  |
| Interface | `JwtPayload`                    | `src/lib/jwt/jwt.types.ts`                                | —             | Standard JWT payload claims `{ iss?, sub?, aud?, exp?, nbf?, iat?, jti? }`        |
| Interface | `JwtToken`                      | `src/lib/jwt/jwt.types.ts`                                | —             | Decoded JWT `{ header, payload, signature, raw }`                                 |
| Type      | `JwtValidationSeverity`         | `src/lib/jwt/jwt.types.ts`                                | —             | `"error" \| "warning"`                                                            |
| Interface | `JwtValidationIssue`            | `src/lib/jwt/jwt.types.ts`                                | —             | Single validation issue `{ code, message, severity }`                             |
| Type      | `JwtValidationCode`             | `src/lib/jwt/jwt.types.ts`                                | —             | Machine-readable codes: `MALFORMED`, `EXPIRED`, `ISSUER_MISMATCH`, etc.           |
| Interface | `JwtValidationOptions`          | `src/lib/jwt/jwt.types.ts`                                | —             | Validation config `{ issuer?, audience?, requireSubject? }`                       |
| Interface | `IStorageStrategy`              | `src/lib/storage/storage.ts`                              | —             | Strategy interface for key-value storage backends                                 |
| Class     | `LocalStorageStrategy`          | `src/lib/storage/storage.ts`                              | —             | Default storage strategy delegating to `localStorage`                             |
| Token     | `STORAGE_STRATEGY`              | `src/lib/storage/storage.ts`                              | —             | InjectionToken for providing custom storage strategy                              |
| Service   | `StorageService`                | `src/lib/storage/storage.ts`                              | —             | Injectable service wrapping IStorageStrategy for DI-backed storage                |
| Directive | `UISurface`                     | `src/lib/surface/surface.directive.ts`                    | `[uiSurface]` | Host directive mapping `surfaceType` input to CSS class `ui-surface-type-<value>` |
| Token     | `UI_DEFAULT_SURFACE_TYPE`       | `src/lib/surface/surface.directive.ts`                    | —             | InjectionToken for providing default surface type                                 |
| Type      | `SurfaceType`                   | `src/lib/surface/surface.directive.ts`                    | —             | `"transparent" \| "raised" \| "sunken" \| "panel" \| string`                      |
