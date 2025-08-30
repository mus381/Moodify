import React from 'react';
import './PlaylistView.css'; // We'll create this next


const PlaylistView = ({ tracks }) => {

  // Add a check in case there are no tracks yet
  if (!tracks || tracks.length === 0) {
    return <p>Select a mood to generate a playlist!</p>;
  }
  return (
    <div className="playlist-container">
      <h2>Generated Playlist</h2>
      <ul className="playlist">
      {/* Map over the tracks from props */}
        {tracks.map(({ track }) => (
          <li key={track.id} className="track">
            <span className="track-title">{track.name}</span>
            <span className="track-artist">{track.artists[0].name}</span>
       
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistView;


