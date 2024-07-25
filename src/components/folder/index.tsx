import { PropsWithChildren, ReactNode } from "react";

type Folder = {
  insert?: ReactNode;
  title?: ReactNode;
  className?: string;
};

export default function Folder({
  insert,
  title,
  className,
  children,
}: PropsWithChildren<Folder>) {
  return (
    <div className="relative w-[34rem]">
      <img className="" src="/folder-back.png" />
      {title ? (
        <div className="absolute left-[4.5rem] top-[1.5rem] text-2xl font-bold">
          {title}
        </div>
      ) : null}
      {insert ? (
        <div className="absolute right-[4rem] top-0">{insert}</div>
      ) : null}
      <img
        className="absolute bottom-0 right-0 w-[37rem] max-w-none"
        src="/folder-front.png"
      />
      <div
        className={
          "absolute inset-8 isolate z-10 grid items-end justify-center"
        }
      >
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}
