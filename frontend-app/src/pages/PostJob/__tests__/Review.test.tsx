import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Review from '../Review';

const navigateMock = vi.fn();

const state = {
  categoryId: '1',
  title: 'Fix sink',
  subcategoryId: 'faucet',
  answers: { size: 'small' },
  description: 'leaking',
  imgFiles: [],
  videoFiles: [],
  schedule: { type: 'flexible' },
  budget: 300,
};

vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => ({ state }),
  };
});

vi.mock('../../../services/jobService', () => ({
  default: {
    getJobCategories: vi.fn().mockResolvedValue({ data: { categories: [] } }),
    getJobSubcategories: vi.fn().mockResolvedValue([]),
    getJobSubcategoryForm: vi.fn().mockResolvedValue({}),
    createJob: vi.fn(),
  },
}));

import jobService from '../../../services/jobService';
const createJobMock = vi.mocked(jobService.createJob);

beforeEach(() => {
  navigateMock.mockClear();
  createJobMock.mockClear();
  localStorage.clear();
});

it('posts job and navigates on success', async () => {
  createJobMock.mockResolvedValue({ data: { id: 'j1' } });
  render(<Review />);
  const postBtn = screen.getByRole('button', { name: /post job/i });
  fireEvent.click(postBtn);
  await waitFor(() => expect(createJobMock).toHaveBeenCalled());
  expect(localStorage.getItem('hasPostedJob')).toBe('true');
  await waitFor(() =>
    expect(navigateMock).toHaveBeenCalledWith('/job/success', {
      state: { jobId: 'j1' },
    }),
  );
});

it('shows error when post fails', async () => {
  createJobMock.mockRejectedValue(new Error('fail'));
  render(<Review />);
  const postBtn = screen.getByRole('button', { name: /post job/i });
  fireEvent.click(postBtn);
  await waitFor(() => expect(createJobMock).toHaveBeenCalled());
  expect(await screen.findByText(/failed to post job/i)).toBeInTheDocument();
  expect(postBtn).toBeEnabled();
});
