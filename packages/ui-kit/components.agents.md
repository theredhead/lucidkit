# @theredhead/lucid-kit — API Inventory

> Machine-readable inventory of all public exports.
> Referenced from the root [AGENTS.md](../../AGENTS.md).

## Components

| Name                    | File                                                                          | Selector                    | Description                                                                                                                        |
| ----------------------- | ----------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `UIButton`              | `src/lib/button/button.component.ts`                                          | `ui-button`                 | Thin wrapper around native `<button>` with variant, size, and colour inputs. No custom output — use native `(click)`.              |
| `UISelect`              | `src/lib/select/select.component.ts`                                          | `ui-select`                 | Thin wrapper around native `<select>` with two-way value binding                                                                   |
| `UIInput`               | `src/lib/input/input.component.ts`                                            | `ui-input`                  | Wrapper around native `<input>` / `<textarea>` with text/value models and adapters                                                 |
| `UIIcon`                | `src/lib/icon/icon.component.ts`                                              | `ui-icon`                   | Inline SVG icon component with built-in Lucide registry and custom icon support                                                    |
| `UIFilter`              | `src/lib/filter/filter.component.ts`                                          | `ui-filter`                 | Predicate builder for composing filter rules against typed fields                                                                  |
| `UIAutocomplete`        | `src/lib/autocomplete/autocomplete.component.ts`                              | `ui-autocomplete`           | Type-ahead component with optional custom item template                                                                            |
| `UICalendarPanel`       | `src/lib/calendar-panel/calendar-panel.component.ts`                          | `ui-calendar-panel`         | Standalone calendar grid panel for date selection                                                                                  |
| `UIRichTextView`        | `src/lib/rich-text-view/rich-text-view.component.ts`                          | `ui-rich-text-view`         | Read-only renderer for HTML or Markdown content; auto-detects format via `strategy` input (`'html'\|'markdown'\|'auto'`)           |
| `UIThemeToggle`         | `src/lib/theme-toggle/theme-toggle.component.ts`                              | `ui-theme-toggle`           | Toggle button for switching between light and dark mode                                                                            |
| `UITableView`           | `src/lib/table-view/table-view.component.ts`                                  | `ui-table-view`             | Table with sorting, filtering, selection, column resizing, and pluggable rendering strategy (`'plain'` or `'virtual'`)             |
| `UITableHeader`         | `src/lib/table-view/table-view-header/table-view-header.component.ts`         | `ui-table-header`           | Table header row (internal)                                                                                                        |
| `UITableBody`           | `src/lib/table-view/table-view-body/table-view-body.component.ts`             | `ui-table-body`             | Table body viewport with virtual scrolling (internal, legacy — prefer strategy components)                                         |
| `UIPlainTableBody`      | `src/lib/table-view/rendering-strategies/plain-table-body.component.ts`       | `ui-plain-table-body`       | Plain-scroll table body strategy — `@for` loop, no CDK dependency (internal)                                                       |
| `UICdkVirtualTableBody` | `src/lib/table-view/rendering-strategies/cdk-virtual-table-body.component.ts` | `ui-cdk-virtual-table-body` | CDK virtual-scroll table body strategy — `CdkVirtualScrollViewport` (internal)                                                     |
| `UITableBodyBase`       | `src/lib/table-view/rendering-strategies/table-body-base.ts`                  | _(directive)_               | Abstract base for table body strategy components (internal)                                                                        |
| `UITableFooter`         | `src/lib/table-view/table-view-footer/table-view-footer.component.ts`         | `ui-table-footer`           | Table footer with pagination controls (internal)                                                                                   |
| `UICheckbox`            | `src/lib/checkbox/checkbox.component.ts`                                      | `ui-checkbox`               | Checkbox / toggle-switch control with two visual variants                                                                          |
| `UIRadioGroup`          | `src/lib/radio-group/radio-group.component.ts`                                | `ui-radio-group`            | Radio group container managing single-selection                                                                                    |
| `UIRadioButton`         | `src/lib/radio-group/radio-button.component.ts`                               | `ui-radio-button`           | Single radio button within a `<ui-radio-group>`                                                                                    |
| `UITabGroup`            | `src/lib/tabs/tab-group.component.ts`                                         | `ui-tab-group`              | Tabbed container managing tab headers and lazy-rendering active content                                                            |
| `UITab`                 | `src/lib/tabs/tab.component.ts`                                               | `ui-tab`                    | Single tab panel within a `<ui-tab-group>`                                                                                         |
| `UITabSeparator`        | `src/lib/tabs/tab-separator.component.ts`                                     | `ui-tab-separator`          | Visual separator between tab groups or items                                                                                       |
| `UITabSpacer`           | `src/lib/tabs/tab-spacer.component.ts`                                        | `ui-tab-spacer`             | Flexible spacer that expands to fill space in tab headers                                                                          |
| `UIBadge`               | `src/lib/badge/badge.component.ts`                                            | `ui-badge`                  | Standalone status indicator / count badge                                                                                          |
| `UIPagination`          | `src/lib/pagination/pagination.component.ts`                                  | `ui-pagination`             | Pagination control for navigating pages                                                                                            |
| `UIRepeater`            | `src/lib/repeater/repeater.component.ts`                                      | `ui-repeater`               | Repeating container with optional reordering and transfer                                                                          |
| `UIAccordion`           | `src/lib/accordion/accordion.component.ts`                                    | `ui-accordion`              | Container managing multiple collapsible panels                                                                                     |
| `UIAccordionItem`       | `src/lib/accordion/accordion-item.component.ts`                               | `ui-accordion-item`         | Single collapsible panel inside `<ui-accordion>`                                                                                   |
| `UIBreadcrumb`          | `src/lib/breadcrumb/breadcrumb.component.ts`                                  | `ui-breadcrumb`             | Navigation breadcrumb trail                                                                                                        |
| `UIDialog`              | `src/lib/dialog/dialog.component.ts`                                          | `ui-dialog`                 | Declarative dialog built on native `<dialog>`                                                                                      |
| `UIDialogHeader`        | `src/lib/dialog/dialog-header.component.ts`                                   | `ui-dialog-header`          | Dialog header section                                                                                                              |
| `UIDialogBody`          | `src/lib/dialog/dialog-body.component.ts`                                     | `ui-dialog-body`            | Dialog body section                                                                                                                |
| `UIDialogFooter`        | `src/lib/dialog/dialog-footer.component.ts`                                   | `ui-dialog-footer`          | Dialog footer section                                                                                                              |
| `UIDropdownList`        | `src/lib/dropdown-list/dropdown-list.component.ts`                            | `ui-dropdown-list`          | Dropdown list component with popover options                                                                                       |
| `UIDropdownListPanel`   | `src/lib/dropdown-list/dropdown-list.component.ts`                            | `ui-dropdown-list-panel`    | Popover content rendering option list for UIDropdownList (internal)                                                                |
| `UISlider`              | `src/lib/slider/slider.component.ts`                                          | `ui-slider`                 | Range slider with single-thumb and dual-thumb (range) modes                                                                        |
| `UIProgress`            | `src/lib/progress/progress.component.ts`                                      | `ui-progress`               | Progress indicator in linear (bar) or circular (ring) form                                                                         |
| `UIAvatar`              | `src/lib/avatar/avatar.component.ts`                                          | `ui-avatar`                 | Avatar showing image, Gravatar, initials, or fallback icon                                                                         |
| `UIChip`                | `src/lib/chip/chip.component.ts`                                              | `ui-chip`                   | Compact interactive chip with optional remove button                                                                               |
| `UIFileUpload`          | `src/lib/file-upload/file-upload.component.ts`                                | `ui-file-upload`            | File-upload with click-to-browse and drag-and-drop                                                                                 |
| `UITreeView`            | `src/lib/tree-view/tree-view.component.ts`                                    | `ui-tree-view`              | Hierarchical tree-view with expand/collapse and selection                                                                          |
| `UITreeNode`            | `src/lib/tree-view/tree-node.component.ts`                                    | `ui-tree-node`              | Single node within a `<ui-tree-view>`                                                                                              |
| `UISplitContainer`      | `src/lib/split-container/split-container.component.ts`                        | `ui-split-container`        | Resizable split container with draggable divider                                                                                   |
| `UIColorPicker`         | `src/lib/color-picker/color-picker.component.ts`                              | `ui-color-picker`           | Colour picker with RGB/HSL/Hex input and theme palette grid                                                                        |
| `UIColorPanel`          | `src/lib/color-picker/color-panel.component.ts`                               | `ui-color-panel`            | Colour selection panel used by UIColorPicker                                                                                       |
| `UIColorPickerPopover`  | `src/lib/color-picker/color-picker-popover.component.ts`                      | `ui-color-picker-popover`   | Popover wrapper for the colour picker                                                                                              |
| `UIChart`               | `src/lib/chart/chart.component.ts`                                            | `ui-chart`                  | Chart supporting multiple graph strategies (line, bar, pie, scatter)                                                               |
| `UIAnalogClock`         | `src/lib/analog-clock/analog-clock.component.ts`                              | `ui-analog-clock`           | Analog clock rendered entirely in SVG                                                                                              |
| `UICalendarMonthView`   | `src/lib/calendar/calendar-month-view.component.ts`                           | `ui-calendar-month-view`    | Calendar month view displaying events on a grid                                                                                    |
| `UIGanttChart`          | `src/lib/gantt-chart/gantt-chart.component.ts`                                | `ui-gantt-chart`            | Gantt chart for visualising project timelines                                                                                      |
| `UICard`                | `src/lib/card/card.component.ts`                                              | `ui-card`                   | Content container with optional header, body, and footer                                                                           |
| `UICardHeader`          | `src/lib/card/card.component.ts`                                              | `ui-card-header`            | Card header section                                                                                                                |
| `UICardBody`            | `src/lib/card/card.component.ts`                                              | `ui-card-body`              | Card body section                                                                                                                  |
| `UICardFooter`          | `src/lib/card/card.component.ts`                                              | `ui-card-footer`            | Card footer section                                                                                                                |
| `UIToastContainer`      | `src/lib/toast/toast.component.ts`                                            | `ui-toast-container`        | Container rendering active toast notifications                                                                                     |
| `UIDrawer`              | `src/lib/drawer/drawer.component.ts`                                          | `ui-drawer`                 | Off-canvas drawer panel                                                                                                            |
| `UIDropdownMenu`        | `src/lib/dropdown-menu/dropdown-menu.component.ts`                            | `ui-dropdown-menu`          | Dropdown menu with items and dividers                                                                                              |
| `UIDropdownItem`        | `src/lib/dropdown-menu/dropdown-menu.component.ts`                            | `ui-dropdown-item`          | Single item within a dropdown menu                                                                                                 |
| `UIDropdownDivider`     | `src/lib/dropdown-menu/dropdown-menu.component.ts`                            | `ui-dropdown-divider`       | Visual divider within a dropdown menu                                                                                              |
| `UISidebarNav`          | `src/lib/sidebar-nav/sidebar-nav.component.ts`                                | `ui-sidebar-nav`            | Sidebar navigation container                                                                                                       |
| `UISidebarItem`         | `src/lib/sidebar-nav/sidebar-nav.component.ts`                                | `ui-sidebar-item`           | Navigation item within a sidebar                                                                                                   |
| `UISidebarGroup`        | `src/lib/sidebar-nav/sidebar-nav.component.ts`                                | `ui-sidebar-group`          | Group of related sidebar items                                                                                                     |
| `UISidebarHeader`       | `src/lib/sidebar-nav/sidebar-nav.component.ts`                                | `[uiSidebarHeader]`         | Sidebar header directive — apply as attribute on any element                                                                       |
| `UISidebarFooter`       | `src/lib/sidebar-nav/sidebar-nav.component.ts`                                | `[uiSidebarFooter]`         | Sidebar footer directive — apply as attribute on any element                                                                       |
| `UIToggle`              | `src/lib/toggle/toggle.component.ts`                                          | `ui-toggle`                 | Toggle button control                                                                                                              |
| `UICarousel`            | `src/lib/carousel/carousel.component.ts`                                      | `ui-carousel`               | Carousel / image slider with multiple strategies                                                                                   |
| `UIMediaPlayer`         | `src/lib/media-player/media-player.component.ts`                              | `ui-media-player`           | Media player for video/audio with embed providers (YouTube, Vimeo)                                                                 |
| `UIImage`               | `src/lib/image/image.component.ts`                                            | `ui-image`                  | Lazy-loading image component with IntersectionObserver                                                                             |
| `UIGauge`               | `src/lib/gauge/gauge.component.ts`                                            | `ui-gauge`                  | Gauge with multiple visualisation strategies                                                                                       |
| `UIQRCode`              | `src/lib/qr-code/qr-code.component.ts`                                        | `ui-qr-code`                | QR code generator and renderer                                                                                                     |
| `UITimeline`            | `src/lib/timeline/timeline.component.ts`                                      | `ui-timeline`               | Timeline displaying sequential events                                                                                              |
| `UIEmojiPicker`         | `src/lib/emoji-picker/emoji-picker.component.ts`                              | `ui-emoji-picker`           | Emoji picker with category navigation                                                                                              |
| `UIRichTextEditor`      | `src/lib/rich-text-editor/rich-text-editor.component.ts`                      | `ui-rich-text-editor`       | Rich-text editor: HTML WYSIWYG + Markdown modes with split-pane preview (`splitDirection`) and full-screen toggle                  |
| `UISkeleton`            | `src/lib/skeleton/skeleton.component.ts`                                      | `ui-skeleton`               | Animated shimmer placeholder while content loads — `text`, `rect`, and `circle` variants                                           |
| `UIEmptyState`          | `src/lib/empty-state/empty-state.component.ts`                                | `ui-empty-state`            | Zero-data placeholder with heading, optional message, optional icon, and projected action slot                                     |
| `UISegmentedControl`    | `src/lib/segmented-control/segmented-control.component.ts`                    | `ui-segmented-control`      | iOS-style mutually exclusive option button row via `items` input and `[(value)]` binding                                           |
| `UIRating`              | `src/lib/rating/rating.component.ts`                                          | `ui-rating`                 | Star rating input with interactive and read-only modes; `max`, `[(value)]`, `size`, `readonly`, `disabled`                         |
| `UICountdown`           | `src/lib/countdown/countdown.component.ts`                                    | `ui-countdown`              | Live countdown or elapsed timer ticking every second; `target`, `mode`, `format`; emits `expired`                                  |
| `UISignature`           | `src/lib/signature/signature.component.ts`                                    | `ui-signature`              | Signature field supporting drawn strokes, optional pressure-sensitive capture, image paste/drop/browse, replay, and SVG/PNG export |

