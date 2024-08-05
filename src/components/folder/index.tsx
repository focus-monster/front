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
      {title ? (
        <div
          style={{
            backgroundImage: "url(/word-border.png)",
            backgroundSize: "100% 80%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className="absolute left-[1.5rem] top-[1.5rem] w-fit min-w-[200px] p-4 text-center"
        >
          {title}
        </div>
      ) : null}
      {insert ? (
        <div className="absolute right-[4rem] top-0">{insert}</div>
      ) : null}
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
