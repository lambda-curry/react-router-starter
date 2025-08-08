import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AddTodo } from '../add-todo';

// hoist regex literals to top-level to satisfy biome's useTopLevelRegex
const ADD_REGEX = /add/i;

describe('AddTodo', () => {
  it('renders input and button', () => {
    const mockOnAdd = vi.fn();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: ADD_REGEX })).toBeInTheDocument();
  });

  it('calls onAdd when form is submitted with text', () => {
    const mockOnAdd = vi.fn();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: ADD_REGEX });
    
    fireEvent.change(input, { target: { value: 'New todo' } });
    fireEvent.click(button);
    
    expect(mockOnAdd).toHaveBeenCalledWith('New todo');
  });

  it('clears input after adding todo', () => {
    const mockOnAdd = vi.fn();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    const input = screen.getByPlaceholderText('Add a new todo...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: ADD_REGEX });
    
    fireEvent.change(input, { target: { value: 'New todo' } });
    fireEvent.click(button);
    
    expect(input.value).toBe('');
  });

  it('does not call onAdd with empty text', () => {
    const mockOnAdd = vi.fn();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    const button = screen.getByRole('button', { name: ADD_REGEX });
    fireEvent.click(button);
    
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('trims whitespace from input', () => {
    const mockOnAdd = vi.fn();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: ADD_REGEX });
    
    fireEvent.change(input, { target: { value: '  New todo  ' } });
    fireEvent.click(button);
    
    expect(mockOnAdd).toHaveBeenCalledWith('New todo');
  });
});
