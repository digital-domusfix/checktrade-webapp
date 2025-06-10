import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../LoginPage';
import OnboardingPage from '../../onboarding/OnboardingPage';

test('email sign up flow shows code inputs and navigates to onboarding', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    </MemoryRouter>,
  );

  await user.click(screen.getByText(/continue with email/i));
  const emailField = screen.getByPlaceholderText(/your@email\.com/i);
  await user.type(emailField, 'test@example.com');
  await user.click(screen.getByText(/send code/i));

  const inputs = screen.getByTestId('code-inputs');
  expect(inputs).toBeInTheDocument();

  const boxes = inputs.querySelectorAll('input');
  for (const box of Array.from(boxes)) {
    await user.type(box, '1');
  }

  expect(screen.getByTestId('role-select')).toBeInTheDocument();
});
