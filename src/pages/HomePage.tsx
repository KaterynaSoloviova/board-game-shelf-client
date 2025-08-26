import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Grid,
  Box,
  Paper,
  Group,
  Loader,
  Center,
  Card,
  Image,
  Badge,
  rem,
} from '@mantine/core';
import { IconDice, IconUsers, IconClock, IconStar } from '@tabler/icons-react';
import { Game } from '../interfaces';
import axios from 'axios';
import { BASE_URL } from '../config';
import BoardGamesShelfImage from '../assets/BoardGamesShelf.png';
import ReactSvg from '../assets/react.svg';

const HomePage: React.FC = () => {
  const [hottestGames, setHottestGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Color palette from MyGames page
  const brandColors = {
    beige: "#e0d9c4",
    lightBrown: "#c5b79d",
    mutedGreen: "#6b8e23",
    darkBrown: "#635841",
    accent: "#a87e5b",
  };

  useEffect(() => {
    fetchHottestGames();
  }, []);

  const fetchHottestGames = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/games/top`);

      // Take top 6 games from the backend response
      const topGames = response.data.slice(0, 6);
      setHottestGames(topGames);
    } catch (error) {
      console.error("Failed to fetch top games:", error);
      // Fallback to empty array if the endpoint fails
      setHottestGames([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (gameId: string) => {
    // Navigate to game details page
    window.location.href = `/game/${gameId}`;
  };

  return (
    <Box bg={brandColors.beige} mih="100vh">
      {/* Hero Section with BoardGamesShelf Image */}
      <Box
        style={{
          background: `linear-gradient(135deg, ${brandColors.beige} 0%, ${brandColors.lightBrown} 100%)`,
          padding: '1rem 0',
          textAlign: 'center'
        }}
      >
        <Container size="xl">
          <Image
            src={BoardGamesShelfImage}
            alt="Board Games Shelf"
            style={{
              maxWidth: '400px',
              margin: '0 auto 2rem',
              filter: 'drop-shadow(0 10px 20px rgba(99, 88, 65, 0.2))'
            }}
          />
          <Title
            order={1}
            size="3rem"
            c={brandColors.darkBrown}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              marginBottom: '1rem'
            }}
          >
            Board Games Shelf
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
            Your personal board games library
          </Text>
        </Container>
      </Box>

      <Container size="xl" py="lg">
        {/* Welcome Message */}
        <Paper
          shadow="sm"
          p="xl"
          radius="md"
          mb="lg"
          style={{
            backgroundColor: '#f0f0eb',
            border: `1px solid ${brandColors.lightBrown}`,
            textAlign: 'center'
          }}
        >
          <Stack gap="lg" align="center">
            <Title
              order={2}
              c={brandColors.darkBrown}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600
              }}
            >
              Welcome! 🎲
            </Title>
            <Text
              size="lg"
              c={brandColors.mutedGreen}
              style={{
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.6,
                maxWidth: '800px'
              }}
            >
              This is my personal collection of board games that I've put together so we can all keep track of what's on the shelf. Whether you're looking for something quick and fun, a deep strategy challenge, or a cooperative adventure, you'll find it here.
            </Text>
          </Stack>
        </Paper>

        {/* How to Use Section */}
        <Paper
          shadow="sm"
          p="xl"
          radius="md"
          mb="xl"
          style={{
            backgroundColor: '#f0f0eb',
            border: `1px solid ${brandColors.lightBrown}`
          }}
        >
          <Title
            order={3}
            c={brandColors.darkBrown}
            mb="lg"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600
            }}
          >
            What you can do on the site
          </Title>
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="sm" align="center" ta="center">
                <IconDice
                  size={40}
                  color={brandColors.accent}
                  style={{ marginBottom: '0.5rem' }}
                />
                <Text
                  size="md"
                  c={brandColors.mutedGreen}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <strong>Browse the Shelf</strong> – see all games in the collection.
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="sm" align="center" ta="center">
                <IconUsers
                  size={40}
                  color={brandColors.accent}
                  style={{ marginBottom: '0.5rem' }}
                />
                <Text
                  size="md"
                  c={brandColors.mutedGreen}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <strong>Filter by Tags</strong> – find games for family nights, party games, two-player duels, or strategy marathons.
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="sm" align="center" ta="center">
                <IconStar
                  size={40}
                  color={brandColors.accent}
                  style={{ marginBottom: '0.5rem' }}
                />
                <Text
                  size="md"
                  c={brandColors.mutedGreen}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <strong>Game Notes</strong> – check out short descriptions and my thoughts on each game (house rules, favorite expansions, best player counts).
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Friendly Note Section */}
        <Paper
          shadow="sm"
          p="xl"
          radius="md"
          mb="xl"
          style={{
            backgroundColor: '#f0f0eb',
            border: `1px solid ${brandColors.lightBrown}`,
            textAlign: 'center'
          }}
        >
          <Stack gap="lg" align="center">
            <Text
              size="lg"
              c={brandColors.mutedGreen}
              style={{
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.6,
                maxWidth: '700px'
              }}
            >
              This isn't just a list — it's our shelf. If you're coming over for a game night, check here first to see what's available, or suggest something new to add!
            </Text>
            <Text
              size="xl"
              c={brandColors.accent}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontStyle: 'italic'
              }}
            >
              "Grab some snacks, pick a game, and let's play!"
            </Text>
          </Stack>
        </Paper>

        {/* Hottest Games Slider */}
        <Paper
          shadow="sm"
          p="xl"
          radius="md"
          style={{
            backgroundColor: '#f0f0eb',
            border: `1px solid ${brandColors.lightBrown}`
          }}
        >
          <Title
            order={3}
            c={brandColors.darkBrown}
            mb="lg"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600
            }}
          >
            🔥 Hottest Games
          </Title>

          {loading ? (
            <Center py="xl">
              <Loader color={brandColors.darkBrown} />
            </Center>
          ) : hottestGames.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              No top games found. The backend will rank games based on your criteria!
            </Text>
          ) : (
            <Grid gutter="md">
              {hottestGames.map((game) => (
                <Grid.Col key={game.id} span={{ base: 12, sm: 6, lg: 4 }}>
                  <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    style={{
                      borderColor: brandColors.lightBrown,
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 30px rgba(99, 88, 65, 0.15)'
                      }
                    }}
                    onClick={() => handleGameClick(game.id)}
                  >
                    <Card.Section>
                      <Image
                        src={game.coverImage || ReactSvg}
                        height={rem(200)}
                        alt={game.title}
                        style={{ objectFit: 'cover' }}
                      />
                    </Card.Section>

                    <Stack gap="xs" mt="md">
                      <Title order={4} c={brandColors.darkBrown} size="md">
                        {game.title}
                      </Title>

                      <Group gap="xs" wrap="wrap">
                        <Badge
                          color={brandColors.mutedGreen}
                          variant="light"
                          size="sm"
                        >
                          {game.genre}
                        </Badge>
                        <Badge
                          color={brandColors.accent}
                          variant="light"
                          size="sm"
                        >
                          {game.minPlayers}-{game.maxPlayers} players
                        </Badge>
                      </Group>

                      <Group gap="xs" c={brandColors.mutedGreen}>
                        <IconClock size={16} />
                        <Text size="sm">{game.playTime} min</Text>
                        <IconUsers size={16} />
                        <Text size="sm">{game._count?.sessions || 0} sessions</Text>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;