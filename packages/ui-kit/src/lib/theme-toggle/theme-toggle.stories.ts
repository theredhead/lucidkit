import type {
  Meta,
  StoryObj,
} from '@storybook/angular';

import { UiThemeToggleComponent } from './theme-toggle.component';

const meta: Meta<UiThemeToggleComponent> = {
    title: '@Theredhead/UI Kit/Theme Toggle',
    component: UiThemeToggleComponent,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'radio',
            options: ['icon', 'button'],
            description: 'Visual style of the toggle',
        },
        showTooltip: {
            control: 'boolean',
            description: 'Whether to show a tooltip on hover',
        },
        ariaLabel: {
            control: 'text',
            description: 'Accessible label for the button',
        },
    },
};

export default meta;
type Story = StoryObj<UiThemeToggleComponent>;

/**
 * Default icon button variant.
 */
export const Default: Story = {
    args: {
        variant: 'icon',
        showTooltip: false,
    },
};

/**
 * Icon button with tooltip showing the action.
 */
export const WithTooltip: Story = {
    args: {
        variant: 'icon',
        showTooltip: true,
    },
};

/**
 * Button variant with icon and text label.
 */
export const ButtonVariant: Story = {
    args: {
        variant: 'button',
        showTooltip: false,
    },
};

/**
 * Button variant with tooltip.
 */
export const ButtonWithTooltip: Story = {
    args: {
        variant: 'button',
        showTooltip: true,
    },
};
