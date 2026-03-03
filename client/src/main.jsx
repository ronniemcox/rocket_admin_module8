import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import Record from "./components/Record";
import RecordList from "./components/RecordList";
import Login from "./components/Login";
import Unauthorized from "./components/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";

import { NoticeProvider } from "./context/NoticeContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // HOME page (cards)
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },

      // AGENTS page (your RecordList table)
      {
        path: "agents",
        element: (
          <ProtectedRoute>
            <RecordList />
          </ProtectedRoute>
        ),
      },

      // Create agent
      {
        path: "create",
        element: (
          <ProtectedRoute>
            <Record />
          </ProtectedRoute>
        ),
      },

      // Edit agent
      {
        path: "edit/:id",
        element: (
          <ProtectedRoute>
            <Record />
          </ProtectedRoute>
        ),
      },

      // Transactions placeholder for later (so Home button doesn't 404)
      {
        path: "transactions",
        element: (
          <ProtectedRoute>
            <div className="mt-4">
              <h2>Transactions</h2>
              <p>Coming next step.</p>
            </div>
          </ProtectedRoute>
        ),
      },

      // Login + Unauthorized
      { path: "login", element: <Login /> },
      { path: "unauthorized", element: <Unauthorized /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NoticeProvider>
      <RouterProvider router={router} />
    </NoticeProvider>
  </React.StrictMode>
);