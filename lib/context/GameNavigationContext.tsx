"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface GameNavigationContextType {
    isHomeNavigationConfirmationRequired: boolean;
    setHomeNavigationConfirmationRequired: (required: boolean) => void;
}

const GameNavigationContext = createContext<
    GameNavigationContextType | undefined
>(undefined);

export const GameNavigationProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [
        isHomeNavigationConfirmationRequired,
        setHomeNavigationConfirmationRequired,
    ] = useState(false);

    return (
        <GameNavigationContext.Provider
            value={{
                isHomeNavigationConfirmationRequired,
                setHomeNavigationConfirmationRequired,
            }}
        >
            {children}
        </GameNavigationContext.Provider>
    );
};

export const useGameNavigation = () => {
    const context = useContext(GameNavigationContext);
    if (!context) {
        throw new Error(
            "useGameNavigation must be used within a GameNavigationProvider"
        );
    }
    return context;
};
