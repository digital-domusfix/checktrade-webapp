import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { RegisterForm } from '../RegisterForm';

const registerMock = vi.fn().mockResolvedValue('user1');
vi.mock('../../../../store/useAuthStore', () => ({
  useAuthStore: (selector: any) => selector({ register: registerMock }),
}));

it('submits registration', async () => {
  const onRegistered = vi.fn();
  render(<RegisterForm onRegistered={onRegistered} />);

  fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.submit(screen.getByRole('button'));

  await waitFor(() => expect(onRegistered).toHaveBeenCalledWith('user1'));
});
