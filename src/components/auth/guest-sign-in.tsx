import { queryClient } from "@/app";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Auth } from "../../hooks/auth";
import { Button } from "../ui/button";

const mutation = async () => {
  const response = await fetch("/api/users/signUpAnonymous", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en",
    },
    body: JSON.stringify({}),
  });
  if (!response.ok) {
    throw new Error("Failed to sign in as a guest: " + (await response.text()));
  }
  const data = (await response.json()) as Auth;

  window.localStorage.setItem("socialId", data.socialId!);

  return data as Auth;
};

export default function GuestSignIn() {
  const { mutate } = useMutation<Auth>({
    mutationKey: ["user"],
    mutationFn: mutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Button
      variant="link"
      className="mx-auto w-fit text-neutral-900 underline"
      onClick={() => {
        mutate();
      }}
    >
      Access as a guest
    </Button>
  );
}
