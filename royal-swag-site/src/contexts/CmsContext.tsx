"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_CMS_CONTENT } from "@/lib/cms-defaults";

type CmsSections = typeof DEFAULT_CMS_CONTENT;

type CmsContextValue = {
  sections: CmsSections;
  loaded: boolean;
};

const CmsContext = createContext<CmsContextValue>({
  sections: DEFAULT_CMS_CONTENT as CmsSections,
  loaded: false,
});

export function CmsProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<CmsSections>(
    DEFAULT_CMS_CONTENT as CmsSections
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cms/public")
      .then((r) => (r.ok ? r.json() : null))
      .then((json: { sections?: CmsSections } | null) => {
        if (cancelled || !json?.sections) return;
        setSections(json.sections);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <CmsContext.Provider value={{ sections, loaded }}>{children}</CmsContext.Provider>
  );
}

export function useCms() {
  return useContext(CmsContext);
}
