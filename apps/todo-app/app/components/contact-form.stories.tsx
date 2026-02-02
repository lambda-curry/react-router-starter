import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ContactForm } from './contact-form';

const meta: Meta<typeof ContactForm> = {
  component: ContactForm,
  title: 'Components/ContactForm',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Example form using @lambdacurry/forms with Zod validation. Use `onSubmit` in Storybook; use `fetcher` on a route with getValidatedFormData in the action.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ContactForm>;

export const Default: Story = {
  args: {
    onSubmit: fn()
  }
};
