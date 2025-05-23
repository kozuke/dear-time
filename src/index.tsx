import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SplashScreen } from "./screens/SplashScreen";
import { InitialSetupScreen } from "./screens/InitialSetupScreen";
import { StitchDesign as HomeScreen } from "./screens/StitchDesign";
import { SettingsScreen } from "./screens/SettingsScreen";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/setup" element={<InitialSetupScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </Router>
  </StrictMode>
);