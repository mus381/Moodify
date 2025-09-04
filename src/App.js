import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import MoodSelector from './components/MoodSelector';
import PlaylistView from './components/PlaylistView';
import MoodInput from './components/MoodInput';
import FaceMoodDetector from './components/FaceMoodDetector';

// --- Page Animation Variants ---
const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
    scale: 0.8
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: "100vw",
    scale: 1.2
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};


// --- HomePage Component ---
const HomePage = ({ onMoodSelect }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="page"
    >
      <h1>Moodify</h1>
      <MoodSelector onMoodSelected={onMoodSelect} />
      <MoodInput onMoodDetected={onMoodSelect} />
      <FaceMoodDetector onMoodDetected={onMoodSelect} />
    </motion.div>
  );
};


// --- PlaylistPage Component ---
const PlaylistPage = ({ mood, tracks, onGoBack }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="page"
    >
      <button onClick={onGoBack} className="back-button">← Back</button>
      <h2 className="playlist-page-title">Here's your <span className="mood-highlight">{mood}</span> playlist</h2>
      <PlaylistView tracks={tracks} />
    </motion.div>
  );
};


// --- Main App Component (acts as a router) ---
function App() {
  const [page, setPage] = useState('home'); // 'home' or 'playlist'
  const [currentMood, setCurrentMood] = useState('');
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

    const accessToken = 'BQDGEso9ITWW8fnQUMM5esyIHhNh_PhFzfJ9WBYi5xXIn2QDvmbYI8OhsJz09Ywc5TPsqPoW_oPCJrOVrFO3WpV94f-Fof8LaRaY25iY8sPRusocLb_ev3OJTk_t2kUUQjyJknzmQl8';

  const moodToSearchQueryMap = React.useMemo(() => ({
    happy: 'Happy Hits!',
    chill: 'lofi beats',
    focus: 'Focus Music',
    workout: 'Workout Hits',
    sad: 'Sad Indie'
  }), []);

  const handleMoodSelection = useCallback(async (mood) => {
    setIsLoading(true);
    setTracks([]); 

    const searchQuery = moodToSearchQueryMap[mood] || 'popular playlists';
    const encodedSearchQuery = encodeURIComponent(searchQuery);
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodedSearchQuery}&type=playlist&limit=5`;

    try {
      const response = await fetch(searchUrl, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        throw new Error(`Spotify API Error: ${response.status}`);
      }
      
      const data = await response.json();

      if (!data?.playlists?.items?.length) {
        throw new Error(`No playlists found for search: ${searchQuery}`);
      }

      const randomPlaylist = data.playlists.items[Math.floor(Math.random() * data.playlists.items.length)];
      const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${randomPlaylist.id}/tracks`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      if (!tracksResponse.ok) {
        throw new Error('Could not fetch tracks for the found playlist.');
      }
        
      const tracksData = await tracksResponse.json();

      if (tracksData && tracksData.items) {
        setTracks(tracksData.items);
        setCurrentMood(mood);
        setPage('playlist'); // Navigate to the playlist page on success
      }
    } catch (error) {
      console.error("Error in handleMoodSelection:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, moodToSearchQueryMap]);

  const navigateHome = () => {
    setPage('home');
  }

  return (
    <div className="App">
       {isLoading && <div className="loading-overlay"><div></div><div></div><div></div></div>}
      <AnimatePresence mode="wait">
        {page === 'home' && <HomePage key="home" onMoodSelect={handleMoodSelection} />}
        {page === 'playlist' && <PlaylistPage key="playlist" mood={currentMood} tracks={tracks} onGoBack={navigateHome} />}
      </AnimatePresence>
    </div>
  );
}

export default App;

