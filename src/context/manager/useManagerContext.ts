// React imports
import { useContext } from 'react';

// Context
import { ManagerContext } from './ManagerContext';

export const useManagerContext = () => {
  const ctx = useContext(ManagerContext);
  if (!ctx) {
    throw new Error(
      `useManagerContext must be used within an ManagerProvider\n (that means you have to wrap the component with the ManagerProvider component)`,
    );
  }

  return ctx;
};
