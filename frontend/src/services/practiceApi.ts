export interface PracticeCard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  tags?: string[];
  bucket: number;
  dueDate: string;
}

export type AnswerDifficulty = 'wrong' | 'hard' | 'easy';

const BASE_URL = 'http://localhost:3000/api';

export async function getPracticeCards(): Promise<PracticeCard[]> {
  const response = await fetch(`${BASE_URL}/practice`);
  if (!response.ok) {
    throw new Error('Failed to fetch practice cards');
  }
  return response.json();
}

export async function recordPracticeResult(cardId: string, difficulty: AnswerDifficulty): Promise<void> {
  const response = await fetch(`${BASE_URL}/practice/record`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cardId, difficulty })
  });
  if (!response.ok) {
    throw new Error('Failed to record practice result');
  }
}

export async function advanceDay(): Promise<void> {
  const response = await fetch(`${BASE_URL}/day/advance`, {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error('Failed to advance day');
  }
}
