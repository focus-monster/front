import { Outlet, useNavigate } from "react-router-dom";
import Loading from "../components/loading";
import { useAuth } from "../hooks/auth";
import Landing from "./landing";
import { useSessions } from "@/hooks/sessions";

export default function AuthLayout() {
  const { data, isLoading, error, isError } = useAuth();
  const { isLoading: isSessionsLoading } = useSessions();
  const navigate = useNavigate();

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (isLoading && isSessionsLoading) {
    return <Loading />;
  }

  if (data?.socialId === null) {
    return <Landing />;
  }

  const path = window.location.pathname;

  if (path === "/onboarding" && data?.verified === true) {
    navigate("/");
  }

  if (
    data?.verified === false &&
    path !== "/onboarding" &&
    data?.anonymous === false
  ) {
    navigate("/onboarding");
  }

  return <Outlet />;
}
