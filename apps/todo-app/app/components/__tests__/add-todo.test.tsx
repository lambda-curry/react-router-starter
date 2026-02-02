import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '../../../test/test-utils';
import { AddTodo } from '../add-todo';

// Hoist regex to top-level to satisfy performance rule
const addRegex = /add/i;

describe('AddTodo', () => {
  it('renders input and button', () => {
    const mockOnAdd = vi.fn();
    renderWithRouter(<AddTodo onAdd={mockOnAdd} />);

    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: addRegex })).toBeInTheDocument();
  });

  it('calls onAdd when form is submitted with text', () => {
    const mockOnAdd = vi.fn();
    renderWithRouter(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: addRegex });

    fireEvent.change(input, { target: { value: 'New todo' } });
    fireEvent.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith('New todo');
  });

  it('clears input after adding todo', () => {
    const mockOnAdd = vi.fn();
    renderWithRouter(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add a new todo...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: addRegex });

    fireEvent.change(input, { target: { value: 'New todo' } });
    fireEvent.click(button);

    expect(input.value).toBe('');
  });

  it('does not call onAdd with empty text', () => {
    const mockOnAdd = vi.fn();
    renderWithRouter(<AddTodo onAdd={mockOnAdd} />);

    const button = screen.getByRole('button', { name: addRegex });
    fireEvent.click(button);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('trims whitespace from input', () => {
    const mockOnAdd = vi.fn();
    renderWithRouter(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: addRegex });

    fireEvent.change(input, { target: { value: '  New todo  ' } });
    fireEvent.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith('New todo');
  });
});
