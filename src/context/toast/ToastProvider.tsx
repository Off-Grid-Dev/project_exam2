import { type ReactNode, useState } from 'react';
import { ToastContext } from './ToastContext';
import { Toast, ToastWrapper } from '../../components/toast/Toast';

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

  function addToast(newToast: Omit<ToastProps, 'id'>) {
    const toastWithId: ToastProps = { ...newToast, id: Date.now().toString() };

    setToastArray((prev) =>
      prev.some(
        (t) => t.text === toastWithId.text && t.text === toastWithId.text,
      )
        ? prev
        : [...prev, toastWithId],
    );

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
      <ToastWrapper>
        {toastArray.length > 0 &&
          toastArray.map(({ id, text, type }) => (
            <Toast key={id} text={text} type={type} />
          ))}
      </ToastWrapper>
    </ToastContext.Provider>
  );
};
