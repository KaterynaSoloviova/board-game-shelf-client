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
import { SignupCredentials } from '../interfaces';

interface SignupModalProps {
  opened: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ opened, onClose, onSwitchToLogin }) => {
  const [credentials, setCredentials] = useState<SignupCredentials>({
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>('');
  const { signup, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password confirmation
    if (credentials.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await signup(credentials);
      onClose();
      setCredentials({ email: '', password: '' });
      setConfirmPassword('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed');
    }
  };

  const handleInputChange = (field: keyof SignupCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (error) setError('');
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create Your Account"
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
            placeholder="Create a password"
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

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
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
            Create Account
          </Button>

          <Group justify="center">
            <Text size="sm" c="dimmed">
              Already have an account?{' '}
            </Text>
            <Button
              variant="subtle"
              size="sm"
              onClick={onSwitchToLogin}
              style={{ color: '#a87e5b' }}
            >
              Login
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default SignupModal;
