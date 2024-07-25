import { PropsWithChildren, ReactNode } from "react";

type Folder = {
  insert?: ReactNode;
  className?: string;
};

export default function Folder({
  className,
  children,
  insert,
}: PropsWithChildren<Folder>) {
  return (
    <div className="relative">
      <img className="w-[34rem]" src="/folder-back.png" />
      {insert ? (
        <div className="absolute right-[4rem] top-0">{insert}</div>
      ) : null}
      <img
        className="absolute bottom-0 right-0 w-[37rem] max-w-none"
        src="/folder-front.png"
      />
      <div
        className={
          "absolute inset-6 isolate z-10 grid items-end justify-center"
        }
      >
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}
