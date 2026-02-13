import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, jest } from 'bun:test';
import { renderWithRouter } from '../../../test/test-utils';
import { AddTodo } from '../add-todo';

// Hoist regex to top-level to satisfy performance rule
const addRegex = /add/i;

describe('AddTodo', () => {
  it('renders input and button', () => {
    const mockOnAdd = jest.fn();
    renderWithRouter(<AddTodo onAdd={mockOnAdd} />);

    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: addRegex })).toBeInTheDocument();
  });

  it('calls onAdd when form is submitted with text', async () => {
    const mockOnAdd = jest.fn();
    const user = userEvent.setup();
    renderWithRouter(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: addRegex });

    await user.type(input, 'New todo');
    await user.click(button);

    await waitFor(() => expect(mockOnAdd).toHaveBeenCalledWith('New todo'));
  });

  it('clears input after adding todo', async () => {
    const mockOnAdd = jest.fn();
    const user = userEvent.setup();
    renderWithRouter(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add a new todo...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: addRegex });

    await user.type(input, 'New todo');
    await user.click(button);

    await waitFor(() => expect(input.value).toBe(''));
  });

  it('does not call onAdd with empty text', () => {
    const mockOnAdd = jest.fn();
    renderWithRouter(<AddTodo onAdd={mockOnAdd} />);

    const button = screen.getByRole('button', { name: addRegex });
    fireEvent.click(button);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('trims whitespace from input', async () => {
    const mockOnAdd = jest.fn();
    const user = userEvent.setup();
    renderWithRouter(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: addRegex });

    await user.type(input, '  New todo  ');
    await user.click(button);

    await waitFor(() => expect(mockOnAdd).toHaveBeenCalledWith('New todo'));
  });
});
