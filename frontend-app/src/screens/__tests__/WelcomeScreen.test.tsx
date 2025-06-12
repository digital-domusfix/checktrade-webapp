import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import WelcomeScreen from '../WelcomeScreen';

const navigateMock = vi.fn();

vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: (selector: any) =>
    selector({ profile: { fullName: 'John Doe' } }),
}));

vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigateMock };
});

beforeEach(() => {
  localStorage.clear();
  navigateMock.mockClear();
});

test('shows first name in welcome message', () => {
  render(<WelcomeScreen />);
  expect(screen.getByText(/welcome, john/i)).toBeInTheDocument();
});

test('cta stores flag and navigates', async () => {
  render(<WelcomeScreen />);
  fireEvent.click(screen.getByRole('button', { name: /post your first job/i }));
  await waitFor(() =>
    expect(localStorage.getItem('onboarding-complete')).toBe('true'),
  );
  expect(navigateMock).toHaveBeenCalledWith('/job/new');
});

test('redirects to dashboard when complete', () => {
  localStorage.setItem('onboarding-complete', 'true');
  render(<WelcomeScreen />);
  expect(navigateMock).toHaveBeenCalledWith('/dashboard', { replace: true });
});
