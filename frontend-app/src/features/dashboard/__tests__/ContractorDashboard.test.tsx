import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ContractorDashboard from '../ContractorDashboard';

let profile: any;

vi.mock('../../../store/useAuthStore', () => ({
  useAuthStore: (selector: any) => selector({ profile }),
}));

vi.mock('../../../services/dashboardService', () => ({
  default: { getDashboard: vi.fn() },
}));

import dashboardService from '../../../services/dashboardService';
const getDashboardMock = vi.mocked(dashboardService.getDashboard);

test('renders welcome header and stats', async () => {
  profile = { fullName: 'Jane Doe', isActive: true };
  getDashboardMock.mockResolvedValue({
    stats: { leadsAwaitingQuote: 1, quotesSent: 2, jobsInProgress: 0, completedJobs: 3 },
    leads: [],
  });

  render(
    <MemoryRouter>
      <ContractorDashboard />
    </MemoryRouter>,
  );

  await waitFor(() => {
    expect(screen.getByText(/welcome back, jane/i)).toBeInTheDocument();
  });
  const awaiting = screen.getByTestId('awaiting');
  expect(awaiting).toHaveTextContent('1');
  expect(awaiting.closest('a')).toHaveAttribute('href', '/jobs?status=awaiting');
});

test('shows no leads message when list is empty', async () => {
  profile = { fullName: 'Jane Doe', isActive: true };
  getDashboardMock.mockResolvedValue({
    stats: { leadsAwaitingQuote: 0, quotesSent: 0, jobsInProgress: 0, completedJobs: 0 },
    leads: [],
  });

  render(
    <MemoryRouter>
      <ContractorDashboard />
    </MemoryRouter>,
  );

  await waitFor(() => {
    expect(screen.getByTestId('no-leads')).toBeInTheDocument();
  });
});

test('quick actions link to profile page', async () => {
  profile = { fullName: 'Jane Doe', isActive: true };
  getDashboardMock.mockResolvedValue({
    stats: { leadsAwaitingQuote: 0, quotesSent: 0, jobsInProgress: 0, completedJobs: 0 },
    leads: [],
  });

  render(
    <MemoryRouter>
      <ContractorDashboard />
    </MemoryRouter>,
  );

  await waitFor(() => {
    expect(screen.getByText(/quick actions/i)).toBeInTheDocument();
  });

  expect(
    screen.getByRole('link', { name: /edit profile/i }),
  ).toHaveAttribute('href', '/profile-setup');
});
