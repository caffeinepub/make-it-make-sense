const PROHIBITED_WORDS = [
  'should',
  'need to',
  'try',
  'improve',
  'better',
  'fix',
  'heal',
  'grow',
  'productive'
];

const REASSURANCE_PATTERNS = [
  'you can',
  'you will',
  'it\'s okay',
  'don\'t worry',
  'you\'re doing',
  'keep going',
  'stay strong',
  'believe in',
  'you got this',
  'proud of you',
  'well done',
  'good job'
];

export function validateText(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Check for prohibited words
  for (const word of PROHIBITED_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      console.warn(`Prohibited word detected: ${word}`);
      return text;
    }
  }
  
  // Check for reassurance language
  for (const pattern of REASSURANCE_PATTERNS) {
    if (lowerText.includes(pattern)) {
      console.warn(`Reassurance language detected: ${pattern}`);
      return text;
    }
  }
  
  // Check for question marks (post-onboarding)
  if (text.includes('?')) {
    console.warn('Question mark detected in generated text');
    return text;
  }
  
  return text;
}

export function containsProhibitedWords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return PROHIBITED_WORDS.some(word => lowerText.includes(word.toLowerCase()));
}

export function containsReassurance(text: string): boolean {
  const lowerText = text.toLowerCase();
  return REASSURANCE_PATTERNS.some(pattern => lowerText.includes(pattern));
}

export function containsQuestionMark(text: string): boolean {
  return text.includes('?');
}
