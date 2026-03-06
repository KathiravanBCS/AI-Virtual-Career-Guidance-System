export interface Flashcard {
  id: number | string;
  frontHTML: string;
  backHTML: string;
}

export interface FlashcardSet {
  topic: string;
  cards: Flashcard[];
  moduleID?: string;
  moduleName?: string;
}

export interface LearningPath {
  $id: string;
  careerName: string;
  modules?: Array<{ title: string }>;
}

export interface FlashcardNudge {
  text: string;
  type: 'tip' | 'warning' | 'success' | 'info';
  icon: string;
}

export interface GenerateFlashcardsInput {
  topic: string;
  numCards: number;
}
