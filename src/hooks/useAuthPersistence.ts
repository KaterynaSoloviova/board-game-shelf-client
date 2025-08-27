import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAuthPersistence = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Update document title based on authentication status
    if (isAuthenticated && user) {
      const displayName = user.username || user.email?.split('@')[0] || 'User';
      document.title = `Board Games Shelf - ${displayName}`;
    } else {
      document.title = 'Board Games Shelf';
    }
  }, [isAuthenticated, user]);

  // You can add more persistence logic here if needed
  // For example, saving user preferences, etc.
};
