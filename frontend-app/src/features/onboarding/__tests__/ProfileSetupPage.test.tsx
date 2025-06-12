import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import ProfileSetupPage from '../ProfileSetupPage';

vi.mock('../../../store/useAuthStore', () => ({
  useAuthStore: (selector: any) => selector({ profile: { userId: 'u1' } }),
}));

vi.mock('../../../services/profileService', () => ({
  default: { updateProfile: vi.fn() },
}));

import profileService from '../../../services/profileService';
const updateProfileMock = vi.mocked(profileService.updateProfile);

vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

beforeAll(() => {
  (global as any).URL.createObjectURL = vi.fn();
  (global as any).URL.revokeObjectURL = vi.fn();
});

test('scrolls to first invalid field when finish fails validation', async () => {
  const { container } = render(<ProfileSetupPage />);
  // complete step 1
  fireEvent.change(screen.getByLabelText(/first name/i), {
    target: { value: 'A' },
  });
  fireEvent.change(screen.getByLabelText(/last name/i), {
    target: { value: 'B' },
  });
  fireEvent.change(screen.getByLabelText(/phone/i), {
    target: { value: '(123) 456-7890' },
  });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));
  await screen.findByRole('button', { name: /finish/i });

  const fileInput = container.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  const scrollSpy = vi.fn();
  Object.defineProperty(fileInput, 'scrollIntoView', {
    value: scrollSpy,
    writable: true,
  });

  fireEvent.change(screen.getByLabelText(/city\/town/i), {
    target: { value: 'Halifax' },
  });
  const invalidFile = new File(['bad'], 'bad.txt', { type: 'text/plain' });
  fireEvent.change(fileInput, { target: { files: [invalidFile] } });
  fireEvent.click(screen.getByRole('button', { name: /finish/i }));

  expect(scrollSpy).toHaveBeenCalled();
});

test('shows toast when profile update fails', async () => {
  updateProfileMock.mockRejectedValueOnce(new Error('Oops'));

  render(<ProfileSetupPage />);

  fireEvent.change(screen.getByLabelText(/first name/i), {
    target: { value: 'A' },
  });
  fireEvent.change(screen.getByLabelText(/last name/i), {
    target: { value: 'B' },
  });
  fireEvent.change(screen.getByLabelText(/phone/i), {
    target: { value: '(123) 456-7890' },
  });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));
  await screen.findByRole('button', { name: /finish/i });

  fireEvent.change(screen.getByLabelText(/city\/town/i), {
    target: { value: 'Halifax' },
  });

  fireEvent.click(screen.getByRole('button', { name: /finish/i }));

  expect(await screen.findByRole('status')).toHaveTextContent('Oops');
});
