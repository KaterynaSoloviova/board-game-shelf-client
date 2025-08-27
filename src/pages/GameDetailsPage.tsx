import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Title,
  Text,
  Stack,
  Center,
  Loader,
  Flex,
  Box,
  Button,
  Paper,
  Modal,
  TextInput,
  Select,
  Group,
  ActionIcon,
  Badge,
  Table,
  Rating,
  Grid,
} from "@mantine/core";
import {
  IconFileText,
  IconExternalLink,
  IconDownload,
  IconEdit,
  IconPlus,
  IconX,
  IconHeart,
  IconHeartPlus,
  IconUsers,
  IconClock,
  IconStar,
} from "@tabler/icons-react";

import { Game, Session, File as GameFile } from "../interfaces";
import { BASE_URL } from "../config";
import { useAuth } from "../contexts/AuthContext";
import { apiRequest } from "../utils/api";

type GameDetails = Game & {
  sessions?: Session[];
  files?: File[];
};

export default function GameDetailsPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Color palette from MyGames page
  const brandColors = {
    beige: "#e0d9c4",
    lightBrown: "#c5b79d",
    mutedGreen: "#8c947d",
    darkBrown: "#635841",
    accent: "#a87e5b",
  };

  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addSessionModalOpen, setAddSessionModalOpen] = useState(false);
  const [editSessionModalOpen, setEditSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sessionDate, setSessionDate] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [existingPlayers, setExistingPlayers] = useState<string[]>([]);
  const [selectedExistingPlayer, setSelectedExistingPlayer] = useState<string | null>(null);
  const [files, setFiles] = useState<GameFile[]>([]);
  const [addFileModalOpen, setAddFileModalOpen] = useState(false);
  const [fileTitle, setFileTitle] = useState("");
  const [fileLink, setFileLink] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (!gameId) return;
    setLoading(true);

    axios
      .get(`${BASE_URL}/api/games/${gameId}`)
      .then((res) => {
        const safeGame: GameDetails = {
          id: res.data?.id || "",
          coverImage: res.data?.coverImage || "",
          title: res.data?.title || "Unknown Game",
          genre: res.data?.genre || "Unknown",
          minPlayers: res.data?.minPlayers ?? 1,
          maxPlayers: res.data?.maxPlayers ?? 1,
          playTime: res.data?.playTime ?? 0,
          publisher: res.data?.publisher || "Unknown Publisher",
          age: res.data?.age || "Unknown",
          rating: res.data?.rating ?? 0,
          myRating: res.data?.myRating ?? undefined,
          description: res.data?.description || "No description available.",
          isOwned: res.data?.isOwned ?? false,
          tags: res.data?.tags || [],
          sessions: res.data?.sessions || [],
          createdAt: res.data?.createdAt || new Date().toISOString(),
        };
        setGame(safeGame);
        fetchSessions(gameId);
        fetchFiles(gameId);
        fetchAllPlayers();
        checkWishlistStatus(gameId);
      })
      .catch((err) => {
        console.error("Error fetching game:", err);
        setError("Failed to load game details");
      })
      .finally(() => setLoading(false));
  }, [gameId]);

  // Fetch sessions
  const fetchSessions = async (gameId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/games/${gameId}/sessions`);
      setGame(prev => prev ? { ...prev, sessions: response.data } : null);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  // Fetch files
  const fetchFiles = async (gameId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/games/${gameId}/files`);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // Fetch all players
  const fetchAllPlayers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/players`);
      setExistingPlayers(response.data.map((p: any) => p.name));
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  // Session handlers
  const handleAddSession = async () => {
    if (!gameId || !sessionDate.trim()) return;

    try {
      const players = selectedPlayers.map(name => ({ name }));
      if (selectedExistingPlayer) {
        players.push({ name: selectedExistingPlayer });
      }

      const response = await apiRequest(`/api/games/${gameId}/sessions/`, {
        method: "POST",
        body: JSON.stringify({
          date: sessionDate,
          notes: sessionNotes,
          players,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add session");
      }

      await fetchSessions(gameId);
      resetSessionForm();
    } catch (error) {
      console.error("Failed to add session:", error);
    }
  };

  const handleEditSession = async () => {
    if (!editingSession || !gameId) return;

    try {
      const players = selectedPlayers.map(name => ({ name }));
      if (selectedExistingPlayer) {
        players.push({ name: selectedExistingPlayer });
      }

      const response = await apiRequest(`/api/sessions/${editingSession.id}`, {
        method: "PUT",
        body: JSON.stringify({
          date: sessionDate,
          notes: sessionNotes,
          players,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to edit session");
      }

      await fetchSessions(gameId);
      resetSessionForm();
    } catch (error) {
      console.error("Failed to edit session:", error);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!gameId) return;

    try {
      const response = await apiRequest(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete session");
      }
      await fetchSessions(gameId);
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const openEditSession = (session: Session) => {
    setEditingSession(session);
    // Format the date properly for the input field
    // Backend sends dates as strings, so we need to handle that
    const dateValue = session.date as any; // Type assertion to handle backend data
    let formattedDate = "";
    
    if (typeof dateValue === 'string') {
      formattedDate = dateValue.split('T')[0];
    } else if (dateValue instanceof Date) {
      formattedDate = dateValue.toISOString().split('T')[0];
    }
    
    setSessionDate(formattedDate);
    setSessionNotes(session.notes || "");
    setSelectedPlayers(session.players?.map(p => p.name) || []);
    setEditSessionModalOpen(true);
  };

  const resetSessionForm = () => {
    setSessionDate("");
    setSessionNotes("");
    setSelectedPlayers([]);
    setNewPlayerName("");
    setSelectedExistingPlayer(null);
    setAddSessionModalOpen(false);
    setEditSessionModalOpen(false);
    setEditingSession(null);
  };

  const addNewPlayerToSession = () => {
    if (newPlayerName.trim() && !selectedPlayers.includes(newPlayerName.trim())) {
      setSelectedPlayers([...selectedPlayers, newPlayerName.trim()]);
      setNewPlayerName("");
    }
  };

  const addExistingPlayerToSession = () => {
    if (selectedExistingPlayer && !selectedPlayers.includes(selectedExistingPlayer)) {
      setSelectedPlayers([...selectedPlayers, selectedExistingPlayer]);
      setSelectedExistingPlayer(null);
    }
  };

  // File handlers
  const handleAddFile = async () => {
    if (!gameId || !fileTitle.trim() || !fileLink) return;

    try {
      const response = await apiRequest(`/api/games/${gameId}/files`, {
        method: "POST",
        body: JSON.stringify({
          title: fileTitle,
          link: fileLink,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add file");
      }

      await fetchFiles(gameId);
      resetFileForm();
    } catch (error) {
      console.error("Failed to add file:", error);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!gameId) return;

    try {
      const response = await apiRequest(`/api/files/${fileId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete file");
      }
      await fetchFiles(gameId);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  const resetFileForm = () => {
    setFileTitle("");
    setFileLink("");
    setAddFileModalOpen(false);
  };

  // Helper functions
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext === 'pdf' ? <IconFileText size={20} /> : <IconExternalLink size={20} />;
  };

  const getFileTypeLabel = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext ? ext.toUpperCase() : 'File';
  };

  const handleFileOpen = (file: GameFile) => {
    window.open(file.link, '_blank');
  };

  const handleFileDownload = (file: GameFile) => {
    const link = document.createElement('a');
    link.href = file.link;
    link.download = file.title;
    link.click();
  };

  const checkWishlistStatus = async (gameId: string) => {
    try {
      // Option 1: Check if the game is in the user's wishlist by fetching all wishlist games
      const response = await axios.get(`${BASE_URL}/api/games/wishlist`);
      const wishlistGames = response.data;
      const isInWishlist = wishlistGames.some((wishlistGame: Game) => wishlistGame.id === gameId);
      setIsInWishlist(isInWishlist);

      // Option 2: Also store in localStorage as backup
      localStorage.setItem(`wishlist_${gameId}`, isInWishlist.toString());
    } catch (error) {
      console.error('Failed to check wishlist status from API:', error);

      // Fallback to localStorage if API fails
      const storedStatus = localStorage.getItem(`wishlist_${gameId}`);
      if (storedStatus !== null) {
        setIsInWishlist(storedStatus === 'true');
      } else {
        setIsInWishlist(false);
      }
    }
  };

  const handleWishlistToggle = async () => {
    if (!game || !gameId) return;

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await apiRequest(`/api/games/${gameId}/removeWishlist`, {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Failed to remove from wishlist");
        }
        setIsInWishlist(false);
        localStorage.setItem(`wishlist_${gameId}`, 'false');
        console.log('Removed from wishlist:', game.title);
      } else {
        // Add to wishlist
        const response = await apiRequest(`/api/games/${gameId}/addWishlist`, {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Failed to add to wishlist");
        }
        setIsInWishlist(true);
        localStorage.setItem(`wishlist_${gameId}`, 'true');
        console.log('Added to wishlist:', game.title);
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
      // Revert the state change if the API call fails
      setIsInWishlist(!isInWishlist);
      // You could add a toast notification here to inform the user of the error
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <Center style={{ minHeight: '60vh' }}>
        <Stack align="center" gap="md">
          <Loader size="xl" color="blue" />
          <Text c="dimmed" size="lg">Loading game details...</Text>
        </Stack>
      </Center>
    );
  }

  if (error || !game) {
    return (
      <Center style={{ minHeight: '60vh' }}>
        <Stack align="center" gap="md">
          <Text c="red" size="xl" fw={600}>Error</Text>
          <Text c="dimmed">{error || "Game not found"}</Text>
          <Button variant="light" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Stack>
      </Center>
    );
  }

  return (
    <Box bg={brandColors.beige} mih="100vh">
      <Container size="lg" py="lg">
        <Stack gap="lg">
          {/* Top Info Card */}
          <Paper shadow="sm" p="xl" radius="md" withBorder style={{ borderColor: brandColors.lightBrown, backgroundColor: '#f0f0eb' }}>
            <Grid gutter="xl">
              {/* Left Column: Image and Status */}
              <Grid.Col span={4}>
                <Stack gap="lg">
                  {/* Game Cover Image */}
                  {game.coverImage && (
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      style={{
                        width: "100%",
                        borderRadius: 16,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                      }}
                    />
                  )}

                  {/* Status Badge */}
                  <Box>
                    <Text
                      size="md"
                      c="white"
                      fw={600}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#B07770',
                        borderRadius: '20px',
                        display: 'inline-block',
                        textAlign: 'center',
                        width: '100%'
                      }}
                    >
                      {game.isOwned ? "On the shelf" : "Not Owned"}
                    </Text>
                  </Box>
                </Stack>
              </Grid.Col>

              {/* Right Column: Game Info */}
              <Grid.Col span={8}>
                <Stack gap="lg">
                  {/* Header: Rating, Title, Edit Button */}
                  <Flex justify="space-between" align="flex-start">
                    <Flex align="center" gap="lg">
                      {/* Rating Badge */}
                      <Box
                        style={{
                          backgroundColor: '#AAC27A',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: `2px solid #AAC27A`,
                          minWidth: '70px',
                          textAlign: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        <Text fw={700} size="xl" c="white">
                          {game.rating.toFixed(1)}
                        </Text>
                      </Box>

                      {/* Game Title */}
                      <Title order={1} size="2.5rem" c={brandColors.darkBrown} style={{ fontFamily: 'Inter, sans-serif' }}>
                        {game.title}
                      </Title>
                    </Flex>

                    {/* Edit Button */}
                    {isAuthenticated && (
                      <Button
                        variant="light"
                        size="md"
                        style={{
                          backgroundColor: isInWishlist ? brandColors.accent : brandColors.beige,
                          borderColor: brandColors.lightBrown,
                          color: isInWishlist ? 'white' : brandColors.darkBrown,
                          fontWeight: 600,
                          padding: '12px 24px'
                        }}
                        leftSection={<IconEdit size={18} />}
                        onClick={() => navigate(`/edit/${game.id}`)}
                      >
                        Edit Game
                      </Button>
                    )}
                  </Flex>

                  {/* Game Stats Grid */}
                  <Box style={{ marginTop: '1rem' }}>
                    <Grid gutter="xl">
                      <Grid.Col span={4}>
                        <Box style={{ padding: '16px', backgroundColor: brandColors.beige, borderRadius: '8px', border: `1px solid ${brandColors.lightBrown}` }}>
                          <Flex align="center" justify="center" gap="xs" mb="xs">
                            <IconUsers size={18} color="#B07770" />
                            <Text fw={600} size="sm" c={brandColors.darkBrown} style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Players
                            </Text>
                          </Flex>
                          <Text size="lg" fw={700} c={brandColors.darkBrown} style={{ textAlign: 'center' }}>
                            {game.minPlayers}–{game.maxPlayers}
                          </Text>
                        </Box>
                      </Grid.Col>

                      <Grid.Col span={4}>
                        <Box style={{ padding: '16px', backgroundColor: brandColors.beige, borderRadius: '8px', border: `1px solid ${brandColors.lightBrown}` }}>
                          <Flex align="center" justify="center" gap="xs" mb="xs">
                            <IconClock size={18} color="#B07770" />
                            <Text fw={600} size="sm" c={brandColors.darkBrown} style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Play Time
                            </Text>
                          </Flex>
                          <Text size="lg" fw={700} c={brandColors.darkBrown} style={{ textAlign: 'center' }}>
                            {game.playTime} min
                          </Text>
                        </Box>
                      </Grid.Col>

                      <Grid.Col span={4}>
                        <Box style={{ padding: '16px', backgroundColor: brandColors.beige, borderRadius: '8px', border: `1px solid ${brandColors.lightBrown}` }}>
                          <Flex align="center" justify="center" gap="xs" mb="xs">
                            <IconStar size={18} color="#B07770" />
                            <Text fw={600} size="sm" c={brandColors.darkBrown} style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Age
                            </Text>
                          </Flex>
                          <Text size="lg" fw={700} c={brandColors.darkBrown} style={{ textAlign: 'center' }}>
                            {game.age}
                          </Text>
                        </Box>
                      </Grid.Col>
                    </Grid>
                  </Box>

                  {/* Additional Info - Label and value on same line, left aligned */}
                  <Box>
                    <Text fw={600} size="md" c={brandColors.darkBrown} style={{ textAlign: 'left' }}>
                      Genre: {game.genre}
                    </Text>
                  </Box>

                  <Box>
                    <Text fw={600} size="md" c={brandColors.darkBrown} style={{ textAlign: 'left' }}>
                      Publisher: {game.publisher}
                    </Text>
                  </Box>

                  {/* My Rating */}
                  <Box>
                    <Flex align="center" gap="xs">
                      <Text fw={600} size="md" c={brandColors.darkBrown} style={{ textAlign: 'left' }}>
                        My Rating:
                      </Text>
                      {typeof game.myRating === "number" && game.myRating > 0 ? (
                        <Rating
                          value={game.myRating}
                          readOnly
                          size="sm"
                          color={brandColors.accent}
                        />
                      ) : (
                        <Text size="md" c="dimmed" fw={500}>No rating yet</Text>
                      )}
                    </Flex>
                  </Box>

                  {/* Tags */}
                  {game.tags && game.tags.length > 0 && (
                    <Box>
                      <Flex gap="sm" wrap="wrap">
                        {game.tags.map((tag) => (
                          <Box
                            key={tag.id}
                            style={{
                              backgroundColor: '#99B5A3',
                              padding: "6px 12px",
                              borderRadius: "20px",
                              border: `1px solid #99B5A3`,
                            }}
                          >
                            <Text size="sm" fw={600} c="white">
                              {tag.title}
                            </Text>
                          </Box>
                        ))}
                      </Flex>
                    </Box>
                  )}

                  {/* Wishlist Button */}
                  {!game.isOwned && isAuthenticated && (
                    <Box mt="auto" style={{ alignSelf: 'flex-end' }}>
                      <Button
                        variant="light"
                        size="md"
                        onClick={handleWishlistToggle}
                        style={{
                          backgroundColor: isInWishlist ? brandColors.accent : brandColors.beige,
                          borderColor: brandColors.lightBrown,
                          color: isInWishlist ? 'white' : brandColors.darkBrown,
                          fontWeight: 600,
                          padding: '12px 24px'
                        }}
                        leftSection={isInWishlist ? <IconHeart size={18} /> : <IconHeartPlus size={18} />}
                      >
                        {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                      </Button>
                    </Box>
                  )}
                </Stack>
              </Grid.Col>
            </Grid>
          </Paper>

          {/* Description Card */}
          <Paper shadow="sm" p="xl" radius="md" withBorder style={{ borderColor: brandColors.lightBrown, backgroundColor: '#f0f0eb' }}>
            <Stack>
              {game.description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: game.description }}
                  style={{
                    lineHeight: '1.6',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <Text c="dimmed">No description available.</Text>
              )}
            </Stack>
          </Paper>

          {/* Files Section */}
          <Paper shadow="sm" p="lg" radius="md" withBorder style={{ borderColor: brandColors.lightBrown, backgroundColor: '#f0f0eb' }}>
            <Flex justify="space-between" align="center" mb="sm">
              <Title order={3} c={brandColors.darkBrown} style={{ fontFamily: 'Inter, sans-serif' }}>Files</Title>
              {isAuthenticated && (
                <Button
                  variant="light"
                  size="sm"
                  style={{
                    backgroundColor: brandColors.accent,
                    borderColor: brandColors.lightBrown,
                    color: 'white',
                    fontWeight: 600,
                    padding: '8px 16px'
                  }}
                  leftSection={<IconPlus size={16} />}
                  onClick={() => setAddFileModalOpen(true)}
                >
                  Add File
                </Button>
              )}
            </Flex>

            {files && files.length > 0 ? (
              <Stack gap="md">
                {files.map((file) => (
                  <Paper key={file.id} shadow="xs" p="md" radius="md" withBorder>
                    <Flex justify="space-between" align="center">
                      <Group gap="md">
                        {getFileIcon(file.title)}
                        <Stack gap={4}>
                          <Text fw={500}>{file.title}</Text>
                          <Badge variant="light" size="xs" color="gray">
                            {getFileTypeLabel(file.title)}
                          </Badge>
                        </Stack>
                      </Group>
                      <Group gap="xs">
                        <Button
                          variant="light"
                          size="sm"
                          style={{
                            backgroundColor: brandColors.beige,
                            borderColor: brandColors.lightBrown,
                            color: brandColors.darkBrown,
                            fontWeight: 600
                          }}
                          leftSection={<IconExternalLink size={16} />}
                          onClick={() => handleFileOpen(file)}
                        >
                          Open
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          style={{
                            backgroundColor: brandColors.beige,
                            borderColor: brandColors.lightBrown,
                            color: brandColors.darkBrown,
                            fontWeight: 600
                          }}
                          leftSection={<IconDownload size={16} />}
                          onClick={() => handleFileDownload(file)}
                        >
                          Download
                        </Button>

                        {isAuthenticated && (
                          <ActionIcon
                            color="red"
                            variant="light"
                            size="sm"
                            onClick={() => handleDeleteFile(file.id)}
                            title="Delete file"
                          >
                            <IconX size={14} />
                          </ActionIcon>
                        )}
                      </Group>
                    </Flex>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                No files yet for this game.
              </Text>
            )}
          </Paper>

          {/* Sessions Section */}
          <Paper shadow="sm" p="lg" radius="md" withBorder style={{ borderColor: brandColors.lightBrown, backgroundColor: '#f0f0eb' }}>
            <Flex justify="space-between" align="center" mb="md">
              <Title order={3} c={brandColors.darkBrown} style={{ fontFamily: 'Inter, sans-serif' }}>
                Game Sessions
              </Title>
              {isAuthenticated && (
                <Button
                  variant="filled"
                  size="sm"
                  style={{
                    backgroundColor: brandColors.accent,
                    borderColor: brandColors.lightBrown,
                    color: 'white',
                    fontWeight: 600,
                    padding: '8px 16px'
                  }}
                  leftSection={<IconPlus size={16} />}
                  onClick={() => setAddSessionModalOpen(true)}
                >
                  Add session
                </Button>
              )}
            </Flex>

            {game.sessions && game.sessions.length > 0 ? (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Players</Table.Th>
                    <Table.Th>Notes</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {game.sessions.map((session) => (
                    <Table.Tr key={session.id}>
                      <Table.Td style={{ textAlign: 'left' }}>
                        {new Date(session.date).toLocaleDateString()}
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'left' }}>
                        {session.players && session.players.length > 0
                          ? session.players.map((p) => p.name).join(", ")
                          : "No players"}
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'left' }}>
                        {session.notes || "No notes"}
                      </Table.Td>
                      <Table.Td>
                        {isAuthenticated && (
                          <Group gap="xs">
                            <ActionIcon
                              variant="filled"
                              size="sm"
                              style={{
                                backgroundColor: brandColors.accent,
                                color: 'white',
                                borderColor: brandColors.lightBrown
                              }}
                              onClick={() => openEditSession(session)}
                              title="Edit session"
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                            <ActionIcon
                              variant="filled"
                              size="sm"
                              style={{
                                backgroundColor: '#B07770',
                                color: 'white',
                                borderColor: '#B07770'
                              }}
                              onClick={() => handleDeleteSession(session.id)}
                              title="Delete session"
                            >
                              <IconX size={16} />
                            </ActionIcon>
                          </Group>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                No sessions yet for this game.
              </Text>
            )}
          </Paper>
        </Stack>

        {/* Add Session Modal */}
        <Modal
          opened={addSessionModalOpen}
          onClose={resetSessionForm}
          title="Add a new session"
          size="md"
          styles={{
            title: { color: brandColors.darkBrown, fontWeight: 600, fontFamily: 'Inter, sans-serif' },
            header: { borderBottom: `2px solid ${brandColors.lightBrown}`, backgroundColor: brandColors.beige },
            body: { backgroundColor: '#f0f0eb' }
          }}
        >
          <Stack gap="md">
            {/* Date Input */}
            <TextInput
              label="Date"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.currentTarget.value)}
              required
              styles={{
                input: { borderColor: 'green' }
              }}
            />

            {/* Player Selection */}
            <Group gap="xs" align="flex-end">
              <Select
                label="Player"
                placeholder="Select existing player"
                value={selectedExistingPlayer}
                data={existingPlayers}
                onChange={setSelectedExistingPlayer}
                styles={{
                  input: { borderColor: 'green' }
                }}
                style={{ flex: 1 }}
                clearable
              />
              <ActionIcon
                color="blue"
                variant="filled"
                size="md"
                onClick={addExistingPlayerToSession}
                title="Add existing player"
                disabled={!selectedExistingPlayer}
              >
                <IconPlus size={16} />
              </ActionIcon>
            </Group>

            {/* New Player Input */}
            <Group gap="xs" align="flex-end">
              <TextInput
                label="New Player"
                placeholder="Enter new player name"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.currentTarget.value)}
                style={{ flex: 1 }}
                styles={{
                  input: { borderColor: 'green' }
                }}
              />
              <ActionIcon
                color="green"
                variant="filled"
                size="md"
                onClick={addNewPlayerToSession}
                title="Add new player"
                disabled={!newPlayerName.trim()}
              >
                <IconPlus size={16} />
              </ActionIcon>
            </Group>

            {/* Selected Players Display */}
            {selectedPlayers.length > 0 && (
              <Box>
                <Text size="sm" fw={500} mb="xs">Selected Players:</Text>
                <Flex gap="xs" wrap="wrap">
                  {selectedPlayers.map((player, index) => (
                    <Badge
                      key={index}
                      variant="light"
                      color="blue"
                      rightSection={
                        <ActionIcon
                          size="xs"
                          variant="transparent"
                          color="blue"
                          onClick={() => setSelectedPlayers(selectedPlayers.filter((_, i) => i !== index))}
                        >
                          <IconX size={10} />
                        </ActionIcon>
                      }
                    >
                      {player}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            )}

            {/* Notes Input */}
            <TextInput
              label="Notes"
              placeholder="Add session notes..."
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.currentTarget.value)}
              styles={{
                input: { borderColor: 'green' }
              }}
            />

            {/* Action Buttons */}
            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                style={{
                  backgroundColor: brandColors.beige,
                  borderColor: brandColors.lightBrown,
                  color: brandColors.darkBrown,
                  fontWeight: 600
                }}
                onClick={resetSessionForm}
              >
                Cancel
              </Button>
              <Button
                style={{
                  backgroundColor: brandColors.accent,
                  borderColor: brandColors.lightBrown,
                  color: 'white',
                  fontWeight: 600
                }}
                onClick={handleAddSession}
                disabled={!sessionDate.trim()}
              >
                Add Session
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Edit Session Modal */}
        <Modal
          opened={editSessionModalOpen}
          onClose={resetSessionForm}
          title="Edit session"
          size="md"
          styles={{
            title: { color: brandColors.darkBrown, fontWeight: 600, fontFamily: 'Inter, sans-serif' },
            header: { borderBottom: `2px solid ${brandColors.lightBrown}`, backgroundColor: brandColors.beige },
            body: { backgroundColor: '#f0f0eb' }
          }}
        >
          <Stack gap="md">
            {/* Date Input */}
            <TextInput
              label="Date"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.currentTarget.value)}
              required
              styles={{
                input: { borderColor: 'green' }
              }}
            />

            {/* Player Selection */}
            <Group gap="xs" align="flex-end">
              <Select
                label="Player"
                placeholder="Select existing player"
                value={selectedExistingPlayer}
                data={existingPlayers}
                onChange={setSelectedExistingPlayer}
                styles={{
                  input: { borderColor: 'green' }
                }}
                style={{ flex: 1 }}
                clearable
              />
              <ActionIcon
                color="blue"
                variant="filled"
                size="md"
                onClick={addExistingPlayerToSession}
                title="Add existing player"
                disabled={!selectedExistingPlayer}
              >
                <IconPlus size={16} />
              </ActionIcon>
            </Group>

            {/* New Player Input */}
            <Group gap="xs" align="flex-end">
              <TextInput
                label="New Player"
                placeholder="Enter new player name"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.currentTarget.value)}
                style={{ flex: 1 }}
                styles={{
                  input: { borderColor: 'green' }
                }}
              />
              <ActionIcon
                color="green"
                variant="filled"
                size="md"
                onClick={addNewPlayerToSession}
                title="Add new player"
                disabled={!newPlayerName.trim()}
              >
                <IconPlus size={16} />
              </ActionIcon>
            </Group>

            {/* Selected Players Display */}
            {selectedPlayers.length > 0 && (
              <Box>
                <Text size="sm" fw={500} mb="xs">Selected Players:</Text>
                <Flex gap="xs" wrap="wrap">
                  {selectedPlayers.map((player, index) => (
                    <Badge
                      key={index}
                      variant="light"
                      color="blue"
                      rightSection={
                        <ActionIcon
                          size="xs"
                          variant="transparent"
                          color="blue"
                          onClick={() => setSelectedPlayers(selectedPlayers.filter((_, i) => i !== index))}
                        >
                          <IconX size={10} />
                        </ActionIcon>
                      }
                    >
                      {player}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            )}

            {/* Notes Input */}
            <TextInput
              label="Notes"
              placeholder="Add session notes..."
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.currentTarget.value)}
              styles={{
                input: { borderColor: 'green' }
              }}
            />

            {/* Action Buttons */}
            <Group justify="flex-end" mt="md">
              <Button variant="light" color="gray" onClick={resetSessionForm}>
                Cancel
              </Button>
              <Button color="blue" onClick={handleEditSession} disabled={!sessionDate.trim()}>
                Update Session
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Add File Modal */}
        <Modal
          opened={addFileModalOpen}
          onClose={resetFileForm}
          title="Add a new file"
          size="md"
          styles={{
            title: { color: brandColors.accent, fontWeight: 600 },
            header: { borderBottom: `2px solid ${brandColors.accent}` }
          }}
        >
          <Stack gap="md">
            {/* File Title Input */}
            <TextInput
              label="File Title"
              placeholder="Enter file title..."
              value={fileTitle}
              onChange={(e) => setFileTitle(e.currentTarget.value)}
              required
              styles={{
                input: { borderColor: brandColors.accent }
              }}
            />

            {/* File Link Input */}
            <TextInput
              label="File Link"
              placeholder="Enter the URL to your file (e.g., Google Drive, Dropbox, etc.)"
              value={fileLink}
              onChange={(e) => setFileLink(e.currentTarget.value)}
              required
              leftSection={<IconExternalLink size={16} />}
              styles={{
                input: { borderColor: brandColors.accent }
              }}
            />

            {/* Action Buttons */}
            <Group justify="flex-end" mt="md">
              <Button variant="light" color="gray" onClick={resetFileForm}>
                Cancel
              </Button>
              <Button
                variant="light"
                style={{
                  backgroundColor: brandColors.accent,
                  color: 'white',
                  borderColor: brandColors.accent
                }}
                onClick={handleAddFile}
                disabled={!fileTitle.trim() || !fileLink.trim()}
              >
                Add File
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </Box>
  );
}
