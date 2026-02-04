import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, OnboardingAnswers, Data } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetOnboardingStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['onboardingStatus'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.getOnboardingStatus();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetOnboardingAnswers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<OnboardingAnswers | null>({
    queryKey: ['onboardingAnswers'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOnboardingAnswers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useInitializeOnboarding() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (answers: OnboardingAnswers) => {
      if (!actor) throw new Error('Actor not available');
      return actor.initializeOnboarding(answers);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboardingStatus'] });
      queryClient.invalidateQueries({ queryKey: ['onboardingAnswers'] });
    },
  });
}

export function useGetReflectionState() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ dailyReflectionDue: boolean; weeklyReflectionDue: boolean }>({
    queryKey: ['reflectionState'],
    queryFn: async () => {
      if (!actor) return { dailyReflectionDue: false, weeklyReflectionDue: false };
      return actor.getReflectionState();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useLogDailyReflection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sentence: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logDailyReflection(sentence);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflectionState'] });
      queryClient.invalidateQueries({ queryKey: ['sentenceHistory'] });
    },
  });
}

export function useGetSentenceHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Data[]>({
    queryKey: ['sentenceHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSentenceHistory();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useLogWeeklyReflection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.logWeeklyReflection();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflectionState'] });
    },
  });
}

export function useResetOnboarding() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateOnboardingAnswers({
        whatMattersMost: '',
        timeSpentInstead: '',
        explanation: '',
        uncomfortableTruth: ''
      });
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.reload();
    },
  });
}
