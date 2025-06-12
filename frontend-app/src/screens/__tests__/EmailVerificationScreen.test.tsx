import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import EmailVerificationScreen from '../EmailVerificationScreen';

let resendMock: any;
let fetchProfileMock: any;
let profile: any;
const navigateMock = vi.fn();

vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: (selector: any) => selector({ resend: resendMock, fetchProfile: fetchProfileMock, profile }),
}));

vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigateMock };
});

beforeEach(() => {
  resendMock = vi.fn();
  fetchProfileMock = vi.fn();
  profile = { isActive: false };
  navigateMock.mockClear();
});

test('displays the provided email address', () => {
  render(<EmailVerificationScreen userId="u1" email="john@example.com" />);
  expect(
    screen.getByText(/confirmation link to john@example.com/i)
  ).toBeInTheDocument();
});

test('calls resend when "Resend Email" is clicked', async () => {
  render(<EmailVerificationScreen userId="u1" email="john@example.com" />);
  fireEvent.click(screen.getByRole('button', { name: /resend email/i }));
  await waitFor(() => expect(resendMock).toHaveBeenCalledWith({ userId: 'u1' }));
});

test('continue button is disabled until verification is true', async () => {
  const { rerender } = render(
    <EmailVerificationScreen userId="u1" email="john@example.com" />
  );
  const continueBtn = screen.getByRole('button', { name: /continue/i });
  expect(continueBtn).toBeDisabled();

  profile = { isActive: true };
  rerender(<EmailVerificationScreen userId="u1" email="john@example.com" />);

  await waitFor(() =>
    expect(screen.getByRole('button', { name: /continue/i })).not.toBeDisabled()
  );
});
