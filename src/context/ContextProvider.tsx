// React imports
import type { FC, ReactNode } from 'react';

// Context providers
import { BreakpointProvider } from './ui/BreakpointProvider';
import { AuthProvider } from './auth/AuthProvider';
import { ToastProvider } from './toast/ToastProvider';

type ContextProviderProps = {
  children: ReactNode;
};

const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BreakpointProvider>{children}</BreakpointProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default ContextProvider;