## Toolbar

All toolbar components use the **DI forwarding pattern** — each tool extends
`UIToolbarItem` and provides itself via `{ provide: UIToolbarItem, useExisting: forwardRef(...) }`.
`UIToolbar` collects direct content children via `contentChildren(UIToolbarItem)`.

| Name                | File                                                                     | Selector               | Description                                                                                  |
| ------------------- | ------------------------------------------------------------------------ | ---------------------- | -------------------------------------------------------------------------------------------- |
| `UIToolbar`         | `src/lib/toolbar/toolbar.component.ts`                                   | `ui-toolbar`           | Container that collects `UIToolbarItem` children and re-emits their actions via `toolAction` |
| `UIToolbarItem`     | `src/lib/toolbar/toolbar-item.directive.ts`                              | _(abstract directive)_ | Abstract base for all toolbar tool components                                                |
| `UIButtonTool`      | `src/lib/toolbar/tools/button-tool/button-tool.component.ts`             | `ui-button-tool`       | Clickable button tool; emits `ToolActionEvent` on click                                      |
| `UIToggleTool`      | `src/lib/toolbar/tools/toggle-tool/toggle-tool.component.ts`             | `ui-toggle-tool`       | Toggle button with `checked` model; `deactivate()` sets checked to false                     |
| `UISeparatorTool`   | `src/lib/toolbar/tools/separator-tool/separator-tool.component.ts`       | `ui-separator-tool`    | Visual divider; does not emit actions                                                        |
| `UIDropdownTool`    | `src/lib/toolbar/tools/dropdown-tool/dropdown-tool.component.ts`         | `ui-dropdown-tool`     | Dropdown panel via `items` input or projected content; `selectedItemId` signal               |
| `UISelectTool`      | `src/lib/toolbar/tools/select-tool/select-tool.component.ts`             | `ui-select-tool`       | Wraps `<ui-select>`; emits with `event: null` on change; `value` model                       |
| `UITemplateTool`    | `src/lib/toolbar/tools/template-tool/template-tool.component.ts`         | `ui-template-tool`     | Renders consumer template via `NgTemplateOutlet`; `$implicit` context is the tool itself     |
| `UIButtonGroupTool` | `src/lib/toolbar/tools/button-group-tool/button-group-tool.component.ts` | `ui-button-group-tool` | Visual group; re-emits direct children's actions unchanged                                   |
| `UIToggleGroupTool` | `src/lib/toolbar/tools/toggle-group-tool/toggle-group-tool.component.ts` | `ui-toggle-group-tool` | Radio-style group; deactivates siblings on child action, then re-emits                       |

