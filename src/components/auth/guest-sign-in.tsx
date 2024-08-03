import { useMutation } from "@tanstack/react-query";
import { Auth } from "../../hooks/auth";
import { queryClient } from "../../main";
import { Button } from "../ui/button";

const mutation = async () => {
  const response = await fetch("/api/users/signUpAnonymous", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const data = await response.json();

  window.localStorage.setItem("socialId", data.socialId);

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
    <Button
      variant="link"
      className="mx-auto w-fit text-white underline"
      onClick={() => {
        mutate();
      }}
    >
      Access as a guest
    </Button>
  );
}
