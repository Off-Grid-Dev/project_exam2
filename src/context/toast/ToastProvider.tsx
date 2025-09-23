import { type ReactNode, useState } from 'react';
import { ToastContext } from './ToastContext';

type AuthProviderProps = {
  children: ReactNode;
};

export const ToastProvider = ({ children }: AuthProviderProps) => {
  const [isToast, setIsToast] = useState(false);

  const showToast = () => setIsToast(true);
  const removeToast = () => setIsToast(false);

  return (
    <ToastContext.Provider value={{ isToast, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
