import { useEffect, useState, type ReactNode } from 'react';
import {
  BreakpointContext,
  type Breakpoint,
  type BreakpointContextValue,
} from './BreakpointContext';

type ProviderChildren =
  | ReactNode
  | ((value: BreakpointContextValue) => ReactNode);

type BreakpointProviderProps = {
  children: ProviderChildren;
};

function getBreakpointFromWidth(w: number): Breakpoint {
  if (w >= 1250) return 'desktop';
  if (w >= 750) return 'tablet';
  return 'mobile';
}

export const BreakpointProvider = ({ children }: BreakpointProviderProps) => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 0;
    return getBreakpointFromWidth(w);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const compute = (w: number) => {
      const next = getBreakpointFromWidth(w);
      setBreakpoint((prev) => (prev === next ? prev : next));
    };

    compute(window.innerWidth);

    const onResize = () => compute(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const value: BreakpointContextValue = { breakpoint };

  // support function-as-child so callers can consume value immediately
  if (typeof children === 'function') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - children as function
    return <>{children(value)}</>;
  }

  return (
    <BreakpointContext.Provider value={value}>
      {children}
    </BreakpointContext.Provider>
  );
};
