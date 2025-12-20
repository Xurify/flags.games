"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface GameNavigationContextType {
  isUnsafeToNavigate: boolean;
  setUnsafeToNavigate: (unsafe: boolean) => void;
}

const GameNavigationContext = createContext<GameNavigationContextType | undefined>(undefined);

export const GameNavigationProvider = ({ children }: { children: ReactNode }) => {
  const [isUnsafeToNavigate, setUnsafeToNavigate] = useState(false);

  return (
    <GameNavigationContext.Provider
      value={{
        isUnsafeToNavigate,
        setUnsafeToNavigate,
      }}
    >
      {children}
    </GameNavigationContext.Provider>
  );
};

export const useGameNavigation = () => {
  const context = useContext(GameNavigationContext);
  if (!context) {
    throw new Error("useGameNavigation must be used within a GameNavigationProvider");
  }
  return context;
};
