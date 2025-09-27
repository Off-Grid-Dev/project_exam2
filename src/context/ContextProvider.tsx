// React imports
import type { FC, ReactNode } from 'react';

// Context providers
import { BreakpointProvider } from './ui/BreakpointProvider';
import { AuthProvider } from './auth/AuthProvider';
import { ToastProvider } from './toast/ToastProvider';
import { ManagerProvider } from './manager/ManagerProvider';

type ContextProviderProps = {
  children: ReactNode;
};

const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ManagerProvider>
        <ToastProvider>
          <BreakpointProvider>{children}</BreakpointProvider>
        </ToastProvider>
      </ManagerProvider>
    </AuthProvider>
  );
};

export default ContextProvider;
