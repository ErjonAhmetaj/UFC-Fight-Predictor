import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "./App";
import FighterList from "./components/FighterList";
import FighterProfile from "./components/FighterProfile";
import FightPredictor from "./components/FightPredictor";
import "./index.css";

// Error boundary component
const ErrorBoundary = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 text-center bg-white rounded-lg shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Oops! Something went wrong</h1>
        <p className="mb-4 text-gray-600">We're sorry, but there was an error loading this page.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <FighterList />,
      },
      {
        path: "fighter/:id",
        element: <FighterProfile />,
      },
      {
        path: "predict",
        element: <FightPredictor />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);