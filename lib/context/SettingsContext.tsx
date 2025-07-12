"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSoundEffect } from "../hooks/useSoundEffect";
import { AUDIO_URLS, AUDIO_URLS_KEYS } from "../constants";

export interface GameSettings {
  soundEffectsEnabled: boolean;
  autoAdvanceEnabled: boolean;
  darkMode: boolean;
}

const defaultSettings: GameSettings = {
  soundEffectsEnabled: true,
  autoAdvanceEnabled: true,
  darkMode: false,
};

interface SettingsContextType {
  settings: GameSettings;
  updateSetting: (key: keyof GameSettings, value: any) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);

  const { playSound: playButtonClickSound } = useSoundEffect({
    audioUrl: AUDIO_URLS.BUTTON_CLICK,
    volume: 0.5,
    cacheKey: AUDIO_URLS_KEYS.BUTTON_CLICK,
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  useEffect(() => {
    const saved = localStorage.getItem("flagGameSettings");
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      setSettings({
        soundEffectsEnabled: parsedSettings.soundEffectsEnabled ?? defaultSettings.soundEffectsEnabled,
        autoAdvanceEnabled: parsedSettings.autoAdvanceEnabled ?? defaultSettings.autoAdvanceEnabled,
        darkMode: parsedSettings.darkMode ?? defaultSettings.darkMode,
      });
    }
  }, []);

  const updateSetting = (key: keyof GameSettings, value: any) => {
    playButtonClickSound();
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("flagGameSettings", JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}; 