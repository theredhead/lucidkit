import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { UIPropertySheet } from "../../property-sheet.component";
import type {
  PropertyChangeEvent,
  PropertyFieldDefinition,
} from "../../property-sheet.types";

// ── Sample data ──────────────────────────────────────────────────────

interface WidgetConfig {
  name: string;
  description: string;
  width: number;
  height: number;
  visible: boolean;
  theme: string;
  accentColor: string;
  opacity: number;
}

const FIELDS: PropertyFieldDefinition<WidgetConfig>[] = [
  {
    key: "name",
    label: "Name",
    type: "string",
    group: "General",
    placeholder: "Widget name",
  },
  {
    key: "description",
    label: "Description",
    type: "string",
    group: "General",
    placeholder: "Optional description",
  },
  { key: "width", label: "Width", type: "number", group: "Dimensions" },
  { key: "height", label: "Height", type: "number", group: "Dimensions" },
  { key: "visible", label: "Visible", type: "boolean", group: "Display" },
  {
    key: "theme",
    label: "Theme",
    type: "select",
    group: "Display",
    options: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
      { value: "auto", label: "System" },
    ],
  },
  {
    key: "accentColor",
    label: "Accent Color",
    type: "color",
    group: "Display",
  },
  {
    key: "opacity",
    label: "Opacity",
    type: "slider",
    group: "Display",
    min: 0,
    max: 100,
    step: 5,
  },
];

const INITIAL: WidgetConfig = {
  name: "My Widget",
  description: "",
  width: 320,
  height: 240,
  visible: true,
  theme: "auto",
  accentColor: "#0061a4",
  opacity: 100,
};

@Component({
  selector: "ui-property-sheet-flat-demo",
  standalone: true,
  imports: [UIPropertySheet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./flat.story.html",
})
export class FlatDemo {
  protected readonly fields: PropertyFieldDefinition<WidgetConfig>[] =
    FIELDS.map(({ group: _, ...rest }) => rest);
  protected readonly data = signal({ ...INITIAL });
}
