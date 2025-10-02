// Export all contexts and providers
export { AuthProvider, useAuth } from './AuthContext';
export { ApiProvider, useApi } from './ApiContext';

// Combined provider for convenience
import React from 'react';
import { AuthProvider } from './AuthContext';
import { ApiProvider } from './ApiContext';

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ApiProvider>
        {children}
      </ApiProvider>
    </AuthProvider>
  );
};
