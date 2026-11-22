import * as React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getSiteConfig } from "../services/firebase";
import { DEFAULT_SITE_CONFIG, SiteConfigData } from "../lib/defaults";

interface SiteContextType {
  config: SiteConfigData;
  loading: boolean;
  refreshConfig: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType>({
  config: DEFAULT_SITE_CONFIG,
  loading: true,
  refreshConfig: async () => {},
});

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfigData>(DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(true);

  const refreshConfig = useCallback(async () => {
    try {
      const data = await getSiteConfig();
      if (data) {
        setConfig({ ...DEFAULT_SITE_CONFIG, ...data });
      }
    } catch (err) {
      console.warn("Using default site configuration:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshConfig();
  }, [refreshConfig]);

  return (
    <SiteContext.Provider value={{ config, loading, refreshConfig }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteContext);
}
