export class Flashcard {
  constructor(
    readonly front: string,
    readonly back: string,
    readonly hint?: string,
    readonly tags: ReadonlyArray<string> = []
  ) {}
}

export enum AnswerDifficulty {
  Wrong = 0,
  Easy = 1,
  Medium = 2,
  Hard = 3,
}

// Buckets are numbered starting from 0
// Bucket 0 contains new cards and cards that were answered incorrectly
export type BucketMap = Map<number, Set<Flashcard>>;