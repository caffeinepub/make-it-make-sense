import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import ResetControl from '../features/settings/ResetControl';

export default function Header() {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <header className="border-b border-border">
      <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-sm font-light tracking-wide text-foreground">
          Make It Make Sense
        </h1>
        
        <div className="flex items-center gap-4">
          <ResetControl />
          <button
            onClick={handleLogout}
            className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
