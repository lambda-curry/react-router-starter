import type { TodoFilter } from '@todo-starter/utils';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TodoFilters } from './todo-filters';

const meta: Meta<typeof TodoFilters> = {
  component: TodoFilters,
  title: 'Components/TodoFilters',
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof TodoFilters>;

export const All: Story = {
  args: {
    currentFilter: 'all' as TodoFilter,
    onFilterChange: fn(),
    activeCount: 3,
    completedCount: 0,
    onClearCompleted: fn()
  }
};

export const Active: Story = {
  args: {
    currentFilter: 'active' as TodoFilter,
    onFilterChange: fn(),
    activeCount: 2,
    completedCount: 1,
    onClearCompleted: fn()
  }
};

export const WithCompleted: Story = {
  args: {
    currentFilter: 'completed' as TodoFilter,
    onFilterChange: fn(),
    activeCount: 1,
    completedCount: 2,
    onClearCompleted: fn()
  }
};
