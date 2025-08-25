import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  rem,
} from "@mantine/core";
import { IconSearch, IconFilter, IconX } from "@tabler/icons-react";
import { Game, Tag } from "../interfaces";
import axios from "axios";
import { BASE_URL } from "../config";
import { GameCard } from "../components/GameCard";

const MyGames: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/games/`)
      .then((res) => {
        setGames(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // filter data
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

  // options for dropdowns

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

  // Filtering games
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
        matchesTags &&
        game.isOwned
      );
    });
  }, [games, searchTerm, selectedGenre, selectedPlayers, selectedTags]);

  // Handle game card click
  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  // reset filter
  const handleClearFilters = () => {
    void setSelectedGenre(null);
    void setSelectedPlayers(null);
    void setSelectedTags([]);
    void setSearchTerm("");
  };

  // delete function
  const handleDeleteGame = async (gameId: string) => {
    try {
      await axios.delete(`${BASE_URL}/api/games/${gameId}/`);
      setGames((prev) => prev.filter((game) => game.id !== gameId));
    } catch (error) {
      console.error("Failed to delete game:", error);
      alert("Failed to delete game. Please try again.");
    }
  };

  return (
    <Box bg="gray.0" mih="100vh">
      {/* Header */}
      <Paper shadow="sm" py="xl">
        <Container size="xl">
          <Flex justify="space-between" align="center">
            <Title order={1}>My Games</Title>
            <Text c="dimmed">
              {filteredGames.length} game{filteredGames.length !== 1 ? "s" : ""}{" "}
              in collection
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
            leftSection={
              <IconSearch style={{ width: rem(16), height: rem(16) }} />
            }
            rightSection={
              searchTerm && (
                <ActionIcon
                  variant="subtle"
                  c="dimmed"
                  onClick={() => setSearchTerm("")}
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
            leftSection={
              <IconFilter style={{ width: rem(16), height: rem(16) }} />
            }
            onClick={() => setShowFilters(!showFilters)}
            mb="md"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>

          {/* Filters */}
          <Collapse in={showFilters}>
            <Divider mb="md" />
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Select
                  label="Genre"
                  placeholder="All Genres"
                  data={genreSelectData}
                  value={selectedGenre}
                  onChange={setSelectedGenre}
                  clearable
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
                />
              </Grid.Col>

              <Grid.Col
                span={{ base: 12, sm: 6, md: 3 }}
                style={{ display: "flex", alignItems: "end" }}
              >
                <Button variant="light" fullWidth onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </Grid.Col>
            </Grid>
          </Collapse>
        </Paper>

        <Button color="blue" mb="md" onClick={() => navigate("/addgame")}>
          Add Game
        </Button>

        {/* Games List */}
        <Stack gap="md">
          {filteredGames.length === 0 ? (
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
            filteredGames.map((game) => (
              <GameCard
                key={game?.id || Math.random()}
                game={game}
                onClick={handleGameClick}
                onDelete={handleDeleteGame}
              />
            ))
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default MyGames;
