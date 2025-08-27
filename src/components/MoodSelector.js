import React from 'react';
import './MoodSelector.css'; // We will create this file next

const MoodSelector = () => {
  // Array of moods to create buttons dynamically
  const moods = ['Happy', 'Chill', 'Focus', 'Workout', 'Sad'];

  return (
    <div className="mood-selector-container">
      {moods.map((mood) => (
        <button key={mood} className="mood-card">
          {mood}
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;