import { useContext } from 'react';
import { BreakpointContext } from './BreakpointContext';

export const useBreakpoint = () => {
  const ctx = useContext(BreakpointContext);
  if (!ctx) {
    throw new Error(
      'useBreakpoint must be used within BreakpointProvider\n (that means you have to wrap the component with the BreakpointProvider component)',
    );
  }

  return ctx;
};