### Types

| Name                 | File                                   | Description                                                         |
| -------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| `ToolActionEvent`    | `src/lib/toolbar/toolbar-action.ts`    | Payload emitted by all toolbar tools (`itemId`, `itemRef`, `event`) |
| `DropdownToolItem`   | `src/lib/toolbar/toolbar-action.ts`    | Item descriptor for `UIDropdownTool` items input                    |
| `ToolbarOrientation` | `src/lib/toolbar/toolbar.component.ts` | `'horizontal' \| 'vertical'`                                        |

## Table-View Columns

| Name                             | File                                                                      | Selector                | Description                                                 |
| -------------------------------- | ------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------- |
| `UITableViewColumn`              | `src/lib/table-view/columns/table-column.directive.ts`                    | —                       | Abstract base directive for all table column types          |
| `UITextColumn`                   | `src/lib/table-view/columns/text-column/text-column.component.ts`         | `ui-text-column`        | Column rendering text values with optional truncation       |
| `UIBadgeColumn`                  | `src/lib/table-view/columns/badge-column/badge-column.component.ts`       | `ui-badge-column`       | Column rendering badge status values                        |
| `UINumberColumn`                 | `src/lib/table-view/columns/number-column/number-column.component.ts`     | `ui-number-column`      | Column rendering formatted numbers                          |
| `UITemplateColumn`               | `src/lib/table-view/columns/template-column/template-column.component.ts` | `ui-template-column`    | Column with consumer-projected template for cell content    |
| `UIAutogenerateColumnsDirective` | `src/lib/table-view/columns/autogenerate-columns.directive.ts`            | `uiAutogenerateColumns` | Directive that auto-generates table columns from datasource |

