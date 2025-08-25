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
} from "@mantine/core";
import {
  IconFileText,
  IconExternalLink,
  IconDownload,
} from "@tabler/icons-react";

import { Game, Session, File } from "../interfaces";
import { BASE_URL } from "../config";

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
  }, [gameId]);

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
              <Title order={2}>{game.title}</Title>
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

        {/* Files Section */}
        {game.files && game.files.length > 0 && (
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Stack>
              <Text fw={500}>Files:</Text>
              {game.files.map((file) => (
                <Stack key={file.id}>
                  <Text>
                    <IconFileText size={16} /> {file.title}
                  </Text>
                  <Button
                    component="a"
                    href={file.link}
                    target="_blank"
                    leftIcon={<IconExternalLink size={16} />}
                  >
                    Open
                  </Button>
                  <Button
                    component="a"
                    href={file.link}
                    download
                    leftIcon={<IconDownload size={16} />}
                  >
                    Download
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Paper>
        )}

        {/* Sessions Section */}
        <Stack spacing={6}>
          <Text fw={500}>Sessions:</Text>
          {game.sessions && game.sessions.length > 0 ? (
            game.sessions.map((session) => (
              <Paper key={session.id} shadow="xs" p="md" radius="md" withBorder>
                <Stack spacing={2}>
                  <Text>📅 {new Date(session.date).toLocaleDateString()}</Text>
                  {session.notes && <Text>📝 {session.notes}</Text>}
                  {session.players && session.players.length > 0 && (
                    <Text>
                      👥 Players:{" "}
                      {session.players.map((p) => p.name).join(", ")}
                    </Text>
                  )}
                  <Text size="sm" c="dimmed">
                    Created at: {new Date(session.createdAt).toLocaleString()}
                  </Text>
                </Stack>
              </Paper>
            ))
          ) : (
            <Text c="dimmed">No sessions yet for this game.</Text>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
