import React from "react";
import {
  Title,
  Text,
  Card,
  Image,
  Group,
  Stack,
  Badge,
  Flex,
  ActionIcon,
  Rating,
  Box,
  rem,
  Tooltip,
} from "@mantine/core";
import {
  IconUsers,
  IconClock,
  IconTrash,
  IconPencil,
  IconStar,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { Game, Tag } from "../interfaces";

interface GameCardProps {
  game: Game;
  onClick: (gameId: string) => void;
  onDelete: (gameId: string) => void;
  onEdit?: (gameId: string) => void;
  accentColor?: string;
  mutedColor?: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onClick,
  onDelete,
  onEdit,
  accentColor = "#a87e5b",
  mutedColor = "#8c947d",
}) => {
  const formatPlayerCount = (min: number, max: number): string => {
    return min === max ? `${min}` : `${min}–${max}`;
  };

  const safeGame = {
    id: game?.id || "",
    title: game?.title || "Unknown Game",
    rating: game?.rating || 0,
    minPlayers: game?.minPlayers || 1,
    maxPlayers: game?.maxPlayers || 1,
    playTime: game?.playTime || 0,
    age: game?.age || "N/A",
    genre: game?.genre || "Unknown",
    publisher: game?.publisher || "Unknown",
    coverImage: game?.coverImage || "",
    myRating: game?.myRating,
    sessions: game?.sessions || [],
    tags: game?.tags || [],
    isOwned: game?.isOwned || false,
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(safeGame.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(safeGame.id);
  };

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      style={{
        cursor: "pointer",
        transition: "transform 150ms ease, box-shadow 150ms ease",
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      sx={{
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "md",
        },
      }}
      onClick={() => onClick(safeGame.id)}
    >
      <Box style={{ position: "relative" }}>
        <Image
          src={safeGame.coverImage}
          alt={safeGame.title}
          height={rem(200)}
          fit="cover"
          radius="md"
          fallbackSrc="https://via.placeholder.com/150"
        />
        <Group
          gap="xs"
          style={{
            position: "absolute",
            top: rem(8),
            right: rem(8),
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: rem(4),
            padding: `2px ${rem(4)}`,
          }}
        >
          <IconStar size={14} color={mutedColor} />
          <Text size="sm" c={mutedColor} fw={500}>
            {safeGame.rating.toFixed(1)}
          </Text>
        </Group>
        {safeGame.isOwned && (
          <Badge
            color="green"
            variant="light"
            style={{ position: "absolute", bottom: rem(8), left: rem(8) }}
          >
            Owned
          </Badge>
        )}
      </Box>

      <Stack gap="sm" style={{ flexGrow: 1 }}>
        <Title order={4} lineClamp={2}>
          {safeGame.title}
        </Title>

        <Group gap="sm">
          <Group gap={rem(4)}>
            <IconUsers size={16} stroke={1.5} color={mutedColor} />
            <Text size="sm" c="dimmed">
              {formatPlayerCount(safeGame.minPlayers, safeGame.maxPlayers)}
            </Text>
          </Group>
          <Group gap={rem(4)}>
            <IconClock size={16} stroke={1.5} color={mutedColor} />
            <Text size="sm" c="dimmed">
              {safeGame.playTime} Min
            </Text>
          </Group>
          <Group gap={rem(4)}>
            <IconCalendarEvent size={16} stroke={1.5} color={mutedColor} />
            <Text size="sm" c="dimmed">
              {safeGame.sessions.length} sessions
            </Text>
          </Group>
        </Group>

        <Group gap="xs" wrap="wrap">
          <Badge color="gray" variant="light" size="sm">
            {safeGame.genre}
          </Badge>
          {safeGame.tags?.slice(0, 3).map((tag: Tag, index: number) => (
            <Badge key={tag.id || index} color="gray" variant="light" size="sm">
              {tag.title}
            </Badge>
          ))}
          {safeGame.tags.length > 3 && (
            <Badge color="gray" variant="light" size="sm">
              +{safeGame.tags.length - 3}
            </Badge>
          )}
        </Group>

        <Box mt="auto">
          <Text size="sm" c="dimmed" mb={rem(4)}>
            My Rating:
          </Text>
          {typeof safeGame.myRating === "number" && safeGame.myRating > 0 ? (
            <Rating
              value={safeGame.myRating}
              fractions={2}
              readOnly
              size="sm"
              color={accentColor}
            />
          ) : (
            <Text size="sm" c="dimmed">
              Not rated yet
            </Text>
          )}
        </Box>
      </Stack>

      <Flex justify="flex-end" gap="xs" mt="md">
        {onEdit && (
          <Tooltip label="Edit Game">
            <ActionIcon variant="subtle" color="gray" onClick={handleEditClick}>
              <IconPencil size={20} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        )}
        <Tooltip label="Delete Game" color="red">
          <ActionIcon variant="subtle" color="red" onClick={handleDeleteClick}>
            <IconTrash size={20} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      </Flex>
    </Card>
  );
};