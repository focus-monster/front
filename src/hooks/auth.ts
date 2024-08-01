import { useQuery } from "@tanstack/react-query";

export type Auth = {
  session: string | null;
};

// const initialData: Auth = {
//   session: null,
// };

const query = async () => {
  return {
    session: "null",
  } as Auth;
};

export function useAuth() {
  return useQuery<Auth>({
    queryKey: ["user"],
    queryFn: query,
    // initialData: initialData,
  });
}
