import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Transactions from "./components/Transactions";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import Record from "./components/Record";
import RecordList from "./components/RecordList";
import Login from "./components/Login";
import Unauthorized from "./components/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateUser from "./components/CreateUser";
import { NoticeProvider } from "./context/NoticeContext";
import Report from "./components/Report";
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
      //Create User 
      {
        path: "create-user",
        element: (
          <ProtectedRoute>
            <CreateUser />
          </ProtectedRoute>
        ),
      },
      // Transactions placeholder for later (so Home button doesn't 404)
      {
        path: "transactions",
        element: (
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
         ),
      },

      {
         path: "report",
         element: (
          <ProtectedRoute>
            <Report />
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