import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Data {
    sentence: string;
    timestamp: bigint;
}
export interface UserProfile {
    name: string;
}
export interface OnboardingAnswers {
    whatMattersMost: string;
    timeSpentInstead: string;
    explanation: string;
    uncomfortableTruth: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOnboardingAnswers(): Promise<OnboardingAnswers | null>;
    getOnboardingStatus(): Promise<boolean>;
    getReflectionState(): Promise<{
        dailyReflectionDue: boolean;
        weeklyReflectionDue: boolean;
    }>;
    getSentenceHistory(): Promise<Array<Data>>;
    getSentenceRetentionLimit(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeOnboarding(answers: OnboardingAnswers): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    logDailyReflection(sentence: string): Promise<void>;
    logWeeklyReflection(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOnboardingAnswers(answers: OnboardingAnswers): Promise<void>;
}
