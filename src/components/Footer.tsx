import { Container, Text, Paper, Flex } from '@mantine/core';
import { IconDice } from '@tabler/icons-react';

function Footer() {
  // Color palette from MyGames page
  const brandColors = {
    beige: "#e0d9c4",
    lightBrown: "#c5b79d",
    mutedGreen: "#8c947d",
    darkBrown: "#635841",
    accent: "#a87e5b",
  };

  return (
    <Paper 
      shadow="sm" 
      py="md" 
      withBorder 
      style={{ 
        borderColor: brandColors.lightBrown, 
        backgroundColor: '#f0f0eb',
        borderTop: '1px solid',
        borderTopColor: brandColors.lightBrown
      }}
    >
      <Container size="xl">
        <Flex justify="space-between" align="center">
          {/* Project Logo */}
          <IconDice 
            size={24} 
            color={brandColors.accent}
            style={{ filter: 'drop-shadow(0 2px 4px rgba(99, 88, 65, 0.2))' }}
          />

          {/* Footer Content */}
          <Text 
            size="sm" 
            c={brandColors.mutedGreen}
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500
            }}
          >
            © 2025 Made with ❤️ |{" "}
            <a
              href="https://github.com/yourusername/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                color: brandColors.accent,
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              View on GitHub
            </a>
          </Text>
        </Flex>
      </Container>
    </Paper>
  );
}

export default Footer;
