import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import OnboardingStatusScreen from '../OnboardingStatusScreen';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigateMock };
});

test('shows approved message and dashboard button', () => {
  render(<OnboardingStatusScreen firstName="John" status="approved" />);
  expect(
    screen.getByRole('heading', { name: /you’re all set, john/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /go to my dashboard/i }),
  ).toBeInTheDocument();
});

test('shows pending message and home button', () => {
  render(<OnboardingStatusScreen firstName="Jane" status="pending" />);
  expect(screen.getByText(/thanks for submitting/i)).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /return to home/i }),
  ).toBeInTheDocument();
});
