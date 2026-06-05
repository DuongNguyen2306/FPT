import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SITE_NAME } from "./lib/contact.js";
import "./index.css";

document.title = SITE_NAME;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
