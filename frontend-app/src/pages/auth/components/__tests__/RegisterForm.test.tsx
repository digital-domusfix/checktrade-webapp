import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { RegisterForm } from '../RegisterForm';

const registerMock = vi.fn().mockResolvedValue('user1');
vi.mock('../../../../store/useAuthStore', () => ({
  useAuthStore: (selector: any) => selector({ register: registerMock }),
}));

it('enables submit when form is valid and submits registration', async () => {
  const onRegistered = vi.fn();
  render(<RegisterForm onRegistered={onRegistered} />);

  const button = screen.getByRole('button', { name: /sign up/i });
  expect(button).toBeDisabled();

  fireEvent.change(screen.getByPlaceholderText(/full name/i), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByPlaceholderText(/email address/i), {
    target: { value: 'john@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: 'secret123' },
  });

  expect(button).not.toBeDisabled();
  fireEvent.submit(button);

  await waitFor(() => expect(onRegistered).toHaveBeenCalledWith('user1'));
});