## Column Inheritance Pattern

The table view uses Angular's dependency injection (DI) forwarding system to enable flexible column composition. All column types extend `UITableViewColumn` and provide themselves via DI forwarding using `forwardRef` to make them discoverable by the parent table component through a single `contentChildren()` query on the base class token.

This pattern allows for extensibility - new column types can be added without modifying the parent table component, as long as they follow the DI forwarding pattern.

## Directives

| Name                 | File                                         | Selector    | Description                                         |
| -------------------- | -------------------------------------------- | ----------- | --------------------------------------------------- |
| `UITooltip`          | `src/lib/tooltip/tooltip.directive.ts`       | `uiTooltip` | Lightweight tooltip directive                       |
| `UIDensityDirective` | `src/lib/ui-density/ui-density.directive.ts` | `uiDensity` | Applies UI density tokens via CSS custom properties |

## Services

| Name                  | File                                          | Description                                         |
| --------------------- | --------------------------------------------- | --------------------------------------------------- |
| `UIDensityService`    | `src/lib/ui-density/ui-density.service.ts`    | Manages UI density state                            |
| `ColumnResizeService` | `src/lib/table-view/column-resize.service.ts` | Persists user-defined column widths to localStorage |
| `PopoverService`      | `src/lib/popover/popover.service.ts`          | Programmatically opens popovers                     |
| `ModalService`        | `src/lib/dialog/dialog.service.ts`            | Programmatically opens modal dialogs                |
| `ToastService`        | `src/lib/toast/toast.service.ts`              | Shows auto-dismissing toast notifications           |

