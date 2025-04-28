import React, { useState, useEffect } from 'react';
import { getPracticeCards, recordPracticeResult, advanceDay, PracticeCard, AnswerDifficulty } from '../services/practiceApi';

const Practice: React.FC = () => {
  const [practiceCards, setPracticeCards] = useState<PracticeCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [advancingDay, setAdvancingDay] = useState(false);
  const [advanceDayMessage, setAdvanceDayMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPracticeCards();
  }, []);

  const fetchPracticeCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const cards = await getPracticeCards();
      if (cards.length === 0) {
        setSessionComplete(true);
      }
      setPracticeCards(cards);
      setCurrentIndex(0);
      setShowHint(false);
      setShowBack(false);
    } catch (err) {
      setError('Failed to load practice cards.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
  };

  const handleShowBack = () => {
    setShowBack(true);
  };

  const handleAnswer = async (difficulty: AnswerDifficulty) => {
    if (currentIndex >= practiceCards.length) return;
    const card = practiceCards[currentIndex];
    try {
      await recordPracticeResult(card.id, difficulty);
      const nextIndex = currentIndex + 1;
      if (nextIndex >= practiceCards.length) {
        setSessionComplete(true);
      } else {
        setCurrentIndex(nextIndex);
        setShowHint(false);
        setShowBack(false);
      }
    } catch {
      setError('Failed to record practice result.');
    }
  };

  const handleAdvanceDay = async () => {
    setAdvancingDay(true);
    setAdvanceDayMessage(null);
    try {
      await advanceDay();
      setAdvanceDayMessage('Day advanced successfully.');
      fetchPracticeCards();
    } catch {
      setAdvanceDayMessage('Failed to advance day.');
    } finally {
      setAdvancingDay(false);
    }
  };

  if (loading) {
    return <div>Loading practice cards...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (sessionComplete) {
    return (
      <div>
        <h2>Practice session complete!</h2>
        <button onClick={fetchPracticeCards}>Restart Practice</button>
        <button onClick={handleAdvanceDay} disabled={advancingDay}>
          {advancingDay ? 'Advancing Day...' : 'Advance Day'}
        </button>
        {advanceDayMessage && <p>{advanceDayMessage}</p>}
      </div>
    );
  }

  const currentCard = practiceCards[currentIndex];

  return (
    <div>
      <h2>Practice Session</h2>
      <div>
        <p><strong>Front:</strong> {currentCard.front}</p>
        {showHint && currentCard.hint && <p><strong>Hint:</strong> {currentCard.hint}</p>}
        {showBack && <p><strong>Back:</strong> {currentCard.back}</p>}
      </div>
      {!showHint && <button onClick={handleShowHint}>Show Hint</button>}
      {showHint && !showBack && <button onClick={handleShowBack}>Show Back</button>}
      {showBack && (
        <div>
          <button onClick={() => handleAnswer('wrong')}>Wrong</button>
          <button onClick={() => handleAnswer('hard')}>Hard</button>
          <button onClick={() => handleAnswer('easy')}>Easy</button>
        </div>
      )}
    </div>
  );
};

export default Practice;
