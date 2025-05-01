export interface Flashcard {
    readonly front: string;
    readonly back: string;
    readonly hint?: string;
    readonly tags: ReadonlyArray<string>;
}
  
export enum AnswerDifficulty {
    Wrong = 0,
    Easy = 1,
    Medium = 2,
    Hard = 3,
}
  
export interface PracticeSession {
    cards: Flashcard[];
    day: number;
}
  
export interface UpdateRequest {
    cardFront: string;
    cardBack: string;
    difficulty: AnswerDifficulty;
}
  
export interface ProgressStats {
    totalCards: number;
    cardsByBucket: Record<number, number>;
    successRate: number;
    averageMovesPerCard: number;
    totalPracticeEvents: number;
}
