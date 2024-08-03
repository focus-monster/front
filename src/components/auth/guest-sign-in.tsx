import { useMutation } from "@tanstack/react-query";
import { Auth } from "../../hooks/auth";
import { wait } from "../../utils";
import { queryClient } from "../../main";

const mutation = async () => {
  await wait(1000);

  return {
    socialId: "abc",
  };
};

export default function GuestSignIn() {
  const { mutate } = useMutation<Auth>({
    mutationKey: ["user"],
    mutationFn: mutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return (
    <button
      onClick={() => {
        mutate();
      }}
      className="mt-4 w-fit cursor-pointer text-sm text-white underline"
    >
      Access as a guest
    </button>
  );
}
