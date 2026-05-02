import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";

import { FORM_FIELD_DEBUG, provideFormFields } from "@theredhead/lucid-forms";

import { NoFieldRegistryStorySource } from "./no-field-registry.story";

const meta = {
  title: "@theredhead/UI Forms/Form",
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [NoFieldRegistryStorySource] })],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const NoFieldRegistry: Story = {
  name: "No Field Registry (dev mode)",
  decorators: [
    applicationConfig({
      providers: [provideFormFields({})],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "In **development mode** (default), `UIFormField` renders a warning banner " +
          "for every unresolved component key, making misconfiguration instantly visible.\n\n" +
          "**Fix:** add `provideBuiltInFormFields()` to your `ApplicationConfig`:\n\n" +
          "```ts\n" +
          "// app.config.ts\n" +
          "import { provideBuiltInFormFields } from '@theredhead/lucid-forms';\n\n" +
          "export const appConfig: ApplicationConfig = {\n" +
          "  providers: [\n" +
          "    provideBuiltInFormFields(),\n" +
          "    // ... other providers\n" +
          "  ],\n" +
          "};\n" +
          "```",
      },
    },
  },
  render: () => ({
    template: "<ui-no-field-registry-story-demo />",
  }),
};

export const NoFieldRegistryProduction: Story = {
  name: "No Field Registry (production mode)",
  decorators: [
    applicationConfig({
      providers: [
        provideFormFields({}),
        { provide: FORM_FIELD_DEBUG, useValue: false },
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "In **production mode** (`FORM_FIELD_DEBUG = false`), a misconfigured form " +
          "shows only a generic **\"Configuration error\"** message instead of the full form. " +
          "No internal component keys are exposed to end users.\n\n" +
          "This is the default when Angular's `isDevMode()` returns `false`. " +
          "You can also force it explicitly:\n\n" +
          "```ts\n" +
          "import { FORM_FIELD_DEBUG } from '@theredhead/lucid-forms';\n\n" +
          "providers: [{ provide: FORM_FIELD_DEBUG, useValue: false }]\n" +
          "```",
      },
    },
  },
  render: () => ({
    template: "<ui-no-field-registry-story-demo />",
  }),
};
