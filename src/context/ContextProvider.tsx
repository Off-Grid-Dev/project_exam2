import { BreakpointProvider } from './ui/BreakpointProvider';
import { AuthProvider } from './auth/AuthProvider';
import { ToastProvider } from './toast/ToastProvider';
import type { FC, ReactNode } from 'react';

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
