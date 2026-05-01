import { type Meta } from "@storybook/angular";

const meta = {
  title: "@theredhead/UI Kit/Popover",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          '`PopoverService` provides an imperative API for opening floating popover panels anchored to any DOM element. It uses the native Popover API (`popover="auto"` or `popover="manual"`) for stacking and light-dismiss behaviour.',
          "",
          "## Key Features",
          "",
          "- **Anchored positioning** — popovers attach to a trigger element with configurable vertical and horizontal alignment",
          "- **Component projection** — pass any Angular component as the popover content; forward `inputs` and `outputs`",
          "- **Light dismiss** — by default, clicking outside closes the popover; set `closeOnOutsideClick: false` for manual mode",
          "- **Result subscription** — `ref.closed` is an `Observable` that emits the close value (useful for menus and confirmations)",
          "- **Placement options** — `verticalAxisAlignment` (`top`, `bottom`, `center`, `auto`) and `horizontalAxisAlignment` (`start`, `end`, `center`, `auto`)",
          "",
          "## Usage",
          "",
          "```ts",
          "private readonly popover = inject(PopoverService);",
          "",
          "this.popover.openPopover({",
          "  component: DocumentationStorySource,",
          "  anchor: buttonElement,",
          '  ariaLabel: "My popover",',
          '  inputs: { title: "Hello" },',
          "  outputs: { chosen: (v) => console.log(v) },",
          "});",
          "```",
          "",
          "## PopoverConfig",
          "",
          "| Option | Type | Default | Description |",
          "|--------|------|---------|-------------|",
          "| `component` | `Type<T>` | *(required)* | The Angular component to render |",
          "| `anchor` | `HTMLElement` | *(required)* | The DOM element to anchor to |",
          '| `verticalAxisAlignment` | `"top" \\| "bottom" \\| "center" \\| "auto"` | `"auto"` | Vertical placement |',
          '| `horizontalAxisAlignment` | `"start" \\| "end" \\| "center" \\| "auto"` | `"auto"` | Horizontal placement |',
          "| `closeOnOutsideClick` | `boolean` | `true` | Whether clicking outside closes the popover |",
          "| `showArrow` | `boolean` | `true` | Show a triangular arrow pointing towards the anchor |",
          "| `inputs` | `Record<string, any>` | — | Input bindings forwarded to the component |",
          "| `outputs` | `Record<string, Function>` | — | Output handlers wired to the component |",
          "| `ariaLabel` | `string` | — | Accessible label for the popover container |",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
