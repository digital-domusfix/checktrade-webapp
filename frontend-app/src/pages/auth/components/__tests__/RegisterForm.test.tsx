import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RegisterScreen } from '../../../../screens/RegisterScreen';
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
    target: { value: 'secret' },
  });

  expect(button).toBeDisabled();

  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: 'secret123' },
  });

  expect(button).not.toBeDisabled();
  fireEvent.submit(button);

  await waitFor(() =>
    expect(onRegistered).toHaveBeenCalledWith('user1', 'john@example.com')
  );
});

it('shows validation errors on blur when fields are invalid', async () => {
  render(<RegisterForm onRegistered={() => {}} />);

  fireEvent.blur(screen.getByLabelText(/full name/i));
  expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/email address/i), {
    target: { value: 'invalid' },
  });
  fireEvent.blur(screen.getByLabelText(/email address/i));
  expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'short' },
  });
  fireEvent.blur(screen.getByLabelText(/password/i));
  expect(
    await screen.findByText(/password must be at least 6 characters/i)
  ).toBeInTheDocument();

  expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled();
});

it('navigates to verification screen on successful registration', async () => {
  const registerPromise = new Promise<string>((res) => setTimeout(() => res('user1'), 10));
  registerMock.mockReturnValueOnce(registerPromise);

  render(
    <MemoryRouter initialEntries={['/signup']}>
      <Routes>
        <Route path="/signup" element={<RegisterScreen />} />
        <Route path="/verify-email" element={<div>Verification Page</div>} />
      </Routes>
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/full name/i), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByPlaceholderText(/email address/i), {
    target: { value: 'john@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: 'secret123' },
  });

  const button = screen.getByRole('button', { name: /sign up/i });
  fireEvent.submit(button);

  expect(button).toBeDisabled();

  await waitFor(() => expect(screen.getByText(/verification page/i)).toBeInTheDocument());
});
