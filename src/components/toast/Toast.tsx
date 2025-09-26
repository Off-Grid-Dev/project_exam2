// React imports
import type { FC, ReactNode } from 'react';

// Types
import type { ToastProps } from '../../context/toast/ToastProvider';
import { useToast } from '../../context/toast/useToast';

type ToastWrapperProps = {
  children: ReactNode;
};

export const Toast: FC<ToastProps> = ({ type, text, id }) => {
  const { removeToast } = useToast();

  let additionalClasses;
  switch (type) {
    case 'success': {
      additionalClasses =
        'bg-success-600 border-success-900 hover:border-success-400';
      break;
    }
    case 'warning': {
      additionalClasses =
        'bg-warning-600 border-warning-900 hover:border-warning-900';
      break;
    }
    case 'info': {
      additionalClasses =
        'bg-bg-dark text-text-base border-primary-800 hover:border-primary-400';
      break;
    }
  }

  return (
    <button
      onClick={() => removeToast(id)}
      className={`ml-auto max-w-64 cursor-pointer rounded-md border-2 px-4 py-2 text-center hover:scale-x-105 ${additionalClasses}`}
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
