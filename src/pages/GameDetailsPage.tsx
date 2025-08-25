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
  Divider,
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
  FileInput,
  Alert,
} from "@mantine/core";
import {
  IconFileText,
  IconExternalLink,
  IconDownload,
  IconEdit,
  IconPlus,
  IconX,
  IconUpload,
  IconPhoto,
  IconInfoCircle,
} from "@tabler/icons-react";

import { Game, Session, File as GameFile } from "../interfaces";
import { BASE_URL, CLOUDINARY_URL, CLOUDINARY_UPLOAD_PRESET } from "../config";

type GameDetails = Game & {
  sessions?: Session[];
  files?: File[];
};

const InfoItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <Box style={{ minWidth: 120, marginRight: 24 }}>
    <Text fw={500}>{label}:</Text>
    <Text>{value}</Text>
  </Box>
);

export default function GameDetailsPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");


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
          sessions: res.data?.sessions || [],
          files: res.data?.files || [],
          isOwned: res.data?.isOwned || false,
          createdAt: res.data?.createdAt || new Date(),
          updatedAt: res.data?.updatedAt,
          tags: res.data?.tags || [],
        };

        setGame(safeGame);
      })
      .catch(() => setError("Failed to load game details"))
      .finally(() => setLoading(false));

    // Fetch sessions, files, and all players separately
    if (gameId) {
      fetchSessions(gameId);
      fetchFiles(gameId);
      fetchAllPlayers();
    }
  }, [gameId]);

  const fetchSessions = async (gameId: string) => {
    try {
      const sessionsResponse = await axios.get(`${BASE_URL}/api/games/${gameId}/sessions`);
      setGame(prevGame => {
        if (prevGame) {
          return {
            ...prevGame,
            sessions: sessionsResponse.data
          };
        }
        return prevGame;
      });
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      // Keep existing sessions if fetch fails
    }
  };

  const fetchFiles = async (gameId: string) => {
    try {
      const filesResponse = await axios.get(`${BASE_URL}/api/games/${gameId}/files`);
      setFiles(filesResponse.data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
      setFiles([]);
    }
  };

  const fetchAllPlayers = async () => {
    try {
      const playersResponse = await axios.get(`${BASE_URL}/api/players`);
      console.log("Fetched players:", playersResponse.data);
      const playerNames = playersResponse.data.map((player: any) => player.name);
      console.log("Player names:", playerNames);
      setExistingPlayers(playerNames);
    } catch (error) {
      console.error("Failed to fetch players:", error);
      setExistingPlayers([]);
    }
  };

  const addPlayerToSession = () => {
    if (newPlayerName.trim()) {
      if (!selectedPlayers.includes(newPlayerName.trim())) {
        setSelectedPlayers([...selectedPlayers, newPlayerName.trim()]);
        setNewPlayerName("");
      }
    }
  };

  const addExistingPlayerToSession = () => {
    if (selectedExistingPlayer && !selectedPlayers.includes(selectedExistingPlayer)) {
      setSelectedPlayers([...selectedPlayers, selectedExistingPlayer]);
      setSelectedExistingPlayer(null);
    }
  };

  const removePlayerFromSession = (playerName: string) => {
    setSelectedPlayers(selectedPlayers.filter(p => p !== playerName));
  };

  const handleAddSession = async () => {
    if (!sessionDate || selectedPlayers.length === 0 || !game || !gameId) {
      alert("Please fill in date and add at least one player");
      return;
    }

    try {
      // First, create or get players
      const playerPromises = selectedPlayers.map(async (playerName) => {
        try {
          // Try to find existing player
          const existingPlayer = await axios.get(`${BASE_URL}/api/players`);
          const player = existingPlayer.data.find((p: any) => p.name === playerName);
          
          if (player) {
            return player.id;
          } else {
            // Create new player
            const newPlayer = await axios.post(`${BASE_URL}/api/players`, { name: playerName });
            return newPlayer.data.id;
          }
        } catch (error) {
          console.error("Error with player:", playerName, error);
          return null;
        }
      });

      const playerIds = (await Promise.all(playerPromises)).filter(id => id !== null);

      // Create session using the correct endpoint
      const sessionData = {
        date: sessionDate,
        notes: sessionNotes,
        playerIds: playerIds
      };

      await axios.post(`${BASE_URL}/api/games/${gameId}/sessions/`, sessionData);
      
      // Refresh sessions from server
      await fetchSessions(gameId);

      // Reset form and close modal
      setSessionDate("");
      setSessionNotes("");
      setSelectedPlayers([]);
      setNewPlayerName("");
      setAddSessionModalOpen(false);
    } catch (error) {
      console.error("Failed to add session:", error);
      alert("Failed to add session. Please try again.");
    }
  };

  const resetSessionForm = () => {
    setSessionDate("");
    setSessionNotes("");
    setSelectedPlayers([]);
    setNewPlayerName("");
    setSelectedExistingPlayer(null);
    setAddSessionModalOpen(false);
  };

  const openEditSession = (session: Session) => {
    setEditingSession(session);
    setSessionDate(new Date(session.date).toISOString().split('T')[0]);
    setSessionNotes(session.notes || "");
    setSelectedPlayers(session.players?.map(p => p.name) || []);
    setEditSessionModalOpen(true);
  };

  const handleEditSession = async () => {
    if (!editingSession || !sessionDate || selectedPlayers.length === 0 || !game || !gameId) {
      alert("Please fill in date and add at least one player");
      return;
    }

    try {
      // First, create or get players
      const playerPromises = selectedPlayers.map(async (playerName) => {
        try {
          // Try to find existing player
          const existingPlayer = await axios.get(`${BASE_URL}/api/players`);
          const player = existingPlayer.data.find((p: any) => p.name === playerName);
          
          if (player) {
            return player.id;
          } else {
            // Create new player
            const newPlayer = await axios.post(`${BASE_URL}/api/players`, { name: playerName });
            return newPlayer.data.id;
          }
        } catch (error) {
          console.error("Error with player:", playerName, error);
          return null;
        }
      });

      const playerIds = (await Promise.all(playerPromises)).filter(id => id !== null);

      // Update session using the correct endpoint
      const sessionData = {
        date: sessionDate,
        notes: sessionNotes,
        playerIds: playerIds
      };

      await axios.put(`${BASE_URL}/api/sessions/${editingSession.id}`, sessionData);
      
      // Refresh sessions from server
      await fetchSessions(gameId);

      // Reset form and close modal
      setEditingSession(null);
      setSessionDate("");
      setSessionNotes("");
      setSelectedPlayers([]);
      setNewPlayerName("");
      setSelectedExistingPlayer(null);
      setEditSessionModalOpen(false);
    } catch (error) {
      console.error("Failed to edit session:", error);
      alert("Failed to edit session");
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!game || !gameId) return;

    if (!confirm("Are you sure you want to delete this session?")) return;

    try {
      // Delete session using the correct endpoint
      await axios.delete(`${BASE_URL}/api/sessions/${sessionId}`);
      
      // Refresh sessions from server
      await fetchSessions(gameId);
    } catch (error) {
      console.error("Failed to delete session:", error);
      alert("Failed to delete session");
    }
  };

  const handleAddFile = async () => {
    if (!fileTitle.trim() || !fileLink.trim() || !gameId) {
      alert("Please fill in both title and link");
      return;
    }

    try {
      const fileData = {
        title: fileTitle.trim(),
        link: fileLink.trim()
      };

      await axios.post(`${BASE_URL}/api/games/${gameId}/files`, fileData);
      
      // Refresh files from server
      await fetchFiles(gameId);
      
      // Reset form and close modal
      setFileTitle("");
      setFileLink("");
      setAddFileModalOpen(false);
    } catch (error) {
      console.error("Failed to add file:", error);
      alert("Failed to add file");
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/files/${fileId}`);
      
      // Refresh files from server
      if (gameId) {
        await fetchFiles(gameId);
      }
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert("Failed to delete file");
    }
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    try {
      // For PDFs, try using the regular image upload but with proper handling
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      
      // Don't specify resource_type - let Cloudinary auto-detect
      // This should make files publicly accessible by default

      console.log('Uploading to:', CLOUDINARY_URL);
      console.log('File type:', file.type);
      console.log('File name:', file.name);
      
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Upload failed:', res.status, errorText);
        throw new Error(`Upload failed: ${res.status}`);
      }

      const data = await res.json();
      console.log('Upload response:', data);
      setFileLink(data.secure_url);
      setUploadedFile(file);
      setUploadError("");
    } catch (error) {
      console.error("File upload error:", error);
      setUploadError("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetFileForm = () => {
    setFileTitle("");
    setFileLink("");
    setUploadedFile(null);
    setUploadError("");
    setAddFileModalOpen(false);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <IconFileText size={20} color="red" />;
      case 'doc':
      case 'docx':
        return <IconFileText size={20} color="blue" />;
      case 'xls':
      case 'xlsx':
        return <IconFileText size={20} color="green" />;
      case 'txt':
        return <IconFileText size={20} color="gray" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <IconPhoto size={20} color="purple" />;
      default:
        return <IconFileText size={20} color="blue" />;
    }
  };

  const getFileTypeLabel = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension ? extension.toUpperCase() : 'FILE';
  };

  const handleFileDownload = (file: GameFile) => {
    // Simple direct download - should work now with regular upload
    console.log('Downloading file:', file.title, 'URL:', file.link);
    
    const link = document.createElement('a');
    link.href = file.link;
    link.download = file.title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileOpen = (file: GameFile) => {
    // Simple open in new tab - should work now with regular upload
    console.log('Opening file:', file.title, 'URL:', file.link);
    window.open(file.link, '_blank');
  };

  if (loading) {
    return (
      <Center h="50vh">
        <Loader />
      </Center>
    );
  }

  if (error || !game) {
    return (
      <Container size="xl" py="xl">
        <Paper shadow="sm" p="xl" radius="md">
          <Stack align="center" gap="md">
            <Text size="lg" c="red">
              {error || "Game not found"}
            </Text>
            <Text
              onClick={() => navigate("/games")}
              style={{ cursor: "pointer", color: "blue" }}
            >
              Back to My Games
            </Text>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack>
        {/* Top Info Card */}
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Flex gap="xl" align="flex-start" wrap="wrap">
            {/* Game Cover */}
            {game.coverImage && (
              <Box style={{ minWidth: 200, maxWidth: 200 }}>
                <img
                  src={game.coverImage}
                  alt={game.title}
                  style={{ width: "100%", borderRadius: 8 }}
                />
              </Box>
            )}

            {/* Info */}
            <Stack style={{ flex: 1 }}>
              <Flex justify="space-between" align="flex-start">
                <Title order={2}>{game.title}</Title>
                <Button
                  variant="light"
                  color="blue"
                  leftSection={<IconEdit size={16} />}
                  onClick={() => navigate(`/edit/${game.id}`)}
                >
                  Edit Game
                </Button>
              </Flex>
              <Divider />
              <Flex wrap="wrap" gap="md">
                <InfoItem label="Rating" value={game.rating.toFixed(1)} />
                <InfoItem label="My Rating" value={game.myRating ?? "N/A"} />
                <InfoItem label="Publisher" value={game.publisher} />
                <InfoItem label="Genre" value={game.genre} />
                <InfoItem
                  label="Players"
                  value={`${game.minPlayers}–${game.maxPlayers}`}
                />
                <InfoItem label="Play Time" value={`${game.playTime} min`} />
                <InfoItem label="Age" value={game.age} />
              </Flex>
            </Stack>
          </Flex>
        </Paper>

        {/* Description Card */}
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Stack>
            <Text fw={500}>Description:</Text>
            <Text>{game.description}</Text>
          </Stack>
        </Paper>

        {/* Tags Card */}
        {game.tags && game.tags.length > 0 && (
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Stack>
              <Text fw={500}>Tags:</Text>
              <Flex gap="xs" wrap="wrap">
                {game.tags.map((tag) => (
                  <Box
                    key={tag.id}
                    style={{
                      backgroundColor: "#f1f3f4",
                      padding: "8px 12px",
                      borderRadius: "16px",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Text size="sm" fw={500} c="dark">
                      {tag.title}
                    </Text>
                  </Box>
                ))}
              </Flex>
            </Stack>
          </Paper>
        )}

        {/* Files Section */}
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Flex justify="space-between" align="center" mb="md">
            <Title order={3}>Files</Title>
            <Button
              variant="light"
              color="green"
              leftSection={<IconPlus size={16} />}
              onClick={() => setAddFileModalOpen(true)}
            >
              Add File
            </Button>
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
                        leftSection={<IconExternalLink size={14} />}
                        onClick={() => handleFileOpen(file)}
                      >
                        Open
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        leftSection={<IconDownload size={14} />}
                        onClick={() => handleFileDownload(file)}
                      >
                        Download
                      </Button>

                      <ActionIcon
                        color="red"
                        variant="light"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id)}
                        title="Delete file"
                      >
                        <IconX size={14} />
                      </ActionIcon>
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
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Flex justify="space-between" align="center" mb="md">
            <Title order={3}>Sessions</Title>
            <Button
              variant="light"
              color="blue"
              leftSection={<IconPlus size={16} />}
              onClick={() => setAddSessionModalOpen(true)}
            >
              Add session
            </Button>
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
                    <Table.Td>
                      {new Date(session.date).toLocaleDateString()}
                    </Table.Td>
                    <Table.Td>
                      {session.players && session.players.length > 0
                        ? session.players.map((p) => p.name).join(", ")
                        : "No players"}
                    </Table.Td>
                    <Table.Td>
                      {session.notes || "No notes"}
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          color="blue"
                          variant="light"
                          size="sm"
                          onClick={() => openEditSession(session)}
                          title="Edit session"
                        >
                          <IconEdit size={14} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          variant="light"
                          size="sm"
                          onClick={() => handleDeleteSession(session.id)}
                          title="Delete session"
                        >
                          <IconX size={14} />
                        </ActionIcon>
                      </Group>
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
          title: { color: 'green', fontWeight: 600 },
          header: { borderBottom: '2px solid green' }
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
          
          <Group gap="xs" align="flex-end">
            <TextInput
              label="New player"
              placeholder="Enter new player name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.currentTarget.value)}
              styles={{
                input: { borderColor: 'green' }
              }}
              style={{ flex: 1 }}
            />
            <ActionIcon
              color="blue"
              variant="filled"
              size="md"
              onClick={addPlayerToSession}
              title="Add new player"
              disabled={!newPlayerName.trim()}
            >
              <IconPlus size={16} />
            </ActionIcon>
          </Group>

          {/* Selected Players Display */}
          {selectedPlayers.length > 0 && (
            <Stack gap="xs">
              <Text size="sm" fw={500}>Selected Players:</Text>
              <Group gap="xs">
                {selectedPlayers.map((player, index) => (
                  <Badge
                    key={index}
                    variant="light"
                    color="pink"
                    rightSection={
                      <ActionIcon
                        size="xs"
                        color="pink"
                        variant="transparent"
                        onClick={() => removePlayerFromSession(player)}
                      >
                        <IconX size={10} />
                      </ActionIcon>
                    }
                  >
                    {player}
                  </Badge>
                ))}
              </Group>
            </Stack>
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
              color="blue"
              onClick={resetSessionForm}
            >
              Cancel
            </Button>
            <Button
              variant="light"
              color="green"
              onClick={handleAddSession}
            >
              Add
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Session Modal */}
      <Modal
        opened={editSessionModalOpen}
        onClose={() => {
          setEditingSession(null);
          setEditSessionModalOpen(false);
          resetSessionForm();
        }}
        title="Edit session"
        size="md"
        styles={{
          title: { color: 'blue', fontWeight: 600 },
          header: { borderBottom: '2px solid blue' }
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
              input: { borderColor: 'blue' }
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
                input: { borderColor: 'blue' }
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
          
          <Group gap="xs" align="flex-end">
            <TextInput
              label="New player"
              placeholder="Enter new player name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.currentTarget.value)}
              styles={{
                input: { borderColor: 'blue' }
              }}
              style={{ flex: 1 }}
            />
            <ActionIcon
              color="blue"
              variant="filled"
              size="md"
              onClick={addPlayerToSession}
              title="Add new player"
              disabled={!newPlayerName.trim()}
            >
              <IconPlus size={16} />
            </ActionIcon>
          </Group>

          {/* Selected Players Display */}
          {selectedPlayers.length > 0 && (
            <Stack gap="xs">
              <Text size="sm" fw={500}>Selected Players:</Text>
              <Group gap="xs">
                {selectedPlayers.map((player, index) => (
                  <Badge
                    key={index}
                    variant="light"
                    color="pink"
                    rightSection={
                      <ActionIcon
                        size="xs"
                        color="pink"
                        variant="transparent"
                        onClick={() => removePlayerFromSession(player)}
                      >
                        <IconX size={10} />
                      </ActionIcon>
                    }
                  >
                    {player}
                  </Badge>
                ))}
              </Group>
            </Stack>
          )}

          {/* Notes Input */}
          <TextInput
            label="Notes"
            placeholder="Add session notes..."
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.currentTarget.value)}
            styles={{
              input: { borderColor: 'blue' }
            }}
          />

          {/* Action Buttons */}
          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              color="gray"
              onClick={() => {
                setEditingSession(null);
                setEditSessionModalOpen(false);
                resetSessionForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="light"
              color="blue"
              onClick={handleEditSession}
            >
              Update
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
          title: { color: 'green', fontWeight: 600 },
          header: { borderBottom: '2px solid green' }
        }}
      >
        <Stack gap="md">
          {/* File Upload Section */}
          <Paper shadow="sm" p="md" radius="md" bg="gray.0">
            <Text fw={500} mb="md">Upload File</Text>
            
            <FileInput
              label="Choose File"
              placeholder="Select a file from your computer"
              accept="*/*"
              onChange={handleFileUpload}
              leftSection={<IconUpload size={16} />}
              size="md"
              disabled={isUploading}
            />

            {isUploading && (
              <Group align="center" gap="xs" mt="sm">
                <Loader size="sm" />
                <Text size="sm" c="dimmed">
                  Uploading file to Cloudinary...
                </Text>
              </Group>
            )}

            {uploadError && (
              <Alert color="red" icon={<IconInfoCircle size={16} />} mt="sm">
                {uploadError}
              </Alert>
            )}

            {uploadedFile && (
              <Alert color="green" icon={<IconPhoto size={16} />} mt="sm">
                <Stack gap="xs">
                  <Text size="sm">✓ File uploaded successfully!</Text>
                  <Text size="xs" c="dimmed">
                    File: {uploadedFile.name} ({getFileTypeLabel(uploadedFile.name)})
                  </Text>
                  <Text size="xs" c="dimmed">
                    Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </Stack>
              </Alert>
            )}
          </Paper>

          {/* File Title Input */}
          <TextInput
            label="File Title"
            placeholder="Enter file title..."
            value={fileTitle}
            onChange={(e) => setFileTitle(e.currentTarget.value)}
            required
            styles={{
              input: { borderColor: 'green' }
            }}
          />

          {/* File Link Display (Auto-filled after upload) */}
          {fileLink && (
            <TextInput
              label="File Link (Auto-generated)"
              value={fileLink}
              readOnly
              styles={{
                input: { borderColor: 'green', backgroundColor: '#f8f9fa' }
              }}
            />
          )}

          {/* Action Buttons */}
          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              color="gray"
              onClick={resetFileForm}
            >
              Cancel
            </Button>
            <Button
              variant="light"
              color="green"
              onClick={handleAddFile}
              disabled={!fileTitle.trim() || !fileLink}
            >
              Add File
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
