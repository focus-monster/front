import { Outlet, useNavigate } from "react-router-dom";
import Loading from "../components/loading";
import { useAuth } from "../hooks/auth";
import Landing from "./landing";

export default function AuthLayout() {
  const { data, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  if (data?.socialId === null) {
    return <Landing />;
  }

  if (data?.verified === false) {
    navigate("/onboarding");
  }

  return <Outlet />;
}
