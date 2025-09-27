import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, it, expect } from 'vitest';
import Nav from '../Nav';
import NavLink from '../NavLink';
import { AuthProvider } from '../../context/auth/AuthProvider';
import ContextProvider from '../../context/ContextProvider';
import { AuthContext } from '../../context/auth/AuthContext';
import { Header } from '../layout/Header';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../context/auth/useAuth';

describe('Nav component', () => {
  it('renders public links when logged out', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Nav />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByRole('navigation')).toBeTruthy();
    expect(screen.getByText(/home/i)).toBeDefined();
    expect(screen.getByText(/welcome/i)).toBeDefined();
    // should not show logout or profile links
    expect(screen.queryByText(/logout/i)).toBeNull();
    expect(screen.queryByText(/my bookings/i)).toBeNull();
  });

  it('shows protected links when logged in', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Nav />
        </AuthProvider>
      </BrowserRouter>,
    );

    // render an auto-login helper that calls `login()` from the provider
    const AutoLogin = () => {
      const { login } = React.useContext(AuthContext)!;
      useEffect(() => {
        login();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return null;
    };

    render(
      <BrowserRouter>
        <AuthProvider>
          <AutoLogin />
          <Nav />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => expect(screen.getByText(/profile/i)).toBeDefined());
    expect(screen.getByText(/my bookings/i)).toBeDefined();
    expect(screen.getByText(/logout/i)).toBeDefined();
  });

  it('NavLink renders anchor with correct props', () => {
    render(
      <BrowserRouter>
        <NavLink path={'/test'} label={'Test'} aria={'test-link'} />
      </BrowserRouter>,
    );

    const link = screen.getByRole('link', { name: /test-link/i });
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveTextContent('Test');
  });

  it('Header renders brand and nav', () => {
    render(
      <BrowserRouter>
        <ContextProvider>
          <Header />
        </ContextProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/HOLIDAZE/i)).toBeDefined();
    expect(screen.getByRole('navigation')).toBeDefined();
  });

  it('useAuth throws when used outside provider', () => {
    const Bad = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      useAuth();
      return null;
    };

    // Rendering Bad without AuthProvider should throw
    expect(() => render(<Bad />)).toThrow();
  });
});
