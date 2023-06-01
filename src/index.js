import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./Pages/App/App";
import { Provider } from "react-redux";
import { store } from "./Store/store";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
