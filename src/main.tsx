import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./assets/doodle.css/doodle.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./pages/auth-layout.tsx";
import Landing from "./pages/landing.tsx";
import App from "./app.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Today from "./pages/today.tsx";
import Collection from "./pages/collection.tsx";
import Settings from "./pages/settings.tsx";
import Onboarding from "./pages/onboarding.tsx";
import { Toaster } from "sonner";

export const queryClient = new QueryClient();

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
        path: "/onboarding",
        element: <Onboarding />,
      },
      {
        path: "/",
        element: <App />,
        children: [
          {
            path: "/settings",
            element: <Settings />,
          },
          {
            path: "/collection",
            element: <Collection />,
          },
          {
            path: "/",
            element: <Today />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors closeButton position="top-center" />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
);
