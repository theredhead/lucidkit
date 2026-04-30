import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIWizard } from "../../wizard.component";

import { ValidationWizardStory } from "./with-validation.story";

const meta = {
  title: "@theredhead/UI Blocks/Wizard",
  component: UIWizard,
  tags: ["autodocs"],
  argTypes: {
    linear: {
      control: "boolean",
      description: "Enforce sequential step completion.",
    },
    showStepIndicator: {
      control: "boolean",
      description: "Show the step indicator bar.",
    },
    backLabel: {
      control: "text",
      description: "Label for the Back button.",
    },
    nextLabel: {
      control: "text",
      description: "Label for the Next button.",
    },
    finishLabel: {
      control: "text",
      description: "Label for the Finish button.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the wizard.",
    },
  },
  decorators: [moduleMetadata({ imports: [ValidationWizardStory] })]
} satisfies Meta<UIWizard>;

export default meta;
type Story = StoryObj<UIWizard>;

export const WithValidation: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-story-wizard-validation />",
    })
};
