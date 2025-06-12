import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import EmailVerificationScreen from '../EmailVerificationScreen';

let storeState: any;
const resendMock = vi.fn();
const fetchProfileMock = vi.fn();

vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: (selector: any) => selector(storeState),
}));

beforeEach(() => {
  storeState = {
    resend: resendMock,
    fetchProfile: fetchProfileMock,
    profile: { isActive: false },
  };
  resendMock.mockClear();
  fetchProfileMock.mockClear();
});

test('displays provided email address', () => {
  render(
    <MemoryRouter>
      <EmailVerificationScreen userId="u1" email="test@example.com" />
    </MemoryRouter>
  );

  expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
});

test('calls resend when button clicked', async () => {
  render(
    <MemoryRouter>
      <EmailVerificationScreen userId="u1" email="test@example.com" />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole('button', { name: /resend email/i }));

  await waitFor(() => expect(resendMock).toHaveBeenCalledWith({ userId: 'u1' }));
});

test('continue button disabled until verified', async () => {
  const { rerender } = render(
    <MemoryRouter>
      <EmailVerificationScreen userId="u1" email="test@example.com" />
    </MemoryRouter>
  );

  const continueBtn = screen.getByRole('button', { name: /continue/i });
  expect(continueBtn).toBeDisabled();

  storeState.profile = { isActive: true };
  rerender(
    <MemoryRouter>
      <EmailVerificationScreen userId="u1" email="test@example.com" />
    </MemoryRouter>
  );

  await waitFor(() => expect(continueBtn).not.toBeDisabled());
});
