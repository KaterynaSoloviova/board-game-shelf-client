import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextInput,
  NumberInput,
  Button,
  Stack,
  MultiSelect,
  Card,
  Title,
  Group,
  Text,
  Divider,
  FileInput,
  Image,
  ActionIcon,
  Tooltip,
  Badge,
  Grid,
  Paper,
  Box,
  Loader,
  Alert,
  Switch,
} from "@mantine/core";
import {
  IconUpload,
  IconPhoto,
  IconTrash,
  IconDeviceGamepad2,
  IconInfoCircle,
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconUsers,
  IconClock,
  IconStar,
  IconTag,
  IconHeart,
  IconHeartFilled,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import { BASE_URL, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_URL } from "../config";
import { useTags } from "../hooks/useTags";

export const AddGame: React.FC = () => {
  const navigate = useNavigate();
  const { tagOptions, loading: tagsLoading, error: tagsError, addNewTag } = useTags();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [minPlayers, setMinPlayers] = useState(1);
  const [maxPlayers, setMaxPlayers] = useState(1);
  const [playTime, setPlayTime] = useState(30);
  const [publisher, setPublisher] = useState("");
  const [age, setAge] = useState("");
  const [rating, setRating] = useState(0);
  const [myRating, setMyRating] = useState<number | undefined>(undefined);
  const [coverImage, setCoverImage] = useState("");
  const [isOwned, setIsOwned] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [newTag, setNewTag] = useState("");
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline,
      Strike
    ],
    content: "<p>Enter your game description here...</p>",
    onUpdate: ({ editor }) => setDescription(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-lg xl:prose-2xl mx-auto focus:outline-none",
        style: "min-height: 120px; padding: 12px;",
      },
    },
  });

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    // Create preview immediately
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(`${CLOUDINARY_URL}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setCoverImage(data.secure_url);
      // Keep the preview until we have the final URL
    } catch (error) {
      setUploadError("Failed to upload image. Please try again.");
      setImagePreview(""); // Clear preview on error
      console.error("Image upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please enter a game title");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/games/`, {
        title,
        description,
        genre,
        minPlayers,
        maxPlayers,
        playTime,
        publisher,
        age,
        rating,
        myRating,
        coverImage,
        isOwned,
        sessions: [],
        tags: tags.map((t) => ({ title: t })),
        createdAt: new Date(),
      });
      navigate("/mygames");
    } catch (error) {
      console.error(error);
      alert("Failed to add game");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddNewTag = () => {
    const normalized = newTag.trim();
    if (!normalized) return;

    addNewTag(normalized);
    if (!tags.includes(normalized)) {
      setTags((curr) => [...curr, normalized]);
    }
    setNewTag("");
  };

  return (
    <Container size="md" py="xl">
      <Card shadow="lg" padding="xl" radius="md">
        {/* Header */}
        <Group align="center" mb="xl">
          <ActionIcon
            size="xl"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
          >
            <IconDeviceGamepad2 size={24} />
          </ActionIcon>
          <div>
            <Title order={2} c="dark">
              Add New Game
            </Title>
            <Text size="sm" c="dimmed">
              Create a new entry for your board game collection
            </Text>
          </div>
        </Group>

        <Divider mb="xl" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Stack gap="lg">
            {/* Basic Information Section */}
            <Paper shadow="sm" p="md" radius="md" bg="gray.0">
              <Group align="center" mb="md">
                <IconInfoCircle size={18} />
                <Text fw={500}>Basic Information</Text>
              </Group>

              <Grid>
                <Grid.Col span={12}>
                  <TextInput
                    label="Game Title"
                    placeholder="Enter the name of your board game"
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                    required
                    size="md"
                    leftSection={<IconDeviceGamepad2 size={16} />}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Genre"
                    placeholder="Strategy, Adventure, Party..."
                    value={genre}
                    onChange={(e) => setGenre(e.currentTarget.value)}
                    size="md"
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Publisher"
                    placeholder="Game publisher"
                    value={publisher}
                    onChange={(e) => setPublisher(e.currentTarget.value)}
                    size="md"
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Game Description */}
            <Paper shadow="sm" p="md" radius="md" bg="gray.0">
              <Text fw={500} mb="md">
                Game Description
              </Text>
              <Card shadow="sm" padding="xs" radius="md" bg="white">
                <Group mb="xs" gap="xs">
                  {/* Text Formatting */}
                  <Tooltip label="Bold">
                    <ActionIcon
                      variant={editor?.isActive("bold") ? "filled" : "light"}
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      size="sm"
                    >
                      <IconBold size={14} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Italic">
                    <ActionIcon
                      variant={editor?.isActive("italic") ? "filled" : "light"}
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      size="sm"
                    >
                      <IconItalic size={14} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Underline">
                    <ActionIcon
                      variant={editor?.isActive("underline") ? "filled" : "light"}
                      onClick={() => editor?.chain().focus().toggleUnderline().run()}
                      size="sm"
                    >
                      <IconUnderline size={14} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Strikethrough">
                    <ActionIcon
                      variant={editor?.isActive("strike") ? "filled" : "light"}
                      onClick={() => editor?.chain().focus().toggleStrike().run()}
                      size="sm"
                    >
                      <IconStrikethrough size={14} />
                    </ActionIcon>
                  </Tooltip>
                  
                  {/* Headings */}
                  <Tooltip label="Heading 1">
                    <ActionIcon
                      variant={editor?.isActive("heading", { level: 1 }) ? "filled" : "light"}
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                      size="sm"
                    >
                      H1
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Heading 2">
                    <ActionIcon
                      variant={editor?.isActive("heading", { level: 2 }) ? "filled" : "light"}
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                      size="sm"
                    >
                      H2
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Heading 3">
                    <ActionIcon
                      variant={editor?.isActive("heading", { level: 3 }) ? "filled" : "light"}
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                      size="sm"
                    >
                      H3
                    </ActionIcon>
                  </Tooltip>
                  
                  {/* Lists */}
                  <Tooltip label="Bullet List">
                    <ActionIcon
                      variant={editor?.isActive("bulletList") ? "filled" : "light"}
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      size="sm"
                    >
                      • List
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Numbered List">
                    <ActionIcon
                      variant={editor?.isActive("orderedList") ? "filled" : "light"}
                      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      size="sm"
                    >
                      1. List
                    </ActionIcon>
                  </Tooltip>
                  
                  {/* Text Alignment */}
                  <Tooltip label="Align Left">
                    <ActionIcon
                      variant={editor?.isActive({ textAlign: 'left' }) ? "filled" : "light"}
                      onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                      size="sm"
                    >
                      <IconAlignLeft size={14} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Align Center">
                    <ActionIcon
                      variant={editor?.isActive({ textAlign: 'center' }) ? "filled" : "light"}
                      onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                      size="sm"
                    >
                      <IconAlignCenter size={14} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Align Right">
                    <ActionIcon
                      variant={editor?.isActive({ textAlign: 'right' }) ? "filled" : "light"}
                      onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                      size="sm"
                    >
                      <IconAlignRight size={14} />
                    </ActionIcon>
                  </Tooltip>
                  
                </Group>
                <Box
                  style={{
                    border: "1px solid #e9ecef",
                    borderRadius: 8,
                    minHeight: 120,
                    backgroundColor: "white",
                  }}
                >
                  <EditorContent editor={editor} />
                </Box>
              </Card>
            </Paper>

            {/* Game Details */}
            <Paper shadow="sm" p="md" radius="md" bg="gray.0">
              <Group align="center" mb="md">
                <IconUsers size={18} />
                <Text fw={500}>Game Details</Text>
              </Group>

              <Grid>
                <Grid.Col span={{ base: 6, sm: 3 }}>
                  <NumberInput
                    label="Min Players"
                    value={minPlayers}
                    onChange={(value) => setMinPlayers(value || 1)}
                    min={1}
                    max={20}
                    size="md"
                    leftSection={<IconUsers size={16} />}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 6, sm: 3 }}>
                  <NumberInput
                    label="Max Players"
                    value={maxPlayers}
                    onChange={(value) => setMaxPlayers(value || 1)}
                    min={minPlayers}
                    max={20}
                    size="md"
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 6, sm: 3 }}>
                  <NumberInput
                    label="Play Time"
                    value={playTime}
                    onChange={(value) => setPlayTime(value || 30)}
                    min={5}
                    max={600}
                    size="md"
                    leftSection={<IconClock size={16} />}
                    rightSection={
                      <Text size="xs" c="dimmed">
                        min
                      </Text>
                    }
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 6, sm: 3 }}>
                  <TextInput
                    label="Age Rating"
                    placeholder="8+, 12+, Adult"
                    value={age}
                    onChange={(e) => setAge(e.currentTarget.value)}
                    size="md"
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <NumberInput
                    label="Your Rating"
                    value={rating}
                    onChange={(value) => setRating(value || 0)}
                    min={0}
                    max={10}
                    step={0.1}
                    precision={1}
                    size="md"
                    leftSection={<IconStar size={16} />}
                    rightSection={
                      <Text size="xs" c="dimmed">
                        /10
                      </Text>
                    }
                    description="Official BGG rating or community rating"
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <NumberInput
                    label="My Personal Rating"
                    value={myRating}
                    onChange={(value) => setMyRating(value || undefined)}
                    min={0}
                    max={10}
                    step={0.1}
                    precision={1}
                    size="md"
                    leftSection={<IconHeart size={16} />}
                    rightSection={
                      <Text size="xs" c="dimmed">
                        /10
                      </Text>
                    }
                    description="Your personal rating for this game"
                    placeholder="Rate this game yourself"
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <Group align="center" gap="md">
                    <Switch
                      label="I own this game"
                      checked={isOwned}
                      onChange={(event) =>
                        setIsOwned(event.currentTarget.checked)
                      }
                      size="md"
                      thumbIcon={
                        isOwned ? (
                          <IconHeartFilled size={12} color="red" />
                        ) : (
                          <IconHeart size={12} />
                        )
                      }
                    />
                    <Text size="sm" c="dimmed">
                      Toggle if this game is part of your collection
                    </Text>
                  </Group>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Cover Image */}
            <Paper shadow="sm" p="md" radius="md" bg="gray.0">
              <Group align="center" mb="md">
                <IconPhoto size={18} />
                <Text fw={500}>Cover Image</Text>
              </Group>

              <Stack gap="md">
                <FileInput
                  label="Upload Cover Image"
                  placeholder="Choose an image file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  leftSection={<IconUpload size={16} />}
                  size="md"
                  disabled={isUploading}
                />

                {isUploading && (
                  <Group align="center" gap="xs">
                    <Loader size="sm" />
                    <Text size="sm" c="dimmed">
                      Uploading image...
                    </Text>
                  </Group>
                )}

                {uploadError && (
                  <Alert color="red" icon={<IconInfoCircle size={16} />}>
                    {uploadError}
                  </Alert>
                )}

                {(coverImage || imagePreview) && (
                  <Card shadow="sm" padding="md" radius="md" bg="white">
                    <Group align="flex-start" gap="md">
                      <Image
                        src={coverImage || imagePreview}
                        alt="Game cover"
                        width={150}
                        height={200}
                        radius="md"
                        fit="cover"
                      />
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Text size="sm" fw={500}>
                          Cover Image Preview
                        </Text>
                        {isUploading ? (
                          <Group align="center" gap="xs">
                            <Loader size="xs" />
                            <Text size="xs" c="blue">
                              Uploading to cloud...
                            </Text>
                          </Group>
                        ) : coverImage ? (
                          <Text size="xs" c="green">
                            ✓ Image uploaded successfully!
                          </Text>
                        ) : (
                          <Text size="xs" c="dimmed">
                            Preview - not yet uploaded
                          </Text>
                        )}
                        <Button
                          variant="light"
                          color="red"
                          size="xs"
                          leftSection={<IconTrash size={14} />}
                          onClick={() => {
                            setCoverImage("");
                            setImagePreview("");
                            if (imagePreview) URL.revokeObjectURL(imagePreview);
                          }}
                        >
                          Remove Image
                        </Button>
                      </Stack>
                    </Group>
                  </Card>
                )}
              </Stack>
            </Paper>

            {/* Tags */}
            <Paper shadow="sm" p="md" radius="md" bg="gray.0">
              <Group align="center" mb="md">
                <IconTag size={18} />
                <Text fw={500}>Tags & Categories</Text>
              </Group>

              <MultiSelect
                label="Game Tags"
                placeholder="Add tags to categorize your game"
                value={tags}
                onChange={(selected: string[]) => setTags(selected)}
                data={tagOptions}
                searchable
                clearable
                size="md"
                maxDropdownHeight={200}
                description="Select existing tags or create your own custom tags"
                dropdownOpened={tagsDropdownOpen}
                onDropdownOpen={() => setTagsDropdownOpen(true)}
                onDropdownClose={() => setTagsDropdownOpen(false)}
                onChange={(selected: string[]) => {
                  setTags(selected);
                  setTagsDropdownOpen(false); // Close after selection
                }}
              />

              {/* Add New Tag Section */}
              <Group mt="sm" align="flex-end" gap="xs">
                <TextInput
                  placeholder="Enter new tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.currentTarget.value)}
                  size="sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddNewTag();
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const normalized = newTag.trim();
                    if (!normalized) return;
                    addNewTag(normalized);
                    if (!tags.includes(normalized)) {
                      setTags((curr) => [...curr, normalized]);
                    }
                    setNewTag(""); // clear input
                  }}
                >
                  + Add Tag
                </Button>
              </Group>

              {tags.length > 0 && (
                <Group gap="xs" mt="xs">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="light"
                      size="sm"
                      rightSection={
                        <ActionIcon
                          size="xs"
                          color="gray"
                          radius="xl"
                          variant="transparent"
                          onClick={() => removeTag(tag)}
                        >
                          <IconX size={10} />
                        </ActionIcon>
                      }
                      pr={3}
                    >
                      {tag}
                    </Badge>
                  ))}
                </Group>
              )}
            </Paper>

            <Divider />

            {/* Submit Button */}
            <Group justify="flex-end" mt="xl">
              <Button
                variant="light"
                color="gray"
                onClick={() => navigate("/mygames")}
                size="md"
              >
                Cancel
              </Button>
              <Button
                gradient={{ from: "blue", to: "cyan" }}
                variant="gradient"
                size="md"
                onClick={handleSubmit}
                leftSection={<IconDeviceGamepad2 size={18} />}
              >
                Add Game to Collection
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default AddGame;
