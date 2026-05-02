import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";

import { provideFormFields } from "@theredhead/lucid-forms";

import { NoFieldRegistryStorySource } from "./no-field-registry.story";

const meta = {
  title: "@theredhead/UI Forms/Form",
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [NoFieldRegistryStorySource] })],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const NoFieldRegistry: Story = {
  name: "No Field Registry",
  decorators: [
    applicationConfig({
      providers: [provideFormFields({})],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the result of **not calling `provideBuiltInFormFields()`** " +
          "(or any `provideFormFields()`) in your app config.\n\n" +
          "`UIFormField` resolves each field's `component` key through the `FormFieldRegistry`. " +
          "When the registry is empty, no component is found for any key — so the form renders " +
          "group titles and field labels, but no input controls appear and no submit button is shown.\n\n" +
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
