import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux"; // Importa el Provider
import store from "./redux/store"; // Importa el store que creaste
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
