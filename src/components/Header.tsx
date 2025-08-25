import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Text,
  Button,
  Flex,
  Paper,
  Group,
} from '@mantine/core';
import { IconDice, IconLogin, IconLogout } from '@tabler/icons-react';
import { useState } from 'react';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // You can replace this with actual auth state

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
    // Add your login logic here
    setIsLoggedIn(true);
    console.log('Login clicked');
  };

  const handleLogout = () => {
    // Add your logout logic here
    setIsLoggedIn(false);
    console.log('Logout clicked');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Paper 
      shadow="sm" 
      py="md" 
      withBorder 
      style={{ 
        borderColor: brandColors.lightBrown, 
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <Container size="xl">
        <Flex justify="space-between" align="center">
          {/* Project Logo and Name */}
          <Group gap="sm">
            <IconDice 
              size={32} 
              color={brandColors.accent}
              style={{ filter: 'drop-shadow(0 2px 4px rgba(99, 88, 65, 0.2))' }}
            />
            <Text 
              size="xl" 
              fw={700}
              c={brandColors.darkBrown}
              style={{ 
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}
              onClick={() => handleNavigation('/')}
            >
              Board Games Shelf
            </Text>
          </Group>

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

            {/* Login/Logout Button */}
            {isLoggedIn ? (
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
  );
}

export default Header;