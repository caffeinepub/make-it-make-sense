import { useState } from 'react';
import { useResetOnboarding } from '../../hooks/useQueries';

export default function ResetControl() {
  const [showConfirm, setShowConfirm] = useState(false);
  const resetOnboarding = useResetOnboarding();

  const handleReset = () => {
    resetOnboarding.mutate();
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleReset}
          disabled={resetOnboarding.isPending}
          className="text-sm font-light text-destructive hover:opacity-70 transition-opacity disabled:opacity-50"
        >
          {resetOnboarding.isPending ? 'Resetting...' : 'Confirm Reset'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={resetOnboarding.isPending}
          className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
    >
      Reset
    </button>
  );
}
