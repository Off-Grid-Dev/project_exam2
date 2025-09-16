import type { FC, ReactNode } from 'react';
import { useBreakpoint } from '../../context/ui/useBreakpoint';
import {
  createClassOptions,
  getClassFor,
  composeClasses,
} from '../../context/ui/classOptionsTemplate';

type WrapperProps = {
  children: ReactNode;
};

export const Wrapper: FC<WrapperProps> = ({ children }) => {
  const { breakpoint } = useBreakpoint();
  const bp = breakpoint;

  const wrapperClasses = createClassOptions({
    desktopStyles: 'max-w-desktop mx-auto flex justify-between px-6',
    tabletStyles: 'max-w-desktop mx-auto flex justify-between px-4',
    mobileStyles: 'w-full px-4 flex flex-col gap-4',
  });

  const className = composeClasses(getClassFor(bp, wrapperClasses));

  return (
    <>
      <div className={className}>{children}</div>
    </>
  );
};
