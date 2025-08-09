import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddTodo } from '../add-todo';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import type { ReactElement, ReactNode, ChangeEvent, FormEvent } from 'react';

// Create a stateful mock for the input field
let testInputValue = '';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Plus: () => null
}));

// Mock the @lambdacurry/forms components
interface TextFieldProps {
  name: string;
  placeholder: string;
  className: string;
}

vi.mock('@lambdacurry/forms', () => ({
  TextField: ({ name, placeholder, className }: TextFieldProps) => (
    <input
      name={name}
      placeholder={placeholder}
      className={className}
      type="text"
      value={testInputValue}
      onChange={e => {
        testInputValue = e.target.value;
      }}
    />
  ),
  FormError: () => null
}));

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  type: 'button' | 'submit' | 'reset';
}

vi.mock('@lambdacurry/forms/ui', () => ({
  Button: ({ children, onClick, type }: ButtonProps) => (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  )
}));

// Mock the remix-hook-form module
interface RemixFormConfig {
  submitHandlers?: {
    onValid: (data: { text: string }) => void;
  };
  [key: string]: unknown;
}

vi.mock('remix-hook-form', () => {
  let latestConfig: RemixFormConfig | undefined;
  return {
    RemixFormProvider: ({ children }: { children: ReactNode }) => children,
    useRemixForm: (config: RemixFormConfig) => {
      latestConfig = config;
      return {
        ...config,
        getValues: (_name: string) => testInputValue,
        reset: vi.fn(() => {
          testInputValue = '';
          // Force re-render by dispatching a custom event
          const inputs = document.querySelectorAll('input[name="text"]');
          inputs.forEach(input => {
            (input as HTMLInputElement).value = '';
          });
        }),
        setValue: vi.fn((_name: string, value: string) => {
          testInputValue = value;
        }),
        register: vi.fn((name: string) => ({
          name,
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            testInputValue = e.target.value;
          },
          value: testInputValue
        })),
        handleSubmit: vi.fn((arg?: unknown) => {
          // Support both usages:
          // 1) onSubmit={methods.handleSubmit}  → arg is the FormEvent
          // 2) onSubmit={methods.handleSubmit(onValid)} → arg is the onValid callback
          const isEvent = arg && typeof (arg as FormEvent).preventDefault === 'function';
          if (isEvent) {
            const e = arg as FormEvent;
            e.preventDefault();
            const onValid = latestConfig?.submitHandlers?.onValid;
            if (onValid && testInputValue?.trim()) onValid({ text: testInputValue.trim() });
            return undefined;
          }
          const maybeOnValid = arg as ((data: { text: string }) => void) | undefined;
          return (e: FormEvent) => {
            e.preventDefault();
            const onValid = maybeOnValid || latestConfig?.submitHandlers?.onValid;
            if (onValid && testInputValue?.trim()) onValid({ text: testInputValue.trim() });
          };
        }),
        formState: { errors: {} },
        watch: vi.fn((_name: string) => testInputValue)
      };
    }
  };
});

function renderWithRouter(ui: ReactElement) {
  const router = createMemoryRouter([{ path: '/', element: ui }], { initialEntries: ['/'] });
  return render(<RouterProvider router={router} />);
}

// hoist regex literals to top-level to satisfy biome's useTopLevelRegex
const ADD_REGEX = /add/i;

describe('AddTodo', () => {
  beforeEach(() => {
    // Reset the test state before each test
    testInputValue = '';
  });

  it('renders input and button', () => {
    const mockOnAdd = vi.fn();
    renderWithRouter(<AddTodo onAdd={mockOnAdd} />);

    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: ADD_REGEX })).toBeInTheDocument();
  });

  it('calls onAdd when form is submitted with text', () => {
    const mockOnAdd = vi.fn();
    renderWithRouter(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: ADD_REGEX });
    const form = button.closest('form') as HTMLFormElement;

    fireEvent.change(input, { target: { value: 'New todo' } });
    fireEvent.submit(form);

    expect(mockOnAdd).toHaveBeenCalledWith('New todo');
  });

  it('clears input after adding todo', () => {
    const mockOnAdd = vi.fn();
    renderWithRouter(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add a new todo...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: ADD_REGEX });
    const form = button.closest('form') as HTMLFormElement;

    fireEvent.change(input, { target: { value: 'New todo' } });
    fireEvent.submit(form);

    expect(input.value).toBe('');
  });

  it('does not call onAdd with empty text', () => {
    const mockOnAdd = vi.fn();
    renderWithRouter(<AddTodo onAdd={mockOnAdd} />);

    const button = screen.getByRole('button', { name: ADD_REGEX });
    const form = button.closest('form') as HTMLFormElement;
    fireEvent.submit(form);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('trims whitespace from input', () => {
    const mockOnAdd = vi.fn();
    renderWithRouter(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: ADD_REGEX });
    const form = button.closest('form') as HTMLFormElement;

    fireEvent.change(input, { target: { value: '  New todo  ' } });
    fireEvent.submit(form);

    expect(mockOnAdd).toHaveBeenCalledWith('New todo');
  });
});
