import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      `useAuth must be used within an AuthProvider\n (that means you have to wrap the component with the AuthProvider component)`,
    );
  }

  return context;
};
