import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveProfile.mutate({ name: name.trim() });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-light text-foreground">
              Enter your name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-input rounded-sm text-foreground font-light focus:outline-none focus:ring-1 focus:ring-ring"
              autoFocus
              disabled={saveProfile.isPending}
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || saveProfile.isPending}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-sm font-light tracking-wide transition-opacity disabled:opacity-50 hover:opacity-90"
          >
            {saveProfile.isPending ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
