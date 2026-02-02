import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ContactForm } from '../contact-form';

function renderWithRouter(ui: React.ReactElement) {
  const router = createMemoryRouter([{ path: '/', element: ui }], { initialEntries: ['/'] });
  return render(<RouterProvider router={router} />);
}

describe('ContactForm', () => {
  it('renders name, email, message fields and submit button', () => {
    const onSubmit = vi.fn();
    renderWithRouter(<ContactForm onSubmit={onSubmit} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('calls onSubmit with validated data when form is valid', async () => {
    const onSubmit = vi.fn();
    renderWithRouter(<ContactForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Hello, this is a test message.' }
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Jane',
        email: 'jane@example.com',
        message: 'Hello, this is a test message.'
      })
    );
  });

  it('does not call onSubmit when required fields are empty', () => {
    const onSubmit = vi.fn();
    renderWithRouter(<ContactForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not call onSubmit when message is too short', () => {
    const onSubmit = vi.fn();
    renderWithRouter(<ContactForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hi' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
