// React imports
import { type ReactNode, useState, useCallback, useMemo } from 'react';

// Context
import { ToastContext } from './ToastContext';

// Components
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
  const removeToast = useCallback((toastWithId: string) => {
    setToastArray((prev) => prev.filter((toast) => toast.id !== toastWithId));
  }, []);

  const addToast = useCallback(
    (newToast: Omit<ToastProps, 'id'>) => {
      const toastWithId: ToastProps = {
        ...newToast,
        id: Date.now().toString(),
      };

      let added = false;
      setToastArray((prev) => {
        // avoid duplicate toasts with same text and type
        const exists = prev.some(
          (t) => t.text === toastWithId.text && t.type === toastWithId.type,
        );
        if (exists) return prev;
        added = true;
        return [toastWithId, ...prev];
      });

      // only schedule removal if we actually added the toast
      if (added) {
        setTimeout(() => {
          removeToast(toastWithId.id);
        }, 3500);
      }
    },
    [removeToast],
  );

  const contextValue = useMemo(
    () => ({ toastArray, addToast }),
    [toastArray, addToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
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
