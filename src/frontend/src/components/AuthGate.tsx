import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function AuthGate() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-light tracking-tight text-foreground">
            Make It Make Sense
          </h1>
          <p className="text-sm text-muted-foreground font-light">
            The Coherence Engine
          </p>
        </div>

        <button
          onClick={login}
          disabled={isLoggingIn}
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-sm font-light tracking-wide transition-opacity disabled:opacity-50 hover:opacity-90"
        >
          {isLoggingIn ? 'Connecting...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}
