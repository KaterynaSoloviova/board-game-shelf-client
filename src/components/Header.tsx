import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Text,
  Button,
  Flex,
  Paper,
  Group,
  Image,
} from '@mantine/core';
import { IconLogin, IconLogout, IconUser } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAuthPersistence } from '../hooks/useAuthPersistence';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import HeaderIcon from '../assets/header_icon.png';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const [signupModalOpened, setSignupModalOpened] = useState(false);

  // Use the auth persistence hook
  useAuthPersistence();

  // Debug: Log user object when it changes
  useEffect(() => {
    if (user) {
      console.log('Header: User object updated:', user);
      console.log('Header: Username:', user.username);
      console.log('Header: Email:', user.email);
    }
  }, [user]);

  // Color palette from MyGames page
  const brandColors = {
    beige: "#e0d9c4",
    lightBrown: "#c5b79d",
    mutedGreen: "#8c947d",
    darkBrown: "#635841",
    accent: "#a87e5b",
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogin = () => {
    setLoginModalOpened(true);
    
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSwitchToSignup = () => {
    setLoginModalOpened(false);
    setSignupModalOpened(true);
  };

  const handleSwitchToLogin = () => {
    setSignupModalOpened(false);
    setLoginModalOpened(true);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <Paper 
        shadow="sm"
        withBorder 
        style={{ 
          borderColor: brandColors.lightBrown, 
          backgroundColor: '#f0f0eb',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <Container size="xl">
          <Flex justify="space-between" align="center">
            {/* Project Logo and Name */}
            <Flex gap="sm" align="center">
              <Image
                src={HeaderIcon}
                alt="Board Games Shelf"
                width={80}
                height={80}
                py="xs"
                fit="contain"
                style={{ 
                  filter: 'drop-shadow(0 2px 4px rgba(99, 88, 65, 0.2))',
                  marginLeft: '-20px'
                }}
              />
              <Text 
                size="xl" 
                fw={700}
                c={brandColors.darkBrown}
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => handleNavigation('/')}
              >
                Board Games Shelf
              </Text>
            </Flex>

            {/* Navigation Buttons */}
            <Group gap="md">
              <Button
                variant={isActive('/games') ? 'filled' : 'light'}
                onClick={() => handleNavigation('/games')}
                c={isActive('/games') ? 'white' : brandColors.darkBrown}
                style={{ 
                  backgroundColor: isActive('/games') ? brandColors.accent : brandColors.beige, 
                  borderColor: brandColors.lightBrown,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(99, 88, 65, 0.15)'
                  }
                }}
              >
                My Games
              </Button>
              <Button
                variant={isActive('/wishlist') ? 'filled' : 'light'}
                onClick={() => handleNavigation('/wishlist')}
                c={isActive('/wishlist') ? 'white' : brandColors.darkBrown}
                style={{ 
                  backgroundColor: isActive('/wishlist') ? brandColors.accent : brandColors.beige, 
                  borderColor: brandColors.lightBrown,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(99, 88, 65, 0.15)'
                  }
                }}
              >
                Wishlist
              </Button>
              <Button
                variant={isActive('/about') ? 'filled' : 'light'}
                onClick={() => handleNavigation('/about')}
                c={isActive('/about') ? 'white' : brandColors.darkBrown}
                style={{ 
                  backgroundColor: isActive('/about') ? brandColors.accent : brandColors.beige, 
                  borderColor: brandColors.lightBrown,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(99, 88, 65, 0.15)'
                  }
                }}
              >
                About Project
              </Button>

              {/* User Info and Auth Buttons */}
              {isAuthenticated ? (
                <Group gap="sm">
                  <Text size="sm" c={brandColors.darkBrown} fw={500}>
                    Welcome{user?.username || user?.email ? `, ${user?.username || user?.email?.split('@')[0]}` : ''}!
                  </Text>
                  <Button
                    variant="light"
                    onClick={handleLogout}
                    c={brandColors.darkBrown}
                    leftSection={<IconLogout size={16} />}
                    style={{ 
                      backgroundColor: brandColors.beige, 
                      borderColor: brandColors.lightBrown,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(99, 88, 65, 0.15)'
                      }
                    }}
                  >
                    Logout
                  </Button>
                </Group>
              ) : (
                <Button
                  variant="light"
                  onClick={handleLogin}
                  c={brandColors.darkBrown}
                  leftSection={<IconLogin size={16} />}
                  style={{ 
                    backgroundColor: brandColors.beige, 
                    borderColor: brandColors.lightBrown,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(99, 88, 65, 0.15)'
                    }
                  }}
                >
                  Login
                </Button>
              )}
            </Group>
          </Flex>
        </Container>
      </Paper>

      {/* Auth Modals */}
      <LoginModal
        opened={loginModalOpened}
        onClose={() => setLoginModalOpened(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />
      
      <SignupModal
        opened={signupModalOpened}
        onClose={() => setSignupModalOpened(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}

export default Header;