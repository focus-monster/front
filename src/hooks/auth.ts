import { useQuery } from "@tanstack/react-query";
import { wait } from "../utils";

export type Auth = {
  session: string | null;
};

// const initialData: Auth = {
//   session: null,
// };

const query = async () => {
  await wait(2000);

  return {
    session: "abc",
  } as Auth;
};

export function useAuth() {
  return useQuery<Auth>({
    queryKey: ["user"],
    queryFn: query,
    // initialData: initialData,
  });
}
