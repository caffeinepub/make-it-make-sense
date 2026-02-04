import { useGetSentenceHistory, useLogWeeklyReflection } from '../../hooks/useQueries';
import { generateWeeklyReflection } from '../../lib/textSynthesis';
import { useEffect } from 'react';

export default function WeeklyReflection() {
  const { data: history } = useGetSentenceHistory();
  const logWeeklyReflection = useLogWeeklyReflection();

  useEffect(() => {
    if (!logWeeklyReflection.isSuccess) {
      logWeeklyReflection.mutate();
    }
  }, []);

  const reflectionText = generateWeeklyReflection(history || []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h2 className="text-sm font-light tracking-widest uppercase text-muted-foreground">
          Where your logic bent.
        </h2>
        
        <p className="text-xl font-light leading-relaxed text-foreground">
          {reflectionText}
        </p>
      </div>
    </div>
  );
}
