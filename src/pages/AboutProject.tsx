import React from 'react';
import { Container, Title, Text, Box, Paper, Stack } from '@mantine/core';

const AboutProject: React.FC = () => {
  const brandColors = {
    beige: "#e0d9c4",
    lightBrown: "#c5b79d",
    mutedGreen: "#8c947d",
    darkBrown: "#635841",
    accent: "#a87e5b",
  };

  return (
    <Box bg={brandColors.beige} mih="100vh">
      <Paper shadow="sm" py="xl" withBorder style={{ borderColor: brandColors.lightBrown, backgroundColor: brandColors.beige }}>
        <Container size="xl">
          <Title order={1} c={brandColors.darkBrown}>About This Project</Title>
          <Text c={brandColors.mutedGreen} size="sm">
            Learn more about the Board Games Shelf application
          </Text>
        </Container>
      </Paper>

      <Container size="xl" py="xl">
        <Paper shadow="sm" p="xl" radius="md" style={{ backgroundColor: 'white', border: `1px solid ${brandColors.lightBrown}` }}>
          <Stack gap="lg">
            <Title order={2} c={brandColors.darkBrown}>About the Board Games Shelf</Title>
            <Text size="lg" c={brandColors.mutedGreen} style={{ lineHeight: 1.6 }}>
              This is a personal board games collection management application built with React, TypeScript, and Mantine UI. 
              It helps track your board game collection, manage game sessions, and discover new games to add to your shelf.
            </Text>
            
            <Title order={3} c={brandColors.darkBrown}>Features</Title>
            <Text size="md" c={brandColors.mutedGreen} style={{ lineHeight: 1.6 }}>
              • Game collection management<br/>
              • Session tracking<br/>
              • Tag-based filtering<br/>
              • Game ratings and notes<br/>
              • Responsive design
            </Text>
            
            <Title order={3} c={brandColors.darkBrown}>Technology Stack</Title>
            <Text size="md" c={brandColors.mutedGreen} style={{ lineHeight: 1.6 }}>
              • Frontend: React 19 + TypeScript<br/>
              • UI Library: Mantine v8<br/>
              • Icons: Tabler Icons<br/>
              • HTTP Client: Axios<br/>
              • Build Tool: Vite
            </Text>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutProject;
