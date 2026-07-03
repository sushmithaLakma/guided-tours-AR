import { HashRouter, Route, Routes } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import { UserDataProvider } from "./context/UserDataContext";
import HomeScreen from "./screens/HomeScreen";
import TourDetailScreen from "./screens/TourDetailScreen";
import PlayerScreen from "./screens/PlayerScreen";
import MapScreen from "./screens/MapScreen";
import CityMapScreen from "./screens/CityMapScreen";
import ARScreen from "./screens/ARScreen";

function App() {
  return (
    <UserDataProvider>
      <PlayerProvider>
        <HashRouter>
          <div className="device-shell">
            <div className="device-frame no-scrollbar">
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/city/:cityId/map" element={<CityMapScreen />} />
                <Route path="/tour/:tourId" element={<TourDetailScreen />} />
                <Route path="/tour/:tourId/listen" element={<PlayerScreen />} />
                <Route path="/tour/:tourId/map" element={<MapScreen />} />
                <Route path="/tour/:tourId/ar/:stopId" element={<ARScreen />} />
              </Routes>
            </div>
          </div>
        </HashRouter>
      </PlayerProvider>
    </UserDataProvider>
  );
}

export default App;
