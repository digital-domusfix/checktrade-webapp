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
  expect(
    screen.getByRole('heading', { name: /welcome, john/i }),
  ).toBeInTheDocument();
});

test('handshake icon is hidden from assistive tech and sr message exists', () => {
  const { container } = render(<WelcomeScreen />);
  const icon = container.querySelector('svg.lucide-handshake');
  expect(icon).toHaveAttribute('aria-hidden', 'true');
  expect(
    screen.getByText(/welcome, john! you're ready to post your first job/i),
  ).toHaveClass('sr-only');
});

test('sets flag on mount and CTA navigates', async () => {
  render(<WelcomeScreen />);
  await waitFor(() =>
    expect(localStorage.getItem('onboarding-complete')).toBe('true'),
  );
  const button = screen.getByRole('button', { name: /post your first job/i });
  fireEvent.click(button);
  expect(button).toBeDisabled();
  expect(button.querySelector('svg.animate-spin')).toBeInTheDocument();
  expect(navigateMock).toHaveBeenCalledWith('/job/new');
});

test('leaving and returning redirects to dashboard', async () => {
  const { unmount } = render(<WelcomeScreen />);
  await waitFor(() =>
    expect(localStorage.getItem('onboarding-complete')).toBe('true'),
  );
  navigateMock.mockClear();
  unmount();

  render(<WelcomeScreen />);
  expect(navigateMock).toHaveBeenCalledWith('/dashboard', { replace: true });
});

test('redirects to dashboard when complete', () => {
  localStorage.setItem('onboarding-complete', 'true');
  render(<WelcomeScreen />);
  expect(navigateMock).toHaveBeenCalledWith('/dashboard', { replace: true });
});
