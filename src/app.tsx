import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Header } from "./components/header";
import Timer from "./components/timer";
import Tabs from "./components/tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FocusDialog, FocusDialogProvider } from "./components/focus-dialog";
import AuthLayout from "./pages/auth-layout";
import { Toaster } from "sonner";
import { ErrorBoundary } from "./error-boundary";
import Landing from "./pages/landing";
import Onboarding from "./pages/onboarding";
import Settings from "./pages/settings";
import Collection from "./pages/collection";
import Today from "./pages/today";
import { ResultDialog, ResultDialogProvider } from "./components/result-dialog";
import PrivacyPolicy from "./pages/privacy-policy";
import UserAgreement from "./pages/user-agreement";

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/user-agreement",
    element: <UserAgreement />,
  },
  {
    path: "/",
    element: (
      <QueryClientProvider client={queryClient}>
        <ResultDialogProvider>
          <FocusDialogProvider>
            <AuthLayout />
            <FocusDialog />
            <ResultDialog />
          </FocusDialogProvider>
        </ResultDialogProvider>
        <Toaster richColors closeButton position="top-center" />
      </QueryClientProvider>
    ),
    errorElement: <ErrorBoundary />,
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
        element: <MainPage />,
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

function MainPage() {
  return (
    <>
      <Header />
      <Timer />
      <Tabs />
      <Outlet />
    </>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
