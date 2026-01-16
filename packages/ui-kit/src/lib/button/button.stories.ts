import type {
  Meta,
  StoryObj,
} from '@storybook/angular';

import {
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
  UiButtonComponent,
} from './button.component';

const meta: Meta<UiButtonComponent> = {
    title: 'UI Kit/Button',
    component: UiButtonComponent,
    tags: ['autodocs'],
    argTypes: {
        label: {
            control: 'text',
            description: 'Text displayed on the button',
        },
        variant: {
            control: 'select',
            options: ['basic', 'raised', 'stroked', 'flat'] satisfies ButtonVariant[],
            description: 'Visual style variant of the button',
        },
        color: {
            control: 'select',
            options: ['primary', 'accent', 'warn'] satisfies ButtonColor[],
            description: 'Color theme of the button',
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'] satisfies ButtonSize[],
            description: 'Size of the button',
        },
        isDisabled: {
            control: 'boolean',
            description: 'Whether the button is disabled',
        },
    },
};

export default meta;
type Story = StoryObj<UiButtonComponent>;

/**
 * The default button with raised style and primary color.
 */
export const Default: Story = {
    args: {
        label: 'Click me',
        variant: 'raised',
        color: 'primary',
        size: 'medium',
        isDisabled: false,
    },
};

/**
 * Primary action button for main call-to-actions.
 */
export const Primary: Story = {
    args: {
        label: 'Primary Action',
        variant: 'raised',
        color: 'primary',
        size: 'medium',
    },
};

/**
 * Accent colored button for secondary emphasis.
 */
export const Accent: Story = {
    args: {
        label: 'Accent Button',
        variant: 'raised',
        color: 'accent',
        size: 'medium',
    },
};

/**
 * Warning button for destructive or cautionary actions.
 */
export const Warning: Story = {
    args: {
        label: 'Delete',
        variant: 'raised',
        color: 'warn',
        size: 'medium',
    },
};

/**
 * Basic button without elevation.
 */
export const Basic: Story = {
    args: {
        label: 'Basic Button',
        variant: 'basic',
        color: 'primary',
        size: 'medium',
    },
};

/**
 * Stroked/outlined button variant.
 */
export const Stroked: Story = {
    args: {
        label: 'Stroked Button',
        variant: 'stroked',
        color: 'primary',
        size: 'medium',
    },
};

/**
 * Flat button without elevation.
 */
export const Flat: Story = {
    args: {
        label: 'Flat Button',
        variant: 'flat',
        color: 'primary',
        size: 'medium',
    },
};

/**
 * Small sized button.
 */
export const Small: Story = {
    args: {
        label: 'Small',
        variant: 'raised',
        color: 'primary',
        size: 'small',
    },
};

/**
 * Large sized button.
 */
export const Large: Story = {
    args: {
        label: 'Large Button',
        variant: 'raised',
        color: 'primary',
        size: 'large',
    },
};

/**
 * Disabled button state.
 */
export const Disabled: Story = {
    args: {
        label: 'Disabled',
        variant: 'raised',
        color: 'primary',
        size: 'medium',
        isDisabled: true,
    },
};

/**
 * All button variants displayed together.
 */
export const AllVariants: Story = {
    render: () => ({
        template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <ui-button label="Basic" variant="basic" color="primary"></ui-button>
        <ui-button label="Raised" variant="raised" color="primary"></ui-button>
        <ui-button label="Stroked" variant="stroked" color="primary"></ui-button>
        <ui-button label="Flat" variant="flat" color="primary"></ui-button>
      </div>
    `,
    }),
};

/**
 * All button colors displayed together.
 */
export const AllColors: Story = {
    render: () => ({
        template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <ui-button label="Primary" variant="raised" color="primary"></ui-button>
        <ui-button label="Accent" variant="raised" color="accent"></ui-button>
        <ui-button label="Warn" variant="raised" color="warn"></ui-button>
      </div>
    `,
    }),
};

/**
 * All button sizes displayed together.
 */
export const AllSizes: Story = {
    render: () => ({
        template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <ui-button label="Small" variant="raised" color="primary" size="small"></ui-button>
        <ui-button label="Medium" variant="raised" color="primary" size="medium"></ui-button>
        <ui-button label="Large" variant="raised" color="primary" size="large"></ui-button>
      </div>
    `,
    }),
};
