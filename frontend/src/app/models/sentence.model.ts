export interface Sentence {
  id: number;
  title: string;
  content: string;
  word_ids: number[];
  created_at: string;
  updated_at: string;
}

export interface SentencePayload {
  title: string;
  content: string;
  wordIds: number[];
}
