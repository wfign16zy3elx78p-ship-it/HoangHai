import { useState, useEffect } from "react";

const NAV_EVENT = "byd-spa-navigate";

export function useRouter() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener("popstate", sync);
    window.addEventListener(NAV_EVENT, sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(NAV_EVENT, sync);
    };
  }, []);

  const navigate = (to: string) => {
    window.history.pushState(null, "", to);
    window.dispatchEvent(new Event(NAV_EVENT));
    window.scrollTo(0, 0);
  };

  return { path, navigate };
}

export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}
