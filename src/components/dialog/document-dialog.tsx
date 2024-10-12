import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogHeader } from "../ui/dialog";
import { PropsWithChildren } from "react";

export default function DocumentDialog({
  color,
  title,
  children,
}: PropsWithChildren<{
  color: string;
  title: string;
}>) {
  return (
    <Dialog>
      <DialogTrigger>
        <button
          style={{
            backgroundImage: `radial-gradient(${color}, ${color})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            maskImage: "url(/black-button.png)",
            maskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskImage: "url(/black-button.png)",
            WebkitMaskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
          }}
          className="px-8 py-4"
        >
          {title}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl overflow-clip bg-white p-0">
        <DialogHeader className="bg-[#C2D5EB] py-4">
          <DialogTitle className="text-center text-2xl font-medium">
            {title}
          </DialogTitle>
          <DialogClose className="fixed right-4 top-2">
            <img className="w-9" src="/dialog-close.png" alt="close" />
          </DialogClose>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-scroll px-12 pb-12 pt-8">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
