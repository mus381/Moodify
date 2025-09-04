import React from 'react';
import { motion } from 'framer-motion';
import './PlaylistView.css';

const PlaylistView = ({ tracks }) => {

  // A check in case the component is rendered with no tracks
  if (!tracks || tracks.length === 0) {
    // We return null instead of a message because App.js now handles the initial state
    return null;
  }

  return (
    <motion.div
      className="playlist-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }} // Defines how it animates out
      transition={{ duration: 0.5 }}
    >
      <h2>Generated Playlist</h2>
      <ul className="playlist">
        {tracks.map(({ track }, index) => ( // <-- Add index here
    <li key={track.id || track.uri || index} className="track"> 
            <span className="track-title">{track.name}</span>
            <span className="track-artist">{track.artists[0].name}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default PlaylistView;
