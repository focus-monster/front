import { PropsWithChildren, ReactNode } from "react";

type Folder = {
  insert?: ReactNode;
};

export default function Folder({
  children,
  insert,
}: PropsWithChildren<Folder>) {
  return (
    <div className="w-lg relative pl-16">
      <img className="w-full" src="/folder-back.png" />
      {insert ? <div className="absolute right-32 top-0">{insert}</div> : null}
      <img
        className="absolute bottom-0 right-0 w-full"
        src="/folder-front.png"
      />
      <div className="isolate z-10">{children}</div>
    </div>
  );
}
