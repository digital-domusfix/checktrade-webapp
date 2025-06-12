import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Step3 from '../Step3';

const navigateMock = vi.fn();

const state = {
  categoryId: '1',
  title: 'Fix sink',
  subcategoryId: 'faucet',
  answers: {},
  description: '',
  imgFiles: [],
  videoFiles: [],
};

vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => ({ state }),
  };
});

test('validates schedule and budget before navigating', async () => {
  render(<Step3 />);
  const next = screen.getByRole('button', { name: /next: review & post/i });
  expect(next).toBeDisabled();

  fireEvent.click(screen.getByRole('radio', { name: /flexible/i }));
  fireEvent.change(screen.getByLabelText(/budget/i), {
    target: { value: '300' },
  });
  await waitFor(() => expect(next).toBeEnabled());

  fireEvent.click(next);
  await waitFor(() =>
    expect(navigateMock).toHaveBeenCalledWith('/post-job/review', {
      state: { ...state, schedule: { type: 'flexible' }, budget: 300 },
    }),
  );
});
