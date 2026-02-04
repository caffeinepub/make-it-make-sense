import { useState } from 'react';
import type { OnboardingAnswers } from '../../backend';
import { generateExplanationSentence, generateUncushionedSentence } from '../../lib/textSynthesis';
import { useLogDailyReflection } from '../../hooks/useQueries';

interface ExplanationBlockProps {
  answers: OnboardingAnswers;
}

export default function ExplanationBlock({ answers }: ExplanationBlockProps) {
  const [isUncushioned, setIsUncushioned] = useState(false);
  const logDailyReflection = useLogDailyReflection();

  const explanationSentence = generateExplanationSentence(answers);
  const uncushionedSentence = generateUncushionedSentence(answers);

  const displayedSentence = isUncushioned ? uncushionedSentence : explanationSentence;

  const handleToggle = () => {
    const newState = !isUncushioned;
    setIsUncushioned(newState);
    
    if (newState && !logDailyReflection.isSuccess) {
      logDailyReflection.mutate(uncushionedSentence);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h2 className="text-sm font-light tracking-widest uppercase text-muted-foreground">
          Your Current Explanation
        </h2>
        
        <p className="text-xl font-light leading-relaxed text-foreground">
          {displayedSentence}
        </p>
      </div>

      <button
        onClick={handleToggle}
        className="px-6 py-2 border border-border rounded-sm text-sm font-light tracking-wide text-foreground hover:bg-accent transition-colors"
      >
        State it without cushioning.
      </button>
    </div>
  );
}
