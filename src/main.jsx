import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";
import "./sass/styles.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import taskReducer from "./reducers/taskReducer.js";
import listReducer from "./reducers/listReducer.js";
import focusReducer from "./reducers/focusReducer.js";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

const store = configureStore({
  reducer: {
    allTasks: taskReducer,
    allLists: listReducer,
    allFocuses: focusReducer,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
