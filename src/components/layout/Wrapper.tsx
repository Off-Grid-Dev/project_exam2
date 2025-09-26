// React imports
import type { FC, ReactNode } from 'react';

// Local hooks
import { useBreakpoint } from '../../context/ui/useBreakpoint';

type WrapperProps = {
  children: ReactNode;
};

export const Wrapper: FC<WrapperProps> = ({ children }) => {
  const { breakpoint } = useBreakpoint();

  return (
    <div className={`max-w-${breakpoint} mx-auto flex flex-col px-2`}>
      {children}
    </div>
  );
};
