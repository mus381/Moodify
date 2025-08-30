import React, { useState } from 'react';
import './App.css';
import MoodSelector from './components/MoodSelector';
import PlaylistView from './components/PlaylistView';

function App() {
  // State to hold the playlist tracks. Starts as an empty array.
  const [tracks, setTracks] = useState([]);

  // Your temporary access token. Remember, this expires after one hour.
  const accessToken = 'BQC5NEJ3sH-dzyQXe5k50kszQMl4A39-80s3iW_8ST2JvQc4xkJN-JMR3UwZ4gUffaD2EikiPm0_x2bYQ3KVdZK8W61TOLR2d_eRhX3QqO3qMVgqNILjBtbBLLIxGVpdZJYJYsFKEUM';

  /**
   * Fetches a playlist from Spotify based on the selected mood.
   * @param {string} mood - The mood keyword to search for (e.g., "happy", "focus").
   */
  const getPlaylist = async (mood) => {
    const searchUrl = `https://api.spotify.com/v1/search?q=${mood}&type=playlist&limit=1`;
    
    try {
      // First, search for a playlist that matches the mood
      const response = await fetch(searchUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = await response.json();

      // --- RESILIENCE CHECK ---
      // This is the critical fix: check if the search returned any playlists.
      if (!data.playlists || data.playlists.items.length === 0) {
        console.error(`No playlists found for the mood: ${mood}`);
        // NOTE: alert() is used for simplicity. In a real app, you'd use a styled modal.
        alert(`Sorry, we couldn't find any playlists for "${mood}". Please try another!`);
        setTracks([]); // Clear any previous playlist from the view
        return; // Exit the function to prevent errors
      }
      // --- END OF FIX ---

      // If the check passes, it's safe to get the ID of the first playlist.
      const playlistId = data.playlists.items[0].id;

      // Now, use the playlist ID to get its tracks
      const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const tracksData = await tracksResponse.json();

      // Update our state with the fetched tracks, ensuring we have valid data
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

  return (
    <div className="App">
      <h1>Moodify</h1>
      {/* Pass the getPlaylist function down to the MoodSelector */}
      <MoodSelector onMoodSelected={getPlaylist} />
      {/* Pass the tracks from our state down to the PlaylistView */}
      <PlaylistView tracks={tracks} />
    </div>
  );
}

export default App;
