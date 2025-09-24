import { createContext } from 'react';
import type { ToastProps } from './ToastProvider';

type ToastContextProps = {
  toastArray: ToastProps[];
  addToast: (newToast: Omit<ToastProps, 'id'>) => void;
};

export const ToastContext = createContext<ToastContextProps | undefined>(
  undefined,
);
