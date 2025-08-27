import React from 'react';
import './PlaylistView.css'; // We'll create this next

// Let's create some fake song data to work with
const fakePlaylist = [
  { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen' },
  { id: 2, title: 'Stairway to Heaven', artist: 'Led Zeppelin' },
  { id: 3, title: 'Hotel California', artist: 'Eagles' },
  { id: 4, title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses' },
  { id: 5, title: 'Smells Like Teen Spirit', artist: 'Nirvana' },
];

const PlaylistView = () => {
  return (
    <div className="playlist-container">
      <h2>Generated Playlist</h2>
      <ul className="playlist">
        {fakePlaylist.map((track) => (
          <li key={track.id} className="track">
            <span className="track-title">{track.title}</span>
            <span className="track-artist">{track.artist}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistView;