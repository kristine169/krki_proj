import React, { useEffect, useState } from 'react';
import { getCards, Card } from '../services/api';

const ViewCards = () => {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await getCards();
        setCards(data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };
    fetchCards();
  }, []);

  return (
    <div>
      <h2>View Cards</h2>
      {cards.length === 0 ? (
        <p>No cards available.</p>
      ) : (
        <ul>
          {cards.map((card) => (
            <li key={card.id}>
              <strong>Front:</strong> {card.front} <br />
              <strong>Back:</strong> {card.back}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewCards;
