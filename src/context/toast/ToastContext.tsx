// React imports
import { createContext } from 'react';

// Types
import type { ToastProps } from './ToastProvider';

type ToastContextProps = {
  toastArray: ToastProps[];
  addToast: (newToast: Omit<ToastProps, 'id'>) => void;
  removeToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextProps | undefined>(
  undefined,
);
