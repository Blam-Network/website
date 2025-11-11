"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface NightmapContextType {
  show24h: boolean;
}

const NightmapContext = createContext<NightmapContextType | undefined>(undefined);

export const NightmapProvider = ({ children }: { children: ReactNode }) => {
  const [show24h, setShow24h] = useState(false);

  // Alternate between current and 24h every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShow24h(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NightmapContext.Provider value={{ show24h }}>
      {children}
    </NightmapContext.Provider>
  );
};

export const useNightmap = () => {
  const context = useContext(NightmapContext);
  if (context === undefined) {
    throw new Error("useNightmap must be used within a NightmapProvider");
  }
  return context;
};

