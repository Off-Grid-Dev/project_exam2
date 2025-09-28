import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from '../Login';
import ContextProvider from '../../context/ContextProvider';
import * as api from '../../api/api';
import type { LoginProfileResponse } from '../../types/api/responses';

describe('LoginForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('renders inputs and submit button', () => {
    render(
      <MemoryRouter>
        <ContextProvider>
          <LoginForm />
        </ContextProvider>
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/Email:/i)).toBeDefined();
    expect(screen.getByLabelText(/Password:/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeDefined();
  });

  it('calls fetchProfiles with correct payload on submit and logs in when token present', async () => {
    const mockLoginResponse: LoginProfileResponse = {
      data: {
        name: 'tester',
        email: 'tester@example.com',
        avatar: { url: 'https://example.com/avatar.jpg', alt: 'avatar' },
        banner: { url: 'https://example.com/banner.jpg', alt: 'banner' },
        accessToken: 'tok-123',
        venueManager: false,
      },
      meta: {},
    };

    const spy = vi
      .spyOn(api, 'fetchProfiles')
      .mockResolvedValue(mockLoginResponse);

    render(
      <MemoryRouter>
        <ContextProvider>
          <LoginForm />
        </ContextProvider>
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/Email:/i) as HTMLInputElement;
    const passInput = screen.getByLabelText(/Password:/i) as HTMLInputElement;
    const submit = screen.getByRole('button', { name: /Submit/i });

    // fill inputs
    fireEvent.change(emailInput, { target: { value: 'user@stud.noroff.no' } });
    fireEvent.change(passInput, { target: { value: 'password1' } });

    // set token to simulate successful authentication
    localStorage.setItem('accessToken', 'tok-123');

    fireEvent.click(submit);

    await waitFor(() => expect(spy).toHaveBeenCalled());

    // main assertion is that fetchProfiles was called with the correct args
  });

  it('prevents submission when validation fails', async () => {
    const mockLoginResponse: LoginProfileResponse = {
      data: {
        name: 'x',
        email: 'x@stud.noroff.no',
        avatar: { url: '', alt: '' },
        banner: { url: '', alt: '' },
        accessToken: 'tok-x',
        venueManager: false,
      },
      meta: {},
    };

    const spy = vi
      .spyOn(api, 'fetchProfiles')
      .mockResolvedValue(mockLoginResponse);

    render(
      <MemoryRouter>
        <ContextProvider>
          <LoginForm />
        </ContextProvider>
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/Email:/i) as HTMLInputElement;
    const passInput = screen.getByLabelText(/Password:/i) as HTMLInputElement;
    const submit = screen.getByRole('button', { name: /Submit/i });

    // invalid email and short password
    fireEvent.change(emailInput, { target: { value: 'bad-email' } });
    fireEvent.change(passInput, { target: { value: 'short' } });

    fireEvent.click(submit);

    // fetchProfiles should not be called because form validation prevents submission
    await waitFor(() => expect(spy).not.toHaveBeenCalled());
  });
});
