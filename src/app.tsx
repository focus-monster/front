import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Header } from "./components/header";
import Timer from "./components/timer";
import Tabs from "./components/tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  FocusDialog,
  FocusDialogProvider,
} from "./components/dialog/focus-dialog";
import AuthLayout from "./pages/auth-layout";
import { Toaster } from "sonner";
import { ErrorBoundary } from "./error-boundary";
import Landing from "./pages/landing";
import Onboarding from "./pages/onboarding";
import Settings from "./pages/settings";
import Collection from "./pages/collection";
import Today from "./pages/today";
import {
  ResultDialog,
  ResultDialogProvider,
} from "./components/dialog/result-dialog";
import PrivacyPolicy from "./pages/privacy-policy";
import UserAgreement from "./pages/user-agreement";
import {
  CollectionDialog,
  CollectionDialogProvider,
} from "./components/dialog/collection-dialog";
import { isMobile } from "react-device-detect";

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
            element: (
              <CollectionDialogProvider>
                <Collection />
                <CollectionDialog />
              </CollectionDialogProvider>
            ),
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

function MobileNotSupported() {
  return (
    <div className="fixed flex h-screen w-screen flex-col items-center justify-center">
      <img src="/block-monster.png" alt="block-monster" className="w-48" />
      <div className="pt-8 text-center text-white">
        <h1 className="text-xl font-bold">Please use PC</h1>
        <p className="pt-2">Mobile version is not supported.</p>
        <p className="">Please open the site on PC.</p>
      </div>
    </div>
  );
}

function App() {
  if (isMobile) {
    return <MobileNotSupported />;
  }

  return <RouterProvider router={router} />;
}

export default App;