## Strategy Classes

| Name                        | File                                                               | Description                       |
| --------------------------- | ------------------------------------------------------------------ | --------------------------------- |
| `GraphPresentationStrategy` | `src/lib/chart/strategies/graph-presentation-strategy.ts`          | Base strategy for chart rendering |
| `LineGraphStrategy`         | `src/lib/chart/strategies/line-graph.strategy.ts`                  | Line graphs                       |
| `BarGraphStrategy`          | `src/lib/chart/strategies/bar-graph.strategy.ts`                   | Vertical bar charts               |
| `StackedBarGraphStrategy`   | `src/lib/chart/strategies/stacked-bar-graph.strategy.ts`           | Stacked bar charts                |
| `PieChartStrategy`          | `src/lib/chart/strategies/pie-chart.strategy.ts`                   | Pie / doughnut charts             |
| `ScatterPlotStrategy`       | `src/lib/chart/strategies/scatter-plot.strategy.ts`                | Scatter plots                     |
| `GaugePresentationStrategy` | `src/lib/gauge/strategies/gauge-presentation-strategy.ts`          | Base strategy for gauge rendering |
| `AnalogGaugeStrategy`       | `src/lib/gauge/strategies/analog-gauge.strategy.ts`                | Analog speedometer style          |
| `VuMeterStrategy`           | `src/lib/gauge/strategies/vu-meter.strategy.ts`                    | VU meter style                    |
| `DigitalGaugeStrategy`      | `src/lib/gauge/strategies/digital-gauge.strategy.ts`               | Digital numeric display           |
| `LcdGaugeStrategy`          | `src/lib/gauge/strategies/lcd-gauge.strategy.ts`                   | LCD-style numeric display         |
| `BarGaugeStrategy`          | `src/lib/gauge/strategies/bar-gauge.strategy.ts`                   | Horizontal bar gauge              |
| `ScrollCarouselStrategy`    | `src/lib/carousel/scroll-strategy.ts`                              | Carousel via horizontal scroll    |
| `CoverflowCarouselStrategy` | `src/lib/carousel/coverflow-strategy.ts`                           | Carousel with 3D coverflow effect |
| `HtmlEditingStrategy`       | `src/lib/rich-text-editor/strategies/html-editing.strategy.ts`     | Rich text WYSIWYG editing         |
| `MarkdownEditingStrategy`   | `src/lib/rich-text-editor/strategies/markdown-editing.strategy.ts` | Markdown plain-text editing       |

