import { useMutation } from "@tanstack/react-query";
import { Auth, dummyAuth, useAuth } from "../hooks/auth";
import { queryClient } from "@/app";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="flex shrink-0 items-center justify-between p-6">
      <div className="flex items-center gap-3">
        <Link to="/">
          <img width="314px" height="33px" src="/logo.png" alt="focusmonster" />
        </Link>
      </div>
      <div>
        <AuthActions />
      </div>
    </header>
  );
}
function AuthActions() {
  const { data } = useAuth();
  const { mutate } = useMutation<Auth>({
    mutationKey: ["user"],
    mutationFn: async () => {
      localStorage.removeItem("socialId");

      return dummyAuth;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });

  if (!data) {
    return (
      <div className="flex items-center gap-3">
        <LogIn />
        <button className="rounded-lg bg-neutral-900 px-4 py-2 text-neutral-50">
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => mutate()}
      className="rounded-lg border-2 border-neutral-900 bg-neutral-50 px-4 py-2 text-neutral-900"
    >
      Log Out
    </button>
  );
}
function LogIn() {
  return (
    <button className="rounded-lg bg-neutral-100 px-4 py-2">Log In</button>
  );
}
