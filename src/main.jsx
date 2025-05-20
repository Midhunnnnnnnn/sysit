import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { LogInContextProvider } from "./Context/LogInContext/Login.jsx";
import ErrorBoundary from "./components/constants/Error.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./Context/DarkMode/ThemeProvider.jsx";
import { RefProvider } from "./Context/RefContext/RefContext.jsx";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    if (window.confirm("New content available! Reload?")) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log("App is ready to work offline!");
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Auth0Provider
        domain={import.meta.env.VITE_DOMAIN_NAME}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <RefProvider>
          <LogInContextProvider>
            <ErrorBoundary>
              <Toaster />
              <App />
            </ErrorBoundary>
          </LogInContextProvider>
        </RefProvider>
      </Auth0Provider>
    </ThemeProvider>
  </BrowserRouter>
);
