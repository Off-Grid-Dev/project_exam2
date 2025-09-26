// React imports
import { useContext } from 'react';

// Context
import { AuthContext } from './AuthContext';

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      `useAuth must be used within an AuthProvider\n (that means you have to wrap the component with the AuthProvider component)`,
    );
  }

  return ctx;
};
