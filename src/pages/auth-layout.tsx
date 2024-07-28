import { Outlet } from "react-router-dom";
import Loading from "../components/loading";
import { useAuth } from "../hooks/auth";
import Landing from "./landing";

export default function AuthLayout() {
  const { data, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (data?.session === null) {
    return <Landing />;
  }

  return <Outlet />;
}
