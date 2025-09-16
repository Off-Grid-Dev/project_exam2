import type { FC, ReactNode } from 'react';
import { BreakpointProvider } from '../../context/ui/BreakpointContext';

type WrapperProps = {
  children: ReactNode;
};

const classOptions = {
  desktop: 'max-w-desktop mx-auto flex justify-between',
  tablet: '',
  mobile: '',
};

export const Wrapper: FC<WrapperProps> = ({ children }) => {
  return (
    <BreakpointProvider>
      {(value) => (
        <div
          className={value.breakpoint === 'desktop' ? classOptions.desktop : ''}
        >
          {children}
        </div>
      )}
    </BreakpointProvider>
  );
};
