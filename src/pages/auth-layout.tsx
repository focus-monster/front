import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";
import { useEffect } from "react";
import Loading from "../components/loading";

export default function AuthLayout() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.loading) {
      return;
    }
    if (!auth.session) {
      navigate("/Landing");
    }
  }, [auth, navigate]);

  if (auth.loading) {
    return <Loading />;
  }

  return (
    <div className="">
      <Outlet />
    </div>
  );
}
