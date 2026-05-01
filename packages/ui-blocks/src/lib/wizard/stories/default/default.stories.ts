import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIWizard } from "../../wizard.component";

import { BasicWizardStory } from "./default.story";

const meta = {
  title: "@theredhead/UI Blocks/Wizard",
  component: BasicWizardStory,
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
  decorators: [moduleMetadata({ imports: [BasicWizardStory] })],
} satisfies Meta<BasicWizardStory>;

export default meta;
type Story = StoryObj<BasicWizardStory>;

export const Default: Story = {
  args: {
    linear: false,
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
    template: `<ui-story-wizard-basic
        [linear]="linear"
        [showStepIndicator]="showStepIndicator"
        [backLabel]="backLabel"
        [nextLabel]="nextLabel"
        [finishLabel]="finishLabel"
        [ariaLabel]="ariaLabel"
      />`,
  }),
};
