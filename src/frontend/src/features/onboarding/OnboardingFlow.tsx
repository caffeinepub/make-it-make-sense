import { useState } from 'react';
import { ONBOARDING_QUESTIONS, type OnboardingStep } from './onboardingQuestions';
import { useInitializeOnboarding } from '../../hooks/useQueries';

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(0);
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']);
  const [currentAnswer, setCurrentAnswer] = useState('');

  const initializeOnboarding = useInitializeOnboarding();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAnswer.trim()) return;

    const newAnswers = [...answers];
    newAnswers[currentStep] = currentAnswer.trim();
    setAnswers(newAnswers);

    if (currentStep === 3) {
      initializeOnboarding.mutate({
        whatMattersMost: newAnswers[0],
        timeSpentInstead: newAnswers[1],
        explanation: newAnswers[2],
        uncomfortableTruth: newAnswers[3]
      });
    } else {
      setCurrentStep((currentStep + 1) as OnboardingStep);
      setCurrentAnswer('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-2xl w-full">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <p className="text-lg font-light text-foreground leading-relaxed">
              {ONBOARDING_QUESTIONS[currentStep]}
            </p>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="w-full min-h-[120px] px-4 py-3 bg-background border border-input rounded-sm text-foreground font-light focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              autoFocus
              disabled={initializeOnboarding.isPending}
            />
          </div>

          <button
            type="submit"
            disabled={!currentAnswer.trim() || initializeOnboarding.isPending}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-sm font-light tracking-wide transition-opacity disabled:opacity-50 hover:opacity-90"
          >
            {initializeOnboarding.isPending ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
