import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AddJobForm from '../AddJobForm';

let createJobMock: any;
vi.mock('../../../../services/jobService', () => {
  createJobMock = vi.fn().mockResolvedValue({});
  return { default: { createJob: createJobMock } };
});

const property = { id: 'p1', nickname: 'Home' } as any;

it('creates job', async () => {
  const onCreated = vi.fn();
  render(<AddJobForm property={property} onCreated={onCreated} />);

  fireEvent.change(screen.getByPlaceholderText('Job title'), {
    target: { value: 'Fix sink' },
  });
  fireEvent.submit(screen.getByRole('button'));

  await waitFor(() => expect(createJobMock).toHaveBeenCalled());
  expect(onCreated).toHaveBeenCalled();
});
