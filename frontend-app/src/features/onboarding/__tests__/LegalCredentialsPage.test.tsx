import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import LegalCredentialsPage from '../LegalCredentialsPage';
import legalService from '../../../services/legalService';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigateMock };
});

global.URL.createObjectURL = vi.fn();

vi.mock('../../../services/legalService', () => ({
  default: {
    uploadDocument: vi.fn(() => Promise.resolve({ id: 'd1' })),
    submitCredentials: vi.fn(() => Promise.resolve()),
  },
}));

const uploadMock = vi.mocked(legalService.uploadDocument);

test('submit disabled until required docs and terms provided', async () => {
  render(<LegalCredentialsPage />);

  const submit = screen.getByRole('button', { name: /submit for approval/i });
  expect(submit).toBeDisabled();

  const insuranceInput = screen.getByLabelText(/proof of insurance/i);
  const idInput = screen.getByLabelText(/government id/i);
  fireEvent.click(screen.getByLabelText(/sole trader/i));

  const file = new File(['a'], 'a.pdf', { type: 'application/pdf' });
  fireEvent.change(insuranceInput, { target: { files: [file] } });
  fireEvent.change(idInput, { target: { files: [file] } });
  await waitFor(() => expect(uploadMock).toHaveBeenCalledTimes(2));

  expect(submit).toBeDisabled();
  fireEvent.click(screen.getByLabelText(/i agree/i));
  await waitFor(() => expect(submit).not.toBeDisabled());
});

test('shows error on invalid file type', () => {
  render(<LegalCredentialsPage />);

  const insuranceInput = screen.getByLabelText(/proof of insurance/i);
  const bad = new File(['bad'], 'bad.txt', { type: 'text/plain' });
  fireEvent.change(insuranceInput, { target: { files: [bad] } });

  expect(screen.getByText(/unsupported format/i)).toBeInTheDocument();
});
