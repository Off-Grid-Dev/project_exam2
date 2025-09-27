// React imports
import { createContext } from 'react';

type ManagerContextProps = {
  isManager: boolean;
};

export const ManagerContext = createContext<ManagerContextProps | undefined>(
  undefined,
);
