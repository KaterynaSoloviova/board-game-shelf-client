import React from 'react';
import { Container, Title, Text, Box, Paper } from '@mantine/core';

const Wishlist: React.FC = () => {
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
          <Title order={1} c={brandColors.darkBrown}>Wishlist</Title>
          <Text c={brandColors.mutedGreen} size="sm">
            Games you'd like to add to your collection
          </Text>
        </Container>
      </Paper>

      <Container size="xl" py="xl">
        <Paper shadow="sm" p="xl" radius="md" style={{ backgroundColor: 'white', border: `1px solid ${brandColors.lightBrown}` }}>
          <Text size="lg" c="dimmed" ta="center" py="xl">
            Wishlist feature coming soon! This is where you'll be able to track games you want to add to your collection.
          </Text>
        </Paper>
      </Container>
    </Box>
  );
};

export default Wishlist;
