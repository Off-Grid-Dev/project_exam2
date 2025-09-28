import { render, screen, fireEvent } from '@testing-library/react';
import ContextProvider from '../../context/ContextProvider';
import { MemoryRouter } from 'react-router-dom';
import { LoginRegister } from '../LoginRegister';
import { describe, test, expect } from 'vitest';

describe('LoginRegister page', () => {
  test('shows the initial buttons and toggles to Login and Register forms', () => {
    render(
      <MemoryRouter>
        <ContextProvider>
          <LoginRegister />
        </ContextProvider>
      </MemoryRouter>,
    );

    // initial state shows both buttons
    const loginBtn = screen.getByRole('button', { name: /Log In/i });
    const registerBtn = screen.getByRole('button', { name: /Register/i });
    expect(loginBtn).toBeInTheDocument();
    expect(registerBtn).toBeInTheDocument();

    // click login -> LoginForm should render (has email input)
    fireEvent.click(loginBtn);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();

    // rerender page to reset and click register
    render(
      <MemoryRouter>
        <ContextProvider>
          <LoginRegister />
        </ContextProvider>
      </MemoryRouter>,
    );
    const regBtn2 = screen.getByRole('button', { name: /Register/i });
    fireEvent.click(regBtn2);
    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toBeInTheDocument();
  });
});
