import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterForm } from '../Register';
import ContextProvider from '../../context/ContextProvider';
import * as api from '../../api/api';
import type { RegisterProfilePayload } from '../../types/api/profile';

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('renders fields and submit button', () => {
    render(
      <MemoryRouter>
        <ContextProvider>
          <RegisterForm />
        </ContextProvider>
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/User name:/i)).toBeDefined();
    expect(screen.getByLabelText(/email:/i)).toBeDefined();
    expect(screen.getByLabelText(/Password:/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeDefined();
  });

  it('submits payload to fetchProfiles with expected shape', async () => {
    const spy = vi
      .spyOn(api, 'fetchProfiles')
      .mockResolvedValue(undefined as never);

    render(
      <MemoryRouter>
        <ContextProvider>
          <RegisterForm />
        </ContextProvider>
      </MemoryRouter>,
    );

    const name = screen.getByLabelText(/User name:/i) as HTMLInputElement;
    const email = screen.getByLabelText(/email:/i) as HTMLInputElement;
    const pass = screen.getByLabelText(/Password:/i) as HTMLInputElement;
    const submit = screen.getByRole('button', { name: /Submit/i });
    const form = submit.closest('form') as HTMLFormElement;

    fireEvent.change(name, { target: { value: 'tester' } });
    fireEvent.change(email, { target: { value: 'tester@stud.noroff.no' } });
    fireEvent.change(pass, { target: { value: 'password123' } });

    // wait for controlled inputs to reflect new values before submitting
    await waitFor(() => expect(name.value).toBe('tester'));
    await waitFor(() => expect(email.value).toBe('tester@stud.noroff.no'));
    await waitFor(() => expect(pass.value).toBe('password123'));

    fireEvent.submit(form);

    await waitFor(() => expect(spy).toHaveBeenCalled());

    // check that the first call contained registerProfilePayload
    const calledArg = spy.mock.calls[0][1] as {
      registerProfilePayload?: RegisterProfilePayload;
    };
    expect(calledArg.registerProfilePayload).toBeDefined();
    expect(calledArg.registerProfilePayload?.name).toBe('tester');
    expect(calledArg.registerProfilePayload?.email).toBe(
      'tester@stud.noroff.no',
    );
  });

  it('includes avatar, banner and venueManager when provided', async () => {
    const spy = vi
      .spyOn(api, 'fetchProfiles')
      .mockResolvedValue(undefined as never);

    render(
      <MemoryRouter>
        <ContextProvider>
          <RegisterForm />
        </ContextProvider>
      </MemoryRouter>,
    );

    const name = screen.getByLabelText(/User name:/i) as HTMLInputElement;
    const email = screen.getByLabelText(/email:/i) as HTMLInputElement;
    const pass = screen.getByLabelText(/Password:/i) as HTMLInputElement;
    const avatarUrl = screen.getByPlaceholderText(
      /avatar url/i,
    ) as HTMLInputElement;
    const avatarAlt = screen.getByPlaceholderText(
      /avatar alt text/i,
    ) as HTMLInputElement;
    const bannerUrl = screen.getByPlaceholderText(
      /banner url/i,
    ) as HTMLInputElement;
    const bannerAlt = screen.getByPlaceholderText(
      /banner alt text/i,
    ) as HTMLInputElement;
    const venueManager = screen.getByLabelText(
      /venue manager:/i,
    ) as HTMLInputElement;

    fireEvent.change(name, { target: { value: 'tester' } });
    fireEvent.change(email, { target: { value: 'tester@stud.noroff.no' } });
    fireEvent.change(pass, { target: { value: 'password123' } });
    fireEvent.change(avatarUrl, { target: { value: 'https://a.com/a.png' } });
    fireEvent.change(avatarAlt, { target: { value: 'avatar alt' } });
    fireEvent.change(bannerUrl, { target: { value: 'https://b.com/b.png' } });
    fireEvent.change(bannerAlt, { target: { value: 'banner alt' } });
    fireEvent.click(venueManager);

    const submit = screen.getByRole('button', { name: /Submit/i });
    const form = submit.closest('form') as HTMLFormElement;

    await waitFor(() => expect(name.value).toBe('tester'));
    await waitFor(() => expect(email.value).toBe('tester@stud.noroff.no'));
    await waitFor(() => expect(pass.value).toBe('password123'));

    fireEvent.submit(form);

    await waitFor(() => expect(spy).toHaveBeenCalled());

    const calledArg = spy.mock.calls[0][1] as {
      registerProfilePayload?: RegisterProfilePayload;
    };
    expect(calledArg.registerProfilePayload?.avatar?.url).toBe(
      'https://a.com/a.png',
    );
    expect(calledArg.registerProfilePayload?.banner?.url).toBe(
      'https://b.com/b.png',
    );
    expect(calledArg.registerProfilePayload?.venueManager).toBe(true);
  });

  it('prevents submission when email validation fails', async () => {
    const spy = vi
      .spyOn(api, 'fetchProfiles')
      .mockResolvedValue(undefined as never);

    render(
      <MemoryRouter>
        <ContextProvider>
          <RegisterForm />
        </ContextProvider>
      </MemoryRouter>,
    );

    const email = screen.getByLabelText(/email:/i) as HTMLInputElement;
    const submit = screen.getByRole('button', { name: /Submit/i });
    const form = submit.closest('form') as HTMLFormElement;

    fireEvent.change(email, { target: { value: 'notanemail' } });

    await waitFor(() => expect(email.value).toBe('notanemail'));

    fireEvent.submit(form);

    // component should not call fetchProfiles when form is invalid
    await waitFor(() => expect(spy).not.toHaveBeenCalled());
  });
});
