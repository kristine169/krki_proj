import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";
import { PracticeRecord, ProgressStats } from "../types";

/**
* Converts a BucketMap into an array where each index represents the bucket number.
*/
export function toBucketSets(buckets: BucketMap): Array<Set<Flashcard>> {
const bucketSets: Array<Set<Flashcard>> = [];

const maxIndex = Math.max(0, ...buckets.keys());

for (let i = 0; i <= maxIndex; i++) {
bucketSets[i] = new Set<Flashcard>();
}

for (const [index, cardSet] of buckets.entries()) {
bucketSets[index] = cardSet;
}

return bucketSets;
}

/**
* Selects cards to practice based on the day and the bucket array.
*/
export function practice(
buckets: Array<Set<Flashcard>>,
day: number
): Set<Flashcard> {
const cardsToPractice = new Set<Flashcard>();

if (buckets[0]) {
for (const flashcard of buckets[0]) {
cardsToPractice.add(flashcard);
}
}

for (let bucketNum = 1; bucketNum < buckets.length; bucketNum++) {
const scheduledDay = 2 ** bucketNum;
if (day % scheduledDay === 0 && buckets[bucketNum]) {
for (const flashcard of buckets[bucketNum]) {
cardsToPractice.add(flashcard);
}
}
}

return cardsToPractice;
}

/**
* Updates the buckets depending on the answer difficulty provided.
*/
export function update(
buckets: BucketMap,
card: Flashcard,
difficulty: AnswerDifficulty
): BucketMap {
const copiedBuckets = new Map<number, Set<Flashcard>>();

let foundInBucket = -1;

for (const [bucketNum, cardSet] of buckets.entries()) {
copiedBuckets.set(bucketNum, new Set(cardSet));
if (cardSet.has(card)) {
foundInBucket = bucketNum;
}
}

if (foundInBucket === -1 && !copiedBuckets.has(0)) {
copiedBuckets.set(0, new Set<Flashcard>());
}

if (foundInBucket !== -1) {
copiedBuckets.get(foundInBucket)!.delete(card);
}

let destinationBucket: number;

if (difficulty === AnswerDifficulty.Wrong) {
destinationBucket = 0;
} else if (difficulty === AnswerDifficulty.Hard) {
destinationBucket = foundInBucket;
} else {
destinationBucket = foundInBucket + 1;
}

if (!copiedBuckets.has(destinationBucket)) {
copiedBuckets.set(destinationBucket, new Set<Flashcard>());
}

copiedBuckets.get(destinationBucket)!.add(card);

return copiedBuckets;
}

/**
* Returns a hint for the flashcard if it exists.
*/
export function getHint(card: Flashcard): string {
return card.hint ? card.hint : "No hint available.";
}

/**
* Calculates overall progress statistics from buckets and practice history.
*/
export function computeProgress(
buckets: BucketMap,
history: PracticeRecord[]
): ProgressStats {
let overallCards = 0;
const cardsDistribution: Record<number, number> = {};

for (const [bucketNumber, cards] of buckets.entries()) {
overallCards += cards.size;
cardsDistribution[bucketNumber] = cards.size;
}

const highestBucketNumber = Math.max(0, ...Object.keys(cardsDistribution).map(Number));
for (let i = 0; i <= highestBucketNumber; i++) {
if (!(i in cardsDistribution)) {
cardsDistribution[i] = 0;
}
}

const totalAnswers = history.length;
const successfulAnswers = history.filter(
(entry) => entry.difficulty === AnswerDifficulty.Easy || entry.difficulty === AnswerDifficulty.Hard
).length;

const successRate = totalAnswers > 0 ? (successfulAnswers / totalAnswers) * 100 : 0;

const moveCounts: Record<string, number> = {};

for (const entry of history) {
const key = `${entry.cardFront}:${entry.cardBack}`;
moveCounts[key] = (moveCounts[key] ?? 0) + 1;
}

const averageMoves = Object.keys(moveCounts).length > 0
? Object.values(moveCounts).reduce((acc, moves) => acc + moves, 0) / Object.keys(moveCounts).length
: 0;

return {
totalCards: overallCards,
cardsByBucket: cardsDistribution,
successRate,
averageMovesPerCard: averageMoves,
totalPracticeEvents: totalAnswers,
};
}