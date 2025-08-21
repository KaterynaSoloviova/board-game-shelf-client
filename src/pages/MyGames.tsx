import React, { useState, useMemo } from 'react';
import {
  Container,
  Title,
  Text,
  TextInput,
  Select,
  Button,
  Card,
  Image,
  Group,
  Stack,
  Badge,
  Flex,
  Collapse,
  ActionIcon,
  Rating,
  Divider,
  Grid,
  Box,
  Paper,
  rem
} from '@mantine/core';
import { IconSearch, IconFilter, IconUsers, IconClock, IconX } from '@tabler/icons-react';

// Types based on your Prisma schema
interface Session {
  id: string;
  date: Date;
  notes?: string;
  gameId: string;
  createdAt: Date;
}

interface Game {
  id: string;
  title: string;
  genre: string;
  minPlayers: number;
  maxPlayers: number;
  playTime: number;
  publisher: string;
  age: string;
  rating: number;
  coverImage: string;
  isOwned: boolean;
  sessions: Session[];
  myRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data - replace with your API calls
const mockGames: Game[] = [
  {
    id: '1',
    title: 'Brass: Birmingham',
    genre: 'Strategy',
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 120,
    publisher: 'Roxley Games',
    age: '14+',
    rating: 8.6,
    coverImage: '/images/games/brass-birmingham.jpg', // Update with your image paths
    isOwned: true,
    myRating: 9,
    sessions: [
      { id: '1', date: new Date(), gameId: '1', createdAt: new Date() },
      { id: '2', date: new Date(), gameId: '1', createdAt: new Date() }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Add more games...
];

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const formatPlayerCount = (min: number, max: number): string => {
    return min === max ? `${min} Player${min > 1 ? 's' : ''}` : `${min}–${max} Players`;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Flex gap="md">
        {/* Game Cover Image */}
        <Box style={{ flexShrink: 0 }}>
          <Image
            src={game.coverImage}
            alt={game.title}
            width={96}
            height={128}
            radius="sm"
            fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgOTYgMTI4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iOTYiIGhlaWdodD0iMTI4IiBmaWxsPSIjRTJFOEYwIi8+CjxwYXRoIGQ9Ik00OCA2NEw2NCA0OEg4MFY4MEg2NEw0OCA2NFoiIGZpbGw9IiM3MTgwOTYiLz4KPHN2Zz4K"
          />
        </Box>

        {/* Game Details */}
        <Stack style={{ flex: 1 }} gap="xs">
          {/* Title and BGG Rating */}
          <Flex justify="space-between" align="flex-start" gap="md">
            <Title order={4} lineClamp={2} style={{ flex: 1 }}>
              {game.title}
            </Title>
            <Badge color="green" variant="filled" size="lg">
              {game.rating.toFixed(1)}
            </Badge>
          </Flex>

          {/* Game Info Icons */}
          <Group gap="lg">
            <Group gap="xs">
              <IconUsers style={{ width: rem(16), height: rem(16) }} />
              <Text size="sm" c="dimmed">
                {formatPlayerCount(game.minPlayers, game.maxPlayers)}
              </Text>
            </Group>
            <Group gap="xs">
              <IconClock style={{ width: rem(16), height: rem(16) }} />
              <Text size="sm" c="dimmed">
                {game.playTime} Min
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              Age: {game.age}
            </Text>
          </Group>

          {/* Genre and Publisher */}
          <Stack gap={4}>
            <Group gap="xs">
              <Text size="sm" fw={500}>Genre:</Text>
              <Text size="sm" c="dimmed">{game.genre}</Text>
            </Group>
            <Group gap="xs">
              <Text size="sm" fw={500}>Publisher:</Text>
              <Text size="sm" c="dimmed">{game.publisher}</Text>
            </Group>
          </Stack>

          {/* My Rating */}
          {game.myRating && (
            <Group gap="xs">
              <Text size="sm" fw={500}>My Rating:</Text>
              <Rating value={game.myRating / 2} fractions={2} readOnly size="sm" />
              <Text size="sm" c="dimmed">({game.myRating}/10)</Text>
            </Group>
          )}

          {/* Sessions Count */}
          <Group gap="xs">
            <Text size="sm" fw={500}>Sessions:</Text>
            <Badge variant="light" size="sm">
              {game.sessions.length}
            </Badge>
          </Group>
        </Stack>
      </Flex>
    </Card>
  );
};

const MyGames: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>('');
  const [selectedPlayers, setSelectedPlayers] = useState<string | null>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Get unique genres
  const genres = useMemo(() => 
    [...new Set(mockGames.map(game => game.genre))].sort()
  , []);

  // Filter games
  const filteredGames = useMemo(() => {
    return mockGames.filter(game => {
      const matchesSearch = searchTerm === '' || 
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.publisher.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = !selectedGenre || game.genre === selectedGenre;
      
      let matchesPlayers = true;
      if (selectedPlayers) {
        switch (selectedPlayers) {
          case '1':
            matchesPlayers = game.minPlayers <= 1 && game.maxPlayers >= 1;
            break;
          case '2':
            matchesPlayers = game.minPlayers <= 2 && game.maxPlayers >= 2;
            break;
          case '3':
            matchesPlayers = game.minPlayers <= 3 && game.maxPlayers >= 3;
            break;
          case '4+':
            matchesPlayers = game.maxPlayers >= 4;
            break;
        }
      }
      
      return matchesSearch && matchesGenre && matchesPlayers && game.isOwned;
    });
  }, [searchTerm, selectedGenre, selectedPlayers]);

  const handleClearFilters = (): void => {
    setSelectedGenre('');
    setSelectedPlayers('');
    setSearchTerm('');
  };

  const genreSelectData = genres.map(genre => ({
    value: genre,
    label: genre
  }));

  const playerSelectData = [
    { value: '1', label: '1 Player' },
    { value: '2', label: '2 Players' },
    { value: '3', label: '3 Players' },
    { value: '4+', label: '4+ Players' }
  ];

  return (
    <Box bg="gray.0" mih="100vh">
      {/* Header */}
      <Paper shadow="sm" py="xl">
        <Container size="xl">
          <Flex justify="space-between" align="center">
            <Title order={1}>My Games</Title>
            <Text c="dimmed">
              {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} in collection
            </Text>
          </Flex>
        </Container>
      </Paper>

      <Container size="xl" py="xl">
        {/* Filters Section */}
        <Paper shadow="sm" p="lg" radius="md" mb="xl">
          {/* Search Bar */}
          <TextInput
            placeholder="Search games by title, genre, or publisher..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} />}
            rightSection={
              searchTerm && (
                <ActionIcon
                  variant="subtle"
                  c="dimmed"
                  onClick={() => setSearchTerm('')}
                >
                  <IconX style={{ width: rem(16), height: rem(16) }} />
                </ActionIcon>
              )
            }
            mb="md"
          />

          {/* Filter Toggle */}
          <Button
            variant="subtle"
            leftSection={<IconFilter style={{ width: rem(16), height: rem(16) }} />}
            onClick={() => setShowFilters(!showFilters)}
            mb="md"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>

          {/* Filters */}
          <Collapse in={showFilters}>
            <Divider mb="md" />
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <Select
                  label="Genre"
                  placeholder="All Genres"
                  data={genreSelectData}
                  value={selectedGenre}
                  onChange={setSelectedGenre}
                  clearable
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                <Select
                  label="Player Count"
                  placeholder="Any Player Count"
                  data={playerSelectData}
                  value={selectedPlayers}
                  onChange={setSelectedPlayers}
                  clearable
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 4 }} style={{ display: 'flex', alignItems: 'end' }}>
                <Button
                  variant="light"
                  fullWidth
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              </Grid.Col>
            </Grid>
          </Collapse>
        </Paper>

        {/* Games List */}
        <Stack gap="md">
          {filteredGames.length === 0 ? (
            <Paper shadow="sm" p="xl" radius="md">
              <Stack align="center" gap="xs">
                <Text size="lg" c="dimmed">No games found</Text>
                <Text size="sm" c="dimmed">
                  Try adjusting your search or filters
                </Text>
              </Stack>
            </Paper>
          ) : (
            filteredGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default MyGames;