import express, { Request, Response } from "express";
import cors from "cors";
import * as logic from "./logic/algorithm";
import { Flashcard, AnswerDifficulty } from "./logic/flashcards";
import * as state from "./state";
import { UpdateRequest, ProgressStats, PracticeRecord } from "./types";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes (Each endpoint will be matched in frontend part)
// Get cards to practice for the current day
app.get("/api/practice", (req: Request, res: Response) => {
  try {
    const day = state.getCurrentDay();
    const bucketsMap = state.getBuckets();
    // Convert Map to Array<Set> for the practice function
    const bucketSets = logic.toBucketSets(bucketsMap);
    const cardsToPracticeSet = logic.practice(bucketSets, day);

    // Convert Set to Array for JSON response
    const cardsToPracticeArray = Array.from(cardsToPracticeSet);

    console.log(`Day ${day}: Practice ${cardsToPracticeArray.length} cards`);
    res.json({ cards: cardsToPracticeArray, day });
  } catch (error) {
    console.error("Error getting practice cards:", error);
    res.status(500).json({ message: "Error fetching practice cards" });
  }
});

//  Update a card's bucket after practice
app.post("/api/update", (req: Request, res: Response) => {
  try {
    const { cardFront, cardBack, difficulty } = req.body as UpdateRequest;

    // Validate difficulty
    if (!(difficulty in AnswerDifficulty)) {
      res.status(400).json({ message: "Invalid difficulty level" });
      return;
    }

    const card = state.findCard(cardFront, cardBack);
    if (!card) {
      res.status(404).json({ message: "Card not found" });
      return;
    }

    const currentBuckets = state.getBuckets();
    const previousBucket = state.findCardBucket(card);

    // Use update function
    const updatedBuckets = logic.update(currentBuckets, card, difficulty);
    state.setBuckets(updatedBuckets);

    // Add to history
    const newBucket = state.findCardBucket(card);
    const historyRecord: PracticeRecord = {
      cardFront: card.front,
      cardBack: card.back,
      timestamp: Date.now(),
      difficulty,
      previousBucket: previousBucket ?? -1,
      newBucket: newBucket ?? -1,
    };
    state.addHistoryRecord(historyRecord);

    console.log(
      `Updated card "${card.front}": Difficulty ${AnswerDifficulty[difficulty]}, New Bucket ${newBucket}`
    );
    res.status(200).json({ message: "Card updated successfully" });
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(500).json({ message: "Error updating card" });
  }
});

// Get a hint for a card
app.get("/api/hint", (req: Request, res: Response) => {
  try {
    const { cardFront, cardBack } = req.query;

    if (typeof cardFront !== "string" || typeof cardBack !== "string") {
      res
        .status(400)
        .json({ message: "Missing cardFront or cardBack query parameter" });
      return;
    }

    const card = state.findCard(cardFront, cardBack);
    if (!card) {
      res.status(404).json({ message: "Card not found" });
      return;
    }

    // Use getHint function
    const hint = logic.getHint(card);
    console.log(`Hint requested for "${card.front}": ${hint}`);
    res.json({ hint });
  } catch (error) {
    console.error("Error getting hint:", error);
    res.status(500).json({ message: "Error getting hint" });
  }
});

// Get learning progress statistics
app.get("/api/progress", (req: Request, res: Response) => {
  try {
    const buckets = state.getBuckets();
    const history = state.getHistory();

    // Use computeProgress function
    const progress: ProgressStats = logic.computeProgress(buckets, history);

    res.json(progress);
  } catch (error) {
    console.error("Error computing progress:", error);
    res.status(500).json({ message: "Error computing progress" });
  }
});

// Advance the simulation day
app.post("/api/day/next", (req: Request, res: Response) => {
  state.incrementDay();
  const newDay = state.getCurrentDay();
  console.log(`Advanced to Day ${newDay}`);
  res
    .status(200)
    .json({ message: `Advanced to day ${newDay}`, currentDay: newDay });
});

// Add a new flashcard to bucket 0 from extension
app.post("/api/cards", (req: Request, res: Response) => {
  try {
    const { front, back, hint, tags } = req.body;

    if (typeof front !== "string" || front.trim() === "") {
      res.status(400).json({ message: "Invalid or missing 'front' field" });
      return;
    }
    if (typeof back !== "string" || back.trim() === "") {
      res.status(400).json({ message: "Invalid or missing 'back' field" });
      return;
    }
    // hint and tags are optional
    const hintStr = typeof hint === "string" ? hint : "";
    const tagsArr = Array.isArray(tags) ? tags.filter(t => typeof t === "string") : [];

    // Create new Flashcard instance
    const newCard = new Flashcard(front.trim(), back.trim(), hintStr.trim(), tagsArr);

    // Get current buckets and add new card to bucket 0
    const buckets = state.getBuckets();
    const bucketZero = buckets.get(0) || new Set<Flashcard>();
    bucketZero.add(newCard);
    buckets.set(0, bucketZero);

    // Update state
    state.setBuckets(buckets);

    console.log(`Added new flashcard to bucket 0: ${front} - ${back}`);
    res.status(201).json({ message: "Flashcard added to bucket 0 successfully" });
  } catch (error) {
    console.error("Error adding flashcard:", error);
    res.status(500).json({ message: "Error adding flashcard" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
  console.log(`Current Day: ${state.getCurrentDay()}`);
});
export  {app};