# UI Blocks — New Component Roadmap

New composite blocks that compose `@theredhead/lucid-kit` primitives into
higher-level, content-agnostic layout shells.

## Queue

1. **UISearchView** — `UIFilter` + `UITableView`/`UIRepeater` + `UIPagination`. Unified browse-and-filter layout with collapsible filter bar, results area (table or custom template), and paginator footer.
2. **UIPropertySheet** — `UIInput` + `UISelect` + `UICheckbox` + `UIColorPicker`. Key-value inspector panel accepting a typed field schema and emitting changes. Useful for settings, config, and inspector surfaces.
3. **UICommandPalette** — `UIDialog` + `UIAutocomplete` + `UIIcon`. Keyboard-triggered (Cmd+K / Ctrl+K) searchable action list with grouping, recent items, and keyboard navigation.
4. **UIFileBrowser** — `UITreeView` + `UITableView` + `UIBreadcrumb`. Two-panel file explorer: tree sidebar for folder hierarchy, table for contents, breadcrumb for path. Datasource-driven.
5. **UIChatView** — `UIAvatar` + `UIRichTextEditor` + datasource. Message list with composer bar. Supports text, rich text, and projected message templates.
6. **UIWizard** — `UIButton` + `UIProgress` + content projection. Multi-step workflow shell (not form-specific). Step indicator, prev/next/finish navigation, optional validation gates.
7. **UIKanbanBoard** — `UICard` + drag infrastructure + datasource. Column-based board with draggable cards across swim-lanes and cross-lane transfer logic.
