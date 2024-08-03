import { useMutation } from "@tanstack/react-query";
import { Auth } from "../../hooks/auth";
import { queryClient } from "../../main";

const mutation = async () => {
  const response = await fetch("/api/users/signUpAnonymous", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const data = await response.json();

  return data as Auth;
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
