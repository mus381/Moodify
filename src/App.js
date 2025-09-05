import React from 'react';
import { create } from 'zustand';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

// Component Imports - These are now also memoized for performance
import MoodSelector from './components/MoodSelector';
import PlaylistView from './components/PlaylistView';
import MoodInput from './components/MoodInput';
import FaceMoodDetector from './components/FaceMoodDetector';

// --- ZUSTAND STORE: The Application's Brain ---

const accessToken = 'BQDtP3SjttwrWvpb5IonxDg9rVZKXjfJ8L2sLJ3xiL__UBIa80hc383_RJFFcx-4cmBjO4mbsHppVMu8KJ-3cg4Gv6fmfpNQH-rfEk--h4g5Tx8W41XkqwAAKgQNtmheXAU3aMV5BDg';

const moodToSearchQueryMap = {
  happy: 'Happy Hits!',
  chill: 'lofi beats',
  focus: 'Focus Music',
  workout: 'Workout Hits',
  sad: 'Sad Indie'
};

const useAppStore = create((set) => ({
  // STATE: The single source of truth for our app's data.
  page: 'home',
  currentMood: '',
  tracks: [],
  isLoading: false,

  // ACTIONS: The only functions that can modify the state.
  navigateHome: () => set({ page: 'home', currentMood: '', tracks: [] }),

  fetchPlaylist: async (mood) => {
    set({ isLoading: true, tracks: [] });

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
        set({
          tracks: tracksData.items,
          currentMood: mood,
          page: 'playlist'
        });
      }
    } catch (error) {
      console.error("Error in fetchPlaylist action:", error);
      alert(error.message);
    } finally {
      set({ isLoading: false });
    }
  }
}));

// --- Page Animation Variants ---
const pageVariants = {
  initial: { opacity: 0, x: "-100vw", scale: 0.8 },
  in: { opacity: 1, x: 0, scale: 1 },
  out: { opacity: 0, x: "100vw", scale: 1.2 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

// --- OPTIMIZATION: Memoized Page Components ---

const HomePage = React.memo(() => {
  const fetchPlaylist = useAppStore((state) => state.fetchPlaylist);
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
      <MoodSelector onMoodSelected={fetchPlaylist} />
      <MoodInput onMoodDetected={fetchPlaylist} />
      <FaceMoodDetector onMoodDetected={fetchPlaylist} />
    </motion.div>
  );
});

const PlaylistPage = React.memo(() => {
  const { currentMood, tracks, navigateHome } = useAppStore();
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="page"
    >
      <button onClick={navigateHome} className="back-button">← Back</button>
      <h2 className="playlist-page-title">Here's your <span className="mood-highlight">{currentMood}</span> playlist</h2>
      <PlaylistView tracks={tracks} />
    </motion.div>
  );
});

// --- Main App Component ---
function App() {
  const page = useAppStore((state) => state.page);
  const isLoading = useAppStore((state) => state.isLoading);

  return (
    <div className="App">
      {isLoading && <div className="loading-overlay"><div></div><div></div><div></div></div>}
      <AnimatePresence mode="wait">
        {page === 'home' && <HomePage key="home" />}
        {page === 'playlist' && <PlaylistPage key="playlist" />}
      </AnimatePresence>
    </div>
  );
}

export default App;

