import './App.css';
import MoodSelector from './components/MoodSelector';
import PlaylistView from './components/PlaylistView'; // <-- IMPORT IT

function App() {
  return (
    <div className="App">
      <h1>Moodify</h1>
      <MoodSelector />
      <PlaylistView /> {/* <-- RENDER IT HERE */}
    </div>
  );
}

export default App;