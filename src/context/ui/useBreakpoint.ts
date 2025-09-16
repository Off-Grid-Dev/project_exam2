import { useContext } from 'react';
import { BreakpointContext } from './BreakpointContext';

export const useBreakpoint = () => {
  const ctx = useContext(BreakpointContext);
  if (!ctx)
    throw new Error('useBreakpoint must be used within BreakpointProvider');
  return ctx;
};
