import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Grid,
  Box,
  Loader,
  Center,
  Alert,
  Paper
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import axios from 'axios';
import { BASE_URL } from '../config';
import { Game } from '../interfaces';
import { GameCard } from '../components/GameCard';

function Wishlist() {
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
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header Section */}
        <Box
          style={{
            background: `linear-gradient(135deg, ${brandColors.beige} 0%, ${brandColors.lightBrown} 100%)`,
            padding: '3rem 0',
            borderRadius: '16px',
            textAlign: 'center'
          }}
        >
          <Title
            order={1}
            size="2.5rem"
            c={brandColors.darkBrown}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              marginBottom: '1rem'
            }}
          >
            My Wishlist 🎯
          </Title>
          <Text
            size="lg"
            c={brandColors.mutedGreen}
            style={{
              fontFamily: 'Inter, sans-serif',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Games I'm excited to add to my collection
          </Text>
        </Box>

        {/* Games Grid */}
        {wishlistGames.length === 0 ? (
          <Paper
            p="xl"
            style={{
              backgroundColor: 'white',
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
                />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
}

export default Wishlist;
