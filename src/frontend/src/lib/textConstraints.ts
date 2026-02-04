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

export function validateText(text: string): string {
  const lowerText = text.toLowerCase();
  
  for (const word of PROHIBITED_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      console.warn(`Prohibited word detected: ${word}`);
      return text;
    }
  }
  
  return text;
}

export function containsProhibitedWords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return PROHIBITED_WORDS.some(word => lowerText.includes(word.toLowerCase()));
}

export function containsQuestionMark(text: string): boolean {
  return text.includes('?');
}
