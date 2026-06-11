import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { ProfileProvider } from "./contexts/ProfileContext";
import "./styles.css";

// Le profil est unique et utilisé partout (TopBar du Layout, pages /profile/*).
// On hisse le provider à la racine — un seul fetch initial pour toute la session.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ProfileProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProfileProvider>
  </React.StrictMode>,
);
