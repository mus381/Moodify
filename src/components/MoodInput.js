import React, { useState } from 'react';
import Sentiment from 'sentiment';
import './MoodInput.css';

const MoodInput = React.memo(({ onMoodDetected }) => {
  const [text, setText] = useState('');
  const sentiment = new Sentiment();

  const handleAnalyzeClick = () => {
    if (!text) return;

    const result = sentiment.analyze(text);
    let mood;

    if (result.score > 2) {
      mood = 'happy';
    } else if (result.score < -2) {
      mood = 'sad';
    } else if (result.comparative > 0.5) {
      mood = 'workout';
    } else {
      mood = 'chill';
    }

    onMoodDetected(mood);
  };

  return (
    <div className="mood-input-container">
      <p>Or, tell me how you feel:</p>
      <input
        type="text"
        className="mood-input-box"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g., 'Today was amazing!'"
      />
      <button onClick={handleAnalyzeClick} className="analyze-button">
        Generate from Text
      </button>
    </div>
  );
});

export default MoodInput;



