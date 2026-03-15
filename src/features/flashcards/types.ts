// Flashcard Item (individual card)
export interface FlashcardItem {
  id?: number;
  flashcard_id: number;
  front_html: string;
  back_html: string;
  item_order: number;
}

// Flashcard Set/Collection
export interface Flashcard {
  id?: number;
  flashcard_code: string;
  learning_module_id: number;
  title: string;
  description: string;
  items_count: number;
  status: string;
  items?: FlashcardItem[];
  created_at?: string;
  updated_at?: string;
  // Legacy properties for backward compatibility
  front_html?: string;
  back_html?: string;
}

// Create/Update Flashcard
export interface CreateFlashcardRequest {
  flashcard_code: string;
  learning_module_id: number;
  title: string;
  description: string;
  items_count: number;
  status: 'active' | 'inactive' | 'draft';
}

// Create/Update Flashcard Item
export interface CreateFlashcardItemRequest {
  flashcard_id: number;
  front_html: string;
  back_html: string;
  item_order: number;
}

// API Response for Flashcards List
export interface FlashcardsListResponse {
  data: Flashcard[];
  total: number;
  page: number;
  per_page: number;
}

// API Response for Flashcard Items List
export interface FlashcardItemsListResponse {
  data: FlashcardItem[];
  total: number;
  page: number;
  per_page: number;
}

// Legacy types (kept for backward compatibility)
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
