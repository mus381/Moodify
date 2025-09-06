import React, { useEffect } from 'react';
import { create } from 'zustand';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

// Component Imports
import MoodSelector from './components/MoodSelector';
import PlaylistView from './components/PlaylistView';
import MoodInput from './components/MoodInput';
import FaceMoodDetector from './components/FaceMoodDetector';

// --- ZUSTAND STORE: The Application's Brain ---

const moodToSearchQueryMap = {
  happy: 'Happy Hits!',
  chill: 'lofi beats',
  focus: 'Focus Music',
  workout: 'Workout Hits',
  sad: 'Sad Indie'
};

const useAppStore = create((set, get) => ({
  // STATE
  accessToken: null,
  isInitialized: false,
  page: 'home',
  currentMood: '',
  tracks: [],
  isLoading: false,

  // ACTIONS
  navigateHome: () => set({ page: 'home', currentMood: '', tracks: [] }),

  initializeToken: async () => {
    try {
      const response = await fetch('/.netlify/functions/get-spotify-token');
      if (!response.ok) {
        throw new Error('Serverless function failed to respond.');
      }
      const data = await response.json();

      if (data.accessToken) {
        set({ accessToken: data.accessToken, isInitialized: true });
      } else {
        throw new Error('Failed to retrieve access token from serverless function.');
      }
    } catch (error) {
      console.error("Initialization Error:", error);
      alert("Could not initialize connection with Spotify. Please try refreshing.");
      set({ isInitialized: false }); // Mark as failed
    }
  },

  fetchPlaylist: async (mood) => {
    const { accessToken, isInitialized } = get();
    if (!isInitialized || !accessToken) {
      alert("App is not authenticated. Please refresh.");
      return;
    }

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
  initial: { opacity: 0, x: "-100vw" },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: "100vw" }
};
const pageTransition = { type: "tween", ease: "anticipate", duration: 0.5 };

// --- Memoized Page Components ---

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
  const isInitialized = useAppStore((state) => state.isInitialized);
  const initializeToken = useAppStore((state) => state.initializeToken);

  useEffect(() => {
    // Only initialize once
    if (!isInitialized) {
      initializeToken();
    }
  }, [isInitialized, initializeToken]);

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



