import { createContext } from 'react';

type ToastContextProps = {
  isToast: boolean;
  showToast: () => void;
  removeToast: () => void;
};

export const ToastContext = createContext<ToastContextProps | undefined>(
  undefined,
);
