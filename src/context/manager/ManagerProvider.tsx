// React imports
import { type ReactNode, useState } from 'react';

// Context
import { ManagerContext } from './ManagerContext';
import { getStoredVenueManager } from '../../api/authToken';

type ManagerProviderProps = {
  children: ReactNode;
};

export const ManagerProvider = ({ children }: ManagerProviderProps) => {
  const [isManager] = useState<boolean>(() => !!getStoredVenueManager());

  return (
    <ManagerContext.Provider value={{ isManager }}>
      {children}
    </ManagerContext.Provider>
  );
};
