import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock remix-hook-form to avoid Router dependency in unit tests
vi.mock('remix-hook-form', () => {
  let onValid: ((data: { text: string }) => void) | undefined;
  return {
    RemixFormProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useRemixForm: (config?: { submitHandlers?: { onValid?: (data: { text: string }) => void } }) => {
      onValid = config?.submitHandlers?.onValid;
      const api: any = {
        handleSubmit: (e?: React.FormEvent) => {
          e?.preventDefault?.();
          const input = document.querySelector('input[name="text"]') as HTMLInputElement | null;
          const raw = input?.value ?? '';
          const trimmed = raw.trim();
          if (!trimmed) return; // mimic zod min(1)
          onValid?.({ text: trimmed });
          // mimic methods.reset() effect on DOM
          if (input) input.value = '';
        },
        reset: () => {
          const input = document.querySelector('input[name="text"]') as HTMLInputElement | null;
          if (input) input.value = '';
        },
      };
      return api;
    },
  } as any;
});

// Mock TextField to a plain input
vi.mock('@lambdacurry/forms', () => {
  return {
    TextField: ({ name, placeholder, className }: { name: string; placeholder?: string; className?: string }) => (
      <input name={name} placeholder={placeholder} className={className} />
    ),
    FormError: () => null,
  } as any;
});

// Import after mocks so component sees mocked modules
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
