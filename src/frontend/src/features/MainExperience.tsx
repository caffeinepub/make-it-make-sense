import { useGetOnboardingStatus, useGetReflectionState } from '../hooks/useQueries';
import OnboardingFlow from './onboarding/OnboardingFlow';
import DailySurface from './daily/DailySurface';
import WeeklyReflection from './weekly/WeeklyReflection';
import Header from '../components/Header';

export default function MainExperience() {
  const { data: onboardingComplete, isLoading: onboardingLoading } = useGetOnboardingStatus();
  const { data: reflectionState, isLoading: reflectionLoading } = useGetReflectionState();

  if (onboardingLoading || reflectionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!onboardingComplete) {
    return <OnboardingFlow />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-16">
        {reflectionState?.weeklyReflectionDue ? (
          <WeeklyReflection />
        ) : (
          <DailySurface isDue={reflectionState?.dailyReflectionDue ?? false} />
        )}
      </main>
    </div>
  );
}
