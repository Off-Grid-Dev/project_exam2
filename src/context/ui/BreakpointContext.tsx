import { createContext } from 'react';

export type Breakpoint = 'desktop' | 'tablet' | 'mobile';

export type BreakpointContextValue = {
  breakpoint: Breakpoint;
};

export const BreakpointContext = createContext<
  BreakpointContextValue | undefined
>(undefined);
