import { useGetOnboardingAnswers } from '../../hooks/useQueries';
import ExplanationBlock from './ExplanationBlock';

interface DailySurfaceProps {
  isDue: boolean;
}

export default function DailySurface({ isDue }: DailySurfaceProps) {
  const { data: answers } = useGetOnboardingAnswers();

  if (!isDue || !answers) {
    return <div className="min-h-[60vh]" />;
  }

  return <ExplanationBlock answers={answers} />;
}
