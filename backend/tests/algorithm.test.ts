/**
 * @jest-environment node
 */
import { Flashcard, AnswerDifficulty } from "../src/logic/flashcards";
import { toBucketSets, practice, update, getHint, computeProgress } from "../src/logic/algorithm";
import { PracticeRecord } from "../src/types";


describe("algorithm module", () => {
  const card1 = new Flashcard("Front 1", "Back 1", "Hint 1");
  const card2 = new Flashcard("Front 2", "Back 2");

  it("should convert a BucketMap to an array of Sets", () => {
    const buckets = new Map<number, Set<Flashcard>>([
      [0, new Set([card1])],
      [2, new Set([card2])]
    ]);

    const bucketSets = toBucketSets(buckets);

    expect(bucketSets[0].has(card1)).toBe(true);
    expect(bucketSets[2].has(card2)).toBe(true);
    expect(bucketSets[1]).toBeDefined();
    expect(bucketSets[1].size).toBe(0);
  });

  it("should select practice cards correctly for a given day", () => {
    const bucketsArray: Set<Flashcard>[] = [
      new Set([card1]),
      new Set(),
      new Set([card2])
    ];

    const selectedDay2 = practice(bucketsArray, 2);
    expect(selectedDay2.has(card1)).toBe(true);
    expect(selectedDay2.has(card2)).toBe(false); // Bucket 2 appears every 4 days, day 2 mod 4 = 2, not 0

    const selectedDay4 = practice(bucketsArray, 4);
    expect(selectedDay4.has(card2)).toBe(true);
  });

  it("should update buckets based on answer difficulty", () => {
    const initialBuckets = new Map<number, Set<Flashcard>>([
      [0, new Set([card1])]
    ]);

    const updatedBuckets = update(initialBuckets, card1, AnswerDifficulty.Easy);
    expect(updatedBuckets.get(1)?.has(card1)).toBe(true);
    expect(updatedBuckets.get(0)?.has(card1)).toBe(false);
  });

  it("should return the correct hint", () => {
    expect(getHint(card1)).toBe("Hint 1");
    expect(getHint(card2)).toBe("No hint available.");
  });

  it("should compute progress statistics", () => {
    const buckets = new Map<number, Set<Flashcard>>([
      [0, new Set([card1])],
      [1, new Set([card2])]
    ]);

    const history: PracticeRecord[] = [
      { cardFront: "Front 1", cardBack: "Back 1", difficulty: AnswerDifficulty.Easy, timestamp: Date.now(), previousBucket: 0, newBucket: 1 },
      { cardFront: "Front 2", cardBack: "Back 2", difficulty: AnswerDifficulty.Wrong, timestamp: Date.now(), previousBucket: 1, newBucket: 0 },
      { cardFront: "Front 1", cardBack: "Back 1", difficulty: AnswerDifficulty.Hard, timestamp: Date.now(), previousBucket: 1, newBucket: 0 }
    ];

    const stats = computeProgress(buckets, history);

    expect(stats.totalCards).toBe(2);
    expect(stats.cardsByBucket[0]).toBe(1);
    expect(stats.cardsByBucket[1]).toBe(1);
    expect(stats.totalPracticeEvents).toBe(3);
    expect(stats.successRate).toBeCloseTo((2 / 3) * 100);
    expect(stats.averageMovesPerCard).toBeGreaterThan(0);
  });
});
