import React from 'react';
import {
  Container,
  Title,
  Text,
  Box,
  Paper,
  Stack,
  Group,
  Avatar,
  Button,
  Grid,
  Divider,
  Badge
} from '@mantine/core';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconCode,
  IconDatabase,
  IconPalette,
  IconDeviceGamepad2,
  IconUsers,
  IconHeart
} from '@tabler/icons-react';
import KaterynaPhoto from '../assets/Kateryna-Soloviova-web-developer.jpg';

const AboutProject: React.FC = () => {
  const brandColors = {
    beige: "#e0d9c4",
    lightBrown: "#c5b79d",
    mutedGreen: "#6b8e23",
    darkBrown: "#635841",
    accent: "#a87e5b",
  };

  return (
    <Box bg={brandColors.beige} mih="100vh">
      {/* Header Section */}
      <Paper shadow="sm" py="lg" withBorder style={{ borderColor: brandColors.lightBrown, backgroundColor: '#f0f0eb' }}>
        <Container size="xl">
          <Title order={1} c={brandColors.darkBrown} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            About This Project
          </Title>
          <Text c={brandColors.mutedGreen} size="lg" style={{ fontFamily: 'Inter, sans-serif' }}>
            Meet the developer and learn about the Board Games Shelf application
          </Text>
        </Container>
      </Paper>

      <Container size="xl" py="lg">
        {/* Developer Profile Section */}
        <Paper shadow="sm" p="xl" radius="md" mb="lg" style={{ backgroundColor: '#f0f0eb', border: `1px solid ${brandColors.lightBrown}` }}>
          <Stack gap="lg" align="center">
            <Title order={2} c={brandColors.darkBrown} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              👩‍💻 Developer
            </Title>

            <Avatar
              size={120}
              radius={120}
              src={KaterynaPhoto}
              style={{
                border: `4px solid ${brandColors.accent}`,
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />

            <Stack gap="xs" align="center">
              <Title order={3} c={brandColors.darkBrown} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                Kateryna Soloviova
              </Title>
              <Text size="lg" c={brandColors.mutedGreen} style={{ fontFamily: 'Inter, sans-serif' }}>
                Full Stack Developer
              </Text>
            </Stack>

            {/* Contact Links */}
            <Group gap="md">
              <Button
                variant="light"
                size="md"
                leftSection={<IconMail size={18} />}
                style={{
                  backgroundColor: brandColors.accent,
                  borderColor: brandColors.lightBrown,
                  color: 'white',
                  fontWeight: 600
                }}
                onClick={() => window.open('mailto:soloviova.kateryna@gmail.com')}
              >
                soloviova.kateryna@gmail.com
              </Button>

              <Button
                variant="light"
                size="md"
                leftSection={<IconBrandGithub size={18} />}
                style={{
                  backgroundColor: brandColors.accent,
                  borderColor: brandColors.lightBrown,
                  color: 'white',
                  fontWeight: 600
                }}
                onClick={() => window.open('https://github.com/KaterynaSoloviova', '_blank')}
              >
                GitHub
              </Button>

              <Button
                variant="light"
                size="md"
                leftSection={<IconBrandLinkedin size={18} />}
                style={{
                  backgroundColor: brandColors.accent,
                  borderColor: brandColors.lightBrown,
                  color: 'white',
                  fontWeight: 600
                }}
                onClick={() => window.open('https://www.linkedin.com/in/kateryna-soloviova-webdeveloper/', '_blank')}
              >
                LinkedIn
              </Button>
            </Group>
          </Stack>
        </Paper>

        {/* Project Description Section */}
        <Paper shadow="sm" p="xl" radius="md" mb="lg" style={{ backgroundColor: '#f0f0eb', border: `1px solid ${brandColors.lightBrown}` }}>
          <Stack gap="lg">
            <Title order={2} c={brandColors.darkBrown} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              🎯 Project Goal
            </Title>

            <Text size="lg" c={brandColors.mutedGreen} style={{ lineHeight: 1.8, fontFamily: 'Inter, sans-serif' }}>
              The Board Games Shelf is my personal digital collection that showcases the board games I own and love.
              It's a way for friends and family to explore what's available on my shelf and discover new games through my experiences.
            </Text>

            <Text size="lg" c={brandColors.mutedGreen} style={{ lineHeight: 1.8, fontFamily: 'Inter, sans-serif' }}>
              This project was born from my passion for board games and a desire to create a beautiful, organized way to
              showcase my collection. Visitors can browse through the games I've played, read my personal notes and ratings,
              and get inspired for their own gaming adventures.
            </Text>

            <Text size="lg" c={brandColors.mutedGreen} style={{ lineHeight: 1.8, fontFamily: 'Inter, sans-serif' }}>
              <strong>Technical Goals:</strong> As part of my Ironhack bootcamp journey, this project focuses on mastering
              database types, Prisma ORM, SQL, PostgreSQL, and TypeScript. It's designed to demonstrate my understanding
              of modern database design, type safety, and full-stack development practices.
            </Text>

            <Divider color={brandColors.lightBrown} />

            <Title order={3} c={brandColors.darkBrown} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              ✨ What Makes It Special
            </Title>

            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Group gap="sm" align="center" justify="center">
                  <IconDeviceGamepad2 size={24} color={brandColors.accent} />
                  <Text size="md" c={brandColors.mutedGreen} style={{ fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
                    <strong>Personal Collection:</strong> My curated board games library with detailed information and personal ratings
                  </Text>
                </Group>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Group gap="sm" align="center" justify="center">
                  <IconUsers size={24} color={brandColors.accent} />
                  <Text size="md" c={brandColors.mutedGreen} style={{ fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
                    <strong>Gaming History:</strong> Track all my gaming sessions and remember who I played with
                  </Text>
                </Group>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Group gap="sm" align="center" justify="center">
                  <IconHeart size={24} color={brandColors.accent} />
                  <Text size="md" c={brandColors.mutedGreen} style={{ fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
                    <strong>Wishlist Management:</strong> Keep track of games I want to add to my personal collection
                  </Text>
                </Group>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Group gap="sm" align="center" justify="center">
                  <IconPalette size={24} color={brandColors.accent} />
                  <Text size="md" c={brandColors.mutedGreen} style={{ fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
                    <strong>Beautiful Interface:</strong> Clean, intuitive design that makes exploring my collection enjoyable
                  </Text>
                </Group>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        {/* Technologies Section */}
        <Paper shadow="sm" p="xl" radius="md" style={{ backgroundColor: '#f0f0eb', border: `1px solid ${brandColors.lightBrown}` }}>
          <Stack gap="lg">
            <Title order={2} c={brandColors.darkBrown} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              🛠️ Technologies Used
            </Title>

            <Grid gutter="xl">
              {/* Frontend Technologies */}
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Paper p="lg" radius="md" style={{ backgroundColor: brandColors.beige, border: `1px solid ${brandColors.lightBrown}` }}>
                  <Group gap="sm" mb="md">
                    <IconCode size={24} color={brandColors.accent} />
                    <Title order={3} c={brandColors.darkBrown} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      Frontend
                    </Title>
                  </Group>

                  <Stack gap="sm">
                    <Group gap="xs">
                      <Badge
                        style={{
                          backgroundColor: '#AAC27A',
                          color: 'white',
                          border: '1px solid #AAC27A'
                        }}
                        size="lg"
                      >
                        React 19
                      </Badge>
                      <Badge
                        style={{
                          backgroundColor: '#AAC27A',
                          color: 'white',
                          border: '1px solid #AAC27A'
                        }}
                        size="lg"
                      >
                        TypeScript
                      </Badge>
                    </Group>
                    <Group gap="xs">
                      <Badge
                        style={{
                          backgroundColor: '#99B5A3',
                          color: 'white',
                          border: '1px solid #99B5A3'
                        }}
                        size="lg"
                      >
                        Mantine UI v8
                      </Badge>
                      <Badge
                        style={{
                          backgroundColor: '#99B5A3',
                          color: 'white',
                          border: '1px solid #99B5A3'
                        }}
                        size="lg"
                      >
                        Vite
                      </Badge>
                    </Group>
                    <Group gap="xs">
                      <Badge
                        style={{
                          backgroundColor: '#B07770',
                          color: 'white',
                          border: '1px solid #B07770'
                        }}
                        size="lg"
                      >
                        React Router
                      </Badge>
                      <Badge
                        style={{
                          backgroundColor: '#B07770',
                          color: 'white',
                          border: '1px solid #B07770'
                        }}
                        size="lg"
                      >
                        Axios
                      </Badge>
                    </Group>
                    <Group gap="xs">
                      <Badge
                        style={{
                          backgroundColor: '#AAC27A',
                          color: 'white',
                          border: '1px solid #AAC27A'
                        }}
                        size="lg"
                      >
                        CSS3
                      </Badge>
                      <Badge
                        style={{
                          backgroundColor: '#AAC27A',
                          color: 'white',
                          border: '1px solid #AAC27A'
                        }}
                        size="lg"
                      >
                        HTML5
                      </Badge>
                    </Group>
                  </Stack>
                </Paper>
              </Grid.Col>

              {/* Backend Technologies */}
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Paper p="lg" radius="md" style={{ backgroundColor: brandColors.beige, border: `1px solid ${brandColors.lightBrown}` }}>
                  <Group gap="sm" mb="md">
                    <IconDatabase size={24} color={brandColors.accent} />
                    <Title order={3} c={brandColors.darkBrown} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      Backend
                    </Title>
                  </Group>

                  <Stack gap="sm">
                    <Group gap="xs">
                      <Badge
                        style={{
                          backgroundColor: '#AAC27A',
                          color: 'white',
                          border: '1px solid #AAC27A'
                        }}
                        size="lg"
                      >
                        Node.js
                      </Badge>
                      <Badge
                        style={{
                          backgroundColor: '#AAC27A',
                          color: 'white',
                          border: '1px solid #AAC27A'
                        }}
                        size="lg"
                      >
                        Express.js
                      </Badge>
                    </Group>
                    <Group gap="xs">
                      <Badge
                        style={{
                          backgroundColor: '#99B5A3',
                          color: 'white',
                          border: '1px solid #99B5A3'
                        }}
                        size="lg"
                      >
                        PostgreSQL
                      </Badge>
                      <Badge
                        style={{
                          backgroundColor: '#99B5A3',
                          color: 'white',
                          border: '1px solid #99B5A3'
                        }}
                        size="lg"
                      >
                        Prisma ORM
                      </Badge>
                    </Group>
                    <Group gap="xs">
                      <Badge
                        style={{
                          backgroundColor: '#B07770',
                          color: 'white',
                          border: '1px solid #B07770'
                        }}
                        size="lg"
                      >
                        SQL
                      </Badge>
                      <Badge
                        style={{
                          backgroundColor: '#B07770',
                          color: 'white',
                          border: '1px solid #B07770'
                        }}
                        size="lg"
                      >
                        Database Types
                      </Badge>
                    </Group>
                    <Group gap="xs">
                      <Badge
                        style={{
                          backgroundColor: '#AAC27A',
                          color: 'white',
                          border: '1px solid #AAC27A'
                        }}
                        size="lg"
                      >
                        REST API
                      </Badge>
                      <Badge
                        style={{
                          backgroundColor: '#AAC27A',
                          color: 'white',
                          border: '1px solid #AAC27A'
                        }}
                        size="lg"
                      >
                        TypeScript
                      </Badge>
                    </Group>
                  </Stack>
                </Paper>
              </Grid.Col>
            </Grid>

            <Divider color={brandColors.lightBrown} />

            <Text size="md" c={brandColors.mutedGreen} style={{ lineHeight: 1.6, fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
              This project showcases modern web development practices, combining powerful frontend technologies with a robust backend
              to create a seamless user experience for board game enthusiasts.
            </Text>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutProject;
