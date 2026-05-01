import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { ValidationWizardStory } from "./with-validation.story";

interface ValidationWizardStoryArgs {
  readonly linear: boolean;
  readonly showStepIndicator: boolean;
  readonly backLabel: string;
  readonly nextLabel: string;
  readonly finishLabel: string;
  readonly ariaLabel: string;
}

const meta = {
  title: "@theredhead/UI Blocks/Wizard",
  component: ValidationWizardStory,
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
  decorators: [moduleMetadata({ imports: [ValidationWizardStory] })],
} satisfies Meta<ValidationWizardStoryArgs>;

export default meta;
type Story = StoryObj<ValidationWizardStoryArgs>;

export const WithValidation: Story = {
  args: {
    linear: true,
    showStepIndicator: true,
    backLabel: "Back",
    nextLabel: "Next",
    finishLabel: "Finish",
    ariaLabel: "Wizard",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-story-wizard-validation [linear]="linear" [showStepIndicator]="showStepIndicator" [backLabel]="backLabel" [nextLabel]="nextLabel" [finishLabel]="finishLabel" [ariaLabel]="ariaLabel"></ui-story-wizard-validation>',
  }),
};
