import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Flex,
  Grid,
  Paper,
  Box,
  Center,
  Loader,
  Alert,
} from '@mantine/core';
import { IconHeart, IconAlertCircle } from '@tabler/icons-react';
import { Game } from '../interfaces';
import { GameCard } from '../components/GameCard';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../config';

const Wishlist: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [wishlistGames, setWishlistGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGameClick = (gameId: string) => {
    // Navigate to game details page
    window.location.href = `/game/${gameId}`;
  };

  const handleGameDelete = (gameId: string) => {
    // Remove game from wishlist
    setWishlistGames(prev => prev.filter(game => game.id !== gameId));
    // You could also make an API call here to remove from wishlist
  };

  const brandColors = {
    beige: "#e0d9c4",
    lightBrown: "#c5b79d",
    mutedGreen: "#8c947d",
    darkBrown: "#635841",
    accent: "#a87e5b",
  };

  useEffect(() => {
    fetchWishlistGames();
  }, []);

  const fetchWishlistGames = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/games/wishlist`);
      setWishlistGames(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching wishlist games:', err);
      setError('Failed to load wishlist games');
      setWishlistGames([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Center py="xl">
          <Loader size="lg" color={brandColors.accent} />
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          variant="light"
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box bg={brandColors.beige} mih="100vh">
      <Paper shadow="sm" py="md" withBorder style={{ borderColor: brandColors.lightBrown, backgroundColor: brandColors.beige }}>
        <Container size="xl">
          <Flex justify="space-between" align="center">
            <Stack gap="xs">
              <Flex align="center" gap="sm">
                <IconHeart 
                  size={32} 
                  color="#9A6A63"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(99, 88, 65, 0.2))' }}
                />
                <Title order={1} c="#9A6A63">My Wishlist</Title>
              </Flex>
              <Text
                size="md"
                c={brandColors.darkBrown}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  marginLeft: '40px',
                  fontWeight: 500
                }}
              >
                Games I'm excited to add to my collection
              </Text>
            </Stack>
            <Text c={brandColors.mutedGreen} size="sm">
              {wishlistGames.length} game{wishlistGames.length !== 1 ? "s" : ""}{" "}
              in wishlist
            </Text>
          </Flex>
        </Container>
      </Paper>

      <Container size="xl" py="xl">
        <Stack gap="xl">

        {/* Games Grid */}
        {wishlistGames.length === 0 ? (
          <Paper
            p="xl"
            style={{
              backgroundColor: '#f0f0eb',
              border: `1px solid ${brandColors.lightBrown}`,
              borderRadius: '12px',
              textAlign: 'center'
            }}
          >
            <Text size="lg" c={brandColors.mutedGreen} style={{ fontFamily: 'Inter, sans-serif' }}>
              Your wishlist is empty. Start adding games you'd like to own!
            </Text>
          </Paper>
        ) : (
          <Grid gutter="lg">
            {wishlistGames.map((game) => (
              <Grid.Col key={game.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                <GameCard 
                  game={game} 
                  onClick={handleGameClick}
                  onDelete={handleGameDelete}
                  isAuthenticated={isAuthenticated}
                />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  </Box>
  );
}

export default Wishlist;
