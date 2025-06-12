import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigateMock };
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
    target: { value: '(902) 456-7890' },
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
    target: { value: '(902) 456-7890' },
  });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));
  await screen.findByRole('button', { name: /finish/i });

  fireEvent.change(screen.getByLabelText(/city\/town/i), {
    target: { value: 'Halifax' },
  });

  fireEvent.click(screen.getByRole('button', { name: /finish/i }));

  expect(await screen.findByRole('status')).toHaveTextContent('Oops');
});

test('advances to step 2 when step 1 is valid', async () => {
  render(<ProfileSetupPage />);

  fireEvent.change(screen.getByLabelText(/first name/i), {
    target: { value: 'John' },
  });
  fireEvent.change(screen.getByLabelText(/last name/i), {
    target: { value: 'Doe' },
  });
  fireEvent.change(screen.getByLabelText(/phone/i), {
    target: { value: '(902) 555-1234' },
  });

  const nextBtn = screen.getByRole('button', { name: /next/i });
  expect(nextBtn).not.toBeDisabled();
  fireEvent.click(nextBtn);

  await screen.findByRole('button', { name: /finish/i });
  expect(
    screen.getByRole('heading', { name: /step 2 of 2/i }),
  ).toBeInTheDocument();
});

test('accepts 782 area code as valid', async () => {
  render(<ProfileSetupPage />);

  fireEvent.change(screen.getByLabelText(/first name/i), {
    target: { value: 'Jane' },
  });
  fireEvent.change(screen.getByLabelText(/last name/i), {
    target: { value: 'Smith' },
  });
  fireEvent.change(screen.getByLabelText(/phone/i), {
    target: { value: '(782) 555-0000' },
  });

  const nextBtn = screen.getByRole('button', { name: /next/i });
  expect(nextBtn).not.toBeDisabled();
  fireEvent.click(nextBtn);

  await screen.findByRole('button', { name: /finish/i });
  expect(
    screen.getByRole('heading', { name: /step 2 of 2/i }),
  ).toBeInTheDocument();
});

test('displays validation errors and disables next until valid', () => {
  render(<ProfileSetupPage />);

  const nextBtn = screen.getByRole('button', { name: /next/i });
  expect(nextBtn).toBeDisabled();

  fireEvent.change(screen.getByLabelText(/first name/i), {
    target: { value: 'John' },
  });
  expect(nextBtn).toBeDisabled();

  fireEvent.change(screen.getByLabelText(/last name/i), {
    target: { value: 'Doe' },
  });
  expect(nextBtn).toBeDisabled();

  fireEvent.change(screen.getByLabelText(/phone/i), {
    target: { value: '123' },
  });
  expect(nextBtn).toBeDisabled();

  fireEvent.blur(screen.getByLabelText(/phone/i));
  expect(
    screen.getByText(/enter a valid 902 or 782 phone number/i),
  ).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/phone/i), {
    target: { value: '(506) 555-1234' },
  });
  expect(nextBtn).toBeDisabled();

  fireEvent.blur(screen.getByLabelText(/phone/i));
  expect(
    screen.getByText(/enter a valid 902 or 782 phone number/i),
  ).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/phone/i), {
    target: { value: '(902) 555-1234' },
  });

  expect(nextBtn).not.toBeDisabled();
});

test('finish button state and successful submission', async () => {
  updateProfileMock.mockResolvedValueOnce({});

  render(<ProfileSetupPage />);

  fireEvent.change(screen.getByLabelText(/first name/i), {
    target: { value: 'John' },
  });
  fireEvent.change(screen.getByLabelText(/last name/i), {
    target: { value: 'Doe' },
  });
  fireEvent.change(screen.getByLabelText(/phone/i), {
    target: { value: '(902) 555-1234' },
  });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  await screen.findByRole('button', { name: /finish/i });
  const finishBtn = screen.getByRole('button', { name: /finish/i });

  expect(finishBtn).toBeDisabled();
  fireEvent.change(screen.getByLabelText(/city\/town/i), {
    target: { value: 'Halifax' },
  });
  expect(finishBtn).not.toBeDisabled();

  fireEvent.click(finishBtn);

  await screen.findByText(/saving/i);

  await waitFor(() => {
    expect(updateProfileMock).toHaveBeenCalledWith({
      userId: 'u1',
      firstName: 'John',
      lastName: 'Doe',
      phone: '9025551234',
      city: 'Halifax',
      postalCode: '',
    });
    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
  });
});

test('skip link is hidden when prop is false', () => {
  render(<ProfileSetupPage showSkipLink={false} />);

  expect(screen.queryByText(/skip for now/i)).toBeNull();
});

test('skip link is shown when prop is true', () => {
  render(<ProfileSetupPage showSkipLink />);

  expect(screen.getByText(/skip for now/i)).toBeInTheDocument();
});
