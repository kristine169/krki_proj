import { Flashcard, BucketMap, AnswerDifficulty } from "./logic/flashcards";
import { PracticeRecord } from "./types";

const initialCards: Flashcard[] = [
  new Flashcard("ASAP", "As Soon As Possible", "abreviation", ["phrase", "english"]),
  new Flashcard("TBH", "To Be Honest", "abreviation", ["phrase", "english"]),
  new Flashcard("IDK", "I Don't Know", "abreviation", ["phrase", "english"]),
  new Flashcard("JK", "Just Kidding", "abreviation", ["phrase", "english"])
];

// Initialize buckets: Put all initial cards in bucket 0
let currentBuckets: BucketMap = new Map();
const initialCardSet = new Set(initialCards);
currentBuckets.set(0, initialCardSet);
// Initialize practice history
let practiceHistory: PracticeRecord[] = [];
// Current simulation day (can be incremented or managed)
let currentDay: number = 0;

// State Accessors
export const getBuckets = (): BucketMap => currentBuckets;

export const setBuckets = (newBuckets: BucketMap): void => {
  currentBuckets = newBuckets;
};

export const getHistory = (): PracticeRecord[] => practiceHistory;

export const addHistoryRecord = (record: PracticeRecord): void => {
  practiceHistory.push(record);
};

export const getCurrentDay = (): number => currentDay;

export const incrementDay = (): void => {
  currentDay++;
};

// Helper to find a card
export const findCard = (
  front: string,
  back: string
): Flashcard | undefined => {
  for (const [, bucketSet] of currentBuckets) {
    for (const card of bucketSet) {
      if (card.front === front && card.back === back) {
        return card;
      }
    }
  }
  return initialCards.find(
    (card) => card.front === front && card.back === back
  );
};

// Helper to find the bucket of a card
export const findCardBucket = (cardToFind: Flashcard): number | undefined => {
  for (const [bucketNum, bucketSet] of currentBuckets) {
    if (bucketSet.has(cardToFind)) {
      return bucketNum;
    }
  }
  return undefined;
};

console.log("Initial State Loaded:", currentBuckets);