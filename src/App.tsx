import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PlayerProvider } from "./context/PlayerContext";
import { UserDataProvider } from "./context/UserDataContext";
import { CityProvider } from "./context/CityContext";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import EateriesScreen from "./screens/EateriesScreen";
import TourDetailScreen from "./screens/TourDetailScreen";
import PlayerScreen from "./screens/PlayerScreen";
import MapScreen from "./screens/MapScreen";
import CityMapScreen from "./screens/CityMapScreen";
import ARScreen from "./screens/ARScreen";

function AppShell() {
  const { profile } = useAuth();

  if (!profile) return <SignUpScreen />;

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/favorites" element={<FavoritesScreen />} />
      <Route path="/eateries" element={<EateriesScreen />} />
      <Route path="/city/:cityId/map" element={<CityMapScreen />} />
      <Route path="/tour/:tourId" element={<TourDetailScreen />} />
      <Route path="/tour/:tourId/listen" element={<PlayerScreen />} />
      <Route path="/tour/:tourId/map" element={<MapScreen />} />
      <Route path="/tour/:tourId/ar/:stopId" element={<ARScreen />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <CityProvider>
          <PlayerProvider>
            <HashRouter>
              <div className="device-shell">
                <div className="device-frame no-scrollbar">
                  <AppShell />
                </div>
              </div>
            </HashRouter>
          </PlayerProvider>
        </CityProvider>
      </UserDataProvider>
    </AuthProvider>
  );
}

export default App;
