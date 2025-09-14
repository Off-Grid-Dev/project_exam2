import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';

type WrapperProps = {
  children: ReactNode;
};

export const Wrapper: FC<WrapperProps> = ({ children }) => {
  const [breakpoint, setBreakpoint] = useState<'desktop' | 'tablet' | 'mobile'>(
    () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 0;
      if (w >= 1250) return 'desktop';
      if (w >= 750) return 'tablet';
      return 'mobile';
    },
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const compute = (w: number) => {
      const next = w >= 1250 ? 'desktop' : w >= 750 ? 'tablet' : 'mobile';
      setBreakpoint((prev) => {
        if (prev === next) return prev;
        console.log('[Wrapper] breakpoint change', { from: prev, to: next });
        return next;
      });
    };

    compute(window.innerWidth);

    const onResize = () => compute(window.innerWidth);

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className={`max-w-${breakpoint} mx-auto flex justify-between`}>
      {children}
    </div>
  );
};
