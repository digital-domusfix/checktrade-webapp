import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import JobPostedScreen from '../JobPostedScreen';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => ({ state: { jobId: 'j1' } }),
  };
});

beforeEach(() => {
  localStorage.clear();
  navigateMock.mockClear();
});

test('shows reference id when provided', () => {
  render(<JobPostedScreen />);
  expect(screen.getByText(/reference id: j1/i)).toBeInTheDocument();
});

test('post another job clears id and navigates', () => {
  localStorage.setItem('lastJobId', 'j1');
  render(<JobPostedScreen />);
  const btn = screen.getByRole('button', { name: /post another job/i });
  fireEvent.click(btn);
  expect(localStorage.getItem('lastJobId')).toBe(null);
  expect(navigateMock).toHaveBeenCalledWith('/post-job');
});
