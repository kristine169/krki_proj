export interface Card {
  id: string;
  front: string;
  back: string;
  hint?: string;
  tags?: string[];
}

const BASE_URL = 'http://localhost:3000/api';

export async function getCards(): Promise<Card[]> {
  const response = await fetch(\`\${BASE_URL}/cards\`);
  if (!response.ok) {
    throw new Error('Failed to fetch cards');
  }
  return response.json();
}

export async function addCard(card: Omit<Card, 'id'>): Promise<Card> {
  const response = await fetch(\`\${BASE_URL}/cards\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(card)
  });
  if (!response.ok) {
    throw new Error('Failed to add card');
  }
  return response.json();
}

export async function getPracticeCards(): Promise<Card[]> {
  const response = await fetch(\`\${BASE_URL}/practice\`);
  if (!response.ok) {
    throw new Error('Failed to fetch practice cards');
  }
  return response.json();
}

export async function recordPracticeResult(cardId: string, difficulty: string): Promise<void> {
  const response = await fetch(\`\${BASE_URL}/practice/record\`, {
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
  const response = await fetch(\`\${BASE_URL}/day/advance\`, {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error('Failed to advance day');
  }
}
