import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ImageProvider from "./context";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ImageProvider>
      <App />
    </ImageProvider>
  </React.StrictMode>
);
