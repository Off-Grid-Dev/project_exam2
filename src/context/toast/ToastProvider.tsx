// React imports
import {
  type ReactNode,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';

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
      // generate a stable unique id that works even when tests use fake timers
      // Date.now() may be frozen under fake timers so append a monotonically
      // increasing counter to ensure uniqueness.
      const id = `${Date.now().toString()}-${idRef.current++}`;
      const toastWithId: ToastProps = {
        ...newToast,
        id,
      };

      // schedule the actual state update asynchronously to avoid triggering
      // React state updates synchronously during event handlers in tests which
      // can cause 'not wrapped in act(...)' warnings. We also keep both the
      // add-timer and the removal-timer in timeoutRef so they can be cleared
      // on unmount.
      const addTimer = setTimeout(() => {
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

        if (added) {
          const removeTimer = setTimeout(() => {
            removeToast(toastWithId.id);
          }, 3500);
          timeoutRef.current.push(removeTimer as unknown as number);
        }
      }, 0);
      timeoutRef.current.push(addTimer as unknown as number);
    },
    [removeToast],
  );

  const contextValue = useMemo(
    () => ({ toastArray, addToast, removeToast }),
    [toastArray, addToast, removeToast],
  );

  // keep refs to pending timers so we can clear them when the provider unmounts
  // use ReturnType<typeof setTimeout> for accurate typing, but store as number for
  // cross-environment clearing (Node/browser)
  const timeoutRef = useRef<number[]>([]);
  // monotonically increasing counter for toast ids (avoids collisions with fake timers)
  const idRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      // clear any pending timeouts to avoid state updates after unmount
      timeoutRef.current.forEach((t) => clearTimeout(t));
      timeoutRef.current = [];
    };
  }, []);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastWrapper>
        {toastArray.length > 0 &&
          toastArray.map(({ id, text, type }) => (
            <Toast key={id} id={id} text={text} type={type} />
          ))}
      </ToastWrapper>
    </ToastContext.Provider>
  );
};
