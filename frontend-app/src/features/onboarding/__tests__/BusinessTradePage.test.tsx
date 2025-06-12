import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import BusinessTradePage from '../BusinessTradePage';

vi.mock('../../../store/useAuthStore', () => ({
  useAuthStore: (sel: any) => sel({ profile: { userId: 'u1' } }),
}));

vi.mock('../../../services/jobService', () => ({
  default: {
    getJobCategories: vi.fn(() => Promise.resolve({ data: { categories: [{ id: { value: 'cat1' }, name: 'Plumbing' }] } })),
    getJobSubcategories: vi.fn(() => Promise.resolve({ data: [{ id: 'sub1', name: 'Repair' }] })),
  },
  getJobCategories: vi.fn(() => Promise.resolve({ data: { categories: [{ id: { value: 'cat1' }, name: 'Plumbing' }] } })),
  getJobSubcategories: vi.fn(() => Promise.resolve({ data: [{ id: 'sub1', name: 'Repair' }] })),
}));

vi.mock('../../../services/profileService', () => ({
  default: { completeOnboarding: vi.fn() },
}));

import profileService from '../../../services/profileService';
const completeMock = vi.mocked(profileService.completeOnboarding);

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigateMock };
});

beforeAll(() => {
  (global as any).scrollTo = vi.fn();
});

test('requires valid postal code', async () => {
  render(<BusinessTradePage />);
  await screen.findByText(/trade category/i);

  fireEvent.change(screen.getByLabelText(/trade category/i), { target: { value: 'cat1' } });
  await screen.findByText(/services offered/i);
  fireEvent.click(screen.getByLabelText(/repair/i));
  fireEvent.change(screen.getByLabelText(/city\/town/i), { target: { value: 'Halifax' } });
  fireEvent.change(screen.getByLabelText(/postal code/i), { target: { value: '123' } });
  fireEvent.change(screen.getByLabelText(/travel radius/i), { target: { value: '5' } });

  fireEvent.click(screen.getByRole('button', { name: /next/i }));
  expect(await screen.findByText(/invalid postal code/i)).toBeInTheDocument();
});

 test('submits when valid', async () => {
  completeMock.mockResolvedValueOnce({});
  render(<BusinessTradePage />);
  await screen.findByText(/trade category/i);

  fireEvent.change(screen.getByLabelText(/trade category/i), { target: { value: 'cat1' } });
  await screen.findByText(/services offered/i);
  fireEvent.click(screen.getByLabelText(/repair/i));
  fireEvent.change(screen.getByLabelText(/city\/town/i), { target: { value: 'Halifax' } });
  fireEvent.change(screen.getByLabelText(/travel radius/i), { target: { value: '5' } });

  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  await waitFor(() => {
    expect(completeMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith('/legal-credentials');
  });
 });
