import request from "supertest";
import express from "express";
import * as state from "../src/state";
import * as logic from "../src/logic/algorithm";
import { Flashcard } from "../src/logic/flashcards";
import { app } from "../src/server"; // Import your app here (ensure app is exported in server.ts)

jest.mock("../src/state"); // Mocking state methods
jest.mock("../src/logic/algorithm"); // Mocking logic methods

describe("Express server routes", () => {
  beforeEach(() => {
    // Reset any mocked function before each test
    jest.resetAllMocks();
  });

  it("should return practice cards for the current day", async () => {
    const mockDay = 1;
    const mockBucketsMap = new Map();
    const mockPracticeSet = new Set([new Flashcard("front1", "back1")]);

    // Mock state and logic
    (state.getCurrentDay as jest.Mock).mockReturnValue(mockDay);
    (state.getBuckets as jest.Mock).mockReturnValue(mockBucketsMap);
    (logic.practice as jest.Mock).mockReturnValue(mockPracticeSet);

    const response = await request(app).get("/api/practice");

    expect(response.status).toBe(200);
    expect(response.body.cards.length).toBeGreaterThan(0);
    expect(response.body.day).toBe(mockDay);
  });

  it("should update a card's bucket after practice", async () => {
    const mockCard = new Flashcard("front1", "back1");
    const mockUpdateRequest = {
      cardFront: "front1",
      cardBack: "back1",
      difficulty: 1,
    };

    // Mock state and logic
    (state.findCard as jest.Mock).mockReturnValue(mockCard);
    (state.getBuckets as jest.Mock).mockReturnValue(new Map());
    (logic.update as jest.Mock).mockReturnValue(new Map());

    const response = await request(app).post("/api/update").send(mockUpdateRequest);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Card updated successfully");
  });

  it("should return a hint for a card", async () => {
    const mockCard = new Flashcard("front1", "back1");

    // Mock state and logic
    (state.findCard as jest.Mock).mockReturnValue(mockCard);
    (logic.getHint as jest.Mock).mockReturnValue("This is a hint");

    const response = await request(app).get("/api/hint").query({
      cardFront: "front1",
      cardBack: "back1",
    });

    expect(response.status).toBe(200);
    expect(response.body.hint).toBe("This is a hint");
  });

  it("should return progress stats", async () => {
    const mockProgressStats = { totalCards: 100, learnedCards: 50 };

    // Mock state and logic
    (state.getBuckets as jest.Mock).mockReturnValue(new Map());
    (state.getHistory as jest.Mock).mockReturnValue([]);
    (logic.computeProgress as jest.Mock).mockReturnValue(mockProgressStats);

    const response = await request(app).get("/api/progress");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProgressStats);
  });

  it("should advance the day", async () => {
    const mockNewDay = 2;

    // Mock state
    (state.incrementDay as jest.Mock).mockImplementation(() => {
      (state.getCurrentDay as jest.Mock).mockReturnValue(mockNewDay);
    });

    const response = await request(app).post("/api/day/next");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(`Advanced to day ${mockNewDay}`);
    expect(response.body.currentDay).toBe(mockNewDay);
  });

  it("should add a new flashcard", async () => {
    const newCard = new Flashcard("front1", "back1", "hint", ["tag1"]);
    const mockRequestBody = {
      front: "front1",
      back: "back1",
      hint: "hint",
      tags: ["tag1"],
    };

    // Mock state
    (state.getBuckets as jest.Mock).mockReturnValue(new Map([[0, new Set()]]));
    (state.setBuckets as jest.Mock).mockImplementation(() => {});

    const response = await request(app).post("/api/cards").send(mockRequestBody);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Flashcard added to bucket 0 successfully");
  });
});
