import { useEffect, useRef } from "react";

export function useTitle(title: string) {
  const documentDefined = typeof document !== "undefined";
  const originalTitle = useRef(documentDefined ? document.title : null);

  useEffect(() => {
    if (!documentDefined) return;

    if (document.title !== title)
      document.title = `${title} - ${originalTitle.current}`;

    return () => {
      document.title = originalTitle.current || document.title;
    };
  }, [documentDefined, title]);
}
