import React, { useState } from 'react';
import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Text,
  Stack,
  Alert,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../interfaces';

interface LoginModalProps {
  opened: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ opened, onClose, onSwitchToSignup }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('Login form submitted with credentials:', credentials);

    try {
      console.log('Calling login function...');
      await login(credentials);
      console.log('Login function completed successfully');
      onClose();
      setCredentials({ email: '', password: '' });
    } catch (error) {
      console.error('Login error in modal:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Login to Your Account"
      size="sm"
      centered
      styles={{
        title: {
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#635841',
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          )}

          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            type="email"
            styles={{
              label: { color: '#635841', fontWeight: 500 },
              input: {
                borderColor: '#c5b79d',
                '&:focus': { borderColor: '#a87e5b' },
              },
            }}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required
            styles={{
              label: { color: '#635841', fontWeight: 500 },
              input: {
                borderColor: '#c5b79d',
                '&:focus': { borderColor: '#a87e5b' },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            loading={loading}
            style={{
              backgroundColor: '#a87e5b',
              '&:hover': { backgroundColor: '#8c6b4a' },
            }}
          >
            Login
          </Button>

          <Group justify="center">
            <Text size="sm" c="dimmed">
              Don't have an account?{' '}
            </Text>
            <Button
              variant="subtle"
              size="sm"
              onClick={onSwitchToSignup}
              style={{ color: '#a87e5b' }}
            >
              Sign up
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default LoginModal;
