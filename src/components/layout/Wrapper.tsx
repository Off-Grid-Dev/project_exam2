import type { FC, ReactNode } from 'react';
// import { useBreakpoint } from '../../context/ui/useBreakpoint';

type WrapperProps = {
  children: ReactNode;
};

export const Wrapper: FC<WrapperProps> = ({ children }) => {
  // const { breakpoint } = useBreakpoint();
  return (
    <>
      <div>{children}</div>
    </>
  );
};
