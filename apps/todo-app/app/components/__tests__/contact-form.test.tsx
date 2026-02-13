import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, jest } from 'bun:test';
import { renderWithRouter } from '../../../test/test-utils';
import { ContactForm } from '../contact-form';

describe('ContactForm', () => {
  it('renders name, email, message fields and submit button', () => {
    const onSubmit = jest.fn();
    renderWithRouter(<ContactForm onSubmit={onSubmit} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('calls onSubmit with validated data when form is valid', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();
    renderWithRouter(<ContactForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/name/i), 'Jane');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello, this is a test message.');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Jane',
        email: 'jane@example.com',
        message: 'Hello, this is a test message.'
      })
    );
  });

  it('does not call onSubmit when required fields are empty', () => {
    const onSubmit = jest.fn();
    renderWithRouter(<ContactForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not call onSubmit when message is too short', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();
    renderWithRouter(<ContactForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/name/i), 'Jane');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hi');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
