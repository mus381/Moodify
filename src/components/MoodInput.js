import React, { useState } from 'react';
import Sentiment from 'sentiment'; // Import the library
import './MoodInput.css'; // We'll create this next

const MoodInput = React.memo(({ onMoodDetected }) => {
  const [text, setText] = useState('');
  const sentiment = new Sentiment();

  const handleAnalyzeClick = () => {
    if (!text) return; // Don't do anything if the input is empty

    const result = sentiment.analyze(text);
    let mood;

    // --- This is the core logic ---
    // We map the sentiment score to one of our moods
    if (result.score > 2) {
      mood = 'happy';
    } else if (result.score < -2) {
      mood = 'sad';
    } else if (result.comparative > 0.5) {
      mood = 'workout'; // High energy, positive
    } else {
      mood = 'chill'; // Default to chill for neutral or mild feelings
    }

    console.log(`Text: "${text}", Score: ${result.score}, Detected Mood: ${mood}`);
    onMoodDetected(mood); // Send the detected mood back up to App.js
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