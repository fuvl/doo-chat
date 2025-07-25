import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../contexts/auth';
import { Button } from '../../components/button';
import { Input } from '../../components/input';

export function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (trimmedUsername) {
      login(trimmedUsername);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[url('/src/assets/body-bg.png')] bg-repeat">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-sm shadow-lg">
          <div>
            <h2 className="text-center text-2xl font-semibold text-text-primary">
              Welcome to Doodle Chat
            </h2>
            <p className="mt-2 text-center text-sm text-text-secondary">
              Please enter your name to start chatting
            </p>
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <Input
              id="username"
              name="username"
              type="text"
              required
              label="Username"
              hideLabel
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              disabled={!username.trim()}
            >
              Start Chatting
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}