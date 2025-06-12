import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

let profile: any;

vi.mock('../../../store/useAuthStore', () => ({
  useAuthStore: (selector: any) => selector({ profile }),
}));

vi.mock('../../../services/propertyService', () => ({
  default: { getProperties: vi.fn() },
}));

import propertyService from '../../../services/propertyService';
const getPropertiesMock = vi.mocked(propertyService.getProperties);

beforeEach(() => {
  getPropertiesMock.mockResolvedValue({ data: [] });
});

test('shows banner when profile is not onboarded', async () => {
  profile = { isOnboarded: false };
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(
      screen.getByRole('button', { name: /complete profile/i }),
    ).toBeInTheDocument();
  });
});

test('hides banner when profile is onboarded', async () => {
  profile = { isOnboarded: true };
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(
      screen.queryByRole('button', { name: /complete profile/i }),
    ).not.toBeInTheDocument();
  });
});
