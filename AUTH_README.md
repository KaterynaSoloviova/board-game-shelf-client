# Authentication System Documentation

## Overview
This document describes the authentication system implemented for the Board Games Shelf application.

## Features
- **User Registration**: New users can create accounts with email and password
- **User Login**: Existing users can log in with email and password
- **User Logout**: Authenticated users can log out
- **Protected Routes**: Certain pages require authentication to access
- **Persistent Authentication**: User sessions persist across browser refreshes
- **Form Validation**: Client-side validation for all forms

## API Endpoints
- **Login**: `POST /api/login` (email, password)
- **Signup**: `POST /api/signup` (email, password)

## Components

### AuthContext (`src/contexts/AuthContext.tsx`)
Provides authentication state and methods throughout the application:
- `user`: Current user object (email required, username optional)
- `isAuthenticated`: Boolean indicating if user is logged in
- `login(credentials)`: Login method
- `signup(credentials)`: Signup method
- `logout()`: Logout method
- `loading`: Loading state for async operations

### LoginModal (`src/components/LoginModal.tsx`)
Modal component for user login with:
- Email and password fields
- Form validation
- Error handling
- Link to switch to signup

### SignupModal (`src/components/SignupModal.tsx`)
Modal component for user registration with:
- Email and password fields
- Password confirmation
- Form validation
- Error handling
- Link to switch to login

### ProtectedRoute (`src/components/ProtectedRoute.tsx`)
Wrapper component that:
- Checks if user is authenticated
- Redirects unauthenticated users
- Shows loading state during authentication check

## Usage

### Basic Authentication
```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (isAuthenticated) {
    return <div>Welcome, {user?.username}!</div>;
  }
  
  return <div>Please log in</div>;
}
```

### Protected Routes
```tsx
import ProtectedRoute from '../components/ProtectedRoute';

<Route path="/protected" element={
  <ProtectedRoute>
    <ProtectedComponent />
  </ProtectedRoute>
} />
```

### API Requests with Authentication
```tsx
import { apiRequest } from '../utils/api';

const response = await apiRequest('/api/protected-endpoint', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

## Styling
The authentication components use the same color palette as the rest of the application:
- Primary: `#a87e5b`
- Background: `#f0f0eb`
- Text: `#635841`
- Borders: `#c5b79d`

## Security Features
- JWT tokens stored in localStorage
- Automatic token inclusion in API requests
- Client-side password validation
- Protected route redirection
- Session persistence

## Error Handling
- Network errors are caught and displayed to users
- Form validation errors are shown inline
- API error messages are displayed in alert components

## Future Enhancements
- Password reset functionality
- Email verification
- Social authentication (Google, Facebook)
- Remember me functionality
- Session timeout handling
- Multi-factor authentication
