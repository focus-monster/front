import { useState } from "react";
import GoogleAuth from "./auth/google";
import { cn } from "@/lib/utils";

export function LoginPopup({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <>
      {open ? (
        <div
          style={{
            backgroundImage: "url(/square.png)",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className={cn(
            "absolute z-10 flex w-fit flex-col items-center justify-center gap-4 px-36 pb-12 pt-16",
            className,
          )}
        >
          <img
            src="/close.png"
            alt="close"
            className="absolute right-8 top-[18px] w-[19px] hover:cursor-pointer"
            onClick={() => {
              setOpen(false);
              onClick && onClick();
            }}
          />
          <p>Please log in to update your profile.</p>
          <GoogleAuth />
        </div>
      ) : null}
    </>
  );
}
