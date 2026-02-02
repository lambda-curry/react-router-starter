import type { Todo } from '@todo-starter/utils';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TodoItem } from './todo-item';

const sampleTodo: Todo = {
  id: '1',
  text: 'Learn React Router 7',
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

const meta: Meta<typeof TodoItem> = {
  component: TodoItem,
  title: 'Components/TodoItem',
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof TodoItem>;

export const Default: Story = {
  args: {
    todo: sampleTodo,
    onToggle: fn(),
    onDelete: fn(),
    onUpdate: fn()
  }
};

export const Completed: Story = {
  args: {
    todo: { ...sampleTodo, completed: true, text: 'Completed task' },
    onToggle: fn(),
    onDelete: fn(),
    onUpdate: fn()
  }
};
