import { HashRouter, Route, Routes } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import HomeScreen from "./screens/HomeScreen";
import TourDetailScreen from "./screens/TourDetailScreen";
import PlayerScreen from "./screens/PlayerScreen";
import MapScreen from "./screens/MapScreen";
import ARScreen from "./screens/ARScreen";

function App() {
  return (
    <PlayerProvider>
      <HashRouter>
        <div className="device-shell">
          <div className="device-frame no-scrollbar">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/tour/:tourId" element={<TourDetailScreen />} />
              <Route path="/tour/:tourId/listen" element={<PlayerScreen />} />
              <Route path="/tour/:tourId/map" element={<MapScreen />} />
              <Route path="/tour/:tourId/ar/:stopId" element={<ARScreen />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </PlayerProvider>
  );
}

export default App;
