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
    <div className="relative w-full">
      <img className="" src="/folder-back.png" />
      {title ? title : null}
      {insert ? insert : null}
      <img className="absolute bottom-0 right-0" src="/folder-front.png" />
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
