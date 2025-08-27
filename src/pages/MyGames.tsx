import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  TextInput,
  Select,
  MultiSelect,
  Button,
  Stack,
  Flex,
  Collapse,
  ActionIcon,
  Divider,
  Grid,
  Box,
  Paper,
  Group,
  rem,
  Loader,
  Center,
} from "@mantine/core";
import { IconSearch, IconFilter, IconX, IconChess } from "@tabler/icons-react";
import { Game, Tag } from "../interfaces";
import axios from "axios";
import { BASE_URL } from "../config";
import { GameCard } from "../components/GameCard";
import { useAuth } from "../contexts/AuthContext";
import { apiRequest } from "../utils/api";

const MyGames: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // New color palette based on the board game shelf image
  const brandColors = {
    beige: "#e0d9c4",
    lightBrown: "#c5b79d",
    mutedGreen: "#8c947d",
    darkBrown: "#635841",
    accent: "#a87e5b",
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/games/`);
      const gamesWithSessions = await Promise.all(
        response.data.map(async (game: Game) => {
          try {
            const sessionsResponse = await axios.get(`${BASE_URL}/api/games/${game.id}/sessions`);
            return {
              ...game,
              sessions: sessionsResponse.data || []
            };
          } catch (error) {
            console.error(`Failed to fetch sessions for game ${game.title}:`, error);
            return {
              ...game,
              sessions: []
            };
          }
        })
      );
      setGames(gamesWithSessions);
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [location.pathname]);

  const genres = useMemo(
    () => [...new Set(games.map((game) => game.genre))].sort(),
    [games]
  );

  const tags = useMemo(
    () =>
      [
        ...new Set(
          games.flatMap((game) => game.tags?.map((tag: Tag) => tag.title) || [])
        ),
      ].sort(),
    [games]
  );

  const genreSelectData = genres.map((genre) => ({
    value: genre,
    label: genre,
  }));

  const tagSelectData = tags.map((tag) => ({
    value: tag,
    label: tag,
  }));

  const playerSelectData = [
    { value: "1", label: "1 Player" },
    { value: "2", label: "2 Players" },
    { value: "3", label: "3 Players" },
    { value: "4", label: "4 Players" },
    { value: "5", label: "5 Players" },
    { value: "6", label: "6 Players" },
    { value: "7", label: "7 Players" },
    { value: "8+", label: "8+ Players" },
  ];

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch =
        searchTerm === "" ||
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.publisher.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = !selectedGenre || game.genre === selectedGenre;

      let matchesPlayers = true;
      if (selectedPlayers) {
        if (selectedPlayers === "1") {
          matchesPlayers = game.minPlayers <= 1 && game.maxPlayers >= 1;
        } else if (selectedPlayers === "2") {
          matchesPlayers = game.minPlayers <= 2 && game.maxPlayers >= 2;
        } else if (selectedPlayers === "3") {
          matchesPlayers = game.minPlayers <= 3 && game.maxPlayers >= 3;
        } else if (selectedPlayers === "4") {
          matchesPlayers = game.minPlayers <= 4 && game.maxPlayers >= 4;
        } else if (selectedPlayers === "5") {
          matchesPlayers = game.minPlayers <= 5 && game.maxPlayers >= 5;
        } else if (selectedPlayers === "6") {
          matchesPlayers = game.minPlayers <= 6 && game.maxPlayers >= 6;
        } else if (selectedPlayers === "7") {
          matchesPlayers = game.minPlayers <= 7 && game.maxPlayers >= 7;
        } else if (selectedPlayers === "8+") {
          matchesPlayers = game.maxPlayers >= 8;
        }
      }

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) =>
          game.tags.some((gameTag: Tag) => gameTag.title === tag)
        );

      return (
        matchesSearch &&
        matchesGenre &&
        matchesPlayers &&
        matchesTags
      );
    });
  }, [games, searchTerm, selectedGenre, selectedPlayers, selectedTags]);

  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const handleClearFilters = () => {
    setSelectedGenre(null);
    setSelectedPlayers(null);
    setSelectedTags([]);
    setSearchTerm("");
  };

  const handleDeleteGame = async (gameId: string) => {
    try {
      const response = await apiRequest(`/api/games/${gameId}/`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete game");
      }
      setGames((prev) => prev.filter((game) => game.id !== gameId));
    } catch (error) {
      console.error("Failed to delete game:", error);
      alert("Failed to delete game. Please try again.");
    }
  };

  const handleEditGame = (gameId: string) => {
    navigate(`/edit/${gameId}`);
  };

  return (
    <Box bg={brandColors.beige} mih="100vh">
      <Paper shadow="sm" py="md" withBorder style={{ borderColor: brandColors.lightBrown, backgroundColor: brandColors.beige }}>
        <Container size="xl">
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="sm">
              <IconChess 
                size={32} 
                color="#9A6A63"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(99, 88, 65, 0.2))' }}
              />
              <Title order={1} c="#9A6A63">My Games</Title>
            </Flex>
            <Text c={brandColors.mutedGreen} size="sm">
              {filteredGames.length} game{filteredGames.length !== 1 ? "s" : ""}{" "}
              in collection
            </Text>
          </Flex>
        </Container>
      </Paper>

      <Container size="xl" py="xl">
        <Paper shadow="sm" p="md" radius="md" mb="lg" style={{ backgroundColor: "#f0f0eb" }}>
          <TextInput
            placeholder="Search games..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16), color: brandColors.mutedGreen }} />}
            rightSection={
              searchTerm && (
                <ActionIcon
                  variant="subtle"
                  c={brandColors.mutedGreen}
                  onClick={() => setSearchTerm("")}
                >
                  <IconX style={{ width: rem(16), height: rem(16) }} />
                </ActionIcon>
              )
            }
            mb="sm"
            styles={{ input: { borderColor: brandColors.lightBrown } }}
          />

          <Button
            variant="subtle"
            leftSection={<IconFilter style={{ width: rem(16), height: rem(16) }} />}
            onClick={() => setShowFilters(!showFilters)}
            c={brandColors.mutedGreen}
            mb="sm"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>

          <Collapse in={showFilters}>
            <Divider my="md" color={brandColors.lightBrown} />
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Select
                  label="Genre"
                  placeholder="All Genres"
                  data={genreSelectData}
                  value={selectedGenre}
                  onChange={setSelectedGenre}
                  clearable
                  styles={{ input: { borderColor: brandColors.lightBrown } }}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Select
                  label="Player Count"
                  placeholder="Any Player Count"
                  data={playerSelectData}
                  value={selectedPlayers}
                  onChange={setSelectedPlayers}
                  clearable
                  styles={{ input: { borderColor: brandColors.lightBrown } }}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <MultiSelect
                  label="Tags"
                  placeholder="Select tags..."
                  data={tagSelectData}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  clearable
                  searchable
                  styles={{ input: { borderColor: brandColors.lightBrown } }}
                />
              </Grid.Col>

              <Grid.Col
                span={{ base: 12, sm: 6, md: 3 }}
                style={{ display: "flex", alignItems: "end" }}
              >
                <Button variant="light" fullWidth onClick={handleClearFilters} c={brandColors.darkBrown} style={{ backgroundColor: brandColors.beige, borderColor: brandColors.lightBrown }}>
                  Clear Filters
                </Button>
              </Grid.Col>
            </Grid>
          </Collapse>
        </Paper>

        <Group gap="md" mb="md">
          {isAuthenticated && (
            <Button color={brandColors.accent} onClick={() => navigate("/addgame")}>
              Add Game
            </Button>
          )}
          <Button
            variant="light"
            onClick={fetchGames}
            disabled={loading}
            c={brandColors.darkBrown}
            style={{ backgroundColor: brandColors.beige }}
            leftSection={loading && <Loader size="xs" color={brandColors.darkBrown} />}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </Group>

        {loading ? (
          <Center mt="xl">
            <Loader color={brandColors.darkBrown} />
          </Center>
        ) : filteredGames.length === 0 ? (
          <Paper shadow="sm" p="xl" radius="md">
            <Stack align="center" gap="xs">
              <Text size="lg" c="dimmed">
                No games found
              </Text>
              <Text size="sm" c="dimmed">
                Try adjusting your search or filters
              </Text>
            </Stack>
          </Paper>
        ) : (
          <Grid gutter="md">
            {filteredGames.map((game) => (
              <Grid.Col key={game?.id || Math.random()} span={{ base: 12, sm: 6, lg: 4 }}>
                <GameCard
                  game={game}
                  onClick={handleGameClick}
                  onDelete={handleDeleteGame}
                  onEdit={handleEditGame}
                  accentColor={brandColors.accent}
                  mutedColor={brandColors.mutedGreen}
                  isAuthenticated={isAuthenticated}
                />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MyGames;