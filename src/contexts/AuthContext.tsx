import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, LoginCredentials, SignupCredentials} from '../interfaces';
import { BASE_URL } from '../config';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    console.log('Initial auth check - Token:', token ? 'Present' : 'Missing');
    console.log('Initial auth check - User data:', userData);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Parsed user data:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Debug function to check current auth state
  const debugAuthState = () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    console.log('Current auth state:');
    console.log('- Token:', token ? 'Present' : 'Missing');
    console.log('- User data:', userData);
    console.log('- User state:', user);
    console.log('- Is authenticated:', !!user);
  };

  // Expose debug function in development
  if (import.meta.env.DEV) {
    (window as any).debugAuth = debugAuthState;
  }

  // Function to fetch user data using the stored token
  const fetchUserData = async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No token available to fetch user data');
        return null;
      }

      console.log('Fetching user data with token...');
      const response = await fetch(`${BASE_URL}/api/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Fetched user data:', userData);
        return userData;
      } else {
        console.log('Failed to fetch user data, status:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setLoading(true);
      console.log('Attempting login with:', { email: credentials.email });
      
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed with status:', response.status, 'Error:', errorData);
        throw new Error(errorData.message || `Login failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('Login response data:', data);
      console.log('Login response data keys:', Object.keys(data));
      console.log('Login response data type:', typeof data);
      
      // Try to find the token in different possible field names
      let token = data.token || data.accessToken || data.jwt || data.authToken || data.access_token;
      let userData = data.user || data.userData || data.userInfo || data;
      
      console.log('Extracted token:', token ? 'Found' : 'Missing');
      console.log('Extracted user data:', userData ? 'Found' : 'Missing');
      
      // If we still don't have a token, log the entire response for debugging
      if (!token) {
        console.error('Could not find token in response. Full response:', data);
        throw new Error('Invalid login response: missing token. Please check the response structure.');
      }
      
      // For login, if we don't have explicit user data, try to construct it from available fields
      if (!userData || (typeof userData === 'object' && Object.keys(userData).length === 0)) {
        console.log('No explicit user data found, attempting to construct from response...');
        
        // Check if the response itself contains user information
        if (data.email || data.id) {
          userData = {
            id: data.id || 'temp-id',
            email: data.email || credentials.email,
            username: data.username,
            createdAt: data.createdAt || new Date().toISOString()
          };
          console.log('Constructed user data from response:', userData);
        } else {
          // Try to fetch user data separately
          console.log('Attempting to fetch user data separately...');
          const fetchedUserData = await fetchUserData();
          
          if (fetchedUserData) {
            userData = fetchedUserData;
            console.log('Successfully fetched user data:', userData);
          } else {
            // If we can't construct user data, create a minimal user object
            userData = {
              id: 'temp-id',
              email: credentials.email,
              createdAt: new Date().toISOString()
            };
            console.log('Created minimal user data:', userData);
          }
        }
      }

      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('Stored token and user data, setting user state');
      setUser(userData);
      
      console.log('Login successful, user state updated');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<void> => {
    try {
      setLoading(true);
      console.log('Attempting signup with:', { email: credentials.email });
      
      const response = await fetch(`${BASE_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Signup response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Signup failed with status:', response.status, 'Error:', errorData);
        throw new Error(errorData.message || 'Signup failed');
      }

      const data = await response.json();
      console.log('Signup response data:', data);
      console.log('Signup response data keys:', Object.keys(data));
      
      // Try to find the token in different possible field names
      let token = data.token || data.accessToken || data.jwt || data.authToken || data.access_token;
      let userData = data.user || data.userData || data.userInfo;
      
      console.log('Extracted token:', token ? 'Found' : 'Missing');
      console.log('Extracted user data:', userData ? 'Found' : 'Missing');
      
      // If we still don't have a token, log the entire response for debugging
      if (!token) {
        console.error('Could not find token in response. Full response:', data);
        throw new Error('Invalid signup response: missing token. Please check the response structure.');
      }
      
      if (!userData) {
        console.error('Could not find user data in response. Full response:', data);
        throw new Error('Invalid signup response: missing user data. Please check the response structure.');
      }

      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('Stored token and user data, setting user state');
      setUser(userData);
      
      console.log('Signup successful, user state updated');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
