import { type ReactNode, useState } from 'react';
import { ToastContext } from './ToastContext';

type AuthProviderProps = {
  children: ReactNode;
};

export type ToastProps = {
  id: string;
  type: string;
  text: string;
};

export const ToastProvider = ({ children }: AuthProviderProps) => {
  const [toastArray, setToastArray] = useState<ToastProps[]>([]);

  function addToast(newToast: ToastProps) {
    const toastWithId: ToastProps = { ...newToast, id: Date.now().toString() };
    setToastArray((prev) => [...prev, toastWithId]);

    setTimeout(() => {
      removeToast(toastWithId.id);
    }, 3500);
  }

  function removeToast(toastWithId: string) {
    setToastArray((prev) => prev.filter((toast) => toast.id !== toastWithId));
  }

  return (
    <ToastContext.Provider value={{ toastArray, addToast }}>
      {children}
    </ToastContext.Provider>
  );
};
