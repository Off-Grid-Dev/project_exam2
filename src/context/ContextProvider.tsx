import { BreakpointProvider } from './ui/BreakpointProvider';
import { AuthProvider } from './auth/AuthProvider';
import type { FC, ReactNode } from 'react';

type ContextProviderProps = {
  children: ReactNode;
};

const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <BreakpointProvider>{children}</BreakpointProvider>
    </AuthProvider>
  );
};

export default ContextProvider;
