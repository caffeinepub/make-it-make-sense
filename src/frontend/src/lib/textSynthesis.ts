import type { OnboardingAnswers, Data } from '../backend';
import { validateText } from './textConstraints';

export function generateExplanationSentence(answers: OnboardingAnswers): string {
  const { whatMattersMost, timeSpentInstead, explanation } = answers;
  
  const sentence = `You say ${whatMattersMost.toLowerCase()} matters most, but you explain choosing ${timeSpentInstead.toLowerCase()} by telling yourself ${explanation.toLowerCase()}.`;
  
  return validateText(sentence);
}

export function generateUncushionedSentence(answers: OnboardingAnswers): string {
  const { whatMattersMost, timeSpentInstead, uncomfortableTruth } = answers;
  
  const sentence = `${whatMattersMost} is stated as the priority, yet ${timeSpentInstead.toLowerCase()} receives the time, which works only if ${uncomfortableTruth.toLowerCase()}.`;
  
  return validateText(sentence);
}

export function generateWeeklyReflection(history: Data[]): string {
  if (history.length === 0) {
    return validateText('No pattern yet established.');
  }

  if (history.length === 1) {
    return validateText('The explanation has been stated once.');
  }

  const uniqueSentences = new Set(history.map(h => h.sentence));
  
  if (uniqueSentences.size > 1) {
    return validateText('The explanation changed more often than the priority.');
  }

  return validateText('The explanation remained consistent.');
}
