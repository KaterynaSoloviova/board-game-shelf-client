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
  isAuthenticated?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onClick,
  onDelete,
  onEdit,
  accentColor = "#a87e5b",
  isAuthenticated = false,
}) => {
  // Color palette from MyGames page
  const brandColors = {
    beige: "#e0d9c4",
    lightBrown: "#c5b79d",
    mutedGreen: "#8c947d",
    darkBrown: "#635841",
    accent: "#a87e5b",
  };
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
    genre: game?.genre || "Unknown",
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
      padding="lg"
      radius="md"
      withBorder
      style={{
        cursor: "pointer",
        transition: "all 0.3s ease",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderColor: brandColors.lightBrown,
        backgroundColor: '#f0f0eb',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 30px rgba(99, 88, 65, 0.15)'
        }
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
            backgroundColor: '#8B9A6A',
            borderRadius: rem(12),
            padding: `8px 12px`,
            border: `2px solid #8B9A6A`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <IconStar size={16} color="white" />
          <Text size="sm" c="white" fw={700}>
            {safeGame.rating.toFixed(1)}
          </Text>
        </Group>
        <Box
          style={{
            position: "absolute",
            bottom: rem(8),
            left: rem(8),
            backgroundColor: '#9A6A63',
            borderRadius: rem(20),
            padding: `4px 12px`,
            border: `1px solid #9A6A63`,
            display: 'inline-block'
          }}
        >
          <Text size="xs" fw={600} c="white">
            {safeGame.isOwned ? "On the shelf" : "Not Owned"}
          </Text>
        </Box>
      </Box>

      <Stack gap="sm" style={{ flexGrow: 1 }}>
        <Title order={4} lineClamp={2} c={brandColors.darkBrown}> {/* Set title color */}
          {safeGame.title}
        </Title>

        <Group gap="sm" wrap="nowrap">
          <Group gap={rem(4)}>
            <IconUsers size={16} stroke={1.5} color={brandColors.darkBrown} />
            <Text size="sm" c={brandColors.darkBrown}>
              {formatPlayerCount(safeGame.minPlayers, safeGame.maxPlayers)}
            </Text>
          </Group>
          <Group gap={rem(4)}>
            <IconClock size={16} stroke={1.5} color={brandColors.darkBrown} />
            <Text size="sm" c={brandColors.darkBrown}>
              {safeGame.playTime} Min
            </Text>
          </Group>
          <Group gap={rem(4)}>
            <IconCalendarEvent size={16} stroke={1.5} color={brandColors.darkBrown} />
            <Text size="sm" c={brandColors.darkBrown}>
              {safeGame.sessions.length} sessions
            </Text>
          </Group>
        </Group>

        <Group gap="xs" wrap="wrap">
          <Badge 
            size="sm"
            style={{
              backgroundColor: '#99B5A3',
              color: 'white',
              border: '1px solid #99B5A3',
              fontSize: '14px',
              padding: '6px 10px',
              lineHeight: '1.2'
            }}
          >
            {safeGame.genre}
          </Badge>
          {safeGame.tags?.slice(0, 3).map((tag: Tag, index: number) => (
            <Badge 
              key={tag.id || index} 
              size="sm"
              style={{
                backgroundColor: '#99B5A3',
                color: 'white',
                border: '1px solid #99B5A3',
                fontSize: '14px',
                padding: '6px 10px',
                lineHeight: '1.2'
              }}
            >
              {tag.title}
            </Badge>
          ))}
          {safeGame.tags.length > 3 && (
            <Badge 
              size="sm"
              style={{
                backgroundColor: '#99B5A3',
                color: 'white',
                border: '1px solid #99B5A3',
                fontSize: '14px',
                padding: '6px 10px',
                lineHeight: '1.2'
              }}
            >
              +{safeGame.tags.length - 3}
            </Badge>
          )}
        </Group>

        <Flex align="center" mt="auto" gap="xs"> {/* Use Flex to align items on one line */}
          <Text size="sm" c={brandColors.darkBrown}> {/* Set My Rating color */}
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
            <Text size="sm" c={brandColors.darkBrown}>
              Not rated yet
            </Text>
          )}
        </Flex>
      </Stack>

      <Flex justify="flex-end" gap="xs" mt="md">
        {onEdit && isAuthenticated && (
          <Tooltip label="Edit Game">
            <ActionIcon 
              variant="filled" 
              size="sm"
              style={{
                backgroundColor: brandColors.accent,
                color: 'white',
                borderColor: brandColors.lightBrown
              }}
              onClick={handleEditClick}
            >
              <IconPencil size={16} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        )}
        {isAuthenticated && (
          <Tooltip label="Delete Game" color="red">
            <ActionIcon 
              variant="filled" 
              size="sm"
              style={{
                backgroundColor: '#B07770',
                color: 'white',
                borderColor: '#B07770'
              }}
              onClick={handleDeleteClick}
            >
              <IconTrash size={16} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        )}
      </Flex>
    </Card>
  );
};