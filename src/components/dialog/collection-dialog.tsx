import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Session } from "@/hooks/sessions";
import { Evaluation } from "@/pages/session-card";
import { Time } from "@/pages/today";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

export const CollectionDialogContext = createContext(
  {} as {
    open: boolean;
    setOpen: (open: boolean) => void;
    collection: Session[] | null;
    setCollection: (result: Session[] | null) => void;
  },
);

export const CollectionDialogProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [collection, setCollection] = useState<Session[] | null>(null);
  console.log(open, collection);

  return (
    <CollectionDialogContext.Provider
      value={{
        open,
        setOpen,
        collection,
        setCollection,
      }}
    >
      {children}
    </CollectionDialogContext.Provider>
  );
};

export function CollectionDialog() {
  const { open, setOpen, collection } = useContext(CollectionDialogContext);

  if (!collection)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          style={{
            backgroundImage: 'url("/box-lg.png")',
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            width: "694px",
            height: "602px",
          }}
          className=""
        ></DialogContent>
      </Dialog>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0">
        <DialogTitle className="sr-only"></DialogTitle>
        <div className="scrol flex snap-x snap-mandatory gap-[180px] overflow-x-scroll">
          <div className="w-[180px] shrink-0"></div>
          {collection.map((session) => {
            return (
              <div
                key={session.id}
                style={{
                  backgroundImage: 'url("/box-lg-plain.png")',
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  width: "694px",
                  height: "602px",
                }}
                className="shrink-0 snap-center"
              >
                <div className="w-full py-5 text-center">
                  <Time session={session} />
                </div>
                <div className="px-10 py-6">
                  <img
                    src={session.image}
                    className="h-[300px] overflow-clip rounded-lg border-2 object-contain"
                  />
                </div>
                <div className="px-10 py-6">
                  <Evaluation evaluation={session.evaluation} />
                </div>
              </div>
            );
          })}
          <div className="w-[180px] shrink-0 font-semibold"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
