import "bootstrap/dist/css/bootstrap.min.css";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Record from "./components/Record";
import RecordList from "./components/RecordList";
import Login from "./components/Login";
import Unauthorized from "./components/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";
import Home from "./components/Home";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/agents", element: <RecordList /> },
      { path: "/create", element: <Record /> },
      { path: "/edit/:id", element: <Record /> },
      { path: "/login", element: <Login /> },
      { path: "/unauthorized", element: <Unauthorized /> },
      // placeholder for next steps
      { path: "/transactions", element: <div>Transactions Page (Coming Next)</div> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);