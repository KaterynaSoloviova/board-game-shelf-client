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
} from '@mantine/core';
import { IconDice, IconUsers, IconClock, IconStar } from '@tabler/icons-react';
import { Game } from '../interfaces';
import axios from 'axios';
import { BASE_URL } from '../config';
import ReactSvg from '../assets/react.svg';

const HomePage: React.FC = () => {
  const [hottestGames, setHottestGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Color palette from MyGames page
  const brandColors = {
    beige: "#e0d9c4",
    lightBrown: "#c5b79d",
    mutedGreen: "#8c947d",
    darkBrown: "#635841",
    accent: "#a87e5b",
  };

  useEffect(() => {
    fetchHottestGames();
  }, []);

  const fetchHottestGames = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/games/`);
      
      // Get games with session counts and sort by most sessions
      const gamesWithSessions = await Promise.all(
        response.data.map(async (game: Game) => {
          try {
            const sessionsResponse = await axios.get(`${BASE_URL}/api/games/${game.id}/sessions`);
            return {
              ...game,
              sessionCount: sessionsResponse.data?.length || 0
            };
          } catch (error) {
            return {
              ...game,
              sessionCount: 0
            };
          }
        })
      );

      // Sort by session count (most played first) and take top 6
      const sortedGames = gamesWithSessions
        .sort((a, b) => b.sessionCount - a.sessionCount)
        .slice(0, 6);

      setHottestGames(sortedGames);
    } catch (error) {
      console.error("Failed to fetch hottest games:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (gameId: string) => {
    // Game click functionality can be added here if needed
    console.log('Game clicked:', gameId);
  };

  return (
    <Box bg={brandColors.beige} mih="100vh">
      <Container size="xl" py="xl">
        {/* Welcome Message */}
        <Paper 
          shadow="sm" 
          p="xl" 
          radius="md" 
          mb="xl" 
          style={{ 
            backgroundColor: 'white',
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
            backgroundColor: 'white',
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
            How to Use the Site
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
            backgroundColor: 'white',
            border: `1px solid ${brandColors.lightBrown}`,
            textAlign: 'center'
          }}
        >
          <Stack gap="lg" align="center">
            <Title 
              order={3} 
              c={brandColors.darkBrown}
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600
              }}
            >
              A Friendly Note
            </Title>
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
            backgroundColor: 'white',
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
            🎯 Hottest Games - Most Played
          </Title>
          
          {loading ? (
            <Center py="xl">
              <Loader color={brandColors.darkBrown} />
            </Center>
          ) : hottestGames.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              No games found. Start adding games to see the most played ones!
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
                         height={160}
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
                        <Text size="sm">{(game as any).sessionCount || 0} sessions</Text>
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