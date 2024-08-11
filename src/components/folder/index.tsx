import { PropsWithChildren, ReactNode } from "react";

type Folder = {
  insert?: ReactNode;
  title?: ReactNode;
  className?: string;
  landing: "" | "-landing";
};

export default function Folder({
  insert,
  title,
  className,
  landing = "",
  children,
}: PropsWithChildren<Folder>) {
  return (
    <div className="relative w-full">
      <img
        className=""
        src={`/folder-back${landing}.png`}
        width={landing === "" ? "688px" : "860px"}
      />
      {title ? title : null}
      {insert ? insert : null}
      <img
        className="absolute bottom-0 right-0"
        src={`/folder-front${landing}.png`}
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
