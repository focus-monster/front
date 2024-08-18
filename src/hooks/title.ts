import { useEffect, useRef } from "react";

export function useTitle(title: string, isFocusing: boolean) {
  const documentDefined = typeof document !== "undefined";
  const originalTitle = useRef(documentDefined ? document.title : null);

  useEffect(() => {
    if (!documentDefined) return;
    if (isFocusing) {
      if (document.title !== title)
        document.title = `${title} - ${originalTitle.current}`;
    } else {
      document.title = originalTitle.current || document.title;
    }
  }, [documentDefined, title, isFocusing]);
}
