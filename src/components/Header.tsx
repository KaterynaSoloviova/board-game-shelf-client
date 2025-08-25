import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Button,
  Flex,
  Box,
  Paper,
  Image,
} from '@mantine/core';
import BoardGamesShelfImage from '../assets/BoardGamesShelf.png';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

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

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box bg={brandColors.beige}>
      {/* Hero Section with BoardGamesShelf Image */}
      <Box 
        style={{ 
          background: `linear-gradient(135deg, ${brandColors.beige} 0%, ${brandColors.lightBrown} 100%)`,
          padding: '2rem 0',
          textAlign: 'center'
        }}
      >
        <Container size="xl">
          <Image
            src={BoardGamesShelfImage}
            alt="Board Games Shelf"
            style={{ 
              maxWidth: '300px', 
              margin: '0 auto 1rem',
              filter: 'drop-shadow(0 8px 16px rgba(99, 88, 65, 0.2))'
            }}
          />
          <Title 
            order={1} 
            size="2.5rem" 
            c={brandColors.darkBrown}
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}
          >
            Board Games Shelf
          </Title>
          <Text 
            size="md" 
            c={brandColors.mutedGreen}
            style={{ 
              fontFamily: 'Inter, sans-serif',
              maxWidth: '500px',
              margin: '0 auto'
            }}
          >
            Your personal board games library
          </Text>
        </Container>
      </Box>

      {/* Navigation Panel */}
      <Paper 
        shadow="sm" 
        py="md" 
        withBorder 
        style={{ 
          borderColor: brandColors.lightBrown, 
          backgroundColor: 'white',
          margin: '0 auto',
          maxWidth: '800px',
          marginTop: '-1rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        <Container size="md">
          <Flex justify="center" gap="xl" wrap="wrap">
            <Button
              variant={isActive('/') ? 'filled' : 'light'}
              onClick={() => handleNavigation('/')}
              c={isActive('/') ? 'white' : brandColors.darkBrown}
              style={{ 
                backgroundColor: isActive('/') ? brandColors.accent : brandColors.beige, 
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
              Home
            </Button>
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
          </Flex>
        </Container>
      </Paper>
    </Box>
  );
}

export default Header;