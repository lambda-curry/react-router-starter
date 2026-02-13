import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AddTodo } from './add-todo';

const meta: Meta<typeof AddTodo> = {
  component: AddTodo,
  title: 'Components/AddTodo',
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof AddTodo>;

export const Default: Story = {
  args: {
    onAdd: fn()
  }
};