## Types

| Name                   | File                                                 | Description                                                                |
| ---------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------- |
| `RichTextViewStrategy` | `src/lib/rich-text-view/rich-text-view.component.ts` | `'html' \| 'markdown' \| 'auto'` — rendering strategy for `UIRichTextView` |

## Text Input Adapters

| Name                     | File                                                 | Description                                   |
| ------------------------ | ---------------------------------------------------- | --------------------------------------------- |
| `TextAdapterRegistry`    | `src/lib/input/adapters/text-adapter-registry.ts`    | Registry managing text input adapters         |
| `EmailTextAdapter`       | `src/lib/input/adapters/email-text-adapter.ts`       | Validates/formats email addresses             |
| `UrlTextAdapter`         | `src/lib/input/adapters/url-text-adapter.ts`         | Validates/formats URLs                        |
| `IPAddressTextAdapter`   | `src/lib/input/adapters/ip-address-text-adapter.ts`  | Validates/formats IPv4 addresses              |
| `IntegerTextAdapter`     | `src/lib/input/adapters/integer-text-adapter.ts`     | Validates/formats integers                    |
| `FloatTextAdapter`       | `src/lib/input/adapters/float-text-adapter.ts`       | Validates/formats floating-point numbers      |
| `DecimalTextAdapter`     | `src/lib/input/adapters/decimal-text-adapter.ts`     | Validates/formats decimal numbers             |
| `MoneyTextAdapter`       | `src/lib/input/adapters/money-text-adapter.ts`       | Validates/formats currency values             |
| `HexadecimalTextAdapter` | `src/lib/input/adapters/hexadecimal-text-adapter.ts` | Validates/formats hexadecimal values          |
| `PhoneTextAdapter`       | `src/lib/input/adapters/phone-text-adapter.ts`       | Validates/formats phone numbers               |
| `CreditCardTextAdapter`  | `src/lib/input/adapters/credit-card-text-adapter.ts` | Validates/formats credit card numbers         |
| `PercentageTextAdapter`  | `src/lib/input/adapters/percentage-text-adapter.ts`  | Validates/formats percentages                 |
| `DateTextAdapter`        | `src/lib/input/adapters/date-text-adapter.ts`        | Validates/formats date strings                |
| `DateInputAdapter`       | `src/lib/input/adapters/date-input-adapter.ts`       | Popup adapter with calendar panel             |
| `TimeTextAdapter`        | `src/lib/input/adapters/time-text-adapter.ts`        | Validates/formats time strings                |
| `ColorTextAdapter`       | `src/lib/input/adapters/color-text-adapter.ts`       | Validates/formats colour values (hex/rgb/hsl) |
| `SlugTextAdapter`        | `src/lib/input/adapters/slug-text-adapter.ts`        | Converts text to URL-safe slugs               |
| `UuidTextAdapter`        | `src/lib/input/adapters/uuid-text-adapter.ts`        | Validates/formats UUID format                 |
| `CronTextAdapter`        | `src/lib/input/adapters/cron-text-adapter.ts`        | Validates cron expression syntax              |
| `UppercaseTextAdapter`   | `src/lib/input/adapters/uppercase-text-adapter.ts`   | Converts input to uppercase                   |
| `LowercaseTextAdapter`   | `src/lib/input/adapters/lowercase-text-adapter.ts`   | Converts input to lowercase                   |
| `TrimTextAdapter`        | `src/lib/input/adapters/trim-text-adapter.ts`        | Trims whitespace from input                   |
| `PasswordTextAdapter`    | `src/lib/input/adapters/password-text-adapter.ts`    | Password validation rules                     |
| `IbanTextAdapter`        | `src/lib/input/adapters/iban-text-adapter.ts`        | Validates IBAN bank account numbers           |
| `MacAddressTextAdapter`  | `src/lib/input/adapters/mac-address-text-adapter.ts` | Validates MAC address format                  |

