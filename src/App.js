import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import MoodInput from './components/MoodInput';     
import MoodSelector from './components/MoodSelector';
import PlaylistView from './components/PlaylistView';

function App() {
  const [tracks, setTracks] = useState([]);

  // This is where you will paste your new token each time it expires.
  const accessToken = 'BQClZisbSlioqd8JoX0OTcn0cbzIDJfh5ELS-UQStQ6ve3DJM8XyKchw4Z2GNI1gMfgJ5zcW_kecmTqaa_C8xuCyByagxf60mj5zaKKVHP11lEBZl4y8HVBNSymoK-gBTyozp7V32E8';

  const getPlaylist = async (mood) => {
    const searchUrl = `https://api.spotify.com/v1/search?q=${mood}&type=playlist&limit=1`;
    
    try {
      const response = await fetch(searchUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // Handle cases where the token has expired
      if (response.status === 401) {
          alert("Your Spotify token has expired. Please get a new one and update the App.js file.");
          return;
      }

      const data = await response.json();

      if (!data.playlists || data.playlists.items.length === 0) {
        console.error(`No playlists found for the mood: ${mood}`);
        alert(`Sorry, we couldn't find any playlists for "${mood}". Please try another!`);
        setTracks([]);
        return;
      }

      const playlistId = data.playlists.items[0].id;
      const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const tracksData = await tracksResponse.json();

      if (tracksData.items) {
        setTracks(tracksData.items);
      } else {
        setTracks([]);
      }

    } catch (error) {
      console.error("Error fetching from Spotify API:", error);
      alert("There was an error communicating with Spotify. Please check the console.");
    }
  };

  // ... inside the App.js component ...

  return (
    <div className="App">
      <h1>Moodify</h1>
      <MoodSelector onMoodSelected={getPlaylist} />

      {/* --- ADD THE NEW COMPONENT HERE --- */}
      <MoodInput onMoodDetected={getPlaylist} />

      <AnimatePresence>
        {tracks.length > 0 && (
          <PlaylistView tracks={tracks} />
        )}
      </AnimatePresence>
    </div>
  );
}

  export default App;

 

