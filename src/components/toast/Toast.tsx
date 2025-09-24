import type { FC, ReactNode } from 'react';
import type { ToastProps } from '../../context/toast/ToastProvider';

type ToastWrapperProps = {
  children: ReactNode;
};

export const Toast: FC<Omit<ToastProps, 'id'>> = ({ type, text }) => {
  let additionalClasses;

  switch (type) {
    case 'success': {
      additionalClasses = 'bg-success-600 border-success-900';
      break;
    }
    case 'warning': {
      additionalClasses = 'bg-warning-600 border-warning-900';
      break;
    }
    case 'info': {
      additionalClasses = 'bg-bg-dark text-text-base border-primary-800';
      break;
    }
  }

  return (
    <button
      className={`mx-auto rounded-md border-2 px-4 py-2 text-center ${additionalClasses}`}
    >
      <span>{text}</span>
    </button>
  );
};

export const ToastWrapper: FC<ToastWrapperProps> = ({ children }) => {
  return (
    <div className='absolute inset-[4rem_1rem_auto_auto] flex flex-col gap-1'>
      {children}
    </div>
  );
};
