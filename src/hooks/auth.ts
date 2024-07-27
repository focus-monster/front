import { useEffect, useState } from "react";

type Auth = {
  session: string | null;
  loading: boolean;
};

export function useAuth() {
  const [auth, setAuth] = useState<Auth>({
    session: null,
    loading: true,
  });

  useEffect(() => {
    setTimeout(() => {
      setAuth((prev) => ({
        ...prev,
        loading: false,
        session: "asdf",
      }));
    }, 1000);
  }, []);

  return auth;
}