## Datasource Classes

| Name                      | File                                            | Description                                      |
| ------------------------- | ----------------------------------------------- | ------------------------------------------------ |
| `SelectionModel`          | `src/lib/core/selection-model.ts`               | Reactive selection model tracking selected items |
| `PopoverRef`              | `src/lib/popover/popover.types.ts`              | Reference to an open popover                     |
| `ModalRef`                | `src/lib/dialog/dialog.types.ts`                | Reference to an open modal dialog                |
| `ArrayCalendarDatasource` | `src/lib/calendar/array-calendar-datasource.ts` | In-memory calendar event datasource              |
| `GanttArrayDatasource`    | `src/lib/gantt-chart/gantt-array-datasource.ts` | In-memory Gantt task datasource                  |

## Key Constants

| Name                           | File                                                                      | Description                                                   |
| ------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `UIIcons`                      | `src/lib/icon/lucide-icons.generated.ts`                                  | Lucide icon registry with 300+ categorised SVG icons          |
| `UI_BUTTON_DEFAULTS`           | `src/lib/button/button.component.ts`                                      | InjectionToken for button defaults                            |
| `TAB_GROUP_DEFAULTS`           | `src/lib/tabs/tab-group.component.ts`                                     | InjectionToken for tab group defaults                         |
| `TABLE_ROW_RENDERING_STRATEGY` | `src/lib/table-view/rendering-strategies/table-row-rendering-strategy.ts` | InjectionToken for the default rendering strategy (`'plain'`) |
| `DEFAULT_CHART_PALETTE`        | `src/lib/chart/chart.types.ts`                                            | Default colour palette for charts                             |

## Key Types

> For the full list of 100+ exported types and interfaces, see `src/public-api.ts`
> and the barrel files it re-exports. The most commonly used types include:

| Name                            | Description                                                   |
| ------------------------------- | ------------------------------------------------------------- |
| `ButtonVariant`                 | `"filled" \| "outlined" \| "ghost"`                           |
| `ButtonSize`                    | `"small" \| "medium" \| "large"`                              |
| `ButtonColor`                   | `"neutral" \| "primary" \| "secondary" \| "safe" \| "danger"` |
| `SelectOption`                  | Interface for select option `{ label, value, disabled? }`     |
| `BreadcrumbItem`                | Interface for breadcrumb item `{ label, icon? }`              |
| `BreadcrumbVariant`             | `"link" \| "button"`                                          |
| `DrawerPosition`                | `"left" \| "right" \| "top" \| "bottom"`                      |
| `DrawerWidth`                   | Drawer width specification                                    |
| `FilterFieldDefinition`         | Interface for filter field definitions                        |
| `FilterDescriptor`              | Interface for filter descriptors                              |
| `SortState`                     | Interface representing sort state                             |
| `SelectionMode`                 | `"none" \| "single" \| "multiple"`                            |
| `ToastSeverity`                 | `"info" \| "success" \| "warning" \| "error"`                 |
| `GanttTask`                     | Interface for Gantt chart tasks                               |
| `CalendarEvent`                 | Interface for calendar events                                 |
| `ChartDataPoint`                | Chart data point interface                                    |
| `TextAdapter`                   | Interface for text input adapters                             |
| `ITableRowRenderingStrategy`    | Interface for table body rendering strategies (scrollToIndex) |
| `TableRowRenderingStrategyType` | `"plain" \| "virtual"`                                        |
