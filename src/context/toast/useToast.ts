// React imports
import { useContext } from 'react';

// Context
import { ToastContext } from './ToastContext';

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      `useToast must be used within an ToastProvider\n (that means you have to wrap the component with the ToastProvider component)`,
    );
  }

  return ctx;
};
