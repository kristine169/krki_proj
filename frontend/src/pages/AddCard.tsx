import React, { useState } from 'react';
import { addCard as apiAddCard } from '../services/api';

const AddCard = () => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [hint, setHint] = useState('');
  const [tags, setTags] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      await apiAddCard({ front, back, hint, tags: tagsArray });
      setMessage('Card added successfully!');
      setFront('');
      setBack('');
      setHint('');
      setTags('');
    } catch (error) {
      setMessage('Failed to add card.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Add New Card</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Front:</label>
          <input type="text" value={front} onChange={e => setFront(e.target.value)} required />
        </div>
        <div>
          <label>Back:</label>
          <input type="text" value={back} onChange={e => setBack(e.target.value)} required />
        </div>
        <div>
          <label>Hint:</label>
          <input type="text" value={hint} onChange={e => setHint(e.target.value)} />
        </div>
        <div>
          <label>Tags (comma separated):</label>
          <input type="text" value={tags} onChange={e => setTags(e.target.value)} />
        </div>
        <button type="submit">Add Card</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddCard;
