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
} from "@mantine/core";
import {
  IconUsers,
  IconClock,
  IconX,
  IconEdit,
} from "@tabler/icons-react";
import { Game, Tag } from "../interfaces";

interface GameCardProps {
  game: Game;
  onClick: (gameId: string) => void;
  onDelete: (gameId: string) => void;
  onEdit?: (gameId: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onClick, onDelete, onEdit }) => {
  const formatPlayerCount = (min: number, max: number): string => {
    return min === max
      ? `${min} Player${min > 1 ? "s" : ""}`
      : `${min}–${max} Players`;
  };

  const safeGame = {
    id: game?.id || "",
    title: game?.title || "Unknown Game",
    rating: game?.rating || 0,
    minPlayers: game?.minPlayers || 1,
    maxPlayers: game?.maxPlayers || 1,
    playTime: game?.playTime || 0,
    age: game?.age || "Unknown",
    genre: game?.genre || "Unknown",
    publisher: game?.publisher || "Unknown",
    coverImage: game?.coverImage || "",
    myRating: game?.myRating,
    sessions: game?.sessions || [],
    tags: game?.tags || [],
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ cursor: "pointer" }}
      onClick={() => onClick(safeGame.id)}
    >
      <Flex gap="md">
        {/* Game Cover Image */}
        <Box style={{ flexShrink: 0 }}>
          <Image
            src={safeGame.coverImage}
            alt={safeGame.title}
            width={96}
            height={128}
            radius="sm"
            fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgOTYgMTI4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iOTYiIGhlaWdodD0iMTI4IiBmaWxsPSIjRTJFOEYwIi8+CjxwYXRoIGQ9Ik00OCA2NEw2NCA0OEg4MFY4MEg2NEw0OCA2NFoiIGZpbGw9IiM3MTgwOTYiLz4KPHN2Zz4K"
          />
        </Box>

        {/* Game Details */}
        <Stack style={{ flex: 1 }} gap="xs">
          {/* Title and BGG Rating */}
          <Flex justify="space-between" align="center" gap="md">
            {/* Title + Rating */}
            <Flex align="center" gap="sm" style={{ flex: 1 }}>
              <Title order={4} lineClamp={2}>
                {safeGame.title}
              </Title>
              <Badge color="green" variant="filled" size="lg">
                {safeGame.rating.toFixed(1)}
              </Badge>
            </Flex>

            {/* Delete Button */}
            <ActionIcon
              color="red"
              variant="light"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click navigation
                onDelete(safeGame.id); // Call the delete function
              }}
            >
              <IconX style={{ width: rem(20), height: rem(20) }} />
            </ActionIcon>
          </Flex>

          {/* Game Info Icons */}
          <Group gap="lg">
            <Group gap="xs">
              <IconUsers style={{ width: rem(16), height: rem(16) }} />
              <Text size="sm" c="dimmed">
                {formatPlayerCount(safeGame.minPlayers, safeGame.maxPlayers)}
              </Text>
            </Group>
            <Group gap="xs">
              <IconClock style={{ width: rem(16), height: rem(16) }} />
              <Text size="sm" c="dimmed">
                {safeGame.playTime} Min
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              Age: {safeGame.age}
            </Text>
          </Group>

          {/* Genre and Publisher */}
          <Stack gap={4}>
            <Group gap="xs">
              <Text size="sm" fw={500}>
                Genre:
              </Text>
              <Text size="sm" c="dimmed">
                {safeGame.genre}
              </Text>
            </Group>
            <Group gap="xs">
              <Text size="sm" fw={500}>
                Publisher:
              </Text>
              <Text size="sm" c="dimmed">
                {safeGame.publisher}
              </Text>
            </Group>
          </Stack>

          {/* My Rating Stars at Bottom */}
          <Group mt="sm">
            <Text size="sm" fw={500}>
              My Rating:
            </Text>
            {typeof safeGame.myRating === "number" && safeGame.myRating > 0 ? (
              <Rating
                value={safeGame.myRating} 
                fractions={2} 
                readOnly
                size="sm"
              />
            ) : (
              <Text size="sm" c="dimmed">
                Not rated yet
              </Text>
            )}
          </Group>

          {/* Sessions Count */}
          <Group gap="xs">
            <Text size="sm" fw={500}>
              Sessions:
            </Text>
            <Badge variant="light" size="sm">
              {safeGame.sessions.length}
            </Badge>
          </Group>

          {/* Tags */}
          {safeGame.tags && safeGame.tags.length > 0 && (
            <Group gap="xs">
              <Text size="sm" fw={500}>
                Tags:
              </Text>
              <Group gap="xs" wrap="wrap">
                {safeGame.tags.map((tag: Tag, index: number) => (
                  <Badge
                    key={tag.id || index}
                    variant="dot"
                    size="xs"
                    color="blue"
                  >
                    {tag.title}
                  </Badge>
                ))}
              </Group>
            </Group>
          )}

          {/* Edit Button - Bottom Right */}
          {onEdit && (
            <Group justify="flex-end" mt="md">
              <ActionIcon
                color="blue"
                variant="light"
                size="md"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click navigation
                  onEdit(safeGame.id); // Call the edit function
                }}
                title="Edit Game"
              >
                <IconEdit style={{ width: rem(18), height: rem(18) }} />
              </ActionIcon>
            </Group>
          )}
        </Stack>
      </Flex>
    </Card>
  );
};