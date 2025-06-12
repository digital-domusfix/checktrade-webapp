import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Step1 from '../Step1';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => ({ state: {} }),
  };
});

vi.mock('../../../services/jobService', () => ({
  default: { getJobCategories: vi.fn() },
}));

import jobService from '../../../services/jobService';
const getCategoriesMock = vi.mocked(jobService.getJobCategories);

const categories = [
  { id: { value: '1' }, name: 'Plumbing' },
  { id: { value: '2' }, name: 'Electrical' },
] as any;

beforeEach(() => {
  getCategoriesMock.mockResolvedValue({ data: { categories } });
  navigateMock.mockClear();
});

test('loads categories and validates form', async () => {
  render(<Step1 />);
  await screen.findByRole('radio', { name: /Plumbing/i });
  expect(getCategoriesMock).toHaveBeenCalled();

  const next = screen.getByRole('button', { name: /next: details/i });
  expect(next).toBeDisabled();

  fireEvent.click(screen.getByRole('radio', { name: /Plumbing/i }));
  fireEvent.change(screen.getByLabelText(/job title/i), {
    target: { value: 'Fix sink' },
  });
  await waitFor(() => expect(next).toBeEnabled());

  fireEvent.click(next);
  await waitFor(() =>
    expect(navigateMock).toHaveBeenCalledWith('/post-job/details', {
      state: { categoryId: '1', title: 'Fix sink' },
    }),
  );
});
