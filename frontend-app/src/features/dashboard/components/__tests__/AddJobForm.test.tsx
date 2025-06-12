import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AddJobForm from '../AddJobForm';

vi.mock('../../../../services/jobService', () => ({
  default: { createJob: vi.fn() },
}));

import jobService from '../../../../services/jobService';
const createJobMock = vi.mocked(jobService.createJob);

const property = { id: 'p1', nickname: 'Home' } as any;

it('creates job', async () => {
  createJobMock.mockResolvedValue({});
  const onCreated = vi.fn();
  render(<AddJobForm property={property} onCreated={onCreated} />);

  fireEvent.change(screen.getByPlaceholderText('Job title'), {
    target: { value: 'Fix sink' },
  });
  fireEvent.submit(screen.getByRole('button'));

  await waitFor(() => expect(createJobMock).toHaveBeenCalled());
  expect(onCreated).toHaveBeenCalled();
});
