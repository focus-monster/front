import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./assets/doodle.css/doodle.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./pages/auth-layout.tsx";
import Landing from "./pages/landing.tsx";
import App from "./app.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/landing",
        element: <Landing />,
      },
      {
        path: "/",
        element: <App />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
